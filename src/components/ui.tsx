import { useEffect, type ReactNode } from "react";

export function Modal({ title, onClose, children, wide }: { title?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={`max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl ${wide ? "sm:max-w-lg" : "sm:max-w-sm"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="-mr-1 -mt-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function VerifiedTick({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0 text-sky-500`} viewBox="0 0 24 24" aria-label="Verified">
      <path
        fill="currentColor"
        d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.54-1.4.23-3.04-.89-4.15-1.12-1.12-2.75-1.43-4.15-.89A4.2 4.2 0 0 0 11.6 1.5c-1.58 0-2.95.88-3.66 2.18-1.4-.54-3.04-.23-4.15.89-1.12 1.12-1.43 2.75-.89 4.15A4.2 4.2 0 0 0 .72 12.4c0 1.58.88 2.95 2.18 3.66-.54 1.4-.23 3.04.89 4.15 1.12 1.12 2.75 1.43 4.15.89a4.2 4.2 0 0 0 3.66 2.18c1.58 0 2.95-.88 3.66-2.18 1.4.54 3.04.23 4.15-.89 1.12-1.12 1.43-2.75.89-4.15a4.2 4.2 0 0 0 2.18-3.66z"
        transform="translate(.4 0)"
      />
      <path d="M8 12.4l2.7 2.7L16 9.7" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Avatar({ src, name, size = "h-10 w-10", text = "text-sm" }: { src: string; name: string; size?: string; text?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  return src ? (
    <img src={src} alt={name} className={`${size} rounded-full object-cover`} />
  ) : (
    <span className={`${size} ${text} inline-flex items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700`}>{initials || "?"}</span>
  );
}

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
