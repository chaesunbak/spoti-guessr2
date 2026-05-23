const STORAGE_KEY = "spoti-guest-id";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return `guest_${crypto.randomUUID()}`;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const newId = `guest_${crypto.randomUUID()}`;
  localStorage.setItem(STORAGE_KEY, newId);
  return newId;
}
