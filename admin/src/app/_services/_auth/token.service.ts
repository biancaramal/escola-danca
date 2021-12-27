import { Injectable } from '@angular/core';
import { User } from '../../_interfaces/interfaces.service';

@Injectable({
  providedIn: 'root'
})

export class TokenService {

  constructor() { }

  //Pega o token
  handle(data: any){
    this.setToken(data.token);
    this.setUser(data.admin);
    this.setFalseCarregamento();
  }

  //Salva o token no storage
  setToken(token: any){
    localStorage.setItem('@Auth:token', token);
  }

  //Salva o user no storage
  setUser(admin: any){
    //Adicionar apenas os dados que queremos no storage
    let add = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };

    localStorage.setItem('@Auth:user', JSON.stringify(add));
  }
  
  //Retorna o valor do token
  get(){
    return localStorage.getItem('@Auth:token');
  }

  //Retorna os dados do usuário com objeto
  getUser(){
    let userString = localStorage.getItem('@Auth:user');

    if(userString){
      let userObj = JSON.parse(userString);
      return userObj;
    }
  }

  //Boolean de se existe Token no Storage
  getToken(){
    if(localStorage.getItem('@Auth:token')){
      return true;
    }

    return false;
  }

  //Ao sair, remove todos os tokens salvos
  remove(){
    localStorage.removeItem('@Auth:token');
    localStorage.removeItem('@Auth:user');
  }

  loggedIn(){
    return this.getToken();
  }

  //Seta que logou, mas não aconteceu o carregamento ainda
  setFalseCarregamento(){
    localStorage.setItem('@Auth:loading', 'false');
  }

  //Verifica se já carregou a página
  getCarregamento(){
    return localStorage.getItem('@Auth:loading');
  }

  setTrueCarregamento(){
    localStorage.setItem('@Auth:loading', 'true');
  }
}
