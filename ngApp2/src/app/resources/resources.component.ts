import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../resource.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  ress = [];
  addResourceData = {};
  email = null;
  errorText = null;

  constructor(private _resourceService: ResourceService,
    private _router: Router,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.queryParams.subscribe(params  => {
      this.email = params['email'];
      console.log(this.email);
      this.getResources();
    });
  }

  handleError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this._router.navigate(['/login']);
      }
      if (err.status === 402) {
        this.errorText = err.error;
      }
      console.log(err);
    }
  }

  onKey(event) {
    this.errorText = null;
  }

  getResources() {
    this._resourceService.getResources(this.email)
    .subscribe(
      res => {
        this.ress = res;
        console.log(res);
      },
      err => {
        this.handleError(err);
      }
    );
  }

  addResource() {
    this._resourceService.addResource(this.email, this.addResourceData['value'])
    .subscribe(
      res => {
        this.addResourceData = {};
        this.getResources();
      },
      err => {
        this.handleError(err);
      }
    );
  }

  delResource(index: number) {
    this.errorText = null;
    const value = this.ress[index].value;
    this._resourceService.delResource(this.email, value)
    .subscribe(
      res => {
        this.getResources();
      },
      err => {
        this.handleError(err);
      }
    );
  }

}
