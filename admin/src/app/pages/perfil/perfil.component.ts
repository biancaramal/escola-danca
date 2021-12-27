import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from 'src/app/_config/response.service';
import { SessionService } from 'src/app/_services/_auth/session.service';
import { TokenService } from 'src/app/_services/_auth/token.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  //Formulário
  dataForm: FormGroup;

  //Dados
  data: any;

  constructor(
    public tokenSrv: TokenService,
    public responseSrv: ResponseService,
    private sessionSrv: SessionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.dataForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        ]
      ],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.tokenSrv.getCarregamento() === 'false'){
      this.reloadCurrentPage();
    }
  }

  reloadCurrentPage(){
    window.location.reload();
    this.tokenSrv.setTrueCarregamento();
  }

  update() {
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Caso o formulário seja inválido, não vai enviar
    if(!this.dataForm.valid){
      return;
    }

    this.sessionSrv.editarPerfil(this.dataForm.value).subscribe(
    res => {
      this.responseSrv.handleSuccessPerfil(res, 1);

      //Resetar o formulário
      this.dataForm.reset();
    },
    err => {
      this.responseSrv.handleErrorUpdate(err.error.errors, 1);
      //this.responseSrv.handleErrorStatusCode(err.status, err.error, 1);
    });
  }

}
