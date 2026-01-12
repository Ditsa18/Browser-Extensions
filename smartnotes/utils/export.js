/* =========================
   EXPORT NOTES
========================= */

export function exportNotes(text, filename) {
  if (!text) return;

  // Ensure safe filename
  const safeFilename = filename.replace(/[<>:"/\\|?*]+/g, "_");

  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = safeFilename;

  // Required for Firefox + Chrome extensions
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
