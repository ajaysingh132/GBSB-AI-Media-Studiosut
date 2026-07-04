/*
=========================================================
GBSB AI Media Studio
AI Teacher Controller v0.1
Author : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

"use strict";

/* ------------------------------------
   AI Teacher State
------------------------------------ */

const teacherStudio = {

    currentLesson: null,

    currentModule: null,

    language: "Hindi",

    studentName: "Guest",

    lessons: []

};

/* ------------------------------------
   Initialize
------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

    console.log("AI Teacher Loaded");

    initializeTeacher();

});

/* ------------------------------------
   Initialize Teacher
------------------------------------ */

function initializeTeacher(){

    bindEvents();

    loadLessons();

}

/* ------------------------------------
   Events
------------------------------------ */

function bindEvents(){

    const button = document.getElementById("startLesson");

    if(button){

        button.addEventListener("click", startLesson);

    }

}

/* ------------------------------------
   Start Lesson
------------------------------------ */

function startLesson(){

    alert("AI Lesson Player will be available in next version.");

}

/* ------------------------------------
   Load Lessons
------------------------------------ */

function loadLessons(){

    console.log("Loading Lessons...");

}

/* ------------------------------------
   Open Lesson
------------------------------------ */

function openLesson(id){

    console.log("Lesson :", id);

}

/* ------------------------------------
   Select Language
------------------------------------ */

function changeLanguage(language){

    teacherStudio.language = language;

    console.log("Language :", language);

}

/* ------------------------------------
   Save Progress
------------------------------------ */

function saveProgress(){

    alert("Learning Progress Saved.");

}

/* ------------------------------------
   Complete Lesson
------------------------------------ */

function completeLesson(){

    alert("Lesson Completed.");

}
