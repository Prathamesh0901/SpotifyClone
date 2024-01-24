const folderPath = './Songs';
let currentFolder = '/English%20playlist/';
let currentSong = new Audio();
let playLists;
let songsList;
let track = '';

function playNext() {
    let index;
    for (let i = 0; i < songsList.length; i++) {
        const element = songsList[i];
        if(element.title === track){
            index = i;
            break;
        }
    }
    if(index + 1 <= songsList.length){
        track = songsList[index + 1].title;
        playMusic(track);
    }
}

function updateLibrary() {
    let list2 = '';
    let libraryList = document.querySelector('.lib-boxes');
    libraryList.innerHTML = '';
    songsList.forEach((song) => {
        let html = `
        <div class="box js-box">
            <img src="Assets/music-note.svg" alt="">
            <div class="info">
                <p>${song.title.split('.mp3', 1)}</p>
            </div>
            <button class="play-button-library js-play-button-library"><img src="Assets/play.svg" alt=""></button>
        </div>
        `;
        list2 += html;
    });
    libraryList.innerHTML = list2;

    let libBoxes = document.querySelectorAll('.js-box');

    libBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            track = `${box.querySelector('.info').firstElementChild.innerHTML}.mp3`;
            // updateSongVolume(100);
            playMusic(track);
        });
    });
}

function playMusic(track, pause=false) {
    currentSong.src = folderPath + currentFolder + track;
    if(!pause){
        currentSong.play();
        play.src = 'Assets/pause.svg';
    } else {
        play.src = 'Assets/play.svg';
    }
    document.querySelector('.album-name').innerHTML = track.split('.mp3', 1);
}

function formatMinutes(seconds){
    const minutes = Math.floor(seconds/60);
    const second = Math.floor(seconds%60);

    const finalMinutes = String(minutes).padStart(2, '0');
    const finalSeconds = String(second).padStart(2, '0');

    return `${finalMinutes}:${finalSeconds}`;
}

function updateSongTime(value){
    const percentage = value/100;
    const newTime = currentSong.duration *percentage;
    currentSong.currentTime = newTime;
}

function updateSongVolume(value) {
    if(value == '0') {
        volume.src = 'Assets/mute.svg';
    } else {
        volume.src = 'Assets/volume.svg';
    }
    const percentage = value / 100;
    currentSong.volume = percentage;
    let volumeBar = document.querySelector('.volume-bar');
    volumeBar.style.setProperty('--volume', `${value}%`);
}

async function getPlayLists() {
    let response = await fetch(folderPath);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let playLists = [];
    for(let i = 0;i< as.length;i++){
        const element = as[i];
        if(element.href.endsWith("playlist")){
            playLists.push(element);
        }
    }
    return playLists;
}

async function getSongs() {
    let response = await fetch(folderPath + currentFolder);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let songsList = [];
    for(let i = 0;i< as.length;i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songsList.push(element);
        }
    }
    return songsList;
}

async function main() {
    playLists = await getPlayLists();
    songsList = await getSongs();
    track = songsList[0].title;
    playMusic(track, true);

    let list1 = '';
    let cardList = document.querySelector('.cards-container');
    playLists.forEach((playList) => {
        let html = `
        <div class="card js-card">
            <div class="card-image">
                <img src="Assets/card2img.jpeg">
                <button class="play-button"><img src="Assets/play-svgrepo-com.svg" alt=""></button>
            </div>
            <p class="card-title">${playList.title}</p>
            <p class="card-info">Melody to hear</p>
        </div>
        `;
        list1 += html;
    });
    cardList.innerHTML = list1;

    let cards = document.querySelectorAll('.js-card');

    cards.forEach((card) => {
        card.addEventListener('click', async () => {
            currentFolder = `/${card.querySelector('.card-title').innerHTML}/`;
            songsList = await getSongs();
            updateLibrary();
            playMusic(songsList[0].title);
        });
    });
    
    updateLibrary();

    // Add event listener to boxes in library
    play.addEventListener('click', () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = 'Assets/pause.svg';
        } else{
            currentSong.pause();
            play.src = 'Assets/play.svg';
        }
    });

    // Updating playback bar
    currentSong.addEventListener('timeupdate', () => {
        let songTime = document.querySelector('.songTime');
        songTime.innerHTML = formatMinutes(currentSong.currentTime);
        let songDuration = document.querySelector('.songDuration');
        songDuration.innerHTML = formatMinutes(currentSong.duration);
        
        let progressBar = document.querySelector('.progress-bar');
        const progress = (currentSong.currentTime/currentSong.duration)*100;
        progressBar.value = progress;

        progressBar.style.setProperty('--thumb-progress', `${progress}%`);

        if(progress === 100){
            playNext();
        }
    });

    // Adding hamburger functionality
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.sidebar').style.left = '0';
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.sidebar').style.left = '-120%';
    });

    // Adding previous functionality
    previous.addEventListener('click', () => {
        let index;
        for (let i = 0; i < songsList.length; i++) {
            const element = songsList[i];
            if(element.title === track){
                index = i;
                break;
            }
        }
        if(index - 1 >= 0){
            track = songsList[index - 1].title;
            playMusic(track);
        }
    });
    
    // Adding next functionality
    next.addEventListener('click', () => {
        playNext();
    });

    // Adding mute functionality
    volume.addEventListener('click', () => {
        if(currentSong.volume !== 0){
            updateSongVolume(0);
            document.querySelector('.volume-bar').value = 0;
        } else {
            updateSongVolume(50);
            document.querySelector('.volume-bar').value = 50;
        let index;
        for (let i = 0; i < songsList.length; i++) {
            const element = songsList[i];
            if(element.title === track){
                index = i;
                break;
            }
        }
        if(index + 1 < songsList.length){
            track = songsList[index + 1].title;
            playMusic(track);
        }
    }
    });
    
}

main();
