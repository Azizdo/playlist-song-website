const { FileSystemManager } = require("./file_system_manager");
const path = require("path");

class SongsManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
  }

  /**
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).songs;
  }

  /**
   * TODO : Implémenter la récupération d'une chanson en fonction de son id
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById (id) {
    const song = (await this.getAllSongs()).find(song => song.id == id);
    return song;
  }

  /**
   * TODO : Implémenter l'inversement de l'état aimé d'une chanson
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    let songs = await this.getAllSongs();
    const song = await this.getSongById(id);
      song.liked = !song.liked;
    
    songs = songs.map(element => element.id == song.id ? song : element);
    await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, JSON.stringify({"songs" : songs}));
    return song.liked;
    }

}

module.exports = { SongsManager };
