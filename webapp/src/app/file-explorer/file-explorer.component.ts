import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FileService} from '../services/file/file.service';
import {FileModel} from '../models/Models';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {forkJoin, throwError} from 'rxjs';
import {UserService} from '../services/user/user.service';
import {catchError} from 'rxjs/operators';

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

  constructor(public fileService: FileService,
              public dialog: MatDialog,
              public userService: UserService) {
    this.folderStack = [];
    this.fileService.getFolderContents(this.rootPath).subscribe(data => {
      this.files = FileModel.reorderList(data);
      this.curFolderPath = this.rootPath;
    });
  }

  ngOnInit() {
  }

  public nextFolder(index: number) {
    const folderPath = this.files[index].Path;
    this.fileService.getFolderContents(folderPath).subscribe(data => {
      this.files = FileModel.reorderList(data);
      this.folderStack.push(this.curFolderPath);
      this.curFolderPath = folderPath;
    });
  }

  public lastFolder() {
    if (this.folderStack.length > 0) {
      const lastFolderPath = this.folderStack.pop();
      this.fileService.getFolderContents(lastFolderPath).subscribe(data => {
        this.files = FileModel.reorderList(data);
        this.curFolderPath = lastFolderPath;
      });
    }
  }

  public selectMusic(music: FileModel) {
    // const playList =  this.files.filter(f  => !f.IsDir);
    this.musicSelect.emit(music);
  }

  public delete(index: number) {
    const toDelete = this.files[index];
    this.fileService.delete(toDelete.Path).subscribe(result => {
      console.log('Deleted', toDelete.Path);
      console.log(result);
      this.files.splice(index, 1);
    });
  }

  private safeAppendSingle(f: FileModel) {
    const pathList = this.files.map(file => file.Path);
    if (pathList.indexOf(f.Path) < 0) {
      this.files.push(f);
    }
  }

  private safeAppendList(files: Array<FileModel>) {
    const pathList = this.files.map(file => file.Path);
    console.log(pathList)
    files.forEach(f => {
      if (pathList.indexOf(f.Path) < 0) {
        this.files.push(f);
      }
    });
  }

  public logout() {
    this.userService.logout().subscribe(data => {
      alert(data.Message);
    });
  }

  openDialog(isMkdir: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {name: '', isMkdir: isMkdir, folderPath: this.curFolderPath}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (result instanceof Array) {
          this.safeAppendList(result);
        } else  {
          this.safeAppendSingle(result);
        }
      }
    });
  }
}

export interface DialogData {
  name: string;
  folderPath: string;
  isMkdir: boolean;
  file: FileModel;
}

@Component({
  selector: 'file-dialog',
  templateUrl: 'file-dialog.html',
})
export class DialogComponent {
  @ViewChild('file') file;
  public files: Set<File> = new Set();
  public processing: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  public sumOfFileSize(): number {
    let sum = 0;
    this.files.forEach(f => {
      sum += f.size;
    });
    return sum / 1000000;
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  public ifDisable() {
    if (this.processing) {
      return true;
    }
    if (this.data.isMkdir) {
      return this.data.name == null || this.data.name === '';
    } else {
      return this.files.size === 0;
    }
  }

  public save() {
    this.processing = true;
    // Make directory
    if (this.data.isMkdir) {
      this.fileService.createFolder(this.data.folderPath, this.data.name)
        .pipe(catchError(err => {
          if (err.status === 401) {
            this.processing = false;
          }
          return throwError(err);
        }))
        .subscribe((f: FileModel) => {
        console.log(f);
        this.processing = false;
        this.dialogRef.close(f);
      });

      // Upload files
    } else {
      console.log(this.files);

      const requests = [];
      this.files.forEach(f => {
        requests.push(this.fileService.uploadFile(this.data.folderPath, f));
      });

      forkJoin(requests).subscribe(resultFiles => {
          console.log('Files all uploaded');
          this.dialogRef.close(resultFiles);
        }
      );
    }
  }
}
