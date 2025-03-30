// Apply styles from the settings object
function applyStyles(settings) {
  document.body.style.backgroundColor = settings.bg || "";
  document.body.style.color = settings.text || "";
  document.body.style.fontSize = settings.fontSize
    ? `${settings.fontSize}px`
    : "";
}

// Save settings to cookies with a 30-day expiration
function saveSettingsToCookies(settings) {
  const expirationDays = 30;
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}; path=/`;

  document.cookie = `bg=${encodeURIComponent(settings.bg)}; ${expires}`;
  document.cookie = `text=${encodeURIComponent(settings.text)}; ${expires}`;
  document.cookie = `fontSize=${encodeURIComponent(
    settings.fontSize
  )}; ${expires}`;
}

// Retrieve settings from cookies
function getSettingsFromCookies() {
  const cookies = document.cookie.split(";");
  const settings = {};
  cookies.forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (value) settings[key] = decodeURIComponent(value);
  });
  return settings;
}

// Apply settings from query parameters and update cookies
function applySettingsFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  if (
    urlParams.has("bg") &&
    urlParams.has("text") &&
    urlParams.has("fontSize")
  ) {
    const settings = {
      bg: urlParams.get("bg"),
      text: urlParams.get("text"),
      fontSize: urlParams.get("fontSize"),
    };
    applyStyles(settings);
    saveSettingsToCookies(settings);
    updateFormFields(settings);
    showOutput("Settings applied from URL parameters.");
    return true;
  }
  return false;
}

// Apply settings from cookies
function applySettingsFromCookies() {
  const settings = getSettingsFromCookies();
  if (settings.bg || settings.text || settings.fontSize) {
    applyStyles(settings);
    updateFormFields(settings);
    showOutput("Settings applied from cookies.");
    return true;
  }
  return false;
}

// Update the form fields to reflect the current settings
function updateFormFields(settings) {
  document.getElementById("bg").value = settings.bg || "";
  document.getElementById("text").value = settings.text || "";
  document.getElementById("fontSize").value = settings.fontSize || "16";
}

// Display current settings and source of application
function showOutput(message) {
  const output = document.getElementById("output");
  const bg = document.body.style.backgroundColor || "default";
  const text = document.body.style.color || "default";
  const size = document.body.style.fontSize || "default";
  output.innerHTML = `${message}<br>Background: ${bg}, Text: ${text}, Font Size: ${size}`;
}

// On page load, apply settings from query or cookies
window.onload = () => {
  if (!applySettingsFromQuery()) {
    if (!applySettingsFromCookies()) {
      showOutput("Using default settings.");
    }
  }
};
