(() => {
  const baseInput = document.getElementById("apiBase");
  const modelInput = document.getElementById("model");
  const promptInput = document.getElementById("prompt");
  const generateButton = document.getElementById("generateMusic");
  const status = document.getElementById("musicStatus");
  const taskStatus = document.getElementById("musicTaskStatus");
  const audio = document.getElementById("resultAudio");
  const download = document.getElementById("downloadAudio");
  const lyrics = document.getElementById("lyricsOutput");
  const savedBase = localStorage.getItem("gbsbMusicApiBase") || "";
  baseInput.value = savedBase;

  function setStatus(message) {
    status.textContent = message;
    taskStatus.textContent = message;
  }

  generateButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    const base = baseInput.value.trim().replace(/\/+$/, "");
    if (!base || !/^https:\/\//i.test(base)) {
      setStatus("पहले तैनात backend का HTTPS पता दर्ज करें।");
      return;
    }
    if (prompt.length < 8) {
      setStatus("कृपया भजन या गाने का थोड़ा विस्तृत विवरण लिखें।");
      return;
    }
    localStorage.setItem("gbsbMusicApiBase", base);
    generateButton.disabled = true;
    audio.hidden = true;
    download.hidden = true;
    lyrics.textContent = "";
    setStatus("Google Lyria API से अनुरोध भेजा जा रहा है… इसमें समय लग सकता है।");
    try {
      const response = await fetch(base + "/api/music/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: modelInput.value })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "जनरेशन असफल हुई। Backend कॉन्फ़िगरेशन और लॉग जाँचें।");
      }
      if (!data.audio_url) throw new Error("Backend ने ऑडियो लिंक नहीं लौटाया।");
      const audioUrl = new URL(data.audio_url, base).href;
      audio.src = audioUrl;
      audio.hidden = false;
      download.href = audioUrl;
      download.hidden = false;
      lyrics.textContent = data.lyrics_or_structure || "API ने अलग से बोल/संरचना नहीं लौटाई।";
      setStatus("ऑडियो तैयार है। प्ले करके जाँचें।");
    } catch (error) {
      setStatus(error.message || "कनेक्शन विफल हुआ। Backend और नेटवर्क जाँचें।");
    } finally {
      generateButton.disabled = false;
    }
  });
})();