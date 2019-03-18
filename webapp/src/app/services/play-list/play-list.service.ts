import {ElementRef, Injectable} from '@angular/core';
import {FileModel} from '../../models/Models';

@Injectable({
  providedIn: 'root'
})
export class PlayListService {

  constructor() { }

  public playList: Array<FileModel> = [];
  public curPlayingIndex: number;
  public playMode: number;
  musicPlayer: ElementRef;
  musicPlayerSource: ElementRef;

  public init(player: ElementRef, playerSource: ElementRef)  {
    this.musicPlayer  = player;
    this.musicPlayerSource = playerSource;
    this.playMode = 0;
    console.log('service', this.musicPlayer);
  }

  public currentPlaying(): FileModel {
    if (this.curPlayingIndex != null) {
      return this.playList[this.curPlayingIndex];
    }
    return null;
  }

  public playMusic(index: number) {
    console.log('current index', this.curPlayingIndex);
    if (this.curPlayingIndex != null) {
      this.currentPlaying().isPlaying = false;
    }
    this.curPlayingIndex = index;
    this.currentPlaying().isPlaying = true;
    this.musicPlayerSource.nativeElement.src = '/api/music-data/' + this.currentPlaying().Path;
    this.musicPlayer.nativeElement.load();
    this.musicPlayer.nativeElement.play();
    console.log('audio link',  this.musicPlayerSource.nativeElement.src);
    return this.currentPlaying();
  }

  public next() {
    if (this.playList.length) {
      const index = (this.curPlayingIndex + 1) % this.playList.length;
      this.playMusic(index);
      return this.currentPlaying();
    } else {
      console.log('No prev song');
      return null;
    }
  }

  public prev() {
    if (this.playList.length) {
      const index = (this.curPlayingIndex - 1 + this.playList.length) % this.playList.length;
      this.playMusic(index);
      return this.currentPlaying();
    } else {
      console.log('No prev song');
    }
  }

  public contains(f: FileModel): boolean {
    for (let i = 0; i < this.playList.length; i++) {
      if (this.playList[i].Path === f.Path) {
        return true;
      }
    }
    return  false;
  }

  public addMusic(music: FileModel) {
    this.playList.push(music);
  }

  public addMusicList(list: Array<FileModel>) {
    this.playList = this.playList.concat(list);
  }

  public removeMusic(index: number) {
    this.playList.splice(index, 1);
  }

  public nextPlayMode() {
    this.playMode = (this.playMode + 1) % 3;
  }

}
