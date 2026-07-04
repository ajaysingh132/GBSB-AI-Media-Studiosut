/*
=========================================================
GBSB AI Media Studio
Application Configuration
Version : 1.0.0 Alpha
Author : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

"use strict";

const CONFIG = {

    app: {

        name: "GBSB AI Media Studio",

        shortName: "GBSB Studio",

        version: "1.0.0 Alpha",

        organization: "GBSB4U Publications",

        developer: "Ajay Singh Chouhan"

    },

    ui: {

        theme: "dark",

        language: "Hindi",

        mobileFirst: true

    },

    storage: {

        database: "GBSB_AI_MEDIA_STUDIO"

    },

    audio: {

        format: "wav",

        sampleRate: 44100,

        channels: 1,

        bitrate: 128000

    },

    voice: {

        provider: "browser",

        defaultVoice: "",

        speed: 1.0,

        pitch: 1.0,

        volume: 1.0

    },

    api: {

        provider: "browser",

        baseUrl: "",

        apiKey: ""

    },

    project: {

        autoSave: true,

        backup: true

    },

    export: {

        audio: "wav",

        video: "mp4",

        document: "pdf"

    },

    github: {

        repository: "GBSB-AI-Media-Studiosut"

    }

};

Object.freeze(CONFIG);

window.CONFIG = CONFIG;

console.log("Configuration Loaded");
