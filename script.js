let currentSong = new Audio();
let PLAY = document.querySelector(".PLAY");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let songs;
let currentSongIndex = 0;
let currFolder;
let coverPhotos = [];

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;

    const infoResponse = await fetch(`${folder}/info.json`);
    const infoData = await infoResponse.json();
    const albumTitle = infoData.title || "MyPhonk";
    const albumDescription = infoData.description || "Phonk Playlist";
    const songsData = infoData.songs || [];

    // ✅ Safe DOM assignment
    const titleEl = document.querySelector(".album-title");
    const descEl = document.querySelector(".album-description");
    if (titleEl) titleEl.textContent = albumTitle;
    if (descEl) descEl.textContent = albumDescription;

    songs = songsData;

    const songList = document.querySelector(".songName ul");
    songList.innerHTML = "";

    for (let i = 0; i < songsData.length; i++) {
        const song = songsData[i];
        const cover = coverPhotos[i] || "default-cover.jpg";
        songList.innerHTML += `
            <li>
                <img src="${cover}" alt="${song.title}" class="song-cover" />
                <div class="song-info">
                    <div>${song.title}</div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>
            </li>
        `;
    }

    const items = document.querySelectorAll(".songName li");
    items.forEach((item, index) => {
        item.addEventListener("click", () => {
            playMusic(songsData[index].filename, coverPhotos[index]);
            currentSongIndex = index;
        });
    });

    if (songsData.length > 0) {
        currentSongIndex = 0;
        playMusic(songsData[0].filename, coverPhotos[0]);
        currentSong.pause();
        PLAY.querySelector("i").className = "fa-solid fa-play";
    }
}

const playMusic = (track, coverPhoto) => {
    const CoverPhoto = document.querySelector(".Playbar");
    CoverPhoto.style.animationPlayState = "paused";

    currentSong.onpause = () => {
        CoverPhoto.style.animationPlayState = "paused";
        CoverPhoto.classList.remove('active-cover', 'play-border');
    };

    currentSong.onplay = () => {
        CoverPhoto.style.animationPlayState = "running";
        CoverPhoto.classList.add('active-cover', 'play-border');
    };

    currentSong.src = `${currFolder}/${track}`;
    currentSong.play();
    PLAY.querySelector("i").className = "fa-solid fa-pause";
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    let playbarCover = document.querySelector("#playbar-cover");
    if (coverPhoto) {
        playbarCover.src = coverPhoto;
        playbarCover.alt = `Cover for ${track}`;
    }
};

function assignCoverPhotos(folder) {
    if (folder === "phonk") {
        coverPhotos = ["https://i.scdn.co/image/ab67616d00004851611ae53864c78e196dd5f555",
            "https://i.scdn.co/image/ab67616d00004851c771f7401307f639d0272f68",
            "https://i.scdn.co/image/ab67616d000048515443e7ddafe075e963a6bd34",
            "https://i.scdn.co/image/ab67616d00004851ecb8455c697c79e12445b4a0",
            "https://i.scdn.co/image/ab67616d00004851144fcad8ffb348edefb9e851",
            "https://i.scdn.co/image/ab67616d000048517b83f01b12e6c12b328d7a45",
            "https://i.scdn.co/image/ab67616d000048519bf5280998453fee06ab1c6a",
            "https://i.scdn.co/image/ab67616d000048517c870eecd4fbd6d8dd618f48"];
    } else if (folder === "phonks") {
        coverPhotos = ["https://i.scdn.co/image/ab67616d00004851fc8a3e0f0f2016068474bdc9",
            "https://i.scdn.co/image/ab67616d00004851c80fe27586c2da910984cb9a",
            "https://i.scdn.co/image/ab67616d00004851ecf02d417f93c338e54f77b4",
            "https://i.scdn.co/image/ab67616d00004851e4abb0fb75117230282cd98c",
            "https://i.scdn.co/image/ab67616d00004851361d4c29897bec6ef9a363b6",
            "https://i.scdn.co/image/ab67616d00004851550c08bd67e6d175e2dc463b",
            "https://i.scdn.co/image/ab67616d000048516e415c25972cc9c91dd1034c",
            "https://i.scdn.co/image/ab67616d0000485193942466c2c6ec14557522c6"];
    }
    console.log("Cover photos set for", folder);
}

function setupAlbumCardClicks() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", async () => {
            const folder = card.getAttribute("data-folder");
            if (folder) {
                assignCoverPhotos(folder);
                await getSongs(`/SpotifyClone/songs/${folder}`);
            }
        });
    });
}

async function displayAlbums() {
    const folders = ["phonk", "phonks"];
    const cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = "";

    for (let folder of folders) {
        try {
            const res = await fetch(`/SpotifyClone/songs/${folder}/info.json`);
            const info = await res.json();
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-folder", folder);
            card.innerHTML = `
                <img src="/SpotifyClone/songs/${folder}/cover.jpg" alt="${info.title}" />
                <h3>${info.title}</h3>
                <p>${info.description}</p>
            `;
            cardContainer.appendChild(card);
        } catch (err) {
            console.error(`Error loading info for ${folder}:`, err);
        }
    }

    setupAlbumCardClicks();
}

async function main() {
    await displayAlbums();
    await getSongs(`/SpotifyClone/songs/phonk`); // ✅ Default album

    currentSong.addEventListener("ended", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playMusic(songs[currentSongIndex].filename, coverPhotos[currentSongIndex]);
        } else {
            alert("Playlist ended.");
        }
    });

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
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML =
                `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
            document.querySelector(".circle").style.left =
                (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-155%";
    });

    previous.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playMusic(songs[currentSongIndex].filename, coverPhotos[currentSongIndex]);
        } else {
            alert("No previous Song is Available, restart the songs");
        }
    });

    next.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playMusic(songs[currentSongIndex].filename, coverPhotos[currentSongIndex]);
        } else {
            alert("No Next Song Available, restart the songs");
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });
}

main();
