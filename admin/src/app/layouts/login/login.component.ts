import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/_config/response.service';
import { SessionService } from 'src/app/_services/_auth/session.service';
import { TokenService } from 'src/app/_services/_auth/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //Formulário
  loginForm: FormGroup;
  spinner = false;

  //Erros
  error = { email: false, password: false };

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private sessionSrv: SessionService,
    public responseSrv: ResponseService,
    private tokenSrv: TokenService,
    private router: Router,
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        ]
      ],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login () {
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Inicia o spinner
    this.spinner = true;

    //Tratamento de erros caso o formulário esteja com algum campo vazio
    if(!this.loginForm.valid){

      this.loginForm.value.email === '' ? this.error.email = true : this.error.email =  false;

      this.loginForm.value.password === '' ? this.error.password = true : this.error.password =  false;

      return;
    }
    
    this.sessionSrv.login(this.loginForm.value).subscribe(
      (res : any) => {
        this.handleResponse(res.data);
        this.spinner = false;
      },
      err => {
        console.log(err);
        this.spinner = false;
        this.responseSrv.handleErrorAuth(err, 1);
      });
  }

  handleResponse(data: any){
    this.tokenSrv.handle(data);
    
    this.router.navigate(['/administrativo/perfil']);
  }
}
