import { readFileSync, existsSync } from "node:fs";

const htmlPath = "video.html";
const html = readFileSync(htmlPath, "utf8");
const requiredIds = [
  "projectTitle", "videoUrl", "loadVideoUrl", "videoFile",
  "studioVideo", "videoWatermark", "watermarkText", "applyWatermark",
  "subtitleUrl", "loadSubtitle", "videoStatus", "recentVideos",
  "playbackRate", "fullscreenVideo", "seekBack", "seekForward"
];

const errors = [];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) errors.push(`Missing required HTML element id: ${id}`);
}

for (const match of html.matchAll(/(?:src|href)="(js\/[^"]+|css\/[^"]+)"/g)) {
  if (!existsSync(match[1])) errors.push(`Referenced asset does not exist: ${match[1]}`);
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
