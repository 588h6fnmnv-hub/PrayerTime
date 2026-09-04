'use client';

import { useState, useEffect } from 'react';

export default function PwaDebugPage() {
  const [info, setInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isNavStandalone = (window.navigator as any).standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    let swStatus = 'Not checked';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setInfo((prev) => ({
          ...prev,
          swRegistered: !!reg,
          swScope: reg ? reg.scope : 'None',
          swActive: reg?.active ? reg.active.state : 'None',
        }));
      });
    }

    setInfo({
      userAgent: navigator.userAgent,
      isIOS,
      displayModeStandalone: isStandaloneMode,
      navigatorStandalone: isNavStandalone,
      isPWAActive: isStandaloneMode || isNavStandalone,
      notificationPermission: 'Notification' in window ? Notification.permission : 'Unsupported',
      serviceWorkerSupported: 'serviceWorker' in navigator,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio,
    });
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-[#050505] text-zinc-100 font-mono text-xs space-y-4 pt-12">
      <div className="border border-amber-500/30 rounded-xl p-4 bg-zinc-900/50 backdrop-blur-md">
        <h1 className="text-base font-bold text-amber-400 mb-2">Kahaba PWA Diagnostic</h1>
        <p className="text-zinc-400 text-[11px] mb-4">
          Diagnostic details for testing PWA installation and standalone mode on iOS.
        </p>

        <div className="space-y-3">
          <div className="p-2.5 rounded bg-black/60 border border-white/10">
            <span className="text-zinc-400 block text-[10px]">PWA Standalone Status:</span>
            <span className={`font-bold ${info.isPWAActive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {info.isPWAActive ? 'RUNNING AS STANDALONE APP (PWA)' : 'RUNNING IN BROWSER TAB'}
            </span>
          </div>

          <div className="p-2.5 rounded bg-black/60 border border-white/10 space-y-1">
            <span className="text-zinc-400 block text-[10px]">Display Mode Detection:</span>
            <div>matchMedia(display-mode: standalone): <span className="text-zinc-200 font-semibold">{String(info.displayModeStandalone)}</span></div>
            <div>navigator.standalone (iOS Safari): <span className="text-zinc-200 font-semibold">{String(info.navigatorStandalone)}</span></div>
            <div>iOS Platform Detected: <span className="text-zinc-200 font-semibold">{String(info.isIOS)}</span></div>
          </div>

          <div className="p-2.5 rounded bg-black/60 border border-white/10 space-y-1">
            <span className="text-zinc-400 block text-[10px]">Service Worker Info:</span>
            <div>SW Supported: <span className="text-zinc-200 font-semibold">{String(info.serviceWorkerSupported)}</span></div>
            <div>SW Registered: <span className="text-zinc-200 font-semibold">{String(info.swRegistered)}</span></div>
            <div>SW Scope: <span className="text-zinc-200 font-semibold">{info.swScope || 'N/A'}</span></div>
            <div>SW Active State: <span className="text-zinc-200 font-semibold">{info.swActive || 'N/A'}</span></div>
          </div>

          <div className="p-2.5 rounded bg-black/60 border border-white/10 space-y-1">
            <span className="text-zinc-400 block text-[10px]">Permissions & Environment:</span>
            <div>Notification Permission: <span className="text-zinc-200 font-semibold">{info.notificationPermission}</span></div>
            <div>Viewport: <span className="text-zinc-200 font-semibold">{info.viewportWidth}x{info.viewportHeight}</span></div>
            <div>Screen Height: <span className="text-zinc-200 font-semibold">{info.screenHeight}px</span></div>
            <div>Device Pixel Ratio: <span className="text-zinc-200 font-semibold">{info.pixelRatio}</span></div>
          </div>

          <div className="p-2.5 rounded bg-black/60 border border-white/10 space-y-1 text-[10px] break-all">
            <span className="text-zinc-400 block">User Agent:</span>
            <span className="text-zinc-300">{info.userAgent}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <a href="/" className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-sans text-zinc-200 hover:text-white">
          ← Back to Kahaba App
        </a>
      </div>
    </div>
  );
}
