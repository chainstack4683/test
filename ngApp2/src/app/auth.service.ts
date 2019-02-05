import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _addUserUrl = 'http://localhost:3000/api/adduser';
  private _delUserUrl = 'http://localhost:3000/api/deluser';
  private _usersUrl = 'http://localhost:3000/api/users';

  private _loginUrl = 'http://localhost:3000/api/login';
  private _quotaUrl = 'http://localhost:3000/api/quota';

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
