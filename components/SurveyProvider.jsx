"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Sparkles, Gem, MapPin, Info, ArrowLeft } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { readGemstone, ageFromBirthDate } from '@/lib/jyotish';
import { HOURS_12, MINUTES, to24Hour, from24Hour } from '@/lib/clock12';
import {
  INDIA_UTC_OFFSET_MINUTES,
  UTC_OFFSET_OPTIONS,
  searchIndianCities,
} from '@/lib/birthPlaces';

export const SURVEY_STORAGE_KEY = 'shagun_ratna_survey';
// Remembers that the invitation has already been shown, so it opens itself once
// per browser instead of interrupting on every visit.
export const SURVEY_PROMPTED_KEY = 'shagun_ratna_survey_prompted';

// Long enough for the first fold to land before the dialog asks for attention.
const AUTO_PROMPT_DELAY_MS = 5000;

const SurveyContext = createContext({
  survey: null,
  openSurvey: () => {},
  clearSurvey: () => {},
});

export function useSurvey() {
  return useContext(SurveyContext);
}

// Matched against Showcase.gender in the recommendation query, which stores
// "All" | "Male" | "Female" | "Unisex".
const GENDERS = [
  { label: 'Woman', value: 'Female' },
  { label: 'Man', value: 'Male' },
  { label: 'Prefer not to say', value: 'Unisex' },
];

// Nobody living was born before this, and it keeps the year spinner sane.
const EARLIEST_BIRTH_YEAR = 1900;

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  name: '',
  birthDate: '',
  gender: '',
  birthHour: '',
  birthMinute: '',
  birthMeridiem: '',
  placeQuery: '',
  bornOutsideIndia: false,
  utcOffsetMinutes: INDIA_UTC_OFFSET_MINUTES,
};

// Shared so the three parts of the clock line up as one control.
const TIME_SELECT_CLASS = 'flex-1 min-w-0 bg-white border border-[#C5A059]/40 rounded-xl px-3 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans';

export function SurveyProvider({ children }) {
  // Survey answers replace the old account system — they live only in this
  // browser and are used purely to personalise recommendations and to work out
  // the visitor's gemstone.
  const [survey, setSurvey] = usePersistedState(SURVEY_STORAGE_KEY, null);
  const [prompted, setPrompted] = usePersistedState(SURVEY_PROMPTED_KEY, false);
  const [isOpen, setIsOpen] = useState(false);
  // Drives the softer wording when the dialog let itself in, rather than being
  // asked for from the nav.
  const [autoOpened, setAutoOpened] = useState(false);
  // 'form' while answering, 'result' once there is a stone to show.
  const [view, setView] = useState('form');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Birth place is a combobox: pick a listed city to also capture its
  // coordinates, or just type a town that isn't listed.
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeOpen, setPlaceOpen] = useState(false);
  const [placeHighlight, setPlaceHighlight] = useState(-1);
  const placeFieldRef = useRef(null);

  const openDialog = useCallback((auto) => {
    setForm({
      name: survey?.name || '',
      birthDate: survey?.birthDate || '',
      gender: survey?.gender || '',
      ...from24Hour(survey?.birthTime),
      placeQuery: survey?.birthPlace?.city || '',
      bornOutsideIndia: survey
        ? survey.utcOffsetMinutes !== undefined && survey.utcOffsetMinutes !== INDIA_UTC_OFFSET_MINUTES
        : false,
      utcOffsetMinutes: survey?.utcOffsetMinutes ?? INDIA_UTC_OFFSET_MINUTES,
    });
    setSelectedPlace(survey?.birthPlace?.lat != null ? survey.birthPlace : null);
    setPlaceOpen(false);
    setPlaceHighlight(-1);
    setErrors({});
    setAutoOpened(auto);
    // Someone who already has a reading should land on it rather than on a form
    // asking them the same questions again.
    setView(survey?.gemstone ? 'result' : 'form');
    // Seeing the dialog at all counts as being prompted, so opening it from the
    // nav also stops the timer from interrupting later.
    setPrompted(true);
    setIsOpen(true);
  }, [survey, setPrompted]);

  // Consumers (nav, collection page) always open it deliberately. Wrapped rather
  // than passed through so a click event can never be read as the `auto` flag.
  const openSurvey = useCallback(() => openDialog(false), [openDialog]);

  const clearSurvey = useCallback(() => {
    setSurvey(null);
    setIsOpen(false);
  }, [setSurvey]);

  // First-time visitors are invited on their own after a short pause. It fires
  // once per browser and never for someone who has already answered or already
  // opened it themselves, so it can't turn into a nag.
  useEffect(() => {
    if (survey || prompted) return;
    const timer = setTimeout(() => openDialog(true), AUTO_PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [survey, prompted, openDialog]);

  // Escape closes, and the page behind shouldn't scroll while the modal is up
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Clicking away from the city field should put the suggestions away too.
  useEffect(() => {
    if (!placeOpen) return;
    const onPointerDown = (e) => {
      if (!placeFieldRef.current?.contains(e.target)) setPlaceOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [placeOpen]);

  const placeSuggestions = useMemo(
    () => (form.bornOutsideIndia ? [] : searchIndianCities(form.placeQuery)),
    [form.placeQuery, form.bornOutsideIndia],
  );

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const choosePlace = (place) => {
    setSelectedPlace(place);
    updateForm({ placeQuery: place.city });
    setPlaceOpen(false);
    setPlaceHighlight(-1);
  };

  const handlePlaceKeyDown = (e) => {
    if (!placeOpen || placeSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPlaceHighlight((i) => (i + 1) % placeSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPlaceHighlight((i) => (i <= 0 ? placeSuggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && placeHighlight >= 0) {
      // Otherwise Enter would submit the form behind the open suggestion list.
      e.preventDefault();
      choosePlace(placeSuggestions[placeHighlight]);
    } else if (e.key === 'Escape') {
      setPlaceOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};

    if (!form.name.trim()) next.name = 'Please enter your name.';

    const age = form.birthDate ? ageFromBirthDate(form.birthDate) : null;
    if (!form.birthDate) {
      next.birthDate = 'Please enter your date of birth.';
    } else if (age === null || age < 0) {
      next.birthDate = 'That date is in the future.';
    } else if (age > 120 || Number(form.birthDate.slice(0, 4)) < EARLIEST_BIRTH_YEAR) {
      next.birthDate = `Please enter a date after ${EARLIEST_BIRTH_YEAR}.`;
    }

    if (!form.gender) next.gender = 'Please choose one.';

    // The time is optional, but half a time is worse than none — it would be read
    // as a real birth moment and quietly change which stone comes back.
    const timeParts = [form.birthHour, form.birthMinute, form.birthMeridiem];
    const filledParts = timeParts.filter(Boolean).length;
    if (filledParts > 0 && filledParts < 3) {
      next.birthTime = 'Please complete the time, or clear all three.';
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const utcOffsetMinutes = form.bornOutsideIndia
      ? form.utcOffsetMinutes
      : INDIA_UTC_OFFSET_MINUTES;

    const birthTime = filledParts === 3
      ? to24Hour(form.birthHour, form.birthMinute, form.birthMeridiem)
      : null;

    const reading = readGemstone({
      date: form.birthDate,
      time: birthTime,
      utcOffsetMinutes,
    });

    const typedPlace = form.placeQuery.trim();
    const birthPlace = selectedPlace && selectedPlace.city === typedPlace
      ? selectedPlace
      // A town that isn't in the list is still worth keeping — it just arrives
      // without coordinates, which the reading doesn't need anyway.
      : (typedPlace ? { city: typedPlace, state: '', lat: null, lon: null } : null);

    setSurvey({
      name: form.name.trim(),
      age,
      gender: form.gender,
      birthDate: form.birthDate,
      birthTime,
      birthPlace,
      utcOffsetMinutes,
      // Flattened rather than nested so anything reading the stored survey gets
      // what it needs without pulling in the calculation module.
      gemstone: reading && {
        stone: reading.gemstone.stone,
        hindi: reading.gemstone.hindi,
        planet: reading.gemstone.planet,
        metal: reading.gemstone.metal,
        finger: reading.gemstone.finger,
        day: reading.gemstone.day,
        weight: reading.gemstone.weight,
        alternatives: reading.gemstone.alternatives,
        searchTerms: reading.gemstone.searchTerms,
        rashi: reading.rashi.sanskrit,
        rashiEnglish: reading.rashi.english,
        ambiguous: reading.ambiguous,
        alternateRashi: reading.alternateRashi?.sanskrit || null,
        nearBoundary: reading.nearBoundary,
        timeKnown: reading.timeKnown,
      },
    });

    if (reading) setView('result');
    else setIsOpen(false);
  };

  const stone = survey?.gemstone;

  return (
    <SurveyContext.Provider value={{ survey, openSurvey, clearSurvey }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="survey-heading"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#C5A059]/30 overscroll-contain animate-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-[#A8A196] bg-[#FDFBF7]/80 hover:text-[#90060c] hover:bg-[#EBE3D5]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]"
            >
              <X size={18} />
            </button>

            {view === 'result' && stone ? (
              <GemstoneResult
                stone={stone}
                name={survey.name}
                onEdit={() => { setView('form'); setErrors({}); }}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex items-center gap-2 text-[#C5A059] mb-2">
                  <Sparkles size={14} />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em]">
                    {autoOpened ? 'Welcome' : 'Personalise'}
                  </span>
                </div>
                <h2 id="survey-heading" className="font-brand text-2xl text-[#1a1a1a] mb-1.5">
                  Find your stone
                </h2>
                <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed mb-6">
                  Tell us when and where you were born and we&rsquo;ll find the gemstone
                  your birth chart favours, along with the pieces we&rsquo;d pick for you.
                  No account needed — this stays on your device.
                </p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="survey-name" className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-2">
                      Your Name
                    </label>
                    <input
                      id="survey-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Priya Sharma"
                      value={form.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      aria-invalid={!!errors.name}
                      className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#A8A196] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans"
                    />
                    {errors.name && <p className="mt-1.5 text-[11px] text-[#90060c] font-sans">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="survey-dob" className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-2">
                      Date of Birth
                    </label>
                    <input
                      id="survey-dob"
                      type="date"
                      autoComplete="bday"
                      min={`${EARLIEST_BIRTH_YEAR}-01-01`}
                      max={todayISO()}
                      value={form.birthDate}
                      onChange={(e) => updateForm({ birthDate: e.target.value })}
                      aria-invalid={!!errors.birthDate}
                      className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans"
                    />
                    {errors.birthDate && <p className="mt-1.5 text-[11px] text-[#90060c] font-sans">{errors.birthDate}</p>}
                  </div>

                  <div>
                    <span id="survey-time-label" className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-2">
                      Time of Birth <span className="font-normal normal-case tracking-normal text-[#A8A196]">— optional</span>
                    </span>
                    <div className="flex items-center gap-2" role="group" aria-labelledby="survey-time-label">
                      <select
                        aria-label="Hour of birth"
                        value={form.birthHour}
                        onChange={(e) => updateForm({ birthHour: e.target.value })}
                        aria-invalid={!!errors.birthTime}
                        className={TIME_SELECT_CLASS}
                      >
                        <option value="">Hour</option>
                        {HOURS_12.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                      </select>
                      <span aria-hidden="true" className="text-[#A8A196] font-sans">:</span>
                      <select
                        aria-label="Minute of birth"
                        value={form.birthMinute}
                        onChange={(e) => updateForm({ birthMinute: e.target.value })}
                        aria-invalid={!!errors.birthTime}
                        className={TIME_SELECT_CLASS}
                      >
                        <option value="">Min</option>
                        {MINUTES.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
                      </select>
                      <select
                        aria-label="AM or PM"
                        value={form.birthMeridiem}
                        onChange={(e) => updateForm({ birthMeridiem: e.target.value })}
                        aria-invalid={!!errors.birthTime}
                        className={TIME_SELECT_CLASS}
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {errors.birthTime
                      ? <p className="mt-1.5 text-[11px] text-[#90060c] font-sans">{errors.birthTime}</p>
                      : (
                        <p className="mt-1.5 text-[11px] text-[#1a1a1a]/45 font-sans">
                          The moon changes sign every couple of days, so the time sharpens the reading.
                          Midnight is 12 AM, midday is 12 PM.
                        </p>
                      )}
                  </div>

                  <div ref={placeFieldRef}>
                    <label htmlFor="survey-place" className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-2">
                      Place of Birth <span className="font-normal normal-case tracking-normal text-[#A8A196]">— optional</span>
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A196] pointer-events-none" />
                      <input
                        id="survey-place"
                        type="text"
                        role="combobox"
                        aria-expanded={placeOpen && placeSuggestions.length > 0}
                        aria-controls="survey-place-list"
                        aria-autocomplete="list"
                        autoComplete="off"
                        placeholder={form.bornOutsideIndia ? 'e.g. Dubai' : 'e.g. Jaipur'}
                        value={form.placeQuery}
                        onChange={(e) => {
                          updateForm({ placeQuery: e.target.value });
                          setSelectedPlace(null);
                          setPlaceOpen(true);
                          setPlaceHighlight(-1);
                        }}
                        onFocus={() => setPlaceOpen(true)}
                        onKeyDown={handlePlaceKeyDown}
                        className="w-full bg-white border border-[#C5A059]/40 rounded-xl pl-11 pr-4 py-3 text-sm text-[#1a1a1a] placeholder-[#A8A196] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans"
                      />
                      {placeOpen && placeSuggestions.length > 0 && (
                        <ul
                          id="survey-place-list"
                          role="listbox"
                          className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#C5A059]/40 rounded-xl shadow-lg overflow-hidden"
                        >
                          {placeSuggestions.map((place, index) => (
                            <li key={`${place.city}-${place.state}`} role="option" aria-selected={index === placeHighlight}>
                              <button
                                type="button"
                                onMouseEnter={() => setPlaceHighlight(index)}
                                onClick={() => choosePlace(place)}
                                className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors ${
                                  index === placeHighlight ? 'bg-[#EBE3D5]/60 text-[#90060c]' : 'text-[#1a1a1a]'
                                }`}
                              >
                                {place.city}
                                <span className="text-[#A8A196] text-xs"> · {place.state}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <label className="mt-2.5 flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.bornOutsideIndia}
                        onChange={(e) => {
                          updateForm({
                            bornOutsideIndia: e.target.checked,
                            utcOffsetMinutes: INDIA_UTC_OFFSET_MINUTES,
                          });
                          setSelectedPlace(null);
                          setPlaceOpen(false);
                        }}
                        className="w-3.5 h-3.5 accent-[#90060c]"
                      />
                      <span className="font-sans text-[11px] text-[#1a1a1a]/55">I was born outside India</span>
                    </label>

                    {form.bornOutsideIndia && (
                      <div className="mt-2.5">
                        <label htmlFor="survey-offset" className="block font-sans text-[11px] text-[#1a1a1a]/55 mb-1.5">
                          What did the local clock read against UTC?
                        </label>
                        <select
                          id="survey-offset"
                          value={form.utcOffsetMinutes}
                          onChange={(e) => updateForm({ utcOffsetMinutes: Number(e.target.value) })}
                          className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans"
                        >
                          {UTC_OFFSET_OPTIONS.map((option) => (
                            <option key={option.minutes} value={option.minutes}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-2">
                      You are shopping as
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((option) => {
                        const active = form.gender === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateForm({ gender: option.value })}
                            aria-pressed={active}
                            className={`px-4 py-2.5 rounded-full border font-sans text-xs font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]/40 ${
                              active
                                ? 'bg-[#90060c] border-[#90060c] text-white shadow-sm'
                                : 'bg-white border-[#C5A059]/40 text-[#1a1a1a] hover:border-[#90060c]'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    {errors.gender && <p className="mt-1.5 text-[11px] text-[#90060c] font-sans">{errors.gender}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 font-sans py-3.5 text-xs tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full hover:bg-[#730509] transition-all duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c] focus-visible:ring-offset-2"
                  >
                    {survey ? 'Update' : 'Show My Stone'}
                  </button>
                  {/* Someone who hasn't answered yet needs a way out that isn't the
                      corner X — especially when the dialog opened on its own. */}
                  <button
                    type="button"
                    onClick={survey ? clearSurvey : () => setIsOpen(false)}
                    className="px-5 py-3.5 font-sans text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/60 border border-[#C5A059]/40 rounded-full hover:text-[#90060c] hover:border-[#90060c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]/40"
                  >
                    {survey ? 'Clear' : 'Skip'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </SurveyContext.Provider>
  );
}

// The reading itself. Split out so the dialog above stays readable — it takes the
// already-stored, flattened gemstone rather than recomputing anything.
function GemstoneResult({ stone, name, onEdit, onClose }) {
  const facts = [
    { label: 'Metal', value: stone.metal },
    { label: 'Finger', value: stone.finger },
    { label: 'Wear from', value: stone.day },
    { label: 'Weight', value: stone.weight },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-[#C5A059] mb-2">
        <Gem size={14} />
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em]">
          {name ? `${name.split(' ')[0]}'s stone` : 'Your stone'}
        </span>
      </div>

      <h2 id="survey-heading" className="font-brand text-3xl text-[#1a1a1a] leading-tight">
        {stone.stone}
      </h2>
      <p className="font-sans text-sm text-[#90060c] mb-4">{stone.hindi}</p>

      <div className="rounded-xl bg-[#EBE3D5]/40 border border-[#C5A059]/25 px-4 py-3 mb-5">
        <p className="font-sans text-xs text-[#1a1a1a]/75 leading-relaxed">
          Your moon sign is <strong className="text-[#1a1a1a]">{stone.rashi}</strong> ({stone.rashiEnglish}),
          ruled by <strong className="text-[#1a1a1a]">{stone.planet}</strong> — whose stone is the {stone.stone}.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 mb-5">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/45 mb-1">
              {fact.label}
            </dt>
            <dd className="font-sans text-xs text-[#1a1a1a]/85 leading-snug">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {stone.alternatives?.length > 0 && (
        <p className="font-sans text-[11px] text-[#1a1a1a]/55 leading-relaxed mb-5">
          <span className="font-semibold text-[#1a1a1a]/70">Lighter alternatives (upratna): </span>
          {stone.alternatives.join(', ')}.
        </p>
      )}

      {/* Only shown when the maths itself is genuinely uncertain, so it reads as
          honesty rather than as boilerplate on every reading. */}
      {(stone.ambiguous || stone.nearBoundary) && (
        <div className="flex gap-2.5 rounded-xl border border-[#C5A059]/40 bg-white px-4 py-3 mb-5">
          <Info size={15} className="shrink-0 mt-0.5 text-[#C5A059]" />
          <p className="font-sans text-[11px] text-[#1a1a1a]/65 leading-relaxed">
            {stone.ambiguous
              ? <>The moon moved from {stone.alternateRashi} into {stone.rashi} on your birthday, so
                  your exact time of birth decides between the two. Add it above for a firm reading.</>
              : <>The moon entered {stone.rashi} within half an hour of your birth time. If that time is
                  approximate, it&rsquo;s worth confirming before you buy.</>}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <Link
          href={`/collection?search=${encodeURIComponent(stone.searchTerms[0])}`}
          onClick={onClose}
          className="w-full text-center font-sans py-3.5 text-xs tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full hover:bg-[#730509] transition-all duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c] focus-visible:ring-offset-2"
        >
          See our {stone.stone} pieces
        </Link>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 font-sans text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/55 hover:text-[#90060c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]/40 rounded-full"
        >
          <ArrowLeft size={13} /> Change my details
        </button>
      </div>

      <p className="mt-5 pt-4 border-t border-[#C5A059]/20 font-sans text-[10px] text-[#1a1a1a]/40 leading-relaxed">
        Offered in the traditional Vedic spirit, using the Lahiri ayanamsa. Gemstone
        guidance is a matter of belief and personal custom, not medical or financial advice.
      </p>
    </div>
  );
}
