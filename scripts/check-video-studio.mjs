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
