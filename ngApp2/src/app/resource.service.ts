import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private _resourcesUrl = 'http://localhost:3000/api/resources';
  private _resourceAddUrl = 'http://localhost:3000/api/resourceadd';
  private _resourceDelUrl = 'http://localhost:3000/api/resourcedel';
  private _usersUrl = 'http://localhost:3000/api/users';


  constructor(private http: HttpClient) { }

  delResource(email, value) {
    return this.http.post(this._resourceDelUrl, { email: email, value: value});
  }

  addResource(email, value) {
    return this.http.post(this._resourceAddUrl, { email: email, value: value});
  }

  getResources(email) {
    const params = {};
    if (email) {
      params['email'] = email;
    }
    return this.http.get<[]>(this._resourcesUrl, { params: params});
  }

}
