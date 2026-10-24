/*
GBSB AI Media Studio — Projects Manager v0.2
Mobile-first local project list; no cloud sync or file upload.
*/
"use strict";

(() => {
  const PROJECTS_KEY = "gbsb_projects_v1";
  const VIDEO_KEY = "gbsb_video_projects_v1";
  const sampleProjects = [
    { id: "starter-constitution", name: "Constitution Research", status: "Active", description: "Research and editorial workspace" },
    { id: "starter-banjara", name: "Banjara Gita", status: "In Progress", description: "Content project" },
    { id: "starter-podcast", name: "Podcast Episode 01", status: "Draft", description: "Audio production project" }
  ];
  const byId = (id) => document.getElementById(id);

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
    } catch (_) {
      return [];
    }
  }

  function writeList(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      setStatus("ब्राउज़र स्टोरेज उपलब्ध नहीं है। बदलाव इस बार सेव नहीं हुआ।", "error");
      return false;
    }
  }

  function setStatus(message, kind = "info") {
    const node = byId("projectsStatus");
    if (!node) return;
    node.textContent = message;
    node.dataset.kind = kind;
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function button(label, className, onClick) {
    const node = make("button", className, label);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  }

  function getProjects() {
    const saved = readList(PROJECTS_KEY);
    if (!saved.length) return sampleProjects.map((project) => ({ ...project, starter: true }));
    return saved;
  }

  function renderProjects() {
    const host = byId("projectsList");
    if (!host) return;
    const query = (byId("projectSearch")?.value || "").trim().toLocaleLowerCase();
    const projects = getProjects().filter((project) =>
      [project.name, project.status, project.description].some((value) =>
        String(value || "").toLocaleLowerCase().includes(query)
      )
    );
    host.replaceChildren();
    if (!projects.length) {
      host.appendChild(make("p", "empty-state", query ? "कोई मेल खाता प्रोजेक्ट नहीं मिला।" : "अभी कोई प्रोजेक्ट नहीं है।"));
      return;
    }
    projects.forEach((project) => {
      const card = make("article", "project-card");
      card.appendChild(make("h3", "", project.name || "बिना नाम का प्रोजेक्ट"));
      card.appendChild(make("p", "project-status", "स्थिति: " + (project.status || "Draft")));
      if (project.description) card.appendChild(make("p", "", project.description));
      const actions = make("div", "project-actions");
      if (project.starter) {
        actions.appendChild(button("अपने प्रोजेक्ट में जोड़ें", "open-btn", () => {
          const saved = readList(PROJECTS_KEY);
          if (!saved.some((item) => item.id === project.id)) {
            saved.push({ id: project.id, name: project.name, status: project.status, description: project.description, updatedAt: new Date().toISOString() });
            if (writeList(PROJECTS_KEY, saved)) {
              setStatus("प्रोजेक्ट आपकी स्थानीय सूची में जोड़ दिया गया।", "success");
              renderProjects();
            }
          }
        }));
      } else {
        actions.appendChild(button("नाम बदलें", "open-btn", () => renameProject(project.id)));
        actions.appendChild(button("हटाएँ", "delete-btn", () => deleteProject(project.id)));
      }
      card.appendChild(actions);
      host.appendChild(card);
    });
  }

  function renderVideoProjects() {
    const host = byId("videoProjectsList");
    if (!host) return;
    const query = (byId("projectSearch")?.value || "").trim().toLocaleLowerCase();
    const videos = readList(VIDEO_KEY).filter((video) =>
      [video.title, video.type].some((value) => String(value || "").toLocaleLowerCase().includes(query))
    );
    host.replaceChildren();
    if (!videos.length) {
      host.appendChild(make("p", "empty-state", query ? "कोई मेल खाता वीडियो नहीं मिला।" : "अभी कोई वीडियो प्रोजेक्ट सेव नहीं है।"));
      return;
    }
    videos.forEach((video) => {
      const card = make("article", "project-card");
      card.appendChild(make("h3", "", video.title || "नया वीडियो"));
      card.appendChild(make("p", "project-status", "प्रकार: " + (video.type || "file")));
      if (video.url) {
        card.appendChild(make("p", "section-help", "URL स्थानीय सूची में सेव है।"));
      } else {
        card.appendChild(make("p", "section-help", video.urlNotSaved
          ? "सुरक्षा के लिए URL सेव नहीं हुआ। Video Studio में URL दोबारा डालें।"
          : "स्थानीय फ़ाइल का प्रीव्यू दोबारा शुरू करने के लिए फ़ाइल फिर चुनें।"));
      }
      const actions = make("div", "project-actions");
      actions.appendChild(button("Video Studio खोलें", "open-btn", () => {
        const target = new URL("video.html", window.location.href);
        if (video.url && safeReusableUrl(video.url)) target.searchParams.set("project", String(video.id || ""));
        window.location.href = target.href;
      }));
      actions.appendChild(button("सूची से हटाएँ", "delete-btn", () => {
        if (!window.confirm("इस वीडियो की हाल की सूची वाली एंट्री हटाएँ? मूल फ़ाइल नहीं हटेगी।")) return;
        const updated = readList(VIDEO_KEY).filter((item) => item.id !== video.id);
        if (writeList(VIDEO_KEY, updated)) {
          setStatus("वीडियो सूची से हटाया गया; मूल मीडिया फ़ाइल नहीं हटाई गई।", "success");
          renderVideoProjects();
        }
      }));
      card.appendChild(actions);
      host.appendChild(card);
    });
  }

  function safeReusableUrl(value) {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash;
    } catch (_) {
      return false;
    }
  }

  function newProject() {
    const name = window.prompt("नए प्रोजेक्ट का नाम लिखें:");
    if (name === null) return;
    const cleanName = name.trim().slice(0, 120);
    if (!cleanName) {
      setStatus("प्रोजेक्ट का नाम खाली नहीं हो सकता।", "error");
      return;
    }
    const projects = readList(PROJECTS_KEY);
    projects.unshift({
      id: "project_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7),
      name: cleanName,
      status: "Draft",
      description: "",
      updatedAt: new Date().toISOString()
    });
    if (writeList(PROJECTS_KEY, projects.slice(0, 100))) {
      setStatus("नया प्रोजेक्ट सेव हो गया। यह इसी ब्राउज़र में उपलब्ध है।", "success");
      renderProjects();
    }
  }

  function renameProject(id) {
    const projects = readList(PROJECTS_KEY);
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    const name = window.prompt("प्रोजेक्ट का नया नाम:", project.name || "");
    if (name === null) return;
    const cleanName = name.trim().slice(0, 120);
    if (!cleanName) {
      setStatus("प्रोजेक्ट का नाम खाली नहीं हो सकता।", "error");
      return;
    }
    project.name = cleanName;
    project.updatedAt = new Date().toISOString();
    if (writeList(PROJECTS_KEY, projects)) {
      setStatus("प्रोजेक्ट का नाम अपडेट हो गया।", "success");
      renderProjects();
    }
  }

  function deleteProject(id) {
    const project = readList(PROJECTS_KEY).find((item) => item.id === id);
    if (!project || !window.confirm("‘" + (project.name || "प्रोजेक्ट") + "’ को स्थानीय सूची से हटाएँ?")) return;
    if (writeList(PROJECTS_KEY, readList(PROJECTS_KEY).filter((item) => item.id !== id))) {
      setStatus("प्रोजेक्ट स्थानीय सूची से हटा दिया गया।", "success");
      renderProjects();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    byId("newProjectButton")?.addEventListener("click", newProject);
    byId("projectSearch")?.addEventListener("input", () => {
      renderProjects();
      renderVideoProjects();
    });
    renderProjects();
    renderVideoProjects();
  });

  // Expose narrow functions for debugging and existing inline integrations.
  window.GBSBProjects = { renderProjects, renderVideoProjects, newProject };
})();
