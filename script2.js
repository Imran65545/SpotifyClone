let currentSong = new Audio();
let PLAY = document.querySelector(".PLAY");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let songs = [];
let currentSongIndex = 0;
let currFolder = "";
let coverPhotos = [];

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let response = await fetch(`/songs/${folder}/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let element of as) {
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }

    renderSongList();
    preloadFirstSong();
}

function renderSongList() {
    let songList = document.querySelector(".songName ul");
    songList.innerHTML = "";

    for (let i = 0; i < songs.length; i++) {
        let songName = songs[i].replaceAll("%20", " ");
        let coverPhoto = coverPhotos[i] || "default-cover.jpg";

        songList.innerHTML += `
            <li>
                <img src="${coverPhoto}" alt="${songName}" class="song-cover" />
                <div class="song-info">
                    <div>${songName}</div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>
            </li>
        `;
    }

    Array.from(songList.getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            currentSongIndex = index;
            playMusic(songs[index], coverPhotos[index]);
        });
    });
}

function preloadFirstSong() {
    if (songs.length > 0) {
        currentSongIndex = 0;
        playMusic(songs[0], coverPhotos[0]);
        currentSong.pause();
        PLAY.querySelector("i").className = "fa-solid fa-play";
    }
}

function playMusic(track, coverPhoto) {
    currentSong.src = `/songs/${currFolder}/` + track;
    currentSong.play();

    PLAY.querySelector("i").className = "fa-solid fa-pause";
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    let playbarCover = document.querySelector("#playbar-cover");
    if (coverPhoto) {
        playbarCover.src = coverPhoto;
        playbarCover.alt = `Cover for ${track}`;
    }
}

async function displayAlbums() {
    let response = await fetch(`/songs/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = "";

    for (let anchor of anchors) {
        if (anchor.href.includes("/songs")) {
            let folder = anchor.href.split("/").slice(-1)[0];
            let metadataResponse = await fetch(`/songs/${folder}/info.json`);
            let metadata = await metadataResponse.json();

            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <i class="fa-solid fa-play"></i>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="${metadata.title}" />
                    <h2>${metadata.title}</h2>
                    <p>${metadata.description}</p>
                </div>
            `;
        }
    }

    Array.from(document.querySelectorAll(".card")).forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            assignCoverPhotos(folder);
            await getSongs(folder);
        });
    });
}

function assignCoverPhotos(folder) {
    if (folder === "phonk") {
        coverPhotos = [
            "https://i.scdn.co/image/ab67616d00004851611ae53864c78e196dd5f555",
            "https://i.scdn.co/image/ab67616d00004851c771f7401307f639d0272f68",
            "https://i.scdn.co/image/ab67616d000048515443e7ddafe075e963a6bd34",
            "https://i.scdn.co/image/ab67616d00004851ecb8455c697c79e12445b4a0",
            "https://i.scdn.co/image/ab67616d00004851144fcad8ffb348edefb9e851",
            "https://i.scdn.co/image/ab67616d000048517b83f01b12e6c12b328d7a45",
            "https://i.scdn.co/image/ab67616d000048519bf5280998453fee06ab1c6a",
            "https://i.scdn.co/image/ab67616d000048517c870eecd4fbd6d8dd618f48", 
        ];
    } else if (folder === "phonks") {
        coverPhotos = [
            "https://i.scdn.co/image/ab67616d00004851fc8a3e0f0f2016068474bdc9",// Cover for the first song 
                "https://i.scdn.co/image/ab67616d00004851c80fe27586c2da910984cb9a", // Cover for the second song
                "https://i.scdn.co/image/ab67616d00004851ecf02d417f93c338e54f77b4",
                "https://i.scdn.co/image/ab67616d00004851e4abb0fb75117230282cd98c",
                "https://i.scdn.co/image/ab67616d00004851361d4c29897bec6ef9a363b6",
                "https://i.scdn.co/image/ab67616d00004851550c08bd67e6d175e2dc463b",
                "https://i.scdn.co/image/ab67616d000048516e415c25972cc9c91dd1034c",
                "https://i.scdn.co/image/ab67616d0000485193942466c2c6ec14557522c6",
        ];
    }
}

async function main() {
    await displayAlbums();

    PLAY.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            PLAY.querySelector("i").className = "fa-solid fa-pause";
        } else {
            currentSong.pause();
            PLAY.querySelector("i").className = "fa-solid fa-play";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    });

    previous.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playMusic(songs[currentSongIndex], coverPhotos[currentSongIndex]);
        } else {
            alert("No previous song available.");
        }
    });

    next.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playMusic(songs[currentSongIndex], coverPhotos[currentSongIndex]);
        } else {
            alert("No next song available.");
        }
    });
}

main();
