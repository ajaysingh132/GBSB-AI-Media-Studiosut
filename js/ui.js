/*
=========================================================
GBSB AI Media Studio
Global UI Controller
Version 1.0
Author : Ajay Singh Chouhan
=========================================================
*/

"use strict";

const UI = {

    version: "1.0",

    init() {

        console.log("UI Controller Ready");

    },

    showLoader() {

        const loader = document.getElementById("loader");

        if (loader) {

            loader.style.display = "flex";

        }

    },

    hideLoader() {

        const loader = document.getElementById("loader");

        if (loader) {

            loader.style.display = "none";

        }

    },

    toast(message) {

        alert(message);

    },

    show(id) {

        const el = document.getElementById(id);

        if (el) {

            el.style.display = "block";

        }

    },

    hide(id) {

        const el = document.getElementById(id);

        if (el) {

            el.style.display = "none";

        }

    },

    toggle(id) {

        const el = document.getElementById(id);

        if (!el) return;

        if (el.style.display === "none") {

            el.style.display = "block";

        } else {

            el.style.display = "none";

        }

    },

    setTitle(title) {

        document.title = title;

    },

    darkMode(enable = true) {

        if (enable) {

            document.body.classList.add("dark");

            Storage.set("theme", "dark");

        } else {

            document.body.classList.remove("dark");

            Storage.set("theme", "light");

        }

    },

    loadTheme() {

        const theme = Storage.get("theme");

        if (theme === "dark") {

            document.body.classList.add("dark");

        }

    }

};

document.addEventListener("DOMContentLoaded", () => {

    UI.init();

    UI.loadTheme();

});

window.UI = UI;
