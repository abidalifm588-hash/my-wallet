import { useEffect, useState } from "react";

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem("mywallet:" + key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("mywallet:" + key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  picture: string;
}

export const defaultProfile: Profile = {
  name: "Amirul Islam",
  email: "abidalifm588@gmail.com",
  phone: "01914537042",
  location: "Dhaka, Bangladesh",
  picture: "",
};

export interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
  place?: string;
  tone: "success" | "info" | "warn";
}

export const defaultNotices: Notice[] = [
  {
    id: "n1",
    title: "Account Verified",
    body: "Your account has been verified.",
    time: "Today, 7:00",
    tone: "success",
  },
  {
    id: "n2",
    title: "Incoming transfer · $900",
    body: "You received $900 from City National Bank of Florida.",
    time: "November 27 · 7:00 PM",
    place: "Miami, USA",
    tone: "info",
  },
  {
    id: "n3",
    title: "Incoming transfer · $20",
    body: "You received $20. This amount is usable.",
    time: "November 22",
    place: "Shenzhen, China",
    tone: "info",
  },
  {
    id: "n4",
    title: "Incoming transfer · $100",
    body: "You received $100. This amount was unusable because the account was unverified at the time.",
    time: "November 22",
    place: "Shenzhen, China",
    tone: "warn",
  },
];

export const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
