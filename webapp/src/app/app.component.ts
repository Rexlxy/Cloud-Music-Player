import { ElementRef, Component, ViewChild,  HostListener } from '@angular/core';
import {FileService} from './services/file/file.service';
import {FileModel} from './models/Models';


export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  SPACE = 32
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  @ViewChild('player') player:ElementRef;
  musicPlaying: FileModel;
  playList: Array<FileModel> = [];

  constructor(private fileService: FileService) {
  }

  public updatePlayList(playList: Array<FileModel>)  {
    this.playList = playList;
  }

  public playMusic(music: FileModel) {
    if (this.musicPlaying) {
      this.musicPlaying.isPlaying = false;
    }
    this.loadSong(music);
    this.player.nativeElement.play();
    console.log('audio link',  this.musicLink());
  }

  public nextSong() {
    if (this.playList.length) {
      let curIndex = this.playList.indexOf(this.musicPlaying);
      let nextSong = (curIndex + 1) % this.playList.length;
      this.playMusic(this.playList[nextSong]);
    } else {
      console.log("No next song");
    }
  }

  public prevSong() {
    if (this.playList.length) {
      let curIndex = this.playList.indexOf(this.musicPlaying);
      let prevSong = (curIndex - 1 + this.playList.length) % this.playList.length;
      this.playMusic(this.playList[prevSong]);
    } else {
      console.log("No prev song");
    }
  }

  public loadSong(music: FileModel) {
    this.musicPlaying = music;
    this.musicPlaying.isPlaying = true;
    this.player.nativeElement.load();
  }

  public musicLink(): string {
    if  (this.musicPlaying) {
      return '/api/file?path=' + this.musicPlaying.Path;
    }
    return  null;
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === KEY_CODE.SPACE) {
      if (this.player.nativeElement.paused) {
        this.player.nativeElement.play();
      } else  {
        this.player.nativeElement.pause();
      }
    }
  }

}
