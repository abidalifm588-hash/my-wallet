import { useState } from "react";

const steps = [
  { key: "email", label: "Email", type: "email", expected: "abidalifm588@gmail.com", placeholder: "you@example.com", hint: "Enter the email linked to your wallet." },
  { key: "password", label: "Password", type: "password", expected: "7042", placeholder: "••••", hint: "Enter your account password." },
  { key: "mobile", label: "Mobile Number", type: "tel", expected: "01914537042", placeholder: "01XXXXXXXXX", hint: "Your registered Bangladeshi mobile number." },
  { key: "nid", label: "NID Number", type: "text", expected: "3258942261", placeholder: "10-digit NID", hint: "National ID card number." },
  { key: "passport", label: "Passport Number", type: "text", expected: "A17261575", placeholder: "e.g. A00000000", hint: "As printed on your passport." },
];

const details = [
  ["Name", "Amirul Islam"],
  ["Father's Name", "Abdul Majid Sarkar"],
  ["Mother's Name", "MST Rokeya Begum"],
  ["Mobile No", "01914537042"],
  ["Country Code", "BGD"],
];

export default function Verification({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const done = i >= steps.length;
  const step = steps[Math.min(i, steps.length - 1)];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = val.trim();
    const ok = step.key === "email" ? v.toLowerCase() === step.expected : v.toUpperCase() === step.expected.toUpperCase();
    if (!ok) {
      setErr(`That ${step.label.toLowerCase()} doesn't match our records. Please try again.`);
      return;
    }
    setErr("");
    setVal("");
    setI(i + 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <Logo />
          <span className="text-xl font-semibold tracking-tight text-slate-900">MyWallet</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          {!done ? (
            <form onSubmit={submit}>
              <div className="mb-5 flex gap-1.5">
                {steps.map((_, n) => (
                  <div key={n} className={`h-1 flex-1 rounded-full ${n <= i ? "bg-indigo-600" : "bg-slate-200"}`} />
                ))}
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Step {i + 1} of {steps.length}
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">Verify your identity</h1>
              <p className="mt-1 text-sm text-slate-500">{step.hint}</p>

              <label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="f">
                {step.label}
              </label>
              <input
                key={step.key}
                id="f"
                autoFocus
                type={step.type}
                value={val}
                onChange={(e) => {
                  setVal(e.target.value);
                  setErr("");
                }}
                placeholder={step.placeholder}
                autoComplete="off"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
              {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

              <div className="mt-6 flex gap-3">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setI(i - 1);
                      setVal("");
                      setErr("");
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!val.trim()}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {i === steps.length - 1 ? "Verify" : "Continue"}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Identity confirmed</h1>
                  <p className="text-sm text-slate-500">Here are the details on record.</p>
                </div>
              </div>
              <dl className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {details.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-slate-500">{k}</dt>
                    <dd className="text-right text-sm font-medium text-slate-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <button
                onClick={onDone}
                className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Proceed
              </button>
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">Secured by Arshcroft Security Department</p>
      </div>
    </div>
  );
}

export function Logo({ small }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white ${small ? "h-8 w-8" : "h-9 w-9"}`}>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H5a2 2 0 010-4h13v4" />
        <path d="M3 5v14a2 2 0 002 2h15V7" />
        <circle cx="16.5" cy="14" r="1" fill="currentColor" />
      </svg>
    </span>
  );
}
