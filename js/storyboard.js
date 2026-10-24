/* GBSBFORYOU Script & Shot Planner — local-first MVP */
"use strict";
(() => {
  const STORAGE_KEY = "gbsb_storyboard_v1";
  const $ = (id) => document.getElementById(id);
  let plan = { title: "", format: "9:16", script: "", shots: [] };
  let saveTimer = null;

  function status(message, kind = "info") {
    const node = $("storyStatus");
    if (!node) return;
    node.textContent = message;
    node.dataset.kind = kind;
  }
  function make(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function createShot() {
    return {
      id: "shot_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7),
      title: "नया दृश्य",
      duration: 8,
      visual: "",
      audio: "",
      status: "योजना"
    };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || !Array.isArray(saved.shots)) return;
      plan = {
        title: typeof saved.title === "string" ? saved.title.slice(0, 120) : "",
        format: ["9:16", "16:9", "1:1"].includes(saved.format) ? saved.format : "9:16",
        script: typeof saved.script === "string" ? saved.script.slice(0, 12000) : "",
        shots: saved.shots.slice(0, 200).filter((shot) => shot && typeof shot === "object").map((shot) => ({
          id: String(shot.id || createShot().id),
          title: String(shot.title || "").slice(0, 160),
          duration: Math.max(1, Math.min(600, Number(shot.duration) || 8)),
          visual: String(shot.visual || "").slice(0, 3000),
          audio: String(shot.audio || "").slice(0, 2000),
          status: ["योजना", "तैयार", "पूरा"].includes(shot.status) ? shot.status : "योजना"
        }))
      };
    } catch (_) {
      status("पुराना सेव डेटा नहीं पढ़ा जा सका। नई योजना बनाकर पुनः सेव कर सकते हैं।", "error");
    }
  }
  function saveSoon() {
    clearTimeout(saveTimer);
    status("बदलाव सेव हो रहे हैं…");
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...plan, updatedAt: new Date().toISOString() }));
        status("योजना इसी ब्राउज़र में सेव है।", "success");
      } catch (_) {
        status("ब्राउज़र स्टोरेज उपलब्ध नहीं है। JSON बैकअप डाउनलोड करके सुरक्षित रखें।", "error");
      }
    }, 250);
  }
  function bindPlanFields() {
    $("storyTitle").value = plan.title;
    $("storyFormat").value = plan.format;
    $("storyScript").value = plan.script;
    $("storyTitle").addEventListener("input", () => { plan.title = $("storyTitle").value.slice(0, 120); saveSoon(); });
    $("storyFormat").addEventListener("change", () => { plan.format = $("storyFormat").value; saveSoon(); });
    $("storyScript").addEventListener("input", () => { plan.script = $("storyScript").value.slice(0, 12000); saveSoon(); });
  }
  function field(labelText, value, onInput, options = {}) {
    const wrap = make("label", "shot-field");
    wrap.appendChild(make("span", "", labelText));
    let input;
    if (options.select) {
      input = document.createElement("select");
      options.select.forEach((item) => {
        const option = document.createElement("option");
        option.value = item; option.textContent = item; input.appendChild(option);
      });
      input.value = value;
      input.addEventListener("change", () => onInput(input.value));
    } else if (options.multiline) {
      input = document.createElement("textarea");
      input.rows = options.rows || 3;
      input.maxLength = options.maxLength || 3000;
      input.value = value;
      input.addEventListener("input", () => onInput(input.value));
    } else {
      input = document.createElement("input");
      input.value = value;
      input.maxLength = options.maxLength || 160;
      if (options.number) {
        input.type = "number"; input.min = "1"; input.max = "600"; input.step = "1";
        input.addEventListener("change", () => {
          const n = Math.max(1, Math.min(600, Number(input.value) || 8));
          input.value = String(n); onInput(n);
        });
      } else {
        input.type = "text";
        input.addEventListener("input", () => onInput(input.value));
      }
    }
    wrap.appendChild(input);
    return wrap;
  }
  function renderShots() {
    const host = $("shotsList");
    host.replaceChildren();
    $("shotCount").textContent = plan.shots.length + " शॉट";
    if (!plan.shots.length) host.appendChild(make("p", "empty-state", "अभी शॉट नहीं हैं। शुरू करने के लिए “नया शॉट जोड़ें” दबाएँ।"));
    plan.shots.forEach((shot, index) => {
      const card = make("article", "shot-card");
      const head = make("div", "shot-card-heading");
      head.appendChild(make("h3", "", "शॉट " + (index + 1)));
      head.appendChild(make("span", "duration-badge", shot.duration + " सेकंड"));
      card.appendChild(head);
      card.appendChild(field("शॉट का नाम", shot.title, (value) => { shot.title = value.slice(0, 160); saveSoon(); }, { maxLength: 160 }));
      card.appendChild(field("अवधि (सेकंड)", shot.duration, (value) => { shot.duration = value; renderShots(); saveSoon(); }, { number: true }));
      card.appendChild(field("दृश्य / कैमरा / AI visual prompt", shot.visual, (value) => { shot.visual = value.slice(0, 3000); saveSoon(); }, { multiline: true, maxLength: 3000 }));
      card.appendChild(field("आवाज़ / संवाद / संगीत", shot.audio, (value) => { shot.audio = value.slice(0, 2000); saveSoon(); }, { multiline: true, rows: 2, maxLength: 2000 }));
      card.appendChild(field("स्थिति", shot.status, (value) => { shot.status = value; saveSoon(); }, { select: ["योजना", "तैयार", "पूरा"] }));
      const actions = make("div", "shot-actions");
      const up = make("button", "secondary-button", "↑ ऊपर");
      up.type = "button"; up.disabled = index === 0;
      up.addEventListener("click", () => moveShot(index, -1));
      const down = make("button", "secondary-button", "↓ नीचे");
      down.type = "button"; down.disabled = index === plan.shots.length - 1;
      down.addEventListener("click", () => moveShot(index, 1));
      const remove = make("button", "danger-button", "शॉट हटाएँ");
      remove.type = "button";
      remove.addEventListener("click", () => {
        if (!window.confirm("शॉट " + (index + 1) + " हटाएँ?")) return;
        plan.shots.splice(index, 1); renderShots(); saveSoon();
      });
      actions.append(up, down, remove);
      card.appendChild(actions);
      host.appendChild(card);
    });
  }
  function moveShot(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= plan.shots.length) return;
    [plan.shots[index], plan.shots[target]] = [plan.shots[target], plan.shots[index]];
    renderShots(); saveSoon();
  }
  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.hidden = true;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function safeFilename(name) {
    return (name || "gbsb-storyboard").replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "gbsb-storyboard";
  }
  function exportJson() {
    const payload = { ...plan, updatedAt: new Date().toISOString(), schemaVersion: 1 };
    download(safeFilename(plan.title) + ".json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    status("JSON बैकअप डाउनलोड शुरू हुआ।", "success");
  }
  function exportText() {
    const lines = [
      "GBSBFORYOU — SCRIPT & SHOT PLAN",
      "प्रोजेक्ट: " + (plan.title || "बिना नाम"),
      "फ़ॉर्मेट: " + plan.format,
      "",
      "मुख्य स्क्रिप्ट:",
      plan.script || "(अभी स्क्रिप्ट नहीं लिखी गई)",
      "",
      "शॉट लिस्ट:"
    ];
    plan.shots.forEach((shot, i) => lines.push(
      "", (i + 1) + ". " + (shot.title || "शॉट " + (i + 1)),
      "अवधि: " + shot.duration + " सेकंड | स्थिति: " + shot.status,
      "दृश्य: " + (shot.visual || "—"),
      "आवाज़/संगीत: " + (shot.audio || "—")
    ));
    download(safeFilename(plan.title) + "-shots.txt", lines.join("\n"), "text/plain;charset=utf-8");
    status("Shot List TXT डाउनलोड शुरू हुआ।", "success");
  }
  function clearPlan() {
    if (!window.confirm("इस ब्राउज़र में सेव पूरी स्क्रिप्ट और शॉट लिस्ट साफ़ करें? पहले JSON बैकअप डाउनलोड करना उचित है।")) return;
    plan = { title: "", format: "9:16", script: "", shots: [] };
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    $("storyTitle").value = ""; $("storyFormat").value = "9:16"; $("storyScript").value = "";
    renderShots(); status("स्थानीय योजना साफ़ कर दी गई।", "success");
  }
  document.addEventListener("DOMContentLoaded", () => {
    load();
    bindPlanFields();
    renderShots();
    $("addShot").addEventListener("click", () => {
      if (plan.shots.length >= 200) { status("अधिकतम 200 शॉट रख सकते हैं।", "error"); return; }
      plan.shots.push(createShot()); renderShots(); saveSoon();
    });
    $("exportJson").addEventListener("click", exportJson);
    $("exportText").addEventListener("click", exportText);
    $("clearPlan").addEventListener("click", clearPlan);
    if (!plan.shots.length) status("शॉट प्लान तैयार है। नया शॉट जोड़कर शुरू करें।");
  });
})();
