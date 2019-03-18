import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {FileModel} from '../../models/Models';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private apiService: ApiService) { }

  public getFolderContents(path: string): Observable<Array<FileModel>> {
    console.log('Get folder content, path',  path);
    return this.apiService.get('/api/music-data' + path);
  }

  public createFolder(parentFolderPath: string, name: string): Observable<FileModel> {
    console.log('Create new folder:', name, 'in folder: ', parentFolderPath)
    let url: string;
    if (parentFolderPath === '/') {
      url = '/api/music-data/' + encodeURI(name);
    } else {
      url = '/api/music-data' + parentFolderPath + '/' + encodeURI(name);
    }
    url += '?isDir=true';
    return this.apiService.post(url, null);
  }

  public uploadFile(parentFolderPath: string, file: File): Observable<FileModel> {
    console.log('Uploading file', file.name, 'to folder', parentFolderPath);
    let url: string;
    if (parentFolderPath === '/') {
      url = '/api/music-data/' + file.name;
    } else {
      url = '/api/music-data' + parentFolderPath + '/' + file.name;
    }
    url +=  '?isDir=false';
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.apiService.post(url, formData);
  }

  public delete(path: string): Observable<any> {
    return this.apiService.delete('/api/music-data' + path);
  }

}
