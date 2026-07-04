/*
=========================================================
GBSB AI Media Studio
Video Studio Controller v0.1
Author : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

"use strict";

/* ------------------------------------
   Video Studio State
------------------------------------ */

const videoStudio = {

    currentProject: null,

    selectedVoice: null,

    selectedImage: null,

    subtitleEnabled: true,

    videos: []

};

/* ------------------------------------
   Initialize
------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Video Studio Loaded");

    initializeVideoStudio();

});

/* ------------------------------------
   Initialize Studio
------------------------------------ */

function initializeVideoStudio(){

    bindEvents();

    loadVideos();

}

/* ------------------------------------
   Button Events
------------------------------------ */

function bindEvents(){

    const button = document.getElementById("newVideo");

    if(button){

        button.addEventListener("click",createVideo);

    }

}

/* ------------------------------------
   Create Video
------------------------------------ */

function createVideo(){

    alert("AI Video Creator will be available in next version.");

}

/* ------------------------------------
   Load Video List
------------------------------------ */

function loadVideos(){

    console.log("Loading Videos...");

}

/* ------------------------------------
   Voice Selection
------------------------------------ */

function selectVoice(name){

    videoStudio.selectedVoice = name;

    console.log("Selected Voice:",name);

}

/* ------------------------------------
   Image Selection
------------------------------------ */

function selectImage(file){

    videoStudio.selectedImage = file;

}

/* ------------------------------------
   Subtitle
------------------------------------ */

function toggleSubtitle(){

    videoStudio.subtitleEnabled = !videoStudio.subtitleEnabled;

    console.log("Subtitle :",videoStudio.subtitleEnabled);

}

/* ------------------------------------
   Export Video
------------------------------------ */

function exportVideo(){

    alert("Video Export Module Coming Soon.");

}

/* ------------------------------------
   Save Project
------------------------------------ */

function saveVideoProject(){

    alert("Video Project Saved.");

}
