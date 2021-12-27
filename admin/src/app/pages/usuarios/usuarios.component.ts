import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { User } from '../../_interfaces/interfaces.service';
import { ResponseService } from 'src/app/_config/response.service';
import { CrudService } from '../../_services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  //Formulário
  dataForm: FormGroup;
  updateForm: FormGroup;

  //Controlar a exibição da view
  //1 - Modalidades, 2 - Adicionar, 3 - Editar
  openViewAction: number = 1;

  //Dados
  data: any;
  dataGetByID: any;

  //Table
  dataSource: MatTableDataSource<User>;
  displayed = ['nome', 'email', 'dt_criado', 'acoes'];
  pageSizeOptions = [5, 10];

  //Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public responseSrv: ResponseService,
    private crudSrv: CrudService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }


  ngOnInit(): void {
    //Se estiver na view de exibir, carregar admins
    if(this.openViewAction === 1){
      this.get();
    }
  }

  //Controle de views
  openView(view: number, id: any) {
    //Limpar dados do formulário, caso estivesse aberto
    this.dataForm.reset();

    this.openViewAction = view;

    if(view === 3 && id != null){
      this.openViewAction = view;
      this.getByID(id);
    }

    if(view === 1){
      this.get();
      this.dataForm.reset();
      this.updateForm.reset();
    }
  }

  get() {
    this.crudSrv.get('users').subscribe(
    res => {
      this.data = res;

      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    err => {
      this.responseSrv.handleErrorStatusCode(err.status, err.error, 0);
    });
  }

  getByID(id: number){
    this.crudSrv.getByID('users', id).subscribe(
      res => {
        this.dataGetByID = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  post(){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Caso o formulário seja inválido, não vai enviar
    if(!this.dataForm.valid){
      return;
    }

    this.crudSrv.post('users', this.dataForm.value).subscribe(
      res => {
        console.log(res);

        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.dataForm.reset();

      },
      err => {
        this.responseSrv.handleErrorStatusCode(err.status, err.error, 1);
      }
    );
  }

  update(id: number){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    this.crudSrv.update('users', id, this.updateForm.value).subscribe(
      res => {
        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.updateForm.reset();
      },
      err => {
        this.responseSrv.handleErrorUpdate(err.error.errors, 1);
      }
    );
  }

  openModalDelete(id: number){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.crudSrv.delete('users', id).subscribe(
          res => {
            this.openView(1, null);
          },
          err => {
            console.log(err);
          },
        );

      }

      return;
    });
  }
}
