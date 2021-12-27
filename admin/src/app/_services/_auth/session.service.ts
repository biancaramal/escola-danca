import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions, httpAll } from '../../_config/headers.service';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

    constructor(
        private http: HttpClient,
        private tokenSrv: TokenService,
    ) {}

    //Login
    login(data: any) {
        return this.http.post(`${environment.API}/api/auth/admin/login`, data);

        // return this.http.get(`${environment.API}/sanctum/csrf-cookie`).subscribe(() => {
        //     return this.http.post(`${environment.API}/api/auth/admin/login`, data, {withCredentials: true})
        // });
    }

    //Meu Perfil
    me() {
        let id = this.tokenSrv.getUser().id;

        return this.http.get(`${environment.API}/api/admin/me/${id}`, httpAll);
    }

    //Alterar dados de usuário
    editarPerfil(data: any) {
        let id = this.tokenSrv.getUser().id;

        return this.http.put(`${environment.API}/api/admin/editar-perfil/${id}`, data, httpOptions);
    }

    //Alterar Senha
    alterarSenha(data: any) {
        let id = this.tokenSrv.getUser().id;

        return this.http.put(`${environment.API}/api/admin/alterar-senha/${id}`, data, httpOptions);
    }

    logout() {
        let id = this.tokenSrv.getUser().id;

        return this.http.post(`${environment.API}/api/auth/admin/logout/${id}`, '', httpAll);
    }

    getAdmins() {
        let id = this.tokenSrv.getUser().id;

        return this.http.get(`${environment.API}/api/admin/listAdmins/${id}`, httpAll);
    }
}
