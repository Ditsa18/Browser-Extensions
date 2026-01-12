/* =========================
   TIME HELPERS
========================= */

export function formatTime(isoString) {
  if (!isoString) return "—";

  const date = new Date(isoString);
  if (isNaN(date)) return "—";

  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 30) return "just now";
  if (diff < 60) return `${diff}s ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;

  // fallback to readable date
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function nowISO() {
  return new Date().toISOString();
}
