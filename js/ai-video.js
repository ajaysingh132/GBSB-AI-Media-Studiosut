/* GBSBFORYOU AI Video Engine — safe API-ready frontend scaffold */
"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const API_BASE_KEY = "gbsb_ai_video_api_base_v1";
  const PROVIDER_KEY = "gbsb_ai_video_provider_v1";
  const MODEL_KEY = "gbsb_ai_video_model_v1";
  function status(message, kind = "info") {
    const el = $("engineStatus");
    el.textContent = message;
    el.dataset.kind = kind;
  }
  function normalizeBase(value) {
    let url;
    try { url = new URL(value); } catch (_) { return null; }
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
    return url.href.replace(/\/$/, "");
  }
  function saveSettings() {
    try {
      const base = normalizeBase($("apiBase").value.trim());
      if ($("apiBase").value.trim() && !base) {
        status("Backend URL सही HTTPS पता होना चाहिए; credentials/query/hash न रखें।", "error");
        return;
      }
      localStorage.setItem(API_BASE_KEY, base || "");
      localStorage.setItem(PROVIDER_KEY, $("provider").value);
      localStorage.setItem(MODEL_KEY, $("modelId").value.trim());
      status("सेटिंग इसी ब्राउज़र में सेव हुई। इसमें कोई API key सेव नहीं होती।", "success");
    } catch (_) { status("ब्राउज़र स्टोरेज उपलब्ध नहीं है; सेटिंग इस सत्र में ही रखें।", "error"); }
  }
  async function generate() {
    $("resultVideo").hidden = true;
    $("resultLink").hidden = true;
    $("taskStatus").textContent = "अनुरोध तैयार किया जा रहा है…";
    const base = normalizeBase($("apiBase").value.trim());
    const prompt = $("prompt").value.trim();
    if (!prompt) { status("पहले दृश्य का विवरण लिखें।", "error"); return; }
        if (!base) {
      status("पहले अपने सुरक्षित HTTPS backend का पता दर्ज करें।", "error");
      $("taskStatus").textContent = "Backend URL अनुपलब्ध है।";
      return;
    }
    saveSettings();
    status("Backend से संपर्क किया जा रहा है…");
    $("taskStatus").textContent = "यदि backend contract लागू है तो कार्य ID और स्थिति यहाँ दिखाई जाएगी।";
    try {
      const response = await fetch(base + "/api/video/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: $("provider").value,
          model: $("modelId").value.trim(),
          prompt,
          aspect_ratio: $("ratio").value,
          duration_seconds: Number($("duration").value)
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || ("Backend ने HTTP " + response.status + " लौटाया।"));
      if (!data.id) throw new Error("Backend उत्तर में कार्य ID (id) नहीं मिली।");
      $("taskStatus").textContent = "कार्य ID: " + String(data.id) + " | स्थिति: " + String(data.status || "queued");
      if (data.status_url) $("taskStatus").textContent += " | स्थिति जाँच URL: " + String(data.status_url);
      if (data.video_url) showVideo(data.video_url, base);
      status("Backend ने अनुरोध स्वीकार किया। वास्तविक स्थिति backend के उत्तर पर निर्भर है।", "success");
    } catch (error) {
      status("जनरेशन अनुरोध पूरा नहीं हुआ: " + (error && error.message ? error.message : "नेटवर्क त्रुटि"), "error");
      $("taskStatus").textContent = "Backend/API अभी उपलब्ध नहीं या उसका contract मेल नहीं खाता।";
    }
  }
  function showVideo(value, base) {
    let url;
    try { url = new URL(value, base + "/"); } catch (_) { return; }
    if (!["https:", "blob:"].includes(url.protocol) || url.username || url.password) return;
    const video = $("resultVideo");
    video.src = url.href;
    video.hidden = false;
    const link = $("resultLink");
    link.href = url.href;
    link.hidden = false;
  }
  document.addEventListener("DOMContentLoaded", () => {
    try {
      $("apiBase").value = localStorage.getItem(API_BASE_KEY) || "";
      $("modelId").value = localStorage.getItem(MODEL_KEY) || "";
      const provider = localStorage.getItem(PROVIDER_KEY);
      if (provider && [...$("provider").options].some((o) => o.value === provider)) $("provider").value = provider;
    } catch (_) {}
    $("apiBase").addEventListener("change", saveSettings);
    $("provider").addEventListener("change", saveSettings);
    $("modelId").addEventListener("change", saveSettings);
    $("generate").addEventListener("click", generate);
  });
})();