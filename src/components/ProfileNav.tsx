import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from 'lucide-react';

export function ProfileNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="relative">
        {/* ── Profile Popup ─────────────────────────────────────────────────── */}
        <div
          className={`absolute bottom-full left-0 mb-4 w-[280px] liquid-glass rounded-2xl p-5 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom-left ${
            isProfileOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-white/60 shadow-sm bg-white">
              <AvatarImage src="" alt="Ganesh R" />
              <AvatarFallback className="bg-white text-zinc-600 font-semibold">GR</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-zinc-800 text-base">Ganesh R</span>
          </div>
          <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
            I Suffer from Motion Sickness in real life too. Use{" "}
            <a
              href="https://play.google.com/store/apps/details?id=com.urbandroid.kinestop&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-0.5 whitespace-nowrap"
            >
              KineStop <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>

        {/* ── Nav Bar ───────────────────────────────────────────────────────── */}
        <div
          className="liquid-glass rounded-full flex items-center gap-3 pl-2 pr-5 py-2 cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          {/* Profile avatar — using shadcn Avatar */}
          <Avatar className="h-9 w-9 border-2 border-white/60 shadow-sm transition-transform duration-300">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback className="bg-zinc-200 text-zinc-600 text-xs font-semibold">MS</AvatarFallback>
          </Avatar>

          {/* Text */}
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-zinc-500 tracking-wide">Welcome to my,</p>
            <p className="text-sm font-semibold text-zinc-800">Digital Motion Sickness</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
