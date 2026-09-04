'use client';

import { Calendar, Clock, Settings } from 'lucide-react';

export type TabType = 'today' | 'prayers' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Clock },
    { id: 'prayers' as TabType, label: 'Prayers', icon: Calendar },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none">
      <nav className="glass-nav pointer-events-auto rounded-full p-1.5 flex items-center justify-between space-x-1 max-w-xs w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-200 relative ${
                isActive
                  ? 'text-amber-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-white/10 border border-amber-400/30 shadow-inner" />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 relative z-10 tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
