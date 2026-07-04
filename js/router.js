/*
=========================================================
GBSB AI Media Studio
Application Router
Version 0.2 Alpha
=========================================================
*/

"use strict";

const Router = {

pages:{

home:"index.html",

voices:"voices.html",

projects:"projects.html",

podcast:"podcast.html",

video:"video.html",

audiobook:"audiobook.html",

teacher:"teacher.html",

settings:"settings.html"

},

go(page){

if(this.pages[page]){

window.location.href=this.pages[page];

}else{

console.warn("Unknown page:",page);

}

},

back(){

history.back();

}

};

window.Router=Router;
