export class FileModel {
  Name: string;
  Size: number;
  IsDir: boolean;
  Path: string;

  // UI
  isPlaying = false;

  static isMusicOrFolder(f: FileModel): boolean {
    return (f.IsDir || f.Name.indexOf('.mp3') >= 0);
  }

  static processFileList(files: Array<FileModel>): Array<FileModel> {
    let musicOrFolder = files.filter(FileModel.isMusicOrFolder);
    musicOrFolder = musicOrFolder.sort((a, b) => {
      if  (a.IsDir && b.IsDir) {
        return 0;
      } else if (a.IsDir) {
        return 1;
      } else if (b.IsDir) {
        return -1;
      } else {
        return 0;
      }
    });
    return musicOrFolder;
  }
}
