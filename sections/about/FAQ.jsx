"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Pencil, Trash2, HelpCircle, Loader2, X, Check, RotateCcw } from 'lucide-react';
import { FAQS } from './faqData';
import { useSiteText, useSetSiteText } from '@/components/SiteTextsProvider';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';
import { EditableText } from '@/components/admin/EditableText';
import adminApi from '@/lib/adminApi';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const { isAdmin, editMode } = useAdminEditor();
  const rawFaqsJson = useSiteText('about-faqs-list', '');
  const setTextOverride = useSetSiteText();

  // Active modal state for adding or editing a Q&A item
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    index: null,
    question: '',
    answer: '',
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Parse custom FAQs or fall back to default FAQS list
  const faqList = useMemo(() => {
    if (rawFaqsJson && typeof rawFaqsJson === 'string') {
      try {
        const parsed = JSON.parse(rawFaqsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.warn('Failed to parse about-faqs-list JSON:', err);
      }
    }
    return FAQS;
  }, [rawFaqsJson]);

  // Persists the full FAQ list to MongoDB via SiteContent API
  const persistFaqList = async (updatedList) => {
    setSaving(true);
    try {
      const jsonString = JSON.stringify(updatedList);
      await adminApi.post('/site-texts', {
        key: 'about-faqs-list',
        value: jsonString,
        page: 'About',
        section: 'FAQ',
      });
      setTextOverride('about-faqs-list', jsonString);
      return true;
    } catch (err) {
      console.error('Failed to save FAQ list:', err);
      showToast('error', 'Could not save FAQ changes.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Open modal to Add
  const handleOpenAdd = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      index: null,
      question: '',
      answer: '',
    });
  };

  // Open modal to Edit
  const handleOpenEdit = (index, faq, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalState({
      isOpen: true,
      mode: 'edit',
      index,
      question: faq.question,
      answer: faq.answer,
    });
  };

  // Save changes from modal
  const handleSaveModal = async (e) => {
    e.preventDefault();
    const q = modalState.question.trim();
    const a = modalState.answer.trim();

    if (!q || !a) {
      showToast('error', 'Please provide both question and answer.');
      return;
    }

    let updatedList;
    if (modalState.mode === 'add') {
      updatedList = [...faqList, { question: q, answer: a }];
    } else {
      updatedList = faqList.map((item, idx) =>
        idx === modalState.index ? { ...item, question: q, answer: a } : item
      );
    }

    const success = await persistFaqList(updatedList);
    if (success) {
      showToast('success', modalState.mode === 'add' ? 'New question added successfully!' : 'Question updated successfully!');
      setModalState({ isOpen: false, mode: 'add', index: null, question: '', answer: '' });
    }
  };

  // Delete an item
  const handleDelete = async (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetFaq = faqList[index];
    const confirmed = window.confirm(`Delete question: "${targetFaq.question}"?`);
    if (!confirmed) return;

    const updatedList = faqList.filter((_, idx) => idx !== index);
    const success = await persistFaqList(updatedList);
    if (success) {
      showToast('success', 'Question deleted.');
      if (openIndex === index) setOpenIndex(null);
    }
  };

  // Reset to default questions
  const handleResetDefaults = async () => {
    const confirmed = window.confirm('Reset all questions to default boutique FAQs? Custom added questions will be replaced.');
    if (!confirmed) return;

    const success = await persistFaqList(FAQS);
    if (success) {
      showToast('success', 'Reset to default FAQs.');
      setOpenIndex(null);
    }
  };

  return (
    <section className="py-20 px-6 bg-white text-[#90060c] relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-14">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            <EditableText
              textKey="about-faq-title-prefix"
              defaultText="Frequently Asked"
              label="FAQ Title Prefix"
              section="FAQ"
              as="span"
            />{' '}
            <EditableText
              textKey="about-faq-title-highlight"
              defaultText="Questions"
              label="FAQ Title Highlight"
              section="FAQ"
              as="span"
              className="italic text-[#C5A059]"
            />
          </h2>
          <EditableText
            textKey="about-faq-subtitle"
            defaultText="Answers to what our clients ask us most."
            label="FAQ Subtitle"
            section="FAQ"
            as="p"
            className="text-sm md:text-base opacity-70 font-light block"
          />

          {/* Admin Edit Mode Action Bar */}
          {isAdmin && editMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-[#FAF7F2] border border-[#C5A059]/50 px-5 py-2.5 rounded-2xl shadow-sm"
            >
              <span className="text-xs font-sans font-semibold text-[#90060c] flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#C5A059]" />
                <span>Q&amp;A Manager ({faqList.length} Questions)</span>
              </span>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-semibold text-white bg-[#90060c] hover:bg-[#730509] rounded-full shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus size={13} />
                <span>Add Question</span>
              </button>

              {rawFaqsJson && (
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-sans font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-full transition-colors cursor-pointer"
                  title="Reset to factory defaults"
                >
                  <RotateCcw size={11} />
                  <span>Reset Defaults</span>
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Q&A Accordion Items */}
        <div className="space-y-4">
          {faqList.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question + index}
                className="border border-[#C5A059]/30 rounded-2xl overflow-hidden bg-[#faf3e5]/40 transition-colors hover:border-[#C5A059]/60"
              >
                <div className="w-full flex items-center justify-between gap-3 px-6 py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex-1 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="font-serif text-base md:text-lg text-[#1a1a1a] hover:text-[#90060c] transition-colors">
                      {faq.question}
                    </span>
                    <span className="shrink-0 text-[#C5A059] p-1">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  {/* Admin Inline Edit & Delete Buttons */}
                  {isAdmin && editMode && (
                    <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-[#C5A059]/30">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(index, faq, e)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#90060c] hover:bg-white transition-colors cursor-pointer"
                        title="Edit Question & Answer"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(index, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-[#C5A059]/20"
                    >
                      <div className="px-6 py-5 text-sm md:text-base leading-relaxed text-[#1a1a1a]/80 font-light">
                        <p>{faq.answer}</p>

                        {isAdmin && editMode && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#C5A059]/30 flex justify-end">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(index, faq, e)}
                              className="inline-flex items-center gap-1 text-xs font-sans text-[#90060c] hover:underline cursor-pointer"
                            >
                              <Pencil size={11} />
                              <span>Edit Answer Content</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add or Edit Question & Answer */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#FDFBF7] border border-[#C5A059] rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="px-6 py-4 border-b border-[#C5A059]/20 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <HelpCircle size={18} className="text-[#90060c]" />
                  <h3 className="font-serif text-xl text-[#1a1a1a]">
                    {modalState.mode === 'add' ? 'Add Question & Answer' : 'Edit Question & Answer'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Question
                  </label>
                  <input
                    type="text"
                    required
                    value={modalState.question}
                    onChange={(e) => setModalState((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="e.g. Is Shagun Ratna jewelry certified authentic?"
                    className="w-full px-4 py-2.5 bg-white border border-[#C5A059]/40 rounded-xl text-sm font-sans text-gray-900 focus:outline-none focus:border-[#90060c] focus:ring-1 focus:ring-[#90060c] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Answer
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={modalState.answer}
                    onChange={(e) => setModalState((prev) => ({ ...prev, answer: e.target.value }))}
                    placeholder="Provide clear, authentic details for your clients..."
                    className="w-full px-4 py-2.5 bg-white border border-[#C5A059]/40 rounded-xl text-sm font-sans text-gray-900 focus:outline-none focus:border-[#90060c] focus:ring-1 focus:ring-[#90060c] transition-all leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-xs font-sans font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#90060c] hover:bg-[#730509] text-white text-xs font-sans font-semibold rounded-full shadow transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={13} />
                        <span>Save Question</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[130] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-sans font-semibold text-white animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success' ? 'bg-[#90060c]' : 'bg-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
}
