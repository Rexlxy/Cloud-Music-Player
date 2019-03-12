import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private apiService: ApiService) { }

  public getFolderContents(path: string): Observable<any> {
    return this.apiService.get('/api/folder?folderName=/Jay');
  }
}
