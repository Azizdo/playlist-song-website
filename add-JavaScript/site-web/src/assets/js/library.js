import StorageManager from "./storageManager.js";

class Library {
  constructor (storageManager) {
    this.storageManager = storageManager;
  }


  
  /**
   * TODO
   * Génère le code HTML pour l'affichage des playlists et chansons disponibles
   * @param {Object[]} playlists liste de playlists à afficher
   * @param {Object[]} songs liste de chansons à afficher
   */
  generateLists (playlists, songs) {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.innerHTML = ""; // vider la liste
    // TODO : générer le HTML pour les playlist
    
    playlists.forEach(playlist => { 
      playlistContainer.appendChild(this.buildPlaylistItem(playlist));
      console.log(playlist);
    })

    // TODO : générer le HTML pour les chansons
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = ""
    songs.forEach(song => { 
      songContainer.appendChild(this.buildSongItem(song));
    })
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une playlist
   * @param {Object} playlist playlist à utiliser pour la génération du HTML
   * @returns {HTMLAnchorElement} élément <a> qui contient le HTML de l'affichage pour une playlist
   */
  buildPlaylistItem (playlist) {
    const playlistItem = document.createElement("a");
    playlistItem.href = './playlist.html?id=' + playlist.id; 
    playlistItem.className = 'playlist-item flex-column';

    const playlistPreview = document.createElement("div");
    playlistPreview.className = "playlist-preview";

    const playlistImg = document.createElement("img");
    playlistImg.src = playlist.thumbnail;

    const playlistIcon =document.createElement("i");
    playlistIcon.className = "fa fa-2x fa-play-circle hidden playlist-play-icon";

    const playlistName = document.createElement("p");
    playlistName.appendChild(document.createTextNode(playlist.name))

    const playlistDescription = document.createElement("p");
    playlistDescription.appendChild(document.createTextNode(playlist.description))

    playlistPreview.appendChild(playlistImg);
    playlistPreview.appendChild(playlistIcon);

    playlistItem.appendChild(playlistPreview);
    playlistItem.appendChild(playlistName);
    playlistItem.appendChild(playlistDescription);
    return playlistItem;
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une chansons
   * @param {Object} song chanson à utiliser pour la génération du HTML
   * @returns {HTMLDivElement} élément <div> qui contient le HTML de l'affichage pour une chanson
   */
  buildSongItem = function (song) {
    const songItem = document.createElement("div");
    songItem.className = "song-item flex-row";

    const songName = document.createElement("p");
    songName.appendChild(document.createTextNode(song.name));

    const songGenre = document.createElement("p");
    songGenre.appendChild(document.createTextNode(song.genre));

    const songArtist = document.createElement("p");
    songArtist.appendChild(document.createTextNode(song.artist));

    const songButton = document.createElement("button");
    songButton.className = "fa-2x fa-heart";
    if (song.liked){
      songButton.classList.add("fa");
    }
    else{
      songButton.classList.add("fa-regular");
    }



    const localStorageManager = this.storageManager;

    // TODO : gérer l'événement "click". Modifier l'image du bouton et mettre à jour l'information dans LocalStorage
    songButton.addEventListener("click",function(event){
      console.log("bruh");
      song.liked = !song.liked;
      songButton.className = "fa-2x fa-heart";
      if (song.liked){
        songButton.classList.add("fa");
      }
      else{
        songButton.classList.add("fa-regular");
      }
      
      localStorageManager.replaceItem("songs",song);
  })

  songItem.appendChild(songName);
  songItem.appendChild(songGenre);
  songItem.appendChild(songArtist);
  songItem.appendChild(songButton);

    return songItem;
  };
}

window.onload = () => {
  const storageManager = new StorageManager();
  const library = new Library(storageManager);
  storageManager.loadAllData();
  // TODO : Récupérer les playlists et les chansons de LocalStorage et bâtir le HTML de la page
  library.generateLists(storageManager.getData("playlist"),storageManager.getData("songs"));

};
