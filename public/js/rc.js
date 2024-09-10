
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();


window.addEventListener("DOMContentLoaded", () =>{
    
    socket.on("connected", () =>{
    
        handleInitialLoad();
    
    });
    
    socket.on("reserve_song", (msg) =>{
        
        let songData = JSON.parse(msg);
    
        console.log(songData);
        
    });

    autoComplete(document.querySelector(".search-box"), getSuggestionResult, function(item){
        handleSelectedSuggestion(item); 
    });

    document.querySelector("#stop-btn")
    .addEventListener("click", function(){
        handleStop();
    });
    
    document.querySelector("#play-btn")
    .addEventListener("click", function(){
        handlePlay();
    });
    
    document.querySelector("#pause-btn")
    .addEventListener("click", function(){
        handlePause();
    });
    
});

async function getSuggestionResult(q){
  
    return await fetch(`/getSearchSuggestions/${q}`, {
        method: "GET"
    }).then((response) => response.json());
    
}

async function handleSelectedSuggestion(item){

    let data = await getYoutubeVideos(item);

    displayYoutubeVideos(data);
}


async function getYoutubeVideos(q){

    return await fetch(`/searchSong/${q}`, {
        method: "GET"
    }).then((response) => response.json());

}



function displayYoutubeVideos(data){

    const container = document.querySelector(".search-result-container");
   
    let fragment = new DocumentFragment();
    
    data.forEach((item) =>{
      
        fragment.append(createElements(item));
        
    });
   

    container.innerHTML = "";

    container.append(fragment);

}

function createElements(item){

    const { id, snippet } = item;
    const { videoId } = id;
    const { title, thumbnails } = snippet;
    const { medium } = thumbnails;
    const { url } = medium;

    const resultDiv = document.createElement("DIV");
    resultDiv.setAttribute("class", "result");

    const topDiv = document.createElement("DIV");
    topDiv.setAttribute("class", "top");

    const img = document.createElement("IMG");
    img.setAttribute("src", url);
    img.setAttribute("title", title);
    img.setAttribute("class", "thumbnail");
    img.addEventListener("click", function(){

        const songData = {
            videoId, title
        };
    
        handleReserve(songData);

    });

    topDiv.append(img);
    
    resultDiv.append(topDiv);

    return resultDiv;

}
function handleStop(){
    socket.emit("stop");
}

function handlePlay(){
    socket.emit("play");
}
function handlePause(){
    socket.emit("pause");
}



function handleReserve(songData){

    socket.emit("reserve_song", JSON.stringify(songData));

}


async function handleInitialLoad(){
    
    displayYoutubeVideos(await getYoutubeVideos("New OPM Karaoke"));

}