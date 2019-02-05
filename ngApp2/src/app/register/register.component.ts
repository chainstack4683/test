import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserData = {};
  errorText = null;
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  onKey(event) {
    this.errorText = null;
  }

  registerUser() {
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => {
          console.log(res);
          this.registerUserData['email'] = null;
          this.registerUserData['password'] = null;
          this.errorText = 'User registered successfully';
          this._router.navigate(['/users']);
        },
        err => {
          console.log(err);
          this.errorText = err.error;
        }
      );
  }
}
