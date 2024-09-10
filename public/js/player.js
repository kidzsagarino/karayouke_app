
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

let songList = [];
let reservationListDiv;

window.addEventListener("DOMContentLoaded", () =>{
    
    socket.on("connect", () =>{

        console.log("connected");
        
        startPlayer();
      
    });
    
    socket.on("reserve_song", (msg) =>{
    
        const songData = JSON.parse(msg);
    
        songList.push(songData);
    
        if(songList.length === 1){
        
            createYoutubePlayer();
    
        }

        updateReservedList(songData.title);
       
    });

    socket.on("stop", () =>{
        
        if(player){
            stop();
        }
        

    });

    socket.on("play", ()=>{
        if(player){
            play();
        }
        

    });

    socket.on("pause", ()=>{
        
        if(player){
            pause();
        }
        

    });

    init();
});

window.addEventListener("beforeunload", () =>{

    localStorage.songList = JSON.stringify(songList);

    player.destroy();

});

function init(){

    reservationListDiv = document.querySelector(".reserve-list");

    songList = JSON.parse(localStorage.songList);

}

let nosongDiv;
let hasSongDIv;


function noSong(){
    
    if(nosongDiv){

        nosongDiv.remove();
    }

    if(hasSongDIv){

        hasSongDIv.remove();
    }
   
    
    nosongDiv = document.createElement("DIV");
    nosongDiv.setAttribute("class", "modal-outer no-song");
    nosongDiv.setAttribute("style", "opacity: 1;");

    nosongDiv.innerHTML = `<div class="no-songs">
        <p>
            <img src="images/empty.svg" width="70" />
        </p>
        <p>No song is reserved. </p>
        <p>
            On a separate mobile/device, access the remote control in <b >karayoukeapp.com/rc</b>.
        </p>

        <p>Make sure you connect to the same wifi network.</p>
        <p><b>Note: Autoplay is blocked after the first load</b>. Please manually play the video by using your TV's remote control / by using a mouse / tapping with a finger. </p>
        <p>This is only for the first load.</p>.
   
    </div>`;

    document.body.append(nosongDiv);

}

function playSong(){

    if(songList.length === 0)
    {
        noSong();

        return;
    }

    const { videoId } = songList[0];

    player.loadVideoById(videoId);

   
}

let player;

function createYoutubePlayer() {

  
    if(nosongDiv){
        nosongDiv.remove();
    }

    
    if(player){

        playSong();
        
        return;
     }
 
    
    const { videoId } = songList[0];

    const div = document.createElement("DIV");
    div.setAttribute("class", "modal-outer has-song");

    const playerDIV = document.createElement("DIV");
    playerDIV.setAttribute("id", "player");

    div.appendChild(playerDIV);
    
    document.body.appendChild(div);

    player = new YT.Player(playerDIV, {
        height: '390',
        width: '640',
        videoId: videoId,
        muted: 1,
        playerVars: {
          'playsinline': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

      hasSongDIv = div;
    
}
function onPlayerReady(event) {
    event.target.playVideo();
}



function onPlayerStateChange(event) {

    if (event.data == 0) {

        console.log("1 video finsihed");

        setTimeout(nextSong, 1000);
        
        
    }
}
function stop() {
    
    nextSong();

}

function pause(){

    player.pauseVideo();

}
function play(){

    player.playVideo();
}



function nextSong(){

    songList.shift();

    reservationListDiv.removeChild(reservationListDiv.firstElementChild);

    playSong();
   
}

function startPlayer(){

    if(songList.length === 0){

        noSong();

        return;

    }
  
    createYoutubePlayer();

    displayList();
}

function displayList(){
    
    reservationListDiv.innerHTML = "";

    songList.forEach((item)=>{
        updateReservedList(item.title);
    });
}

function updateReservedList(title){


    const div = document.createElement("DIV");

    div.setAttribute("class", "reserved-song");

    const p = document.createElement("P");

    p.textContent = title;
    
    div.append(p);

    reservationListDiv.append(div);

    
}
