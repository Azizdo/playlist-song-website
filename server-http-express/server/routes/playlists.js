const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { PlaylistManager } = require("../managers/playlist_manager");
const { FileSystemManager } = require("../managers/file_system_manager");

const playlistManager = new PlaylistManager();

/**
 * Retourne la liste de toutes les chansons
 * @memberof module:routes/playlists
 * @name GET /playlists
 */
router.get("/", async (request, response) => {
  try {
    const playlists = await playlistManager.getAllPlaylists();
    response.status(HTTP_STATUS.SUCCESS).json(playlists);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * TODO : retourne un playlist en fonction de son id
 * Retourne playlist en fonction de son id
 * @memberof module:routes/playlists
 * @name GET /playlists/:id
 */
router.get("/:id", async (request, response) => {

  try {
    const id = request.params.id;
    const playlist = await playlistManager.getPlaylistById(id);
    if (playlist === undefined){
      response.status(HTTP_STATUS.NOT_FOUND).json(playlist);
    }
    else{
      response.status(HTTP_STATUS.SUCCESS).json(playlist);
    }  
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Ajoute une playlist
 * @memberof module:routes/playlists
 * @name POST /playlists
 */
router.post("/", async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    const playlist = await playlistManager.addPlaylist(request.body);
    response.status(HTTP_STATUS.CREATED).json(playlist);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * TODO : implémenter la modification d'une playlist
 * Mets à jour l'information d'une playlist en fonction de son id
 * @memberof module:routes/playlists
 * @name PUT /playlists/:id
 */
router.put("/:id", async (request, response) => {
  try {
    const playlist = request.body;
    if (!playlist.hasOwnProperty("id")){
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    await playlistManager.updatePlaylist(playlist);
    if (playlistManager.getPlaylistById(playlist.id) === undefined){    
      response.status(HTTP_STATUS.BAD_REQUEST).send();
    }
    else{
      response.status(HTTP_STATUS.SUCCESS).json({id:playlist.id});
    }
  } 
  catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * TODO : implémenter la suppression de la requête
 * Supprime une playlist en fonction de son id
 * @memberof module:routes/playlists
 * @name DELETE /playlists/:id
 */
router.delete("/:id", async (request, response) => {
  try{
    const id = request.params.id;
    const wasDeleted = await playlistManager.deletePlaylist(id);
    if (wasDeleted){
      response.status(HTTP_STATUS.SUCCESS).send();
    }
    else{
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }}
    catch(error){
      response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }

    }
);

module.exports = { router, playlistManager };
