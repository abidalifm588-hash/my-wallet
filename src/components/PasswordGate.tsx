import { useState } from "react";
import { Modal, inputCls } from "./ui";

export default function PasswordGate({
  title,
  description,
  onSubmit,
  onClose,
  error,
  submitLabel = "Unlock",
}: {
  title: string;
  description?: string;
  onSubmit: (pw: string) => void;
  onClose: () => void;
  error?: string;
  submitLabel?: string;
}) {
  const [pw, setPw] = useState("");
  return (
    <Modal title={title} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(pw);
          setPw("");
        }}
      >
        {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}
        <input autoFocus type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className={inputCls} autoComplete="off" />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" disabled={!pw} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40">
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
