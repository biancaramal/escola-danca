import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/_services/_auth/token.service';
import { SessionService } from 'src/app/_services/_auth/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public tokenSrv: TokenService,
    private sessionSrv: SessionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    
  }

  logout() {
    //Remove o token no BD
    this.sessionSrv.logout().subscribe(
      res => {
        //Remove o token do storage
        this.tokenSrv.remove();

        //Manda para a tela de Login
        this.router.navigateByUrl('/');
      },
      err => {
        console.log(err);
      }
    );
  }
}
