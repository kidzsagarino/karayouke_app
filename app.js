
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { Server } from "socket.io";


dotenv.config();

const PORT = process.env.port || 8080;

const dataApiKey = process.env.Data_API_Key;

const app = express();

const server = app.listen(PORT);

const io = new Server(server);


io.on("connection", async(socket) =>{

    let data = await (await fetch("https://api.ipify.org?format=json")).json();

    let ip = data.ip;

    socket.join(ip);

    io.to(ip).emit("connected");

    socket.on("reserve_song", (msg) =>{

        io.to(ip).emit("reserve_song", msg);

    });
    socket.on("stop", ()=>{
        io.to(ip).emit("stop");
    });
    socket.on("play", ()=>{
        io.to(ip).emit("play");
    });
    socket.on("pause", ()=>{
        io.to(ip).emit("pause");
    });

});

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => {
    res.render("pages/player.ejs");

});

app.get("/rc", (req, res) =>{
    res.render("pages/rc.ejs");
});

app.get("/getSearchSuggestions/:song", async (req, res) =>{
    
    let data = await (await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${req.params.song.trim().toLowerCase()}`)).json();
    
    res.json(data[1]);
});

app.get("/searchSong/:song", async (req, res) =>{

    
    let data = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${req.params.song.trim()}&type=video&videoEmbeddable=true&key=${dataApiKey}`)).json();

    res.json(data.items);

});

