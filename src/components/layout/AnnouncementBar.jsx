import { useEffect, useState } from 'react';
import { Truck, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AnnouncementBar() {
  const { settings } = useSettings();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!settings?.announcement?.enabled) return;
    const dismissed = sessionStorage.getItem('delisoga.announcement.dismissed');
    if (!dismissed) setVisible(true);
  }, [settings]);

  if (!settings?.announcement?.enabled || !visible) return null;
  const text = settings.announcement.text || 'Free delivery across Pakistan on orders of 2 or more jars';

  return (
    <div className="bg-ink-800 text-cream-100 relative z-40">
      <div className="container-x flex items-center justify-center gap-2 sm:gap-3 py-2.5 text-[12.5px] sm:text-[13px]">
        <Truck className="w-4 h-4 text-bamboo-300 flex-shrink-0" strokeWidth={1.5} />
        <p className="font-medium tracking-wide text-center">
          <span className="hidden sm:inline">{text}</span>
          <span className="sm:hidden">Free delivery on 2+ jars</span>
          <span className="hidden sm:inline"> · </span>
          <span className="sm:hidden"> · </span>
          <span className="text-cream-100/70">Cash on Delivery</span>
        </p>
        <button
          onClick={() => { setVisible(false); sessionStorage.setItem('delisoga.announcement.dismissed', '1'); }}
          className="absolute right-2 sm:right-4 w-7 h-7 inline-flex items-center justify-center rounded-full text-cream-100/60 hover:text-cream-100 hover:bg-cream-100/10 transition"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
