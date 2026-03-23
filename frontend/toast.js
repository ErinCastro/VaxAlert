/* ═══════════════════════════════════════════════════════════════════
   VaxAlert – Shared Toast & Modal Helpers
   Include after toast.css.  Usage:
     vaxToast("Something went wrong", "error");
     vaxToast("Saved!", "success");
     vaxToast("Heads up…", "warning");
     vaxToast("FYI…", "info");
   ═══════════════════════════════════════════════════════════════════ */

/* ── SVG icons for each variant ──────────────────────────────────── */
const _vaxIcons = {
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

const _vaxTitles = {
  error:   "Error",
  success: "Success",
  warning: "Warning",
  info:    "Info",
};

let _vaxContainer = null;

function _vaxEnsureContainer() {
  if (_vaxContainer) return _vaxContainer;
  _vaxContainer = document.createElement("div");
  _vaxContainer.id = "vaxToastContainer";
  _vaxContainer.style.cssText = "position:fixed;top:24px;right:24px;z-index:10000;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
  document.body.appendChild(_vaxContainer);
  return _vaxContainer;
}

/**
 * Show a toast notification.
 * @param {string} message   Text to display
 * @param {"error"|"success"|"warning"|"info"} type  Variant (default "info")
 * @param {number} duration  Auto-dismiss ms (default 4000, 0 = manual)
 * @param {string} [title]   Optional custom title (defaults to type name)
 */
function vaxToast(message, type = "info", duration = 4000, title) {
  const container = _vaxEnsureContainer();

  const el = document.createElement("div");
  el.className = `vax-toast ${type}`;
  el.style.pointerEvents = "auto";
  el.innerHTML = `
    <div class="vax-toast-icon">${_vaxIcons[type] || _vaxIcons.info}</div>
    <div class="vax-toast-body">
      <div class="vax-toast-title">${title || _vaxTitles[type] || "Notice"}</div>
      <div class="vax-toast-msg">${message}</div>
    </div>
    <button class="vax-toast-close" aria-label="Dismiss">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    ${duration ? `<div class="vax-toast-progress" style="animation-duration:${duration}ms"></div>` : ""}
  `;

  container.appendChild(el);

  // Trigger slide-in
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));

  const dismiss = () => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  };

  el.querySelector(".vax-toast-close").addEventListener("click", dismiss);

  if (duration) {
    setTimeout(dismiss, duration);
  }

  return { dismiss };
}

/**
 * Show inline form message (replaces old showMsg pattern).
 * @param {string} elementId  ID of the .vax-form-msg element
 * @param {string} text       Message text
 * @param {boolean} isError   true = error, false = success
 * @param {number} autoHide   ms to auto-hide (default 4000, 0 = stay)
 */
function vaxFormMsg(elementId, text, isError, autoHide = 4000) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className = `vax-form-msg show ${isError ? "error" : "success"}`;
  if (autoHide) {
    setTimeout(() => { el.classList.remove("show"); }, autoHide);
  }
}
