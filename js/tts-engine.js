/*
=========================================================
GBSB AI Media Studio
Universal TTS Engine
Version 0.3 Alpha
Author : Ajay Singh Chouhan
=========================================================
*/

"use strict";

const TTSEngine = {

    provider: "browser",

    hfToken: "",

    apiURL: "",

    /* -------------------------------
       Initialize
    ------------------------------- */

    init(){

        console.log("TTS Engine Ready");

    },

    /* -------------------------------
       Provider
    ------------------------------- */

    setProvider(provider){

        this.provider = provider;

        console.log("TTS Provider :",provider);

    },

    /* -------------------------------
       Browser TTS
    ------------------------------- */

    browserSpeak(text){

        if(!window.speechSynthesis){

            alert("Browser TTS not supported.");

            return;

        }

        const msg = new SpeechSynthesisUtterance(text);

        speechSynthesis.cancel();

        speechSynthesis.speak(msg);

    },

    /* -------------------------------
       Universal Speak
    ------------------------------- */

    async speak(text){

        switch(this.provider){

            case "browser":

                this.browserSpeak(text);

                break;

            case "huggingface":

                await this.huggingFaceSpeak(text);

                break;

            case "speechT5":

                await this.speechT5Speak(text);

                break;

            case "kokoro":

                await this.kokoroSpeak(text);

                break;

            default:

                this.browserSpeak(text);

        }

    },

    /* -------------------------------
       HuggingFace
    ------------------------------- */

    async huggingFaceSpeak(text){

        console.log("HF TTS :",text);

        alert("HuggingFace TTS integration coming.");

    },

    /* -------------------------------
       SpeechT5
    ------------------------------- */

    async speechT5Speak(text){

        console.log("SpeechT5 :",text);

        alert("SpeechT5 integration coming.");

    },

    /* -------------------------------
       Kokoro
    ------------------------------- */

    async kokoroSpeak(text){

        console.log("Kokoro :",text);

        alert("Kokoro TTS integration coming.");

    },

    /* -------------------------------
       Stop
    ------------------------------- */

    stop(){

        if(window.speechSynthesis){

            speechSynthesis.cancel();

        }

    },

    /* -------------------------------
       Pause
    ------------------------------- */

    pause(){

        if(window.speechSynthesis){

            speechSynthesis.pause();

        }

    },

    /* -------------------------------
       Resume
    ------------------------------- */

    resume(){

        if(window.speechSynthesis){

            speechSynthesis.resume();

        }

    }

};

TTSEngine.init();

window.TTSEngine = TTSEngine;
