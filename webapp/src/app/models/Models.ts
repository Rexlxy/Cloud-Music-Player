export class FileModel {
  Name: string;
  Size: number;
  IsDir: boolean;
  Path: string;
  IsPrivate: boolean;

  // UI
  isPlaying = false;


  // folders first
  static reorderList(files: Array<FileModel>): Array<FileModel> {
    const folderList = files.filter(f => f.IsDir);
    const fileList = files.filter(f => !f.IsDir);
    return folderList.concat(fileList);
  }
}
