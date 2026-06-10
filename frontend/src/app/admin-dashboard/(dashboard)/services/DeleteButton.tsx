'use client';

import { useState } from 'react';
import { deleteService } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Are you absolutely sure you want to delete this service? All features, FAQs, and standards linked to it will be permanently deleted.')) {
      return;
    }
    setLoading(true);
    const res = await deleteService(slug);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete service');
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
