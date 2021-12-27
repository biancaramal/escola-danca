import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{

  canActivate(): boolean {
    if(!this.token.getToken()){
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  constructor(
    public token: TokenService,
    public router: Router,
  ) { }
}