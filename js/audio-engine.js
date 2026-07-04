/*
=========================================================
GBSB AI Media Studio
Audio Engine
Version 0.3 Alpha
Author : Ajay Singh Chouhan
=========================================================
*/

"use strict";

const AudioEngine = {

    recorder: null,
    stream: null,
    chunks: [],
    audioBlob: null,
    audioURL: null,

    async init(){

        console.log("Audio Engine Ready");

    },

    async startRecording(){

        try{

            this.stream = await navigator.mediaDevices.getUserMedia({
                audio:true
            });

            this.recorder = new MediaRecorder(this.stream);

            this.chunks = [];

            this.recorder.ondataavailable=(e)=>{

                this.chunks.push(e.data);

            };

            this.recorder.onstop=()=>{

                this.audioBlob = new Blob(
                    this.chunks,
                    {type:"audio/webm"}
                );

                this.audioURL = URL.createObjectURL(
                    this.audioBlob
                );

                console.log("Recording Finished");

            };

            this.recorder.start();

            console.log("Recording Started");

        }

        catch(err){

            console.error(err);

            alert("Microphone permission denied.");

        }

    },

    stopRecording(){

        if(this.recorder){

            this.recorder.stop();

        }

    },

    play(){

        if(this.audioURL){

            const audio = new Audio(this.audioURL);

            audio.play();

        }

    },

    download(filename="recording.webm"){

        if(!this.audioURL) return;

        const link=document.createElement("a");

        link.href=this.audioURL;

        link.download=filename;

        link.click();

    }

};

window.AudioEngine=AudioEngine;

document.addEventListener("DOMContentLoaded",()=>{

    AudioEngine.init();

});
