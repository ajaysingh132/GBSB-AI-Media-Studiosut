/*
=========================================================
GBSB AI Media Studio
Authentication Manager
Version 1.0
Author : Ajay Singh Chouhan
=========================================================
*/

"use strict";

const Auth = {

    currentUser: null,

    init(){

        console.log("Authentication Ready");

        this.loadUser();

    },

    loadUser(){

        this.currentUser = Storage.get("current_user");

    },

    login(name,email){

        this.currentUser = {

            id: Date.now(),

            name: name,

            email: email,

            loginTime: new Date().toISOString()

        };

        Storage.set("current_user",this.currentUser);

        console.log("Login Success");

        return this.currentUser;

    },

    logout(){

        this.currentUser = null;

        localStorage.removeItem("current_user");

        console.log("Logout Success");

    },

    isLoggedIn(){

        return this.currentUser !== null;

    },

    getUser(){

        return this.currentUser;

    },

    updateProfile(data){

        if(!this.currentUser) return;

        this.currentUser = {

            ...this.currentUser,

            ...data

        };

        Storage.set("current_user",this.currentUser);

    }

};

document.addEventListener("DOMContentLoaded",()=>{

    Auth.init();

});

window.Auth = Auth;
