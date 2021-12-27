import { HttpHeaders } from '@angular/common/http';

//Para postar, e atualizar dados
export const httpOptions = {
    headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('@Auth:token')}` 
    })
}

//Para listar, listar todos, deletar
export const httpAll = {
    headers: new HttpHeaders({ 
        'Authorization': `Bearer ${localStorage.getItem('@Auth:token')}` 
    })
}
