import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, ChevronRight, ChevronLeft, Download, Trash2 } from 'lucide-react';
import { listOrders, deleteOrder, ORDER_STATUSES } from '../lib/orders';
import { formatPKR, formatDate, formatDateTime } from '../lib/format';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';

const STATUS_COLORS = {
  New: 'bg-ink-100 text-ink-700',
  Confirmed: 'bg-bamboo-100 text-bamboo-700',
  Processing: 'bg-bamboo-200/60 text-bamboo-700',
  Shipped: 'bg-sage-100 text-sage-700',
  Delivered: 'bg-sage-500/20 text-sage-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 12;

export default function OrdersList() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [city, setCity] = useState('all');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await listOrders();
      setOrders(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteOrder(confirmDelete.id);
      setOrders((prev) => prev.filter((o) => o.id !== confirmDelete.id && o.orderId !== confirmDelete.id));
      toast.success(`Order ${confirmDelete.orderId} deleted.`);
      setConfirmDelete(null);
    } catch (e) {
      toast.error('Could not delete order.');
    } finally {
      setDeleting(false);
    }
  };

  const cities = useMemo(() => {
    const s = new Set(orders.map((o) => o.city).filter(Boolean));
    return Array.from(s).sort();
  }, [orders]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders
      .filter((o) => (status === 'all' ? true : o.status === status))
      .filter((o) => (city === 'all' ? true : o.city === city))
      .filter((o) => {
        if (!term) return true;
        return (
          (o.orderId || '').toLowerCase().includes(term) ||
          (o.id || '').toLowerCase().includes(term) ||
          (o.customerName || '').toLowerCase().includes(term) ||
          (o.phone || '').toLowerCase().includes(term)
        );
      });
  }, [orders, q, status, city]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const exportCsv = () => {
    if (filtered.length === 0) return;
    const headers = ['Order ID', 'Customer', 'Phone', 'City', 'Address', 'Quantity', 'Unit Price', 'Subtotal', 'Delivery', 'Total', 'Free Delivery', 'Payment', 'Status', 'Notes', 'Created'];
    const rows = filtered.map((o) => [
      o.orderId || o.id,
      o.customerName,
      o.phone,
      o.city,
      (o.address || '').replace(/\n/g, ' '),
      o.quantity,
      o.unitPrice,
      o.subtotal,
      o.deliveryCharges,
      o.finalTotal,
      o.freeDelivery ? 'Yes' : 'No',
      o.paymentMethod,
      o.status,
      (o.notes || '').replace(/\n/g, ' '),
      formatDateTime(o.createdAt),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delisoga-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet><title>Orders — DELISOGA Admin</title></Helmet>
      <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="eyebrow">Manage</p>
            <h1 className="mt-1 font-display text-3xl text-ink-800">Orders</h1>
          </div>
          <button onClick={exportCsv} className="btn-secondary self-start sm:self-auto">
            <Download size={16} /> Export CSV
          </button>
        </header>

        {/* Filters */}
        <div className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
            <div className="md:col-span-6">
              <label className="label" htmlFor="q">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input id="q" className="input-lg pl-10" placeholder="Order ID, customer name, or phone…"
                       value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="label" htmlFor="status">Status</label>
              <div className="relative">
                <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                <select id="status" className="input-lg pl-10 appearance-none pr-9"
                        value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                  <option value="all">All statuses</option>
                  {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="label" htmlFor="city">City</label>
              <select id="city" className="input-lg appearance-none"
                      value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}>
                <option value="all">All cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <p className="mt-3 text-[12.5px] text-ink-500">
            {loading ? 'Loading…' : `${filtered.length} order${filtered.length === 1 ? '' : 's'} match`}
          </p>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : slice.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-ink-600 font-medium">No orders found</p>
              <p className="text-[12.5px] text-ink-400 mt-1">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-100/60 text-[11px] uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">Order</th>
                    <th className="text-left font-medium px-4 py-3">Customer</th>
                    <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Phone</th>
                    <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">City</th>
                    <th className="text-left font-medium px-4 py-3">Qty</th>
                    <th className="text-left font-medium px-4 py-3">Total</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Date</th>
                    <th className="px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {slice.map((o) => (
                    <tr key={o.id} className="border-t border-ink-100 hover:bg-cream-100/40 transition">
                      <td className="px-4 py-3">
                        <Link to={`/admin/orders/${o.id}`} className="font-medium text-ink-800 hover:text-bamboo-600">{o.orderId || o.id}</Link>
                      </td>
                      <td className="px-4 py-3 text-ink-700">{o.customerName}</td>
                      <td className="px-4 py-3 text-ink-600 hidden md:table-cell">{o.phone}</td>
                      <td className="px-4 py-3 text-ink-600 hidden lg:table-cell">{o.city}</td>
                      <td className="px-4 py-3 text-ink-600">{o.quantity}</td>
                      <td className="px-4 py-3 text-ink-800 font-medium">{formatPKR(o.finalTotal)}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${STATUS_COLORS[o.status] || 'bg-ink-100 text-ink-700'}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">{formatDate(o.createdAt)}</td>
                      <td className="px-2 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(o)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-red-600 hover:bg-red-50 transition"
                            aria-label={`Delete order ${o.orderId || o.id}`}
                            title="Delete order"
                          >
                            <Trash2 size={14} />
                          </button>
                          <Link to={`/admin/orders/${o.id}`} className="inline-flex items-center text-ink-500 hover:text-ink-800 transition" aria-label="View order">
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-ink-100">
              <p className="text-[12.5px] text-ink-500">Page {safePage} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white border border-ink-100 text-ink-700 hover:border-ink-300 transition disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white border border-ink-100 text-ink-700 hover:border-ink-300 transition disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete modal */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete this order?" size="sm">
        <p className="text-sm text-ink-600">
          This will permanently remove order <span className="font-semibold text-ink-800">{confirmDelete?.orderId}</span> by <span className="font-semibold text-ink-800">{confirmDelete?.customerName}</span>. This action cannot be undone.
        </p>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={() => setConfirmDelete(null)} className="btn-ghost">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-primary !bg-red-600 hover:!bg-red-700">
            <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete order'}
          </button>
        </div>
      </Modal>
    </>
  );
}
