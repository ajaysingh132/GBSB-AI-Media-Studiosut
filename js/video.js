/*
GBSB AI Media Studio — Video Studio Controller v0.2
Euron-inspired integration: HLS/MP4 preview, local preview, captions URL,
watermark, playback speed, fullscreen and locally saved project metadata.
Actual AI generation, server upload and FFmpeg transcoding require a backend.
*/
"use strict";

const videoStudio = {
  currentProject: null,
  selectedVoice: null,
  selectedImage: null,
  subtitleEnabled: true,
  videos: [],
  storageKey: "gbsb_video_projects_v1"
};

document.addEventListener("DOMContentLoaded", () => {
  initializeVideoStudio();
});

function initializeVideoStudio() {
  bindEvents();
  loadVideos();
  if (window.GBSBVideoPlayer) GBSBVideoPlayer.setWatermark(document.getElementById("watermarkText")?.value || "GBSBFORYOU");
}

function bindEvents() {
  const byId = (id) => document.getElementById(id);
  byId("newVideo")?.addEventListener("click", () => {
    byId("videoUrl")?.focus();
    GBSBVideoPlayer?.status("वीडियो URL डालें या मोबाइल से फ़ाइल चुनें।");
  });
  byId("loadVideoUrl")?.addEventListener("click", async () => {
    try {
      const url = byId("videoUrl")?.value.trim();
      await GBSBVideoPlayer.setSource(url);
      saveVideoProject({ title: byId("projectTitle")?.value.trim() || "नया वीडियो", url, type: /\.m3u8(?:$|[?#])/i.test(url) ? "hls" : "file" });
      if (!isSafeToPersistUrl(url)) {
        GBSBVideoPlayer.status("वीडियो खुल गया। सुरक्षा के लिए URL/टोकन हाल के प्रोजेक्ट में सेव नहीं किया गया।", "success");
      }
    } catch (error) {
      GBSBVideoPlayer.status(error.message || "वीडियो लोड नहीं हुआ।", "error");
    }
  });
  byId("videoFile")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await GBSBVideoPlayer.setLocalFile(file);
      GBSBVideoPlayer.status("स्थानीय वीडियो का प्रीव्यू तैयार है। यह फ़ाइल अभी सर्वर पर अपलोड नहीं हुई है।", "success");
      saveVideoProject({ title: file.name, url: "", type: "local-preview" });
    } catch (error) {
      GBSBVideoPlayer.status(error.message || "फ़ाइल नहीं खुली।", "error");
    }
  });
  byId("applyWatermark")?.addEventListener("click", () => {
    GBSBVideoPlayer.setWatermark(byId("watermarkText")?.value || "");
    GBSBVideoPlayer.status("वॉटरमार्क प्रीव्यू अपडेट हुआ। यह वीडियो में स्थायी रूप से नहीं जुड़ा है।");
  });
  byId("loadSubtitle")?.addEventListener("click", () => {
    const url = byId("subtitleUrl")?.value.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      GBSBVideoPlayer.status("कैप्शन के लिए पूर्ण https:// या http:// VTT URL दें।", "error");
      return;
    }
    GBSBVideoPlayer.setSubtitle(url);
    GBSBVideoPlayer.status(url ? "कैप्शन ट्रैक जोड़ा गया।" : "कैप्शन URL खाली है।");
  });
  byId("playbackRate")?.addEventListener("change", (event) => GBSBVideoPlayer.setPlaybackRate(event.target.value));
  byId("fullscreenVideo")?.addEventListener("click", () => GBSBVideoPlayer.toggleFullscreen());
  byId("seekBack")?.addEventListener("click", () => GBSBVideoPlayer.seek(-10));
  byId("seekForward")?.addEventListener("click", () => GBSBVideoPlayer.seek(10));
}

function readProjects() {
  try {
    const data = JSON.parse(localStorage.getItem(videoStudio.storageKey) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

function isSafeToPersistUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    // Avoid persisting signed URLs, credentials, and other query-based tokens
    // in browser storage. The user can re-enter such a URL when needed.
    return (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      !parsed.username && !parsed.password && !parsed.search && !parsed.hash;
  } catch (_) {
    return false;
  }
}

function saveVideoProject(project) {
  const requestedUrl = project.url || "";
  const persistUrl = isSafeToPersistUrl(requestedUrl);
  const item = {
    id: "vid_" + Date.now(),
    title: project.title || "नया वीडियो",
    url: persistUrl ? requestedUrl : "",
    type: project.type || "file",
    urlNotSaved: Boolean(requestedUrl && !persistUrl),
    updatedAt: new Date().toISOString()
  };
  const projects = readProjects();
  projects.unshift(item);
  localStorage.setItem(videoStudio.storageKey, JSON.stringify(projects.slice(0, 30)));
  videoStudio.currentProject = item;
  loadVideos();
  return item;
}

function loadVideos() {
  const list = document.getElementById("recentVideos");
  if (!list) return;
  const projects = readProjects();
  list.replaceChildren();
  if (!projects.length) {
    const empty = document.createElement("li");
    empty.textContent = "अभी कोई प्रोजेक्ट सेव नहीं है।";
    list.appendChild(empty);
    return;
  }
  projects.forEach((project) => {
    const item = document.createElement("li");
    item.className = "video-project-item";
    const title = document.createElement("span");
    title.textContent = project.title + " · " + project.type;
    item.appendChild(title);
    if (project.url) {
      const open = document.createElement("button");
      open.type = "button";
      open.textContent = "चलाएँ";
      open.addEventListener("click", async () => {
        try {
          document.getElementById("videoUrl").value = project.url;
          await GBSBVideoPlayer.setSource(project.url, { type: project.type });
        } catch (error) {
          GBSBVideoPlayer.status(error.message || "वीडियो लोड नहीं हुआ।", "error");
        }
      });
      item.appendChild(open);
    } else {
      const note = document.createElement("small");
      note.textContent = project.urlNotSaved
        ? "सुरक्षा के लिए URL सेव नहीं हुआ; वीडियो चलाने के लिए URL दोबारा डालें।"
        : "स्थानीय फ़ाइल का प्रीव्यू दोबारा खोलने के लिए फ़ाइल फिर चुनें।";
      item.appendChild(note);
    }
    list.appendChild(item);
  });
}

function selectVoice(name) {
  videoStudio.selectedVoice = name;
  console.log("Selected Voice:", name);
}

function selectImage(file) {
  videoStudio.selectedImage = file;
}

function toggleSubtitle() {
  videoStudio.subtitleEnabled = !videoStudio.subtitleEnabled;
  console.log("Subtitle:", videoStudio.subtitleEnabled);
}

function exportVideo() {
  GBSBVideoPlayer.status("अंतिम MP4 export के लिए अभी FFmpeg/backend जोड़ना बाकी है।", "error");
}

function createVideo() {
  document.getElementById("videoUrl")?.focus();
}

window.videoStudio = videoStudio;
window.saveVideoProject = (project) => saveVideoProject(project || {
  title: document.getElementById("projectTitle")?.value || "नया वीडियो",
  url: document.getElementById("videoUrl")?.value || "",
  type: "file"
});
