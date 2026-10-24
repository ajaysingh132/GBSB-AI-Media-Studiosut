import { readFileSync, existsSync } from "node:fs";

const errors = [];
const videoHtml = readFileSync("video.html", "utf8");
const requiredVideoIds = [
  "projectTitle", "videoUrl", "loadVideoUrl", "videoFile",
  "studioVideo", "videoWatermark", "watermarkText", "applyWatermark",
  "subtitleUrl", "loadSubtitle", "videoStatus", "recentVideos",
  "playbackRate", "fullscreenVideo", "seekBack", "seekForward"
];
for (const id of requiredVideoIds) {
  if (!videoHtml.includes(`id="${id}"`)) errors.push(`Missing required video HTML element id: ${id}`);
}
for (const file of ["video.html", "projects.html", "storyboard.html", "ai-video.html", "ai-music.html"]) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)) {
    if (!existsSync(match[1])) errors.push(`Referenced asset does not exist in ${file}: ${match[1]}`);
  }
}
const projectsHtml = readFileSync("projects.html", "utf8");
const projectsController = readFileSync("js/projects.js", "utf8");
for (const id of ["projectSearch", "newProjectButton", "projectsStatus", "projectsList", "videoProjectsList"]) {
  if (!projectsHtml.includes(`id="${id}"`)) errors.push(`Projects page is missing required element id: ${id}`);
}
if (!projectsHtml.includes('href="video.html"')) errors.push("Projects page must link to Video Studio.");
if (!projectsController.includes('"gbsb_video_projects_v1"')) errors.push("Projects Manager must read the Video Studio project storage key.");
if (!projectsController.includes("function renderVideoProjects()")) errors.push("Video project rendering function is missing.");
if (!projectsController.includes("function safeReusableUrl(value)")) errors.push("Safe reusable video URL guard is missing.");
if (!projectsController.includes("function newProject()")) errors.push("New project creation function is missing.");
if (!projectsController.includes("window.confirm")) errors.push("Destructive project actions must require confirmation.");

const storyboardHtml = readFileSync("storyboard.html", "utf8");
const storyboardController = readFileSync("js/storyboard.js", "utf8");
for (const id of ["storyTitle", "storyFormat", "storyScript", "storyStatus", "shotsList", "shotCount", "addShot", "exportJson", "exportText", "clearPlan"]) {
  if (!storyboardHtml.includes(`id="${id}"`)) errors.push(`Storyboard page is missing required element id: ${id}`);
}
for (const token of ["function renderShots()", "function moveShot(index, direction)", "function exportJson()", "function exportText()", "localStorage.setItem(STORAGE_KEY"]) {
  if (!storyboardController.includes(token)) errors.push(`Storyboard controller is missing expected capability: ${token}`);
}
if (!storyboardHtml.includes('href="video.html"')) errors.push("Storyboard must link back to Video Studio.");
if (!storyboardHtml.includes('href="projects.html"')) errors.push("Storyboard must link back to Projects Manager.");

const aiHtml = readFileSync("ai-video.html", "utf8");
const aiController = readFileSync("js/ai-video.js", "utf8");
for (const id of ["provider", "apiBase", "prompt", "ratio", "duration", "generate", "engineStatus", "taskStatus", "resultVideo"]) {
  if (!aiHtml.includes(`id="${id}"`)) errors.push(`AI Video Engine is missing required element id: ${id}`);
}
for (const token of ['"/api/video/generations"', "function normalizeBase(value)", 'url.protocol !== "https:"', "API_BASE_KEY", "Demo"]) {
  if (!aiController.includes(token)) errors.push(`AI Video Engine is missing expected safeguard/contract token: ${token}`);
}
if (aiController.includes("Authorization: Bearer")) errors.push("Provider secrets must not be embedded in frontend requests.");
if (!aiHtml.includes('href="storyboard.html"')) errors.push("AI Video Engine should link to Script & Shot Planner.");

const controller = readFileSync("js/video.js", "utf8");
const player = readFileSync("js/video-player.js", "utf8");
for (const token of ["setSource", "setLocalFile", "setWatermark", "setSubtitle", "setPlaybackRate", "toggleFullscreen", "seek"]) {
  if (!player.includes(token)) errors.push(`Player adapter is missing expected capability: ${token}`);
}
if (!controller.includes("function isSafeToPersistUrl")) errors.push("URL persistence safety guard is missing.");
if (!controller.includes("if (loaded?.stale) return;")) errors.push("Stale source result guard is missing.");
if (!controller.includes("Storage quota/privacy restrictions should not break playback.")) errors.push("Storage failure handling is missing.");
if (!player.includes('parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:"')) errors.push("Subtitle URL protocol validation is missing.");

if (errors.length) {
  console.error("Video Studio structural smoke test failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Video Studio structural smoke test passed.");
}

const musicHtml = readFileSync("ai-music.html", "utf8");
const musicController = readFileSync("js/ai-music.js", "utf8");
for (const id of ["apiBase", "model", "prompt", "generateMusic", "musicStatus", "resultAudio", "downloadAudio"]) {
  if (!musicHtml.includes(`id="${id}"`)) errors.push(`AI Music Studio is missing required element id: ${id}`);
}
for (const token of ['"/api/music/generations"', "localStorage.setItem"]) {
  if (!musicController.includes(token)) errors.push(`AI Music controller is missing expected API/safety token: ${token}`);
}
if (musicController.includes("Authorization: Bearer")) errors.push("Google provider secrets must not be embedded in frontend requests.");
if (!musicHtml.includes('href="ai-video.html"')) errors.push("AI Music Studio should link to AI Video Engine.");
