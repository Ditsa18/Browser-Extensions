import {
  getAllNotes,
  saveSiteNotes,
  deleteSiteNotes,
  getTheme,
  setTheme
} from "../utils/storage.js";

import { formatTime, nowISO } from "../utils/time.js";
import { exportNotes } from "../utils/export.js";

/* =========================
   ELEMENTS
========================= */

const siteNameEl = document.getElementById("siteName");
const notesEl = document.getElementById("notes");
const lastEditedEl = document.getElementById("lastEdited");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const pinBtn = document.getElementById("pinSite");
const pastNotesBtn = document.getElementById("pastNotesBtn");

const themeToggle = document.getElementById("themeToggle");
const statusMsg = document.getElementById("statusMsg");

const noteWrapper = document.getElementById("noteWrapper");
const styleButtons = document.querySelectorAll(".style-btn");

/* =========================
   STATE
========================= */

let currentSite = "";
let isPinned = false;
let currentStyle = "pink";

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  getCurrentSite();
});

/* =========================
   CURRENT SITE
========================= */

function getCurrentSite() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.url) return;

    const url = new URL(tabs[0].url);
    currentSite = url.hostname;
    siteNameEl.textContent = currentSite;

    loadNotes();
  });
}

/* =========================
   LOAD NOTES
========================= */

function loadNotes() {
  getAllNotes((notes) => {
    const siteData = notes[currentSite];

    if (!siteData) {
      notesEl.value = "";
      lastEditedEl.textContent = "last edited · —";
      isPinned = false;
      currentStyle = "pink";
      applyStyle();
      updatePinIcon();
      highlightActiveStyle();
      return;
    }

    notesEl.value = siteData.text || "";
    lastEditedEl.textContent = siteData.lastEdited
      ? `last edited · ${formatTime(siteData.lastEdited)}`
      : "last edited · —";

    isPinned = siteData.pinned || false;
    currentStyle = siteData.style || "pink";

    applyStyle();
    updatePinIcon();
    highlightActiveStyle();
  });
}

/* =========================
   SAVE NOTES
========================= */

saveBtn.addEventListener("click", () => {
  saveSiteNotes(
    currentSite,
    {
      text: notesEl.value,
      lastEdited: nowISO(),
      pinned: isPinned,
      style: currentStyle
    },
    () => {
      animate(saveBtn, "saved");
      showStatus("saved ✿");
      loadNotes();
    }
  );
});

/* =========================
   CLEAR NOTES
========================= */

clearBtn.addEventListener("click", () => {
  if (!notesEl.value) return;
  if (!confirm("clear notes for this site?")) return;

  deleteSiteNotes(currentSite, () => {
    notesEl.value = "";
    lastEditedEl.textContent = "last edited · —";
    animate(clearBtn, "deleted");
    showStatus("cleared");
  });
});

/* =========================
   EXPORT NOTES
========================= */

exportBtn.addEventListener("click", () => {
  if (!notesEl.value) {
    showStatus("nothing to export");
    return;
  }

  exportNotes(notesEl.value, `${currentSite}-notes.txt`);
  animate(exportBtn, "exported");
  showStatus("exported ⬇");
});

/* =========================
   PIN SITE
========================= */

pinBtn.addEventListener("click", () => {
  isPinned = !isPinned;
  updatePinIcon();
});

function updatePinIcon() {
  pinBtn.innerHTML = isPinned
    ? '<i class="fa-solid fa-star"></i>'
    : '<i class="fa-regular fa-star"></i>';
}

/* =========================
   NOTE STYLE SWITCHING
========================= */

styleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentStyle = btn.dataset.style;
    applyStyle();
    highlightActiveStyle();
  });
});

function applyStyle() {
  noteWrapper.classList.remove("pink-note", "cream-note", "mint-note");

  if (currentStyle === "cream") {
    noteWrapper.classList.add("cream-note");
  } else if (currentStyle === "mint") {
    noteWrapper.classList.add("mint-note");
  } else {
    noteWrapper.classList.add("pink-note");
  }
}

function highlightActiveStyle() {
  styleButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.style === currentStyle);
  });
}

/* =========================
   PAST NOTES (BASIC + SAFE)
========================= */

pastNotesBtn.addEventListener("click", () => {
  getAllNotes((notes) => {
    const sites = Object.keys(notes || {});
    if (!sites.length) {
      showStatus("no past notes");
      return;
    }

    alert(
      "Saved notes:\n\n" +
      sites.map((s) => `• ${s}`).join("\n")
    );
  });
});

/* =========================
   THEME TOGGLE
========================= */

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";

  document.body.classList.remove("dark", "light");
  document.body.classList.add(newTheme);

  setTheme(newTheme);
  updateThemeIcon(newTheme);
});

function loadTheme() {
  getTheme((storedTheme) => {
    const theme = storedTheme === "light" ? "light" : "dark";
    document.body.classList.add(theme);
    updateThemeIcon(theme);
  });
}

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

/* =========================
   STATUS + ANIMATION HELPERS
========================= */

function showStatus(msg) {
  statusMsg.textContent = msg;
  statusMsg.classList.add("show");

  setTimeout(() => {
    statusMsg.classList.remove("show");
  }, 1500);
}

function animate(el, className) {
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), 400);
}
