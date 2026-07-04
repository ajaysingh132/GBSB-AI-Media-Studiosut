/*
=========================================================
GBSB AI Media Studio
Settings Controller v0.1
Author : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

"use strict";

/* ------------------------------------
   Settings State
------------------------------------ */

const settings = {

    theme: "dark",

    language: "Hindi",

    audioPreview: true

};

/* ------------------------------------
   Initialize
------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Settings Loaded");

    initializeSettings();

});

/* ------------------------------------
   Initialize Settings
------------------------------------ */

function initializeSettings(){

    loadSettings();

    bindEvents();

}

/* ------------------------------------
   Load Settings
------------------------------------ */

function loadSettings(){

    const saved = localStorage.getItem("gbsb_settings");

    if(saved){

        Object.assign(settings, JSON.parse(saved));

    }

    const darkMode = document.getElementById("darkMode");
    const language = document.getElementById("language");

    if(darkMode){
        darkMode.checked = settings.theme === "dark";
    }

    if(language){
        language.value = settings.language;
    }

}

/* ------------------------------------
   Events
------------------------------------ */

function bindEvents(){

    const saveButton = document.getElementById("saveSettings");
    const darkMode = document.getElementById("darkMode");
    const language = document.getElementById("language");

    if(darkMode){

        darkMode.addEventListener("change",function(){

            settings.theme = this.checked ? "dark" : "light";

        });

    }

    if(language){

        language.addEventListener("change",function(){

            settings.language = this.value;

        });

    }

    if(saveButton){

        saveButton.addEventListener("click",saveSettings);

    }

}

/* ------------------------------------
   Save Settings
------------------------------------ */

function saveSettings(){

    localStorage.setItem(

        "gbsb_settings",

        JSON.stringify(settings)

    );

    alert("Settings Saved Successfully.");

}
