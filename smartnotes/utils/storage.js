/* =========================
   STORAGE HELPERS
========================= */

/**
 * Get all saved notes
 */
export function getAllNotes(callback) {
  chrome.storage.local.get(["notes"], (result) => {
    const notes = result?.notes && typeof result.notes === "object"
      ? result.notes
      : {};

    callback(notes);
  });
}

/**
 * Save or update notes for a site
 */
export function saveSiteNotes(site, data, callback = () => {}) {
  if (!site) return;

  getAllNotes((notes) => {
    notes[site] = {
      text: data.text || "",
      lastEdited: data.lastEdited || null,
      pinned: Boolean(data.pinned),
      style: data.style || "pink"
    };

    chrome.storage.local.set({ notes }, () => {
      callback();
    });
  });
}

/**
 * Delete notes for a site
 */
export function deleteSiteNotes(site, callback = () => {}) {
  if (!site) return;

  getAllNotes((notes) => {
    if (notes[site]) {
      delete notes[site];
    }

    chrome.storage.local.set({ notes }, () => {
      callback();
    });
  });
}

/* =========================
   THEME STORAGE
========================= */

/**
 * Get saved theme
 */
export function getTheme(callback) {
  chrome.storage.local.get(["theme"], (result) => {
    const theme = result?.theme === "light" ? "light" : "dark";
    callback(theme);
  });
}

/**
 * Save theme
 */
export function setTheme(theme) {
  const safeTheme = theme === "light" ? "light" : "dark";
  chrome.storage.local.set({ theme: safeTheme });
}
