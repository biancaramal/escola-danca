import { Injectable } from '@angular/core';
import { TokenService } from '../_services/_auth/token.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class ResponseService {

    //Erro quando não tem dados
    withoutData: boolean = false;

    //Alert
    open: boolean = false; //Aberto ou não
    open2: boolean = false; //Onde tem mais de um alerta
    dismissible: boolean = true; //Se aparece o botão pra fechar
    timeout: number = 5000; //Tempo que fica na tela
    alertType: string; //Se é success ou danger
    alertResponse: any = []; //A mensagem

    constructor(
        private tokenSrv: TokenService,
        private router: Router,
    ){}

    /*==========SUCCESS==========*/
    //Tratamento de success ao editar perfil, abre alerta
    handleSuccessPerfil(mensagem: any, alert: number) {

        this.alertResponse.push(mensagem.message);

        //Altera os dados no storage
        this.tokenSrv.setUser(mensagem.data);

        //Após verificar os erros, abrir o alert
        alert == 1 ? this.open = true : this.open2 = true;

        this.alertType = 'success';

        //Fechar o alerta
        this.onTimeout();
    }

    //Tratamento de success, abre alerta
    handleSuccess(mensagem: any, alert: number) {

        this.alertResponse.push(mensagem.message);

        //Após verificar os erros, abrir o alert
        alert == 1 ? this.open = true : this.open2 = true;

        this.alertType = 'success';

        //Fechar o alerta
        this.onTimeout();
    }


    /*==========ERROR==========*/
    //Tratamento de erro ao editar perfil administrativo
    handleErrorUpdate(mensagem: any, alert: number){
      if(mensagem.email){
        if(mensagem.email.length > 0){
          this.alertResponse.push(mensagem.email);
        }
      }

      if(mensagem.name){
        if(mensagem.name.length > 0){
            this.alertResponse.push(mensagem.name);
        }
      }

      //Após verificar os erros, abrir o alert
      alert == 1 ? this.open = true : this.open2 = true;

      this.alertType = 'danger';

      //Fechar o alerta
      this.onTimeout();
    }

    //Verifica o status code do erro, e direciona para o tratamento correto
    handleErrorStatusCode(status: number, mensagem: any, alert: number){
        if(status === 401){
            this.handleErrorAuth(mensagem, alert);
        }

        if(status === 404){
            this.handleDataError(mensagem);
            return;
        }

        if(status === 422){
            this.handleError(mensagem, alert);
            return;
        }

        if(status === 500){
            this.handleServerError(mensagem);
        }
    }

    //401 - Sem autorização, login
    handleErrorAuth(mensagem: any, alert: number){
        this.alertResponse.push(mensagem.error.message);

        //Após verificar os erros, abrir o alert
        alert == 1 ? this.open = true : this.open2 = true;

        this.alertType = 'danger';

        //Fechar o alerta
        this.onTimeout();
    }

    //404 - Tratamento de erro quando está sem dados
    handleDataError(mensagem: any) {

        this.alertResponse.push(mensagem.message);

        //Após verificar os erros, abrir o alert
        this.withoutData = true;
    }

    //500 - Tratamento de erro de servidor
    handleServerError(mensagem: any) {
        console.log(mensagem.message);
        this.alertResponse.push(mensagem.message);
        console.log('Ver outro jeito de fazer isso');
        //Se existir token, limpar
        if(this.tokenSrv.getToken()){
            this.tokenSrv.remove();

            //Redirecionar para o login
            this.router.navigateByUrl('/');
        }

    }

    //422 - Tratamento de erros de exceções, abre alerta
    handleError(mensagem: any, alert: number){

        let array = mensagem.errors;

        if(Array.isArray(array)){
            array.forEach((element : any) => {
                this.alertResponse.push(element);
            });
        }
        else{
            this.alertResponse.push(mensagem.error.errors);
        }

        //Após verificar os erros, abrir o alert
        alert == 1 ? this.open = true : this.open2 = true;

        this.alertType = 'danger';

        //Fechar o alerta
        this.onTimeout();
    }

    //Fecha o alerta ao clicar no botão
    onClosed(){
        this.open = false;
        this.open2 = false;
    }

    //Fecha o alerta após 5 segundos
    onTimeout() {
        setTimeout(() => {
            this.open = false;
            this.open2 = false;
        }, this.timeout);

    }
}
