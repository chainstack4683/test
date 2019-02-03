import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {};
  errorText = null;

  constructor(private _auth: AuthService,
    private _router: Router) { }

  ngOnInit() {
  }

  onKey(event) {
    this.errorText = null;
  }

  loginUser() {
    this._auth.loginUser(this.loginUserData)
    .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', (<any>res).token);
          localStorage.setItem('admin', (<any>res).admin);
          this._router.navigate(['/resources']);
        },
        err => {
          this.loginUserData['password'] = null;
          this.errorText = err.error;
          console.log(err);
        }
    );
  }

}
