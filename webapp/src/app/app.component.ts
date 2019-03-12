import { ElementRef, Component, ViewChild } from '@angular/core';
import {FileService} from './services/file/file.service';
import {FileModel} from './models/Models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  @ViewChild('player') player:ElementRef;
  files: Array<FileModel>;
  curIndex: number;

  audioUrl: string;

  constructor(private fileService: FileService) {
    this.fileService.getFolderContents('').subscribe(data => {
      this.files = data;
    });

  }

  public playMusic(index: number) {
    if (this.curIndex) {
      this.files[this.curIndex].isPlaying = false;
    }
    // this.curIndex = index;
    //
    // let music = this.files[index];
    // music.isPlaying = true;
    // this.audioUrl = '/api/file?filePath=/Jay/' +  music.Name;
    this.loadSong(index);
    this.player.nativeElement.play();
    console.log('audio link',  this.audioUrl);
  }

  public nextSong() {
    let nextSong = (this.curIndex + 1) % this.files.length;
    this.playMusic(nextSong);
  }

  public prevSong() {
    let prevSong = (this.curIndex - 1 + this.files.length) % this.files.length;
    this.playMusic(prevSong);
  }

  public loadSong(index: number) {
    this.audioUrl =  '/api/file?filePath=/Jay/' +  this.files[index].Name;
    this.curIndex = index;
    this.files[this.curIndex].isPlaying = true;
    this.player.nativeElement.load();
  }
}
