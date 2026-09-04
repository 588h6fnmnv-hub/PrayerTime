'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface HeaderProps {
  cityName: string;
  onOpenLocationModal: () => void;
}

export function Header({ cityName, onOpenLocationModal }: HeaderProps) {
  return (
    <header className="px-5 pt-4 pb-2 flex items-center justify-between z-20">
      <div className="flex items-center space-x-3">
        <div className="relative w-9 h-9 rounded-xl overflow-hidden glass-pill flex items-center justify-center p-1.5 border border-amber-500/20 shadow-lg shadow-amber-500/5">
          <Image
            src="/icons/kahaba.svg"
            alt="Kahaba Logo"
            width={28}
            height={28}
            className="object-contain"
            priority
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Kahaba
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
          </h1>
          <p className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium">Islamic Prayer Companion</p>
        </div>
      </div>

      <button
        onClick={onOpenLocationModal}
        className="glass-button px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white transition-all shadow-sm active:scale-95 border border-white/10"
      >
        <MapPin className="w-3.5 h-3.5 text-amber-400/90" />
        <span className="truncate max-w-[110px] font-medium">{cityName || 'Select City'}</span>
      </button>
    </header>
  );
}
