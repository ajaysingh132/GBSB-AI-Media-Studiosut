/*
GBSB AI Media Studio — Euron-inspired video player adapter.
This is an independent vanilla-JS adapter, not a copy of Euron's React component.
Supports direct media URLs (e.g. MP4/WebM) and HLS manifests (.m3u8).
HLS.js is loaded on demand from a pinned CDN version when native HLS is unavailable.
*/
"use strict";

const GBSBVideoPlayer = (() => {
  let hls = null;
  let objectUrl = null;
  let currentSource = "";
  let subtitleTrack = null;

  const el = (id) => document.getElementById(id);
  const video = () => el("studioVideo");
  const status = (message, kind = "info") => {
    const node = el("videoStatus");
    if (!node) return;
    node.textContent = message;
    node.dataset.kind = kind;
  };

  function destroyHls() {
    if (hls) {
      try { hls.destroy(); } catch (_) {}
      hls = null;
    }
  }

  function clearSubtitle() {
    if (subtitleTrack && subtitleTrack.parentNode) subtitleTrack.parentNode.removeChild(subtitleTrack);
    subtitleTrack = null;
  }

  function clearOwnedObjectUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (window.Hls) return resolve(window.Hls);
      const existing = document.querySelector('script[data-gbsb-hls="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.Hls), { once: true });
        existing.addEventListener("error", () => reject(new Error("HLS library could not be loaded.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.gbsbHls = "true";
      script.onload = () => window.Hls ? resolve(window.Hls) : reject(new Error("HLS library loaded without its player API."));
      script.onerror = () => reject(new Error("HLS library could not be loaded. Check internet access and try again."));
      document.head.appendChild(script);
    });
  }

  async function setSource(url, options = {}) {
    const v = video();
    if (!v) throw new Error("Video element is missing.");
    const source = String(url || "").trim();
    if (!source) throw new Error("Enter a video URL or choose a local video file.");
    if (!options.local && !/^https?:\/\//i.test(source) && !source.startsWith("blob:")) {
      throw new Error("Use a complete https:// or http:// video URL.");
    }

    destroyHls();
    clearSubtitle();
    if (objectUrl && source !== objectUrl) clearOwnedObjectUrl();
    v.pause();
    v.removeAttribute("src");
    v.load();
    currentSource = source;

    const isHls = options.type === "hls" || /\.m3u8(?:$|[?#])/i.test(source);
    try {
      if (isHls && v.canPlayType("application/vnd.apple.mpegurl")) {
        v.src = source;
      } else if (isHls) {
        const HlsClass = await loadScript("https://cdn.jsdelivr.net/npm/hls.js@1.6.16/dist/hls.min.js");
        if (!HlsClass.isSupported()) throw new Error("This browser does not support HLS playback. Try an MP4 file.");
        hls = new HlsClass({ enableWorker: true, capLevelToPlayerSize: true });
        hls.loadSource(source);
        hls.attachMedia(v);
        hls.on(HlsClass.Events.MANIFEST_PARSED, () => status("HLS वीडियो तैयार है। Play दबाएँ।", "success"));
        hls.on(HlsClass.Events.ERROR, (_event, data) => {
          if (data && data.fatal) {
            status("HLS playback error. URL/CORS/access token जाँचें।", "error");
            destroyHls();
          }
        });
      } else {
        v.src = source;
      }
      v.load();
      if (!isHls || v.canPlayType("application/vnd.apple.mpegurl")) status("वीडियो स्रोत लोड हो गया। Play दबाएँ।", "success");
      return { url: source, type: isHls ? "hls" : "file" };
    } catch (error) {
      status(error.message || "वीडियो लोड नहीं हुआ।", "error");
      throw error;
    }
  }

  function setLocalFile(file) {
    if (!file) return;
    if (!file.type.startsWith("video/")) throw new Error("कृपया वीडियो फ़ाइल चुनें।");
    destroyHls();
    clearSubtitle();
    clearOwnedObjectUrl();
    objectUrl = URL.createObjectURL(file);
    return setSource(objectUrl, { local: true, type: "file" });
  }

  function setWatermark(text) {
    const node = el("videoWatermark");
    if (!node) return;
    node.textContent = String(text || "").trim();
    node.hidden = !node.textContent;
  }

  function setSubtitle(url) {
    const v = video();
    clearSubtitle();
    if (!url || !v) return;
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "Subtitles";
    track.srclang = "hi";
    track.src = url;
    track.default = true;
    v.appendChild(track);
    subtitleTrack = track;
  }

  function setPlaybackRate(rate) {
    const v = video();
    const n = Number(rate);
    if (v && [0.5, 0.75, 1, 1.25, 1.5, 2].includes(n)) v.playbackRate = n;
  }

  function toggleFullscreen() {
    const frame = el("videoPlayerFrame");
    if (!frame) return;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) void document.exitFullscreen();
    } else if (frame.requestFullscreen) {
      void frame.requestFullscreen();
    } else {
      status("इस ब्राउज़र में fullscreen उपलब्ध नहीं है।", "error");
    }
  }

  function seek(delta) {
    const v = video();
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
    status(delta > 0 ? "+10 सेकंड" : "-10 सेकंड");
  }

  function getSource() { return currentSource; }

  function clear() {
    destroyHls();
    clearSubtitle();
    clearOwnedObjectUrl();
    const v = video();
    if (v) {
      v.pause();
      v.removeAttribute("src");
      v.load();
    }
    currentSource = "";
    status("वीडियो स्रोत हटाया गया।");
  }

  return { setSource, setLocalFile, setWatermark, setSubtitle, setPlaybackRate, toggleFullscreen, seek, getSource, clear, status };
})();

window.GBSBVideoPlayer = GBSBVideoPlayer;
