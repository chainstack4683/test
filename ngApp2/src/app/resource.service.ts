import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private _resourcesUrl = environment.apiEndpoint + '/resources';
  private _resourceAddUrl = environment.apiEndpoint + '/resourceadd';
  private _resourceDelUrl = environment.apiEndpoint + '/resourcedel';

  constructor(private http: HttpClient) { }

  delResource(email: String, value: any) {
    return this.http.post(this._resourceDelUrl, { email: email, value: value });
  }

  addResource(email: String, value: any) {
    return this.http.post(this._resourceAddUrl, { email: email, value: value });
  }

  getResources(email: String) {
    const params = {};
    if (email) {
      params['email'] = email;
    }
    return this.http.get<[]>(this._resourcesUrl, { params: params });
  }

}
