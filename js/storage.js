/*
=========================================================
GBSB AI Media Studio
Storage Manager
Version 0.2 Alpha
Author : Ajay Singh Chouhan
=========================================================
*/

"use strict";

const Storage = {

APP_KEY:"GBSB_AI_MEDIA_STUDIO",

defaultData:{

settings:{},

voices:[],

projects:[],

podcasts:[],

videos:[],

audiobooks:[],

teacher:{},

history:[]

},

init(){

if(!localStorage.getItem(this.APP_KEY)){

localStorage.setItem(

this.APP_KEY,

JSON.stringify(this.defaultData)

);

}

},

read(){

return JSON.parse(

localStorage.getItem(this.APP_KEY)

);

},

save(data){

localStorage.setItem(

this.APP_KEY,

JSON.stringify(data)

);

},

get(section){

const db=this.read();

return db[section];

},

set(section,value){

const db=this.read();

db[section]=value;

this.save(db);

},

add(section,item){

const db=this.read();

db[section].push(item);

this.save(db);

},

remove(section,index){

const db=this.read();

db[section].splice(index,1);

this.save(db);

},

clear(section){

const db=this.read();

db[section]=[];

this.save(db);

},

reset(){

localStorage.removeItem(this.APP_KEY);

this.init();

}

};

Storage.init();

window.Storage=Storage;

console.log("Storage Ready");
