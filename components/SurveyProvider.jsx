"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';

export const SURVEY_STORAGE_KEY = 'shagun_ratna_survey';

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

export function SurveyProvider({ children }) {
  // Survey answers replace the old account system — they live only in this
  // browser and are used purely to personalise recommendations.
  const [survey, setSurvey] = usePersistedState(SURVEY_STORAGE_KEY, null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', gender: '' });
  const [errors, setErrors] = useState({});

  const openSurvey = useCallback(() => {
    setForm({
      name: survey?.name || '',
      age: survey?.age ? String(survey.age) : '',
      gender: survey?.gender || '',
    });
    setErrors({});
    setIsOpen(true);
  }, [survey]);

  const clearSurvey = useCallback(() => {
    setSurvey(null);
    setIsOpen(false);
  }, [setSurvey]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    const age = Number(form.age);
    if (!form.age || Number.isNaN(age) || age < 1 || age > 120) next.age = 'Enter an age between 1 and 120.';
    if (!form.gender) next.gender = 'Please choose one.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSurvey({ name: form.name.trim(), age, gender: form.gender });
    setIsOpen(false);
  };

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
            className="relative w-full max-w-md bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#C5A059]/30 overscroll-contain animate-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full text-[#A8A196] hover:text-[#90060c] hover:bg-[#EBE3D5]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="flex items-center gap-2 text-[#C5A059] mb-2">
                <Sparkles size={14} />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em]">Personalise</span>
              </div>
              <h2 id="survey-heading" className="font-brand text-2xl text-[#1a1a1a] mb-1.5">
                Pieces chosen for you
              </h2>
              <p className="font-sans text-xs text-[#1a1a1a]/60 leading-relaxed mb-6">
                Answer three quick questions and we&rsquo;ll highlight the pieces best suited to you.
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
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={!!errors.name}
                    className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#A8A196] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans"
                  />
                  {errors.name && <p className="mt-1.5 text-[11px] text-[#90060c] font-sans">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="survey-age" className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-2">
                    Your Age
                  </label>
                  <input
                    id="survey-age"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="120"
                    placeholder="e.g. 28"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    aria-invalid={!!errors.age}
                    className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#A8A196] focus:outline-none focus:border-[#90060c] focus-visible:ring-2 focus-visible:ring-[#90060c]/30 transition-colors font-sans"
                  />
                  {errors.age && <p className="mt-1.5 text-[11px] text-[#90060c] font-sans">{errors.age}</p>}
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
                          onClick={() => setForm({ ...form, gender: option.value })}
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
                  {survey ? 'Update' : 'Show My Pieces'}
                </button>
                {survey && (
                  <button
                    type="button"
                    onClick={clearSurvey}
                    className="px-5 py-3.5 font-sans text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/60 border border-[#C5A059]/40 rounded-full hover:text-[#90060c] hover:border-[#90060c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c]/40"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </SurveyContext.Provider>
  );
}
