import StorageManager from "./storageManager.js";
import { formatTime } from "./utils.js";
import { SKIP_TIME, SHORTCUTS } from "./consts.js";
import Player from "./player.js";
import songs from "./songs.js";

export class PlayListManager {
  constructor (player) {
    /**
     * @type {Player}
     */
    this.player = player;
    this.shortcuts = new Map();
  }

  /**
   * TODO
   * Charge les chansons de la playlist choisie et construit dynamiquement le HTML pour les éléments de chansons
   * @param {StorageManager} storageManager gestionnaire d'accès au LocalStorage
   * @param {string} playlistId identifiant de la playlist choisie
   */
  loadSongs (storageManager, playlistId) {
    const playlist = storageManager.getItemById(
      storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    if (!playlist) return;

    // TODO : Changer l'image et le titre de la page en fonction de la playlist choisie
    document.getElementById("playlist-img").src = playlist.thumbnail;
    document.getElementById("playlist-title").textContent = playlist.name;
    // TODO : Récupérer les chansons de la playlist et construire le HTML pour leur représentation
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = "";
    const songsID = playlist.songs
    const songs = [];

    for (const index in songsID) {
      let newSong = storageManager.getItemById("songs", songsID[index].id);
      songContainer.appendChild(this.buildSongItem(newSong, index))
      songs.push(newSong);
    }
    
    this.player.loadSongs(songs);
    this.setCurrentSongName();
  }

  /**
   * TODO
   * Construit le code HTML pour représenter une chanson
   * @param {Object} song la chansons à représenter
   * @param {number} index index de la chanson
   * @returns {HTMLDivElement} le code HTML dans un élément <div>
   */
  buildSongItem (song, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");

    const songIndex = document.createElement("span");
    songIndex.appendChild(document.createTextNode(index));

    const songName = document.createElement("p");
    songName.appendChild(document.createTextNode(song.name));

    const songGenre = document.createElement("p");
    songGenre.appendChild(document.createTextNode(song.genre));

    const songArtist = document.createElement("p");
    songArtist.appendChild(document.createTextNode(song.artist));
    
    const songIcon = document.createElement("i");
    

    if (song.liked){
      songIcon.setAttribute("class", "fa-heart fa-2x");
    }
    else{
      songIcon.setAttribute("class", "fa-regular fa-heart fa-2x");
    }

    songItem.appendChild(songIndex);
    songItem.appendChild(songName);
    songItem.appendChild(songGenre);
    songItem.appendChild(songArtist);
    songItem.appendChild(songIcon);

    // TODO : gérer l'événement "click" et jouer la chanson après un click
    songItem.addEventListener("click", () => {
      this.playAudio(index);
    })
    
    return songItem;
  }

  /**
   * TODO
   * Joue une chanson en fonction de l'index et met à jour le titre de la chanson jouée
   * @param {number} index index de la chanson
   */
  playAudio (index) {
    const playButton = document.getElementById("play");
        
    if (index === undefined) {
      this.player.playAudio();
    } else {
      this.player.currentIndex = index;
      this.setCurrentSongName();
      this.player.playAudio(index);
      playButton.setAttribute("class", "control-btn fa fa-2x fa-pause");
    }

    // TODO : modifier l'icône du bouton. Ajoute la classe 'fa-pause' si la chanson joue, 'fa-play' sinon
    if (this.player.audio.paused) {
      playButton.setAttribute("class", "control-btn fa fa-2x fa-play");
    } else {
      playButton.setAttribute("class", "control-btn fa fa-2x fa-pause");
    }
  }

  /**
   * TODO
   * Joue la prochaine chanson et met à jour le titre de la chanson jouée
   */
  playPreviousSong () {
    this.player.playPreviousSong();
    this.setCurrentSongName();
    this.playAudio(this.player.currentIndex);
   }
   

  /**
   * TODO
   * Joue la chanson précédente et met à jour le titre de la chanson jouée
   */
  playNextSong () {
    this.player.playNextSong();
    this.setCurrentSongName();
    this.playAudio(this.player.currentIndex);
  }


  /**
   * TODO
   * Met à jour le titre de la chanson jouée dans l'interface
   */
  setCurrentSongName () {
    const nowPlaying = document.getElementById("now-playing");
    nowPlaying.textContent = "on joue: " + this.player.currentSong.name;

  }

  /**
   * Met à jour la barre de progrès de la musique
   * @param {HTMLSpanElement} currentTimeElement élément <span> du temps de la chanson
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   * @param {HTMLSpanElement} durationElement élément <span> de la durée de la chanson
   */
  timelineUpdate (currentTimeElement, timelineElement, durationElement) {
    const position =
      (100 * this.player.audio.currentTime) / this.player.audio.duration;
    timelineElement.value = position;
    currentTimeElement.textContent = formatTime(this.player.audio.currentTime);
    if (!isNaN(this.player.audio.duration)) {
      durationElement.textContent = formatTime(this.player.audio.duration);
    }
  }

  /**
   * TODO
   * Déplacement le progrès de la chansons en fonction de l'attribut 'value' de timeLineEvent
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   */
  audioSeek (timelineElement) { 
    this.player.audioSeek(parseInt(timelineElement.value));
  }

  /**
   * TODO
   * Active ou désactive le son
   * Met à jour l'icône du bouton et ajoute la classe 'fa-volume-mute' si le son ferme ou 'fa-volume-high' si le son est ouvert
   */
  muteToggle () { 
    const muteBtn = document.getElementById("mute");
    if (this.player.muteToggle()) {
      this.player.audio.volume = 0;
      muteBtn.setAttribute("class", "control-btn fa fa-2x fa-volume-mute");
    } else {
      this.player.audio.volume = 1;
      muteBtn.setAttribute("class", "control-btn fa fa-2x fa-volume-high");
    }
  }

  /**
   * TODO
   * Active ou désactive l'attribut 'shuffle' de l'attribut 'player'
   * Met à jour l'icône du bouton et ajoute la classe 'control-btn-toggled' si shuffle est activé, retire la classe sinon
   * @param {HTMLButtonElement} shuffleButton élément <button> de la fonctionnalité shuffle
   */
  shuffleToggle (shuffleButton) { 
    if (this.player.shuffleToggle()) {
      shuffleButton.setAttribute("class", "control-btn fa fa-2x fa-shuffle control-btn-toggled");
    } else {
      shuffleButton.setAttribute("class", "control-btn fa fa-2x fa-shuffle");
    }
  }

  /**
   * Ajoute delta secondes au progrès de la chanson en cours
   * @param {number} delta temps en secondes
   */
  scrubTime (delta) {
    this.player.scrubTime(delta);
  }

  /**
   * TODO
   * Configure la gestion des événements
   */
  bindEvents () {
    const currentTime = document.getElementById("timeline-current");
    const duration = document.getElementById("timeline-end");
    const timeline = document.getElementById("timeline");
    this.player.audio.addEventListener("timeupdate", () => {
      this.timelineUpdate(currentTime, timeline, duration);
    });

    timeline.addEventListener("input", () => {
      this.audioSeek(timeline);
    });

   // TODO : gérer l'événement 'ended' sur l'attribut 'audio' du 'player' et jouer la prochaine chanson automatiquement
   this.player.audio.addEventListener("ended", () => { this.playNextSong() });

   // TODO : gérer l'événement 'click' sur le bon bouton et mettre la chanson en pause/enlever la pause
   document.getElementById("play").addEventListener("click", () => { this.playAudio() });

   // TODO : gérer l'événement 'click' sur le bon bouton et fermer/ouvrir le son
   document.getElementById("mute").addEventListener("click", () => { this.muteToggle() });

   // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson précédente
   document.getElementById("previous").addEventListener("click", () => { this.playPreviousSong() });

   // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson suivante
   document.getElementById("next").addEventListener("click", () => { this.playNextSong() });

   // TODO : gérer l'événement 'click' sur le bon bouton et activer/désactiver le mode 'shuffle'
   document.getElementById("shuffle").addEventListener("click", () => { this.shuffleToggle(shuffleButton) });
  }

  /**
   * Configure les raccourcis et la gestion de l'événement 'keydown'
   */
  bindShortcuts () {
    this.shortcuts.set(SHORTCUTS.GO_FORWARD, () => this.scrubTime(SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.GO_BACK, () => this.scrubTime(-SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => this.playAudio());
    this.shortcuts.set(SHORTCUTS.NEXT_SONG, () => this.playNextSong());
    this.shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => this.playPreviousSong());
    this.shortcuts.set(SHORTCUTS.MUTE, () => this.muteToggle());

    document.addEventListener("keydown", (event) => {
      if (this.shortcuts.has(event.key)) {
        const command = this.shortcuts.get(event.key);
        command();
      }
    });
  }
}

window.onload = () => {
  const storageManager = new StorageManager();
  storageManager.loadAllData();

  // TODO : récupérer l'identifiant à partir de l'URL
  // Voir l'objet URLSearchParams
  const myURLSearchParams = new URLSearchParams(document.location.search);

  const playlistId = myURLSearchParams.get("id");

  const player = new Player();
  const playlistManager = new PlayListManager(player);

  // TODO : configurer la gestion des événements et des raccourcis
  playlistManager.bindEvents();
  playlistManager.bindShortcuts();
  
  // TODO : charger la playlist
  playlistManager.loadSongs(storageManager,playlistId)
};
