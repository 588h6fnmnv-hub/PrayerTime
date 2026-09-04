'use client';

import { useState } from 'react';
import { Crosshair, MapPin, Search, X } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestGPS: () => void;
  onSelectCustomLocation: (city: string) => void;
  currentCity: string;
}

const POPULAR_CITIES = [
  'Makkah',
  'Madinah',
  'Jerusalem',
  'Cairo',
  'Istanbul',
  'London',
  'New York',
  'Dubai',
  'Kuala Lumpur',
  'Jakarta',
  'Toronto',
];

export function LocationModal({
  isOpen,
  onClose,
  onRequestGPS,
  onSelectCustomLocation,
  currentCity,
}: LocationModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSelectCustomLocation(search.trim());
      setSearch('');
      onClose();
    }
  };

  const handleCityClick = (city: string) => {
    onSelectCustomLocation(city);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md glass-card border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 animate-in slide-in-from-bottom-5 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Location Settings
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Location access is needed for accurate prayer times.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full glass-button text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option 1: Use Current GPS */}
        <button
          onClick={() => {
            onRequestGPS();
            onClose();
          }}
          className="w-full py-3.5 px-4 rounded-2xl glass-card-gold flex items-center justify-center space-x-2 text-sm font-semibold text-amber-200 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.98] transition-all"
        >
          <Crosshair className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Use Current Location (GPS)</span>
        </button>

        {/* Option 2: Search Custom City */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Choose Location Manually
          </label>
          <form onSubmit={handleCustomSubmit} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter city name (e.g. Chicago, Tokyo)..."
              className="w-full glass-button pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </form>
        </div>

        {/* Quick Select Popular Cities */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Popular Cities
          </span>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            {POPULAR_CITIES.map((city) => {
              const isSelected = currentCity.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                      : 'glass-button text-zinc-300 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
