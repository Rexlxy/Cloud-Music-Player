import {ElementRef, Component, ViewChild, HostListener, OnInit} from '@angular/core';
import {FileService} from './services/file/file.service';
import {FileModel} from './models/Models';
import {PlayListService} from './services/play-list/play-list.service';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";


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
export class AppComponent implements OnInit{

  title = 'app';
  @ViewChild('player') player:ElementRef;
  @ViewChild('playerSource') playerSource:ElementRef;

  playList: Array<FileModel>;
  curMusic: FileModel;

  constructor(public fileService: FileService,
              public playListService: PlayListService) {
    this.playList = this.playListService.playList;
  }

  ngOnInit(): void {
    this.playListService.init(this.player, this.playerSource);
  }

  public playMusic(index: number) {
    this.curMusic = this.playListService.playMusic(index);
  }

  public nextSong() {
    this.curMusic = this.playListService.next();
  }

  public prevSong() {
    this.curMusic = this.playListService.prev();
  }

  public addMusicToList(music: FileModel) {
    if (this.playListService.contains(music)) {
      alert(music.Name + " already in the play list");
    } else {
      this.playListService.addMusic(music);
    }
  }

  public addListToList(list: Array<FileModel>) {
    this.playListService.addMusicList(list);
  }

  public drop(event: CdkDragDrop<string[]>) {
    console.log('drop', event.previousIndex, event.currentIndex);
    if (this.playListService.curPlayingIndex === event.previousIndex) {
      this.playListService.curPlayingIndex = event.currentIndex;
      console.log('updated current playing index', this.playListService.curPlayingIndex);
    }
    moveItemInArray(this.playList, event.previousIndex, event.currentIndex);
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.SPACE) {
      if (this.player.nativeElement.paused) {
        this.player.nativeElement.play();
      } else  {
        this.player.nativeElement.pause();
      }
    }
  }

}
