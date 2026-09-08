import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Star, Edit2, Trash2, Eye, EyeOff, X, Save, BadgeCheck } from 'lucide-react';
import { listReviews, addReview, updateReview, deleteReview } from '../lib/reviews';
import { useToast } from '../context/ToastContext';
import { formatDate, initials } from '../lib/format';
import Modal from '../components/ui/Modal';
import Stars from '../components/ui/Stars';
import Skeleton from '../components/ui/Skeleton';

const blank = { name: '', city: '', rating: 5, title: '', body: '', verified: true, approved: true };

export default function ReviewsManager() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await listReviews({ onlyApproved: false });
      setReviews(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (data) => {
    if (editing) {
      await updateReview(editing.id, data);
      toast.success('Review updated.');
    } else {
      await addReview(data);
      toast.success('Review added.');
    }
    setEditing(null);
    setShowAdd(false);
    await load();
  };

  const toggleApprove = async (r) => {
    await updateReview(r.id, { approved: !r.approved });
    toast.success(r.approved ? 'Review hidden.' : 'Review approved.');
    await load();
  };

  const remove = async (r) => {
    await deleteReview(r.id);
    toast.success('Review deleted.');
    setConfirmDelete(null);
    await load();
  };

  return (
    <>
      <Helmet><title>Reviews — DELISOGA Admin</title></Helmet>
      <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="eyebrow">Manage</p>
            <h1 className="mt-1 font-display text-3xl text-ink-800">Reviews</h1>
            <p className="text-sm text-ink-500 mt-1">Add, edit, approve, hide, or delete customer reviews shown on the site.</p>
          </div>
          <button onClick={() => { setEditing(null); setShowAdd(true); }} className="btn-primary self-start sm:self-auto">
            <Plus size={16} /> Add review
          </button>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-12 text-center">
            <p className="text-ink-600 font-medium">No reviews yet</p>
            <p className="text-[12.5px] text-ink-400 mt-1">Click “Add review” to create your first one.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <li key={r.id} className={`rounded-2xl border bg-white p-5 ${r.approved ? 'border-ink-100' : 'border-ink-100 opacity-70'}`}>
                <div className="flex items-center justify-between">
                  <Stars value={r.rating || 5} size={14} />
                  <div className="flex items-center gap-1">
                    {!r.approved && <span className="badge bg-ink-100 text-ink-600">Hidden</span>}
                    {r.verified && <BadgeCheck size={14} className="text-sage-500" />}
                  </div>
                </div>
                {r.title && <h3 className="mt-2.5 font-display text-[1rem] text-ink-800 leading-snug">{r.title}</h3>}
                <p className="mt-1.5 text-[13px] text-ink-600 leading-relaxed text-pretty line-clamp-4">{r.body}</p>
                <div className="mt-4 pt-3 border-t border-ink-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-bamboo-200 text-bamboo-700 inline-flex items-center justify-center text-[11px] font-semibold">{initials(r.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink-800 truncate">{r.name}</p>
                    <p className="text-[10.5px] text-ink-500">{[r.city, formatDate(r.createdAt)].filter(Boolean).join(' · ')}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <button onClick={() => { setEditing(r); setShowAdd(true); }} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-cream-100 text-ink-700 text-[12.5px] hover:bg-cream-200 transition">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => toggleApprove(r)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-cream-100 text-ink-700 text-[12.5px] hover:bg-cream-200 transition">
                    {r.approved ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Approve</>}
                  </button>
                  <button onClick={() => setConfirmDelete(r)} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cream-100 text-ink-500 hover:text-red-600 hover:bg-red-50 transition" aria-label="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add / edit modal */}
        <ReviewModal
          open={showAdd}
          onClose={() => { setShowAdd(false); setEditing(null); }}
          onSave={save}
          initial={editing || blank}
        />

        {/* Confirm delete */}
        <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete review?" size="sm">
          <p className="text-sm text-ink-600">
            This will permanently remove the review by <span className="font-semibold text-ink-800">{confirmDelete?.name}</span>. This action cannot be undone.
          </p>
          <div className="mt-5 flex gap-2 justify-end">
            <button onClick={() => setConfirmDelete(null)} className="btn-ghost">Cancel</button>
            <button onClick={() => remove(confirmDelete)} className="btn-primary !bg-red-600 hover:!bg-red-700">Delete</button>
          </div>
        </Modal>
      </div>
    </>
  );
}

function ReviewModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial); }, [initial]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.body?.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        city: form.city?.trim() || '',
        rating: Number(form.rating) || 5,
        title: form.title?.trim() || '',
        body: form.body.trim(),
        verified: !!form.verified,
        approved: !!form.approved,
        createdAt: form.createdAt || Date.now(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit review' : 'Add review'} size="md">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Name *</label>
            <input className="input-lg" value={form.name || ''} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input-lg" value={form.city || ''} onChange={(e) => update('city', e.target.value)} />
          </div>
          <div>
            <label className="label">Rating</label>
            <div className="flex items-center gap-2 h-12">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update('rating', n)}
                  className={`p-1 ${n <= (form.rating || 0) ? 'text-bamboo-400' : 'text-ink-200'}`}
                  aria-label={`${n} star${n === 1 ? '' : 's'}`}
                >
                  <Star size={20} fill="currentColor" strokeWidth={0} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Title (optional)</label>
            <input className="input-lg" value={form.title || ''} onChange={(e) => update('title', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Review *</label>
          <textarea rows={4} className="input-lg resize-none" value={form.body || ''} onChange={(e) => update('body', e.target.value)} required />
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm text-ink-700">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.verified} onChange={(e) => update('verified', e.target.checked)} className="rounded" />
            <span>Verified buyer</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.approved} onChange={(e) => update('approved', e.target.checked)} className="rounded" />
            <span>Show on site (approved)</span>
          </label>
        </div>
        <div className="pt-3 border-t border-ink-100 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={14} /> {saving ? 'Saving…' : (initial?.id ? 'Save changes' : 'Add review')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
