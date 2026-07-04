/*
=========================================================
GBSB AI Media Studio
Projects Controller v0.1
Author : Ajay Singh Chouhan
License : MIT
=========================================================
*/

"use strict";

/* --------------------------
   Project List
-------------------------- */

const projects = [

{
    id:1,
    name:"Constitution Research",
    status:"Active"
},

{
    id:2,
    name:"Banjara Gita",
    status:"In Progress"
},

{
    id:3,
    name:"Podcast Episode 01",
    status:"Draft"
}

];

/* --------------------------
   Initialize
-------------------------- */

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Projects Loaded");

    loadProjects();

});

/* --------------------------
   Load Projects
-------------------------- */

function loadProjects(){

    console.log(projects);

}

/* --------------------------
   New Project
-------------------------- */

function newProject(){

    alert("New Project module coming soon.");

}

/* --------------------------
   Open Project
-------------------------- */

function openProject(id){

    alert("Opening Project ID : " + id);

}

/* --------------------------
   Delete Project
-------------------------- */

function deleteProject(id){

    let ok = confirm("Delete Project?");

    if(ok){

        alert("Project " + id + " deleted.");

    }

}

/* --------------------------
   Search
-------------------------- */

function searchProjects(text){

    console.log("Searching :",text);

}

/* --------------------------
   Export
-------------------------- */

function exportProject(id){

    alert("Export Project : "+id);

}
