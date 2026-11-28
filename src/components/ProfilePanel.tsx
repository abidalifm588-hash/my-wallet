import { useEffect, useRef, useState } from "react";
import { Avatar, Modal, VerifiedTick, inputCls } from "./ui";
import PasswordGate from "./PasswordGate";
import { legalDocs, legalLinks } from "../legal";
import { money, usePersisted, type Notice, type Profile } from "../store";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  balance: number;
  setBalance: (n: number) => void;
  notices: Notice[];
  setNotices: (n: Notice[]) => void;
  onClose: () => void;
}

const BALANCE_PW = "1966";
const WITHDRAW_PW = "3384195844";
const HS_PW = "amimelaon@2022";
const DAY = 24 * 60 * 60 * 1000;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-slate-100 px-6 py-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

export default function ProfilePanel({ profile, setProfile, balance, setBalance, notices, setNotices, onClose }: Props) {
  const [attempts, setAttempts] = usePersisted<number>("attempts", 0);
  const [lockUntil, setLockUntil] = usePersisted<number>("lockUntil", 0);
  const [etin, setEtin] = usePersisted<{ verified: boolean; file: string }>("etin", { verified: false, file: "" });

  const [now, setNow] = useState(Date.now());
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [gate, setGate] = useState<null | "balance" | "withdraw" | "hs">(null);
  const [gateErr, setGateErr] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState("");
  const [doc, setDoc] = useState<string | null>(null);
  const [hsOpen, setHsOpen] = useState(false);

  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const [phoneErr, setPhoneErr] = useState("");
  const [etinErr, setEtinErr] = useState("");
  const picRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const locked = lockUntil > now;
  useEffect(() => {
    if (lockUntil && lockUntil <= now) {
      setLockUntil(0);
      setAttempts(0);
    }
  }, [lockUntil, now, setLockUntil, setAttempts]);

  const remaining = Math.max(0, lockUntil - now);
  const hh = String(Math.floor(remaining / 3600000)).padStart(2, "0");
  const mm = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  const openGate = (g: "balance" | "withdraw" | "hs") => {
    setGateErr("");
    setGate(g);
  };

  const submitBalance = (pw: string) => {
    if (pw === BALANCE_PW) {
      setAttempts(0);
      setBalanceVisible(true);
      setGate(null);
      return;
    }
    const n = attempts + 1;
    if (n >= 3) {
      setLockUntil(Date.now() + DAY);
      setAttempts(3);
      setGate(null);
    } else {
      setAttempts(n);
      setGateErr(`Incorrect password. ${3 - n} attempt${3 - n === 1 ? "" : "s"} remaining.`);
    }
  };

  const submitWithdraw = (pw: string) => {
    if (pw === WITHDRAW_PW) {
      setWithdrawOpen(true);
      setGate(null);
    } else setGateErr("Incorrect password.");
  };

  const submitHs = (pw: string) => {
    if (pw === HS_PW) {
      setHsOpen(true);
      setGate(null);
    } else setGateErr("Incorrect password.");
  };

  const saveProfile = () => {
    const digits = draft.phone.replace(/\s|-/g, "");
    if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(digits)) {
      setPhoneErr("Enter a valid Bangladeshi mobile number (e.g. 01914537042).");
      return;
    }
    setPhoneErr("");
    setProfile({ ...draft, name: draft.name.trim() || profile.name, phone: digits });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onPic = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setDraft((d) => ({ ...d, picture: String(r.result) }));
    r.readAsDataURL(f);
  };

  const acceptPdf = (f: File) => {
    const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setEtinErr("Please choose a PDF file.");
      return;
    }
    setEtinErr("");
    setEtin({ verified: true, file: f.name });
  };

  const pickEtin = async () => {
    setEtinErr("");
    const w = window as unknown as {
      showOpenFilePicker?: (o: unknown) => Promise<{ getFile: () => Promise<File> }[]>;
    };
    if (w.showOpenFilePicker) {
      try {
        const [h] = await w.showOpenFilePicker({
          startIn: "downloads",
          multiple: false,
          types: [{ description: "PDF document", accept: { "application/pdf": [".pdf"] } }],
        });
        acceptPdf(await h.getFile());
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    pdfRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px]" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <h2 className="text-base font-semibold text-slate-900">Profile & account</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-6">
          <Avatar src={profile.picture} name={profile.name} size="h-16 w-16" text="text-xl" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-lg font-semibold text-slate-900">{profile.name}</p>
              <VerifiedTick />
            </div>
            <p className="truncate text-sm text-slate-500">{profile.email}</p>
            <p className="truncate text-sm text-slate-400">{profile.location}</p>
          </div>
        </div>

        {/* Balance */}
        <Section title="Balance">
          {locked ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">Account locked</p>
              <p className="mt-1 text-sm text-red-700">Too many incorrect attempts. Try again in</p>
              <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-red-800">
                {hh}:{mm}:{ss}
              </p>
            </div>
          ) : balanceVisible ? (
            <div className="flex items-end justify-between rounded-xl bg-slate-900 p-5 text-white">
              <div>
                <p className="text-xs text-slate-400">Total balance</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{money(balance)}</p>
              </div>
              <button onClick={() => setBalanceVisible(false)} className="text-xs text-slate-400 underline-offset-2 hover:text-white hover:underline">
                Hide
              </button>
            </div>
          ) : (
            <button
              onClick={() => openGate("balance")}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <span className="text-sm font-medium text-slate-800">Tap to see balance</span>
              <span className="text-slate-400">••••••</span>
            </button>
          )}
        </Section>

        {/* Edit profile */}
        <Section title="Edit profile">
          <div className="mb-4 flex items-center gap-4">
            <Avatar src={draft.picture} name={draft.name} size="h-14 w-14" text="text-lg" />
            <div className="flex gap-2">
              <button onClick={() => picRef.current?.click()} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Change photo
              </button>
              {draft.picture && (
                <button onClick={() => setDraft({ ...draft, picture: "" })} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
                  Remove
                </button>
              )}
            </div>
            <input ref={picRef} type="file" accept="image/*" hidden onChange={(e) => onPic(e.target.files?.[0])} />
          </div>
          <div className="space-y-3">
            <Field label="Name">
              <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <input type="email" className={inputCls} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </Field>
            <Field label="Mobile number (Bangladesh)">
              <input
                type="tel"
                className={inputCls}
                value={draft.phone}
                placeholder="01XXXXXXXXX"
                onChange={(e) => {
                  setDraft({ ...draft, phone: e.target.value });
                  setPhoneErr("");
                }}
              />
              {phoneErr && <p className="mt-1 text-xs text-red-600">{phoneErr}</p>}
            </Field>
            <Field label="Location">
              <input className={inputCls} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={saveProfile} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Save changes
            </button>
            {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
          </div>
        </Section>

        {/* e-TIN */}
        <Section title="Tax certificate">
          {etin.verified ? (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-900">Your e-TIN is verified</p>
                {etin.file && <p className="truncate text-xs text-emerald-700">{etin.file}</p>}
                <button onClick={pickEtin} className="mt-1 text-xs text-emerald-800 underline">
                  Upload a different file
                </button>
              </div>
            </div>
          ) : (
            <button onClick={pickEtin} className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-3.5 text-left hover:border-indigo-400 hover:bg-indigo-50/40">
              <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
              </svg>
              <span className="text-sm font-medium text-slate-800">Upload e-TIN Certificate</span>
            </button>
          )}
          {etinErr && <p className="mt-2 text-sm text-red-600">{etinErr}</p>}
          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) acceptPdf(f);
              e.target.value = "";
            }}
          />
        </Section>

        {/* Withdrawal */}
        <Section title="Withdrawal">
          {!withdrawOpen ? (
            <button onClick={() => openGate("withdraw")} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
              <span className="text-sm font-medium text-slate-800">Withdraw funds</span>
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 118 0v3" />
              </svg>
            </button>
          ) : (
            <div className="space-y-2">
              {[
                { name: "Upwork", color: "bg-green-600", msg: "Your Upwork account was terminated because NFC was not available." },
                { name: "LinkedIn", color: "bg-sky-700", msg: "Your LinkedIn account was terminated due to missing passport verification." },
              ].map((o) => (
                <button key={o.name} onClick={() => setWithdrawMsg(o.msg)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-slate-50">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white ${o.color}`}>{o.name[0]}</span>
                  <span className="text-sm font-medium text-slate-800">{o.name}</span>
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Legal */}
        <Section title="Legal & info">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {legalLinks.map((l) => (
              <button key={l} onClick={() => setDoc(l)} className="text-left text-sm text-slate-600 hover:text-indigo-600 hover:underline">
                {l}
              </button>
            ))}
          </div>
        </Section>

        <div className="flex items-center justify-between px-6 pb-8 pt-4">
          <p className="text-xs text-slate-300">MyWallet v1.4.2</p>
          <button onClick={() => openGate("hs")} aria-label="HS" className="rounded px-1.5 py-0.5 text-[9px] font-medium text-slate-300 opacity-60 hover:opacity-100">
            HS
          </button>
        </div>
      </aside>

      {gate === "balance" && (
        <PasswordGate title="Enter password" description="Enter your password to view your balance." onSubmit={submitBalance} onClose={() => setGate(null)} error={gateErr} />
      )}
      {gate === "withdraw" && (
        <PasswordGate title="Withdrawal access" description="Enter your withdrawal password to continue." onSubmit={submitWithdraw} onClose={() => setGate(null)} error={gateErr} />
      )}
      {gate === "hs" && <PasswordGate title="Restricted" onSubmit={submitHs} onClose={() => setGate(null)} error={gateErr} submitLabel="Enter" />}

      {withdrawMsg && (
        <Modal title="Withdrawal unavailable" onClose={() => setWithdrawMsg("")}>
          <p className="text-sm leading-relaxed text-slate-600">{withdrawMsg}</p>
          <button onClick={() => setWithdrawMsg("")} className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Close
          </button>
        </Modal>
      )}

      {doc && (
        <Modal title={legalDocs[doc].title} onClose={() => setDoc(null)} wide>
          <p className="-mt-2 mb-4 text-xs text-slate-400">{legalDocs[doc].updated}</p>
          <div className="space-y-4">
            {legalDocs[doc].sections.map((s) => (
              <div key={s.heading}>
                <h4 className="text-sm font-semibold text-slate-900">{s.heading}</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {hsOpen && <HsAdmin balance={balance} setBalance={setBalance} notices={notices} setNotices={setNotices} onClose={() => setHsOpen(false)} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function HsAdmin({
  balance,
  setBalance,
  notices,
  setNotices,
  onClose,
}: {
  balance: number;
  setBalance: (n: number) => void;
  notices: Notice[];
  setNotices: (n: Notice[]) => void;
  onClose: () => void;
}) {
  const [bal, setBal] = useState(String(balance));
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [tone, setTone] = useState<Notice["tone"]>("info");

  const saveBal = () => {
    const n = Number(bal.replace(/[$,]/g, ""));
    if (!Number.isFinite(n) || n < 0) return setMsg("Enter a valid amount.");
    setBalance(n);
    setMsg("Balance updated.");
  };
  const addNotice = () => {
    if (!title.trim()) return setMsg("Notification needs a title.");
    const n: Notice = {
      id: "c" + Date.now(),
      title: title.trim(),
      body: body.trim(),
      time: time.trim() || new Date().toLocaleString("en-US", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }),
      place: place.trim() || undefined,
      tone,
    };
    setNotices([n, ...notices]);
    setTitle("");
    setBody("");
    setTime("");
    setPlace("");
    setMsg("Notification created.");
  };

  return (
    <Modal title="Account editor" onClose={onClose} wide>
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Balance (USD)</p>
          <div className="flex gap-2">
            <input className={inputCls} inputMode="decimal" value={bal} onChange={(e) => setBal(e.target.value)} />
            <button onClick={saveBal} className="shrink-0 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">
              Save
            </button>
          </div>
        </div>
        <div className="space-y-2.5 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">New notification</p>
          <input className={inputCls} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className={inputCls} rows={2} placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Date / time (optional)" value={time} onChange={(e) => setTime(e.target.value)} />
            <input className={inputCls} placeholder="Place (optional)" value={place} onChange={(e) => setPlace(e.target.value)} />
          </div>
          <select className={inputCls} value={tone} onChange={(e) => setTone(e.target.value as Notice["tone"])}>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warn">Warning</option>
          </select>
          <button onClick={addNotice} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Create notification
          </button>
        </div>
        {notices.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Existing</p>
            <ul className="space-y-1">
              {notices.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-slate-700">{n.title}</span>
                  <button onClick={() => setNotices(notices.filter((x) => x.id !== n.id))} className="shrink-0 text-xs text-red-500 hover:underline">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      </div>
    </Modal>
  );
}
