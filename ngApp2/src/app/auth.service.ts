import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _addUserUrl = environment.apiEndpoint + '/adduser';
  private _delUserUrl = environment.apiEndpoint + '/deluser';
  private _usersUrl = environment.apiEndpoint + '/users';

  private _loginUrl = environment.apiEndpoint + '/login';
  private _quotaUrl = environment.apiEndpoint + '/quota';

  constructor(private http: HttpClient,
    private _router: Router) { }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  loggedInAdmin() {
    return this.loggedIn() && localStorage.getItem('admin') === 'true';
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this._router.navigate(['/login']);

  }

  setQuota(email, quota) {
    return this.http.post(this._quotaUrl, { email: email, quota: quota });
  }

  delUser(user) {
    return this.http.post(this._delUserUrl, user);
  }

  users() {
    return this.http.get<[]>(this._usersUrl);
  }

  registerUser(user) {
    return this.http.post(this._addUserUrl, user);
  }

  loginUser(user) {
    return this.http.post(this._loginUrl, user);
  }
}
