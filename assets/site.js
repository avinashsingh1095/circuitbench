/* Shared site behavior: update the copyright year and provide a saved light/dark theme toggle. */
"use strict";

const currentYear = String(new Date().getFullYear());
document.querySelectorAll("[data-current-year]").forEach((year) => {
  year.textContent = currentYear;
});

const themeStorageKey = "circuitbench-theme";
const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");

function readSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
  } catch {
    return null;
  }
}

function updateTheme(theme) {
  document.documentElement.dataset.theme = theme;
  for (const button of themeButtons) {
    const darkModeIsOn = theme === "dark";
    button.hidden = false;
    button.setAttribute("aria-pressed", String(darkModeIsOn));
    button.setAttribute("aria-label", `Switch to ${darkModeIsOn ? "day" : "night"} mode`);
    button.querySelector("[data-theme-icon]").textContent = darkModeIsOn ? "☀" : "☾";
    button.querySelector("[data-theme-label]").textContent = darkModeIsOn ? "Day mode" : "Night mode";
  }
}

const savedTheme = readSavedTheme();
updateTheme(savedTheme || (themePreference.matches ? "dark" : "light"));

for (const button of themeButtons) {
  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    updateTheme(nextTheme);
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Keep the current page usable if browser storage is disabled.
    }
  });
}

themePreference.addEventListener("change", (event) => {
  if (!readSavedTheme()) updateTheme(event.matches ? "dark" : "light");
});
