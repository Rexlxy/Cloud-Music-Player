import { Injectable } from '@angular/core';
import {FileModel} from '../../models/Models';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  playList: Array<FileModel> = [];


  constructor() { }

  public currentSong

  public addToPlayList(musicList: Array<FileModel>) {
    this.playList = this.playList.concat(musicList);
  }


}
