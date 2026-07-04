/*
=========================================================
GBSB AI Media Studio
Voice Engine
Version 0.3 Alpha
Author : Ajay Singh Chouhan
=========================================================
*/

"use strict";

const VoiceEngine = {

    currentVoice: null,

    voices: [],

    speech: window.speechSynthesis,

    init(){

        this.loadVoices();

        if(this.speech){

            this.speech.onvoiceschanged = () => {

                this.loadVoices();

            };

        }

        console.log("Voice Engine Ready");

    },

    loadVoices(){

        if(!this.speech) return;

        this.voices = this.speech.getVoices();

        Storage.set("voices", this.voices.map(v => ({
            name: v.name,
            lang: v.lang,
            localService: v.localService
        })));

    },

    getVoices(){

        return this.voices;

    },

    speak(text, voiceName = null){

        if(!this.speech) return;

        this.speech.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        if(voiceName){

            const voice = this.voices.find(v => v.name === voiceName);

            if(voice){

                utterance.voice = voice;

            }

        }

        utterance.rate = 1;

        utterance.pitch = 1;

        utterance.volume = 1;

        this.speech.speak(utterance);

    },

    stop(){

        if(this.speech){

            this.speech.cancel();

        }

    },

    pause(){

        if(this.speech){

            this.speech.pause();

        }

    },

    resume(){

        if(this.speech){

            this.speech.resume();

        }

    }

};

document.addEventListener("DOMContentLoaded", () => {

    VoiceEngine.init();

});

window.VoiceEngine = VoiceEngine;
