import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Phone, MapPin, Mail, MessageCircle, Package, Copy, Check, Save, Trash2, XCircle, Download } from 'lucide-react';
import { getOrder, updateOrderStatus, deleteOrder, ORDER_STATUSES, NEXT_STATUS } from '../lib/orders';
import { formatPKR, formatDateTime } from '../lib/format';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import { generateOrderPDF } from '../lib/pdf';

const FLOW = ['New', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const STATUS_BG = {
  New: 'bg-ink-100 text-ink-700 border-ink-200',
  Confirmed: 'bg-bamboo-100 text-bamboo-700 border-bamboo-200',
  Processing: 'bg-bamboo-200/60 text-bamboo-700 border-bamboo-300',
  Shipped: 'bg-sage-100 text-sage-700 border-sage-200',
  Delivered: 'bg-sage-500/20 text-sage-700 border-sage-300',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const o = await getOrder(id);
        if (alive) {
          setOrder(o);
          setStatus(o?.status || 'New');
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const c = settings?.contact || {};
  const wa = (order?.phone || '').replace(/[^\d+]/g, '');

  const save = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrderStatus(order.id, status);
      setOrder((o) => ({ ...o, status }));
      toast.success(`Order marked as ${status}.`);
    } catch (e) {
      toast.error('Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  const advance = async () => {
    const next = NEXT_STATUS[order?.status];
    if (!next) return;
    setStatus(next);
    setSaving(true);
    try {
      await updateOrderStatus(order.id, next);
      setOrder((o) => ({ ...o, status: next }));
      toast.success(`Order moved to ${next}.`);
    } catch (e) {
      toast.error('Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrderStatus(order.id, 'Cancelled');
      setOrder((o) => ({ ...o, status: 'Cancelled' }));
      setStatus('Cancelled');
      toast.success('Order cancelled.');
    } catch (e) {
      toast.error('Could not cancel order.');
    } finally {
      setSaving(false);
    }
  };

  const removeOrder = async () => {
    if (!order) return;
    setDeleting(true);
    try {
      await deleteOrder(order.id);
      toast.success('Order deleted.');
      navigate('/admin/orders', { replace: true });
    } catch (e) {
      toast.error('Could not delete order.');
      setDeleting(false);
    }
  };

  const copyId = () => {
    if (!order) return;
    navigator.clipboard?.writeText(order.orderId || order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadPDF = () => {
    if (!order) return;
    try {
      generateOrderPDF(order, settings);
      toast.success('PDF downloaded.');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error('Could not generate PDF.');
    }
  };

  if (loading) {
    return (
      <div className="px-5 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-5 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto text-center">
        <p className="text-ink-600">Order not found.</p>
        <Link to="/admin/orders" className="btn-link mt-3 inline-flex">Back to orders</Link>
      </div>
    );
  }

  const flowIndex = FLOW.indexOf(order.status);

  return (
    <>
      <Helmet><title>Order {order.orderId} — Admin</title></Helmet>
      <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900 transition mb-4">
          <ArrowLeft size={15} /> Back
        </button>

        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="eyebrow">Order</p>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="font-display text-3xl text-ink-800 tracking-tight">{order.orderId}</h1>
              <button onClick={copyId} className="w-8 h-8 inline-flex items-center justify-center rounded-full text-ink-500 hover:text-ink-800 hover:bg-cream-200 transition" aria-label="Copy ID">
                {copied ? <Check size={15} className="text-sage-500" /> : <Copy size={15} />}
              </button>
            </div>
            <p className="text-sm text-ink-500 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
          <span className={`badge ${STATUS_BG[order.status] || 'bg-ink-100 text-ink-700'} text-[12px] !px-3 !py-1.5`}>{order.status}</span>
        </header>

        {/* Workflow */}
        <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 mb-5">
          <h2 className="font-display text-lg text-ink-800">Order workflow</h2>
          <p className="text-sm text-ink-500 mt-1">Move the order through the stages. The customer will see the new status on their next view.</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {FLOW.map((s, i) => {
              const reached = flowIndex >= i && order.status !== 'Cancelled';
              const active = order.status === s;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border ${
                    active ? 'bg-ink-800 text-cream-100 border-ink-800' :
                    reached ? 'bg-sage-100 text-sage-700 border-sage-200' :
                    'bg-cream-100 text-ink-500 border-ink-100'
                  }`}>
                    {s}
                  </div>
                  {i < FLOW.length - 1 && <span className="w-6 h-px bg-ink-200" />}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label className="label" htmlFor="status">Set status</label>
              <select id="status" className="input-lg" value={status} onChange={(e) => setStatus(e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving || status === order.status} className="btn-primary">
                <Save size={15} /> {saving ? 'Saving…' : 'Save status'}
              </button>
              {NEXT_STATUS[order.status] && (
                <button onClick={advance} disabled={saving} className="btn-secondary">
                  Mark as {NEXT_STATUS[order.status]} →
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Customer & delivery */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
              <h2 className="font-display text-lg text-ink-800">Customer</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">Name</p>
                  <p className="text-ink-800 font-medium mt-1">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">Phone</p>
                  <p className="text-ink-800 font-medium mt-1 inline-flex items-center gap-2">
                    {order.phone}
                    {order.phone && <a href={`tel:${order.phone.replace(/\s/g, '')}`} className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-cream-100 text-ink-600 hover:text-ink-900"><Phone size={12} /></a>}
                  </p>
                </div>
                {order.email && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">Email</p>
                    <p className="text-ink-800 font-medium mt-1 inline-flex items-center gap-2">
                      {order.email}
                      <a href={`mailto:${order.email}`} className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-cream-100 text-ink-600 hover:text-ink-900"><Mail size={12} /></a>
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">City</p>
                  <p className="text-ink-800 font-medium mt-1 inline-flex items-center gap-2">
                    <MapPin size={13} className="text-ink-400" /> {order.city}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">Address</p>
                  <p className="text-ink-800 mt-1 leading-relaxed">{order.address}</p>
                </div>
                {order.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">Notes</p>
                    <p className="text-ink-700 mt-1 italic">{order.notes}</p>
                  </div>
                )}
              </div>

              {wa && (
                <a
                  href={`https://wa.me/${wa.replace(/^\+/, '')}?text=${encodeURIComponent(`Hi ${order.customerName}, this is DELISOGA regarding your order ${order.orderId}.`)}`}
                  target="_blank" rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-sage-500 hover:bg-sage-600 text-cream-100 text-sm font-medium transition"
                >
                  <MessageCircle size={15} /> Message on WhatsApp
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
              <h2 className="font-display text-lg text-ink-800">Order details</h2>
              <div className="mt-4 flex gap-4">
                <div className="w-20 h-24 flex-shrink-0 bg-cream-200 rounded-xl overflow-hidden">
                  <img src="/images/product-main.jpg" alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">DELISOGA</p>
                  <p className="font-display text-[15px] text-ink-800 mt-0.5">{order.productName || 'Glass Jar with Bamboo Lid & Glass Straw'}</p>
                  <p className="text-sm text-ink-500 mt-1">Quantity: {order.quantity}</p>
                </div>
              </div>

              <dl className="mt-5 pt-5 border-t border-ink-100 space-y-2 text-sm text-ink-600">
                <div className="flex items-center justify-between">
                  <dt>Unit price</dt>
                  <dd>{formatPKR(order.unitPrice)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPKR(order.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Delivery</dt>
                  <dd className={order.freeDelivery ? 'text-sage-600 font-medium' : ''}>
                    {order.freeDelivery ? 'Free' : formatPKR(order.deliveryCharges)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-ink-100">
                  <dt className="text-ink-700 font-medium">Total</dt>
                  <dd className="font-display text-lg text-ink-800">{formatPKR(order.finalTotal)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
              <h2 className="font-display text-lg text-ink-800">Summary</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">Payment</dt>
                  <dd className="text-ink-800 font-medium">{order.paymentMethod}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">Free delivery</dt>
                  <dd className={order.freeDelivery ? 'text-sage-600 font-medium' : 'text-ink-600'}>{order.freeDelivery ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-500">Last update</dt>
                  <dd className="text-ink-800">{formatDateTime(order.updatedAt || order.createdAt)}</dd>
                </div>
                {order.sku && (
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">SKU</dt>
                    <dd className="text-ink-800 font-mono text-[12.5px]">{order.sku}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
              <h2 className="font-display text-lg text-ink-800">Quick actions</h2>
              <div className="mt-4 space-y-2.5">
                {NEXT_STATUS[order.status] && (
                  <button onClick={advance} disabled={saving} className="btn-primary w-full">
                    Move to {NEXT_STATUS[order.status]} →
                  </button>
                )}
                {order.status !== 'Cancelled' && (
                  <button onClick={cancelOrder} disabled={saving} className="btn-secondary w-full !text-red-600 !border-red-200 hover:!bg-red-50">
                    <XCircle size={15} /> Cancel order
                  </button>
                )}
                <button onClick={downloadPDF} className="btn-secondary w-full !text-ink-800 hover:!bg-cream-200">
                  <Download size={14} /> Download as PDF
                </button>
                <button onClick={() => setConfirmDelete(true)} disabled={deleting} className="btn-secondary w-full !text-red-600 !border-red-200 hover:!bg-red-50">
                  <Trash2 size={14} /> Delete order
                </button>
                <Link to="/admin/orders" className="btn-ghost w-full">
                  <Package size={15} /> Back to all orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete this order?" size="sm">
        <p className="text-sm text-ink-600">
          This will permanently remove order <span className="font-semibold text-ink-800">{order?.orderId}</span> by <span className="font-semibold text-ink-800">{order?.customerName}</span>. This action cannot be undone.
        </p>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={() => setConfirmDelete(false)} className="btn-ghost">Cancel</button>
          <button onClick={removeOrder} disabled={deleting} className="btn-primary !bg-red-600 hover:!bg-red-700">
            <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete order'}
          </button>
        </div>
      </Modal>
    </>
  );
}
