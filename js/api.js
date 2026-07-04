/*
=========================================================
GBSB AI Media Studio
API Manager
Version 1.0
Author : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

"use strict";

const API = {

    config: {

        provider: "browser",

        baseURL: "",

        apiKey: ""

    },

    init(){

        console.log("API Manager Ready");

    },

    setProvider(provider){

        this.config.provider = provider;

        console.log("Provider:", provider);

    },

    setBaseURL(url){

        this.config.baseURL = url;

    },

    setApiKey(key){

        this.config.apiKey = key;

    },

    async get(endpoint){

        try{

            const response = await fetch(

                this.config.baseURL + endpoint,

                {

                    method:"GET",

                    headers:{

                        "Authorization":"Bearer " + this.config.apiKey,

                        "Content-Type":"application/json"

                    }

                }

            );

            return await response.json();

        }

        catch(error){

            console.error(error);

            return null;

        }

    },

    async post(endpoint,data){

        try{

            const response = await fetch(

                this.config.baseURL + endpoint,

                {

                    method:"POST",

                    headers:{

                        "Authorization":"Bearer " + this.config.apiKey,

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify(data)

                }

            );

            return await response.json();

        }

        catch(error){

            console.error(error);

            return null;

        }

    }

};

document.addEventListener("DOMContentLoaded",()=>{

    API.init();

});

window.API = API;
