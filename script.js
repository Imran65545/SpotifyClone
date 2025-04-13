let currentSong = new Audio();
let PLAY = document.querySelector(".PLAY");
let previous = document.querySelector("#previous")
let next = document.querySelector("#next")
let songs;
let currentSongIndex=0;
let currFolder;
let coverPhotos = [];
let coverPhotos2 = [];



function formatTime(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    

    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60); // Get the minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds

    // Format with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2,'0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    const response = await fetch(`${folder}/`);


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

    //   // Array of cover photos corresponding to each song
      coverPhotos = [
        "https://i.scdn.co/image/ab67616d00004851611ae53864c78e196dd5f555",
            "https://i.scdn.co/image/ab67616d00004851c771f7401307f639d0272f68",
            "https://i.scdn.co/image/ab67616d000048515443e7ddafe075e963a6bd34",
            "https://i.scdn.co/image/ab67616d00004851ecb8455c697c79e12445b4a0",
            "https://i.scdn.co/image/ab67616d00004851144fcad8ffb348edefb9e851",
            "https://i.scdn.co/image/ab67616d000048517b83f01b12e6c12b328d7a45",
            "https://i.scdn.co/image/ab67616d000048519bf5280998453fee06ab1c6a",
            "https://i.scdn.co/image/ab67616d000048517c870eecd4fbd6d8dd618f48", // Cover for the third song
        // Add more covers for all songs
    ];

    coverPhotos2 = ["https://i.scdn.co/image/ab67616d00004851fc8a3e0f0f2016068474bdc9",// Cover for the first song 
                "https://i.scdn.co/image/ab67616d00004851c80fe27586c2da910984cb9a", // Cover for the second song
                "https://i.scdn.co/image/ab67616d00004851ecf02d417f93c338e54f77b4",
                "https://i.scdn.co/image/ab67616d00004851e4abb0fb75117230282cd98c",
                "https://i.scdn.co/image/ab67616d00004851361d4c29897bec6ef9a363b6",
                "https://i.scdn.co/image/ab67616d00004851550c08bd67e6d175e2dc463b",
                "https://i.scdn.co/image/ab67616d000048516e415c25972cc9c91dd1034c",
                "https://i.scdn.co/image/ab67616d0000485193942466c2c6ec14557522c6",

    ]

    

    console.log("Fetched songs:", songs);

    
    let songList = document.querySelector(".songName").getElementsByTagName("ul")[0];
    songList.innerHTML = ""; // Clear any existing list

    for (let i = 0; i < songs.length; i++) {
        let songName = songs[i].replaceAll("%20", " ");
        let SongName = songs[i].replaceAll("Download.mp3", "");
        let coverPhoto = coverPhotos[i] || "default-cover.jpg";

        // Add each song as an HTML list item
        songList.innerHTML += `
            <li>
                <img src="${coverPhoto}" alt="${songName,SongName}" class="song-cover" />
                <div class="song-info">
                    <div>${songName}</div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <i  class="fa-solid fa-play"></i>
                    </div>
                </div>
            </li>
        `;
    }

    // Attach event listeners to each song
    Array.from(document.querySelector(".songName").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            console.log(`Playing: ${songs[index]}`);
            playMusic(songs[index],coverPhotos[index]);
        });

    });


    if (songs.length > 0) {
        currentSongIndex = 0; // Start with the first song
        playMusic(songs[0], coverPhotos[0]);
        currentSong.pause() // Play the first song by default
        PLAY.querySelector("i").className ="fa-solid fa-play";
    }

    
   
  }

  const playMusic = (track,coverPhoto) => {
    


    
    const CoverPhoto = document.querySelector(".Playbar")
    CoverPhoto.style.animationPlayState = "paused";

    currentSong.onpause = () => {
        // Pause rotation when the song is paused
        CoverPhoto.style.animationPlayState = "paused";
        CoverPhoto.classList.remove('active-cover');
        CoverPhoto.classList.remove('play-border');
    };

    currentSong.onplay = () => {
        // Resume rotation when the song resumes
        CoverPhoto.style.animationPlayState = "running";
        CoverPhoto.classList.add('active-cover');
        CoverPhoto.classList.add('play-border');
    };
    let playbarCover = document.querySelector("#playbar-cover");
    // let audio =new Audio(+ track)
    currentSong.src = `${currFolder}/${track}`;

    currentSong.play();
    PLAY.querySelector("i").className = "fa-solid fa-pause";
    document.querySelector(".songinfo").innerHTML= track ;
    document.querySelector(".songtime").innerHTML="00:00/ 00:00";
    
    
    if (coverPhoto) {
        playbarCover.src = coverPhoto;
        playbarCover.alt = `Cover for ${track}`;
        
    }
     

    
   
    

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
            "https://i.scdn.co/image/ab67616d000048517c870eecd4fbd6d8dd618f48"
        ];
    } else if (folder === "phonks") {
        coverPhotos = [
            "https://i.scdn.co/image/ab67616d00004851fc8a3e0f0f2016068474bdc9",
            "https://i.scdn.co/image/ab67616d00004851c80fe27586c2da910984cb9a",
            "https://i.scdn.co/image/ab67616d00004851ecf02d417f93c338e54f77b4",
            "https://i.scdn.co/image/ab67616d00004851e4abb0fb75117230282cd98c",
            "https://i.scdn.co/image/ab67616d00004851361d4c29897bec6ef9a363b6",
            "https://i.scdn.co/image/ab67616d00004851550c08bd67e6d175e2dc463b",
            "https://i.scdn.co/image/ab67616d000048516e415c25972cc9c91dd1034c",
            "https://i.scdn.co/image/ab67616d0000485193942466c2c6ec14557522c6"
        ];
    } 
    // Add more folders as needed
    console.log("Cover photos set for", folder);
}


  // ✅ Fix Album Card Clicks
  function setupAlbumCardClicks() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", async () => {
            const folder = card.getAttribute("data-folder");
            if (folder) {
                assignCoverPhotos(folder); // Set proper covers
                await getSongs(`songs/${folder}`); // Correct path
            }
        });
    });
}



// ✅ Updated displayAlbums (calls setupAlbumCardClicks)
async function displayAlbums() {
    try {
        const response = await fetch(`/songs/`);
        const text = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;

        const anchors = tempDiv.getElementsByTagName("a");
        const cardContainer = document.querySelector(".card-container");
        cardContainer.innerHTML = ""; // Clear existing cards

        for (let anchor of anchors) {
            const href = anchor.getAttribute("href");

            if (href && href.startsWith("songs/")) {
                const folder = href.split("/").filter(Boolean).pop();

                try {
                    const res = await fetch(`songs/${folder}/info.json`);
                    const info = await res.json();

                    const card = document.createElement("div");
                    card.className = "card";
                    card.setAttribute("data-folder", folder);

                    card.innerHTML = `
                        <img src="songs/${folder}/cover.jpg" alt="${info.title}" />
                        <h3>${info.title}</h3>
                        <p>${info.description}</p>
                    `;

                    cardContainer.appendChild(card);
                } catch (err) {
                    console.error(`Error loading info for ${folder}:`, err);
                }
            }
        }

        setupAlbumCardClicks(); // Setup click events after cards are added
    } catch (err) {
        console.error("Error displaying albums:", err);
    }
}


  async function main() {
    // List of songs
    await displayAlbums();  // Show the album cards first
    await getSongs("songs/phonk");
      
    
    currentSong.addEventListener("ended", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playMusic(songs[currentSongIndex], coverPhotos[currentSongIndex]);
        } else {
            // Optional: Reset to first song or show an alert
            alert("Playlist ended.");
        }
    });
    
  


    

    PLAY.addEventListener("click", () => {
        console.log("button was clicked")
        
        // Check if the audio is paused
        if (currentSong.paused) {
            currentSong.play()
            

                    // Replace the icon with a pause icon
                    PLAY.querySelector("i").className = "fa-solid fa-pause";
        } else {
            // Pause the audio and replace the icon with a play icon
            currentSong.pause();
            PLAY.querySelector("i").className ="fa-solid fa-play";
        }
    });
    
    //listener for timeupdate
    currentSong.addEventListener("timeupdate",() =>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = ` ${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left  = (currentSong.currentTime/ currentSong.duration)* 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100
        document.querySelector(".circle").style.left = percent  + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100
    })

    //Add event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left = "0"
    })

    //Add event listener to close button
    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left").style.left = "-155%"
    })

     // Tracks the current song index globally

// Previous button event listener
previous.addEventListener("click", () => {
    console.log("Previous clicked");
    if (currentSongIndex > 0) {
        currentSongIndex--; // Move to the previous song
        playMusic(songs[currentSongIndex], coverPhotos[currentSongIndex]);
    } else {
        console.log("No previous song available");
        alert("No previous Song is Available, restart the songs")
    }
});

// Next button event listener
next.addEventListener("click", () => {
    console.log("Next clicked");
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++; // Move to the next song
        playMusic(songs[currentSongIndex], coverPhotos[currentSongIndex]);
    } else {
        
        alert("Now Next Song Available, restart the songs")
    }
});

    //Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) =>{
        console.log("Setting Volume",e.target,e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    
    

   

             // Prepare the first song without playing it
        currentSong.pause(); // Stop any currently playing song
        currentSong.src = `${currFolder}/` + songs[currentSongIndex];

        document.querySelector(".songinfo").innerHTML = songs[currentSongIndex]; // Update song info
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; // Reset time
        PLAY.querySelector("i").className = "fa-solid fa-play"; // Set play button to "play" state

        // Update the cover photo in the playbar
        let playbarCover = document.querySelector("#playbar-cover");
        playbarCover.src = coverPhotos[currentSongIndex] ;


            // playMusic(songs[0], coverPhotos[0]);

             //load the playlist whenever card is load
 
     // Event listener for cards (switch albums)
    //  Array.from(document.getElementsByClassName("card")).forEach(card => {
    //     card.addEventListener("click", async () => {
    //         let folder = card.dataset.folder;
    //         assignCoverPhotos(folder);
    //         await getSongs(folder);
    //     });
    // });

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {
            
            let folder = item.currentTarget.dataset.folder;
            assignCoverPhotos(folder); // optional: assign correct covers
            await getSongs(`songs/${folder}`);
            

        });
    });

     


 
}

main();



   

  