'use client';

import { useState } from 'react';
import { createGeneralFAQ, deleteGeneralFAQ, updateGeneralFAQ } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export default function FAQsManager({ initialFAQs }: { initialFAQs: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Form states for Editing
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      question: formData.get('question'),
      answer: formData.get('answer'),
    };

    const res = await createGeneralFAQ(payload);
    if (res.success) {
      setShowAddForm(false);
      router.refresh();
      form.reset();
    } else {
      setError(res.error || 'Failed to add FAQ');
    }
    setLoading(false);
  }

  async function handleEditSave(id: number) {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      alert('Question and Answer are required');
      return;
    }
    setLoading(true);
    setError('');
    const res = await updateGeneralFAQ(id, { question: editQuestion, answer: editAnswer });
    if (res.success) {
      setEditingId(null);
      router.refresh();
    } else {
      setError(res.error || 'Failed to update FAQ');
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this general FAQ?')) return;
    setLoading(true);
    const res = await deleteGeneralFAQ(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete FAQ');
    }
    setLoading(false);
  }

  function startEdit(faq: any) {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-800 uppercase tracking-wide">
            Manage General FAQs
          </h2>
          <p className="text-gray-500 text-sm mt-1">Configure general questions, deposit terms, liability terms, and indoor storage information shown on the landing page.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow text-sm transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add FAQ'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500 text-rose-600 p-4 rounded-lg text-sm font-semibold">
          ✗ Error: {error}
        </div>
      )}

      {/* Add FAQ Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 max-w-xl">
          <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs border-l-4 border-primary pl-2 mb-2">New General FAQ</h3>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Question *</label>
            <input
              type="text"
              name="question"
              required
              placeholder="e.g. Do you store vehicles indoors?"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Answer Content *</label>
            <textarea
              name="answer"
              required
              rows={3}
              placeholder="Enter detailed FAQ answer..."
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-yellow-400 text-black font-bold uppercase tracking-widest px-6 py-2.5 rounded shadow text-xs transition-colors"
          >
            {loading ? 'Adding...' : 'Add FAQ'}
          </button>
        </form>
      )}

      {/* List/Table of FAQs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {initialFAQs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            📭 No general FAQs active yet. Click "+ Add FAQ" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {initialFAQs.map((faq) => (
              <div key={faq.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col gap-4">
                {editingId === faq.id ? (
                  // Edit State
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Question</label>
                      <input
                        type="text"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded sm:text-sm text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Answer</label>
                      <textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded sm:text-sm text-black"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(faq.id)}
                        disabled={loading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider px-4 py-1.5 rounded text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold uppercase tracking-wider px-4 py-1.5 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Standard Render
                  <div className="flex justify-between items-start gap-8">
                    <div className="space-y-2">
                      <h3 className="font-bold font-heading text-sm text-gray-900 uppercase tracking-wide">
                        {faq.question}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="flex gap-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                      <button
                        onClick={() => startEdit(faq)}
                        className="text-primary hover:text-yellow-600"
                      >
                        Edit
                      </button>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
