import StorageManager from "./storageManager.js";
import { generateRandomID } from "./utils.js";

/**
 * TODO
 * Popule l'élément 'dataList' avec des éléments <option> en fonction des noms des chansons en paramètre
 * @param {HTMLDataListElement} dataList élément HTML à qui ajouter des options
 * @param {Object} songs liste de chansons dont l'attribut 'name' est utilisé pour générer les éléments <option>
 */
function buildDataList (dataList, songs) {
  dataList.innerHTML = "";
  // TODO : extraire le nom des chansons et populer l'élément dataList avec des éléments <option>
  songs.forEach(element => {
    const songNode = document.createElement("option");
    songNode.setAttribute("value", element.name);
    dataList.appendChild(songNode);
  });
}

/**
 * Permet de mettre à jour la prévisualisation de l'image pour la playlist
 */
function updateImageDisplay () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = URL.createObjectURL(this.files[0]);
}

/**
 * TODO
 * Ajoute le code HTML pour pouvoir ajouter une chanson à la playlist
 * Le code contient les éléments <label>, <input> et <button> dans un parent <div>
 * Le bouton gère l'événement "click" et retire le <div> généré de son parent
 * @param {Event} e événement de clic
 */
let songNumber = 2; 

function addItemSelect (e) {
  // TODO : prévenir le comportement par défaut du bouton pour empêcher la soumission du formulaire
  e.preventDefault();
  // TODO : construire les éléments HTML nécessaires pour l'ajout d'une nouvelle chanson
  const songContainer = document.getElementById("song-list");
  const div = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", `song-${songNumber}`);
  label.textContent = `#${songNumber} `;  //do not work with label.appendChild(text);
  const input = document.createElement("input");
  input.setAttribute("class", "song-input");
  input.setAttribute("id", `song-${songNumber}`);
  input.setAttribute( "type", "select");
  input.setAttribute("list", "song-dataList");
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "fa fa-minus");
  div.appendChild(label);
  div.appendChild(input);
  div.appendChild(deleteButton);
  songContainer.appendChild(div);
  songNumber += 1;

  // TODO : gérér l'événement "click" qui retire l'élément <div> généré de son parent
  deleteButton.addEventListener("click",() => {
    songContainer.removeChild(div);
  })
}


/**
 * TODO
 * Génère un objet Playlist avec les informations du formulaire et le sauvegarde dans le LocalStorage
 * @param {HTMLFormElement} form élément <form> à traiter pour obtenir les données
 * @param {StorageManager} storageManager permet la sauvegarde dans LocalStorage
 */
async function createPlaylist (form, storageManager) {
  // TODO : récupérer les informations du formulaire
  // Voir la propriété "elements" https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
  // TODO : créer un nouveau objet playlist et le sauvegarder dans LocalStorage
  const elements = form.elements;
 
  const newPlaylistName = elements["name"].value;
  const newPlaylistDescription = elements["description"].value;
  const newPlaylistThumbnail = await getImageInput(elements["image"]);
  const newPlaylistSongs = [];
  document.querySelectorAll(".song-input").forEach(song => {newPlaylistSongs.push({id: storageManager.getIdFromName(storageManager.STORAGE_KEY_SONGS, song.value)})});

  const newPlaylist =  {
    id: generateRandomID(2),
    name: newPlaylistName,
    description: newPlaylistDescription,
    thumbnail: newPlaylistThumbnail,
    songs: newPlaylistSongs
  } ;

  storageManager.addItem(storageManager.STORAGE_KEY_PLAYLISTS, newPlaylist);
}

/**
 * Fonction qui permet d'extraire une image à partir d'un file input
 * @param {HTMLInputElement} input champ de saisie pour l'image
 * @returns image récupérée de la saisie
 */
async function getImageInput (input) {
  if (input && input.files && input.files[0]) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(input.files[0]);
    });
    return image;
  }
}

window.onload = () => {
  // TODO : récupérer les éléments du DOM
  const imageInput = document.getElementById("image");
  const form = document.getElementById("playlist-form");
  const storageManager = new StorageManager();
  storageManager.loadAllData();
  const songs = storageManager.getData(storageManager.STORAGE_KEY_SONGS);
  
  // TODO : construire l'objet dataList
  const songContainer = document.getElementById("song-dataList");
  buildDataList(songContainer, songs);
  imageInput.addEventListener("change", updateImageDisplay);
  
  // TODO : gérer l'événement "submit" du formulaire
  document.getElementById("add-song-btn").addEventListener( "click", (e) => {addItemSelect(e)});
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createPlaylist(form, storageManager);
    window.location.replace("index.html");
  });
};
