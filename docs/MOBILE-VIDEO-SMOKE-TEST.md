# GBSB AI Media Studio — Mobile Video Smoke Test

## Purpose
Use this checklist on the published app or the repository's deployed preview before merging the Euron-inspired player integration. GitHub Actions checks source syntax and page structure; it does not exercise media playback in a real browser.

## Test environment
- Device: Android phone
- Browser: Chrome, current stable version
- Network: test once on Wi-Fi and, if available, once on mobile data
- Record browser version, device model, date, and each result below.

## Test cases

| ID | Test | Steps | Expected result | Result |
|---|---|---|---|---|
| M01 | Video Studio opens | Open `video.html` from the deployed app | Page loads; no blank screen; controls fit the phone width | Not run |
| M02 | Direct MP4 | Enter a known, publicly accessible MP4 URL and tap **URL से वीडियो चलाएँ** | Status reports source loaded; video can play, pause, and seek | Not run |
| M03 | HLS | Enter a browser-accessible `.m3u8` URL and load it | Native HLS or hls.js plays the stream; otherwise a useful error appears | Not run |
| M04 | Local file preview | Choose a small video from the phone | Local preview plays; UI clearly says the file is not uploaded | Not run |
| M05 | Playback rate | Change speed to 0.5× and 1.5× | Playback speed changes without breaking playback | Not run |
| M06 | Seek controls | Tap back 10 seconds and forward 10 seconds during playback | Playhead moves within valid duration bounds | Not run |
| M07 | Fullscreen | Tap fullscreen, then exit | Player enters and exits fullscreen when browser supports it; no page lock-up | Not run |
| M08 | Captions | Add a valid WebVTT URL from a host that allows browser access | Captions appear when available; invalid URL protocols are rejected | Not run |
| M09 | Watermark preview | Change watermark text and apply | Overlay text updates; it is not burned into the exported file | Not run |
| M10 | Recent project history | Load a normal URL without query/hash and revisit recent projects | Project metadata appears and can reopen the URL | Not run |
| M11 | Signed URL protection | Load a URL containing a query string or fragment | Video may play, but the full URL is not saved in local history | Not run |
| M12 | Storage restriction | If practical, test with browser storage blocked/full | Playback remains usable; save failure is communicated | Not run |
| M13 | Offline/service worker | After a successful page load, reload with network disabled | Cached app shell may open; remote video playback is not expected offline | Not run |
| M14 | Switch source quickly | Start loading an HLS URL, then quickly load another source | The older async HLS request must not replace the newer source | Not run |

## Safety and interpretation
- Use only media URLs you own or are authorized to test.
- HLS may fail because of CORS, expired signatures, authentication, or host restrictions; that does not alone prove the player code is broken.
- A local-file preview is not an upload and is not cloud-saved.
- The watermark is a visual preview overlay, not permanent encoding.
- Do not enter API keys or private signed URLs into shared screenshots or issue comments.

## Merge gate
Do not mark the pull request ready or merge it until the critical tests M01–M08 and M10–M11 have been run on a real Android browser and failures have been investigated. Fill in Result with Pass/Fail and add a short note for each failure.
