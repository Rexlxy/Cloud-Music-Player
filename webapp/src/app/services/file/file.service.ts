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
    return this.apiService.get('/api/folder?path=' + path);
  }
}
