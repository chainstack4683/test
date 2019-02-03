import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];
  constructor(private _authService: AuthService,
    private _router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  handleError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this._router.navigate(['/login']);
      }
      console.log(err);
    }
  }

  getUsers() {
    this._authService.users()
    .subscribe(
      res => this.users = res,
      err => this.handleError(err)
    );
  }

  delUser(index: number) {
    const email = this.users[index].email;
    this._authService.delUser({email: email})
    .subscribe(
      res => {
        this.getUsers();
      },
      err => this.handleError(err)
    );

  }

  showResource(index: number) {
    const email = this.users[index].email;
    this._router.navigate(['resources'], {queryParams: {email: email}});
  }

  setQuota(index: number) {
    const email = this.users[index].email;
    const quota = this.users[index].quota;

    this._authService.setQuota(email, quota)
    .subscribe(
      res => {
        console.log(res);
      },
      err => this.handleError(err)
    );
  }
}
