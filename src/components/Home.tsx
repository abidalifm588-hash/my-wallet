import { useEffect, useRef, useState } from "react";
import { Avatar, VerifiedTick } from "./ui";
import { Logo } from "./Verification";
import ProfilePanel from "./ProfilePanel";
import { defaultNotices, defaultProfile, usePersisted, type Notice } from "../store";

const toneStyles: Record<Notice["tone"], string> = {
  success: "bg-emerald-100 text-emerald-600",
  info: "bg-indigo-100 text-indigo-600",
  warn: "bg-amber-100 text-amber-600",
};

export default function Home() {
  const [profile, setProfile] = usePersisted("profile", defaultProfile);
  const [balance, setBalance] = usePersisted<number>("balance", 1020);
  const [notices, setNotices] = usePersisted<Notice[]>("notices", defaultNotices);
  const [seen, setSeen] = usePersisted<string[]>("seen", []);
  const [showNotes, setShowNotes] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) setShowNotes(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = notices.filter((n) => !seen.includes(n.id)).length;
  const firstName = profile.name.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo small />
            <span className="text-lg font-semibold tracking-tight text-slate-900">MyWallet</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative" ref={noteRef}>
              <button
                onClick={() => {
                  setShowNotes((s) => !s);
                  setSeen(notices.map((n) => n.id));
                }}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 003.4 0" />
                </svg>
                {unread > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">{unread}</span>
                )}
              </button>

              {showNotes && (
                <div className="fixed inset-x-3 top-[68px] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  </div>
                  <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto">
                    {notices.length === 0 && <li className="px-4 py-8 text-center text-sm text-slate-400">You're all caught up.</li>}
                    {notices.map((n) => (
                      <li key={n.id} className="flex gap-3 px-4 py-3.5">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneStyles[n.tone]}`}>
                          {n.tone === "success" ? (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
                            </svg>
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{n.title}</p>
                          {n.body && <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>}
                          <p className="mt-1 text-xs text-slate-400">
                            {n.time}
                            {n.place ? ` — ${n.place}` : ""}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile */}
            <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-100 sm:pr-3">
              <Avatar src={profile.picture} name={profile.name} size="h-8 w-8" text="text-xs" />
              <span className="hidden items-center gap-1 text-sm font-medium text-slate-800 sm:flex">
                {profile.name}
                <VerifiedTick className="h-4 w-4" />
              </span>
              <span className="sm:hidden">
                <VerifiedTick className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800 ring-1 ring-amber-200">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
              </svg>
              VIP Client
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Welcome back, {firstName}.</h1>
            <p className="mt-2 max-w-md text-slate-500">It's a pleasure to have you with us. Your wallet is ready and everything is in order.</p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-sm font-medium text-emerald-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            NFC Connected
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
          <div className="flex gap-3.5">
            <svg className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
              <path d="M8.5 12l2.5 2.5 4.5-5" />
            </svg>
            <p className="text-[15px] leading-relaxed text-emerald-900">
              Your account is verified, but we advise you to refrain from making any mistakes while withdrawing. If multiple withdrawal attempts fail, the funds will be returned to the original sender. Although you can recover the funds again by contacting the person who sent them to you, we still strongly recommend reviewing everything carefully before making a decision.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[15px] leading-relaxed text-slate-700">
            We are not providing the custom amount withdrawal feature right now. Complete 2 withdrawals first, and then you will be able to withdraw any custom amount of your choice.
          </p>
          <p className="mt-4 text-[15px] text-slate-700">Thank you for staying with us.</p>
          <div className="mt-4 border-l-2 border-slate-200 pl-4 text-sm leading-relaxed text-slate-500">
            <p className="font-semibold text-slate-800">Arshcroft</p>
            <p>Security Department</p>
            <p>Toronto, Canada</p>
          </div>
        </div>
      </main>

      {showProfile && (
        <ProfilePanel
          profile={profile}
          setProfile={setProfile}
          balance={balance}
          setBalance={setBalance}
          notices={notices}
          setNotices={setNotices}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
