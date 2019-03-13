import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileService} from '../services/file/file.service';
import {FileModel} from '../models/Models';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  @Output() musicSelect: EventEmitter<FileModel> = new EventEmitter();
  @Output() playListSelect: EventEmitter<Array<FileModel>> = new EventEmitter();

  curFolderPath: string;
  folderStack: Array<string>;
  files: Array<FileModel>;
  rootPath = '/';

  constructor(private fileService: FileService) {
    this.folderStack = [];
    this.fileService.getFolderContents(this.rootPath).subscribe(data => {
      this.files = FileModel.processFileList(data);
      this.curFolderPath = this.rootPath;
    });
  }

  ngOnInit() {
  }

  public nextFolder(index: number) {
    const folderPath = this.files[index].Path;
    this.fileService.getFolderContents(folderPath).subscribe(data => {
      this.files = FileModel.processFileList(data);
      this.folderStack.push(this.curFolderPath);
      this.curFolderPath = folderPath;
    });
  }

  public lastFolder() {
    if (this.folderStack.length > 0) {
      const lastFolderPath = this.folderStack.pop();
      this.fileService.getFolderContents(lastFolderPath).subscribe(data => {
        this.files = FileModel.processFileList(data);
        this.curFolderPath = lastFolderPath;
      });
    }
  }

  public selectMusic(music: FileModel) {
    // const playList =  this.files.filter(f  => !f.IsDir);
    this.musicSelect.emit(music);
  }
}
