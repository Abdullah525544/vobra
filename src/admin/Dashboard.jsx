import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, TrendingUp, CheckCircle2, Truck, Clock, XCircle, DollarSign, ShoppingBag, Users, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { listOrders } from '../lib/orders';
import { formatPKR, formatPKRCompact, formatDateTime, relativeTime } from '../lib/format';
import Skeleton from '../components/ui/Skeleton';

const STATUS_COLORS = {
  New: 'bg-ink-100 text-ink-700',
  Confirmed: 'bg-bamboo-100 text-bamboo-700',
  Processing: 'bg-bamboo-200/60 text-bamboo-700',
  Shipped: 'bg-sage-100 text-sage-700',
  Delivered: 'bg-sage-500/20 text-sage-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await listOrders();
        if (alive) setOrders(list);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => {
    const count = (s) => orders.filter((o) => o.status === s).length;
    const newCount = count('New');
    const confirmed = count('Confirmed');
    const processing = count('Processing');
    const shipped = count('Shipped');
    const delivered = count('Delivered');
    const cancelled = count('Cancelled');
    const total = orders.length;
    const revenue = orders
      .filter((o) => o.status === 'Delivered')
      .reduce((s, o) => s + (o.finalTotal || 0), 0);
    const allRevenue = orders.reduce((s, o) => s + (o.finalTotal || 0), 0);
    const units = orders.reduce((s, o) => s + (o.quantity || 0), 0);
    const avgOrder = total > 0 ? allRevenue / total : 0;

    return { total, newCount, confirmed, processing, shipped, delivered, cancelled, revenue, allRevenue, units, avgOrder };
  }, [orders]);

  const recent = orders.slice(0, 8);
  const topCards = [
    { label: 'Total orders', value: stats.total, Icon: ShoppingBag, trend: stats.newCount > 0 ? `${stats.newCount} new` : '—', positive: stats.newCount > 0 },
    { label: 'New orders', value: stats.newCount, Icon: Clock },
    { label: 'Processing', value: stats.processing + stats.confirmed, Icon: Package },
    { label: 'Shipped', value: stats.shipped, Icon: Truck },
    { label: 'Delivered', value: stats.delivered, Icon: CheckCircle2, positive: true },
    { label: 'Cancelled', value: stats.cancelled, Icon: XCircle, danger: stats.cancelled > 0 },
  ];

  return (
    <>
      <Helmet><title>Dashboard — DELISOGA Admin</title></Helmet>
      <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <p className="eyebrow">Overview</p>
            <h1 className="mt-1 font-display text-3xl text-ink-800">Dashboard</h1>
          </div>
          <Link to="/admin/orders" className="btn-primary self-start sm:self-auto">
            <Package size={16} /> Manage orders <ChevronRight size={14} />
          </Link>
        </header>

        {/* Revenue row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div className="lg:col-span-2 rounded-2xl bg-ink-800 text-cream-100 p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-bamboo-400/15" />
            <div className="relative">
              <p className="eyebrow text-bamboo-300">Revenue (delivered)</p>
              <p className="mt-2 font-display text-4xl sm:text-5xl text-cream-100 leading-none">{formatPKR(stats.revenue)}</p>
              <p className="mt-2 text-cream-200/70 text-sm">From {stats.delivered} delivered order{stats.delivered === 1 ? '' : 's'}.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-wider text-ink-400">All-time GMV</p>
                <TrendingUp className="w-4 h-4 text-sage-500" />
              </div>
              <p className="mt-1.5 font-display text-2xl text-ink-800">{formatPKRCompact(stats.allRevenue)} <span className="text-sm text-ink-500">PKR</span></p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-wider text-ink-400">Avg. order value</p>
                <DollarSign className="w-4 h-4 text-bamboo-500" />
              </div>
              <p className="mt-1.5 font-display text-2xl text-ink-800">{formatPKR(Math.round(stats.avgOrder))}</p>
            </div>
          </div>
        </section>

        {/* Status cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          {topCards.map(({ label, value, Icon, trend, positive, danger }) => (
            <div key={label} className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-cream-100 text-ink-700 inline-flex items-center justify-center">
                  <Icon size={16} />
                </div>
                {trend && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${positive ? 'text-sage-600' : 'text-ink-500'}`}>
                    {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[11.5px] uppercase tracking-wider text-ink-400">{label}</p>
              <p className={`mt-0.5 font-display text-2xl ${danger ? 'text-red-600' : 'text-ink-800'}`}>{value}</p>
            </div>
          ))}
        </section>

        {/* Units & quick stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-bamboo-50 text-bamboo-600 inline-flex items-center justify-center"><Package size={20} /></div>
            <div>
              <p className="text-[12px] uppercase tracking-wider text-ink-400">Total units sold</p>
              <p className="font-display text-2xl text-ink-800">{stats.units} jar{stats.units === 1 ? '' : 's'}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sage-100 text-sage-600 inline-flex items-center justify-center"><Users size={20} /></div>
            <div>
              <p className="text-[12px] uppercase tracking-wider text-ink-400">Unique customers</p>
              <p className="font-display text-2xl text-ink-800">{new Set(orders.map((o) => o.phone)).size}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cream-200 text-ink-700 inline-flex items-center justify-center"><Truck size={20} /></div>
            <div>
              <p className="text-[12px] uppercase tracking-wider text-ink-400">In transit</p>
              <p className="font-display text-2xl text-ink-800">{stats.shipped + stats.processing}</p>
            </div>
          </div>
        </section>

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl text-ink-800">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-ink-700 hover:text-ink-900 transition inline-flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
            {loading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : recent.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-ink-500">No orders yet.</p>
                <p className="text-[12.5px] text-ink-400 mt-1">Once customers place orders, they will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream-100/60 text-[11px] uppercase tracking-wider text-ink-500">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Order</th>
                      <th className="text-left font-medium px-4 py-3">Customer</th>
                      <th className="text-left font-medium px-4 py-3 hidden md:table-cell">City</th>
                      <th className="text-left font-medium px-4 py-3">Qty</th>
                      <th className="text-left font-medium px-4 py-3">Total</th>
                      <th className="text-left font-medium px-4 py-3">Status</th>
                      <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o) => (
                      <tr key={o.id} className="border-t border-ink-100 hover:bg-cream-100/40 transition">
                        <td className="px-4 py-3">
                          <Link to={`/admin/orders/${o.id}`} className="font-medium text-ink-800 hover:text-bamboo-600">{o.orderId || o.id}</Link>
                        </td>
                        <td className="px-4 py-3 text-ink-700">{o.customerName}</td>
                        <td className="px-4 py-3 text-ink-600 hidden md:table-cell">{o.city}</td>
                        <td className="px-4 py-3 text-ink-600">{o.quantity}</td>
                        <td className="px-4 py-3 text-ink-800 font-medium">{formatPKR(o.finalTotal)}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${STATUS_COLORS[o.status] || 'bg-ink-100 text-ink-700'}`}>{o.status}</span>
                        </td>
                        <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">{relativeTime(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
