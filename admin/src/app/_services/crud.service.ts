import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions, httpAll } from '../_config/headers.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  get(route: string) {
    return this.http.get(`${environment.API}/api/admin/${route}`, httpAll);
    //return this.http.get(`/api/admin/${route}`, httpAll);
  }

  //Listar por ID
  getByID(route: string, id: number) {
    return this.http.get(`${environment.API}/api/admin/${route}/${id}`, httpAll);
    //return this.http.get(`/api/admin/${route}/${id}`, httpAll);
  }

  //Criar
  post(route: string, data: any) {
    return this.http.post(`${environment.API}/api/admin/${route}`, data, httpOptions);
    //return this.http.post(`/api/admin/${route}`, data, httpOptions);
  }

  //Enviar Imagens
  postImage(data: any) {
    //Testes com blob
    //const formData = new FormData();
    //formData.append("name", data.name);
    //formData.append("path", data.path, 'perfil.jpeg');

    return this.http.post(`${environment.API}/api/admin/imagens`, data, httpOptions);
    //return this.http.post(`/api/admin/imagens`, data, httpOptions);
  }

  //Atualizar
  update(route: string, id: number, data: any) {
    return this.http.put(`${environment.API}/api/admin/${route}/${id}`, data, httpOptions);
    //return this.http.put(`/api/admin/${route}/${id}`, data, httpOptions);
  }

  //Deletar
  delete(route: string, id: number) {
    return this.http.delete(`${environment.API}/api/admin/${route}/${id}`, httpAll);
    //return this.http.delete(`/api/admin/${route}/${id}`, httpAll);
  }

}
