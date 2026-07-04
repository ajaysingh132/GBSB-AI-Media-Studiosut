/*
=========================================================
GBSB AI Media Studio
Version : 0.1.0 Alpha
Module  : Core App
Author  : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

const APP = {

    name: "GBSB AI Media Studio",

    version: "0.1.0 Alpha",

    author: "Ajay Singh Chouhan"

};

/* ==========================
   APP START
========================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log(APP.name);

    console.log("Version :", APP.version);

    initApp();

});

/* ==========================
   INITIALIZE
========================== */

function initApp(){

    loadTheme();

    registerButtons();

    showWelcome();

}

/* ==========================
   THEME
========================== */

function loadTheme(){

    const theme = localStorage.getItem("theme") || "dark";

    document.body.dataset.theme = theme;

}

function toggleTheme(){

    const current = document.body.dataset.theme;

    const next = current === "dark" ? "light" : "dark";

    document.body.dataset.theme = next;

    localStorage.setItem("theme", next);

}

/* ==========================
   BUTTONS
========================== */

function registerButtons(){

    document.querySelectorAll("[data-action='theme']")

    .forEach(btn=>{

        btn.addEventListener("click",toggleTheme);

    });

}

/* ==========================
   TOAST
========================== */

function showToast(message){

    alert(message);

}

/* ==========================
   WELCOME
========================== */

function showWelcome(){

    console.log("Welcome to GBSB AI Media Studio");

}

/* ==========================
   VERSION
========================== */

console.log(

"GBSB AI Media Studio v0.1.0 Alpha Loaded"

);
