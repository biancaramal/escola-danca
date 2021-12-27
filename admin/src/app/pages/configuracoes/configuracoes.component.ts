import { Component, OnInit, Input, ViewChild  } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseService } from 'src/app/_config/response.service';
import { SessionService } from 'src/app/_services/_auth/session.service';
import { Admin } from '../../_interfaces/interfaces.service';
import { CrudService } from '../../_services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {
  //Formulário
  dataForm: FormGroup;
  adminForm: FormGroup;
  updateAdminForm: FormGroup;

  //Controlar a exibição da view
  //1 - Admins, 2 - Adicionar, 3 - Editar
  openViewAction: number = 1;

  //Dados
  data: any;
  dataGetByID: any;

  //Table
  dataSource: MatTableDataSource<Admin>;
  displayed = ['nome', 'email', 'dt_criado', 'acoes',];
  pageSizeOptions = [2, 5];

  //Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private sessionSrv: SessionService,
    private formBuilder: FormBuilder,
    public responseSrv: ResponseService,
    private crudSrv: CrudService,
    private dialog: MatDialog,
  ) {
    this.dataForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', [Validators.required, Validators.min(8)]],
    });

    this.adminForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(8)]],
      password_confirmation: ['', [Validators.required, Validators.min(8)]],
    });

    this.updateAdminForm = this.formBuilder.group({
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
    this.openViewAction = view;

    if(view === 3 && id != null){
      this.openViewAction = view;
      this.getByID(id);
    }

    if(view === 1){
      this.get();
      this.dataForm.reset();
      this.adminForm.reset();
      this.updateAdminForm.reset();
    }
  }

  get() {
    this.sessionSrv.getAdmins().subscribe(
    res => {
      this.data = res;

      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    err => {
      console.log(err);
      //this.responseSrv.handleErrorStatusCode(err.status, err.error, 2);
    })
  }

  getByID(id: number){
    this.crudSrv.getByID('admins', id).subscribe(
      res => {
        this.dataGetByID = res;
      },
      err => {
        console.log(err);
      });
  }


  post() {
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Caso o formulário seja inválido, não vai enviar
    if(!this.adminForm.valid){
      return;
    }

    this.crudSrv.post('admins', this.adminForm.value).subscribe(
      res => {
        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.adminForm.reset();

      },
      err => {
        console.log(err);
        //this.responseSrv.handleErrorStatusCode(err.status, err.error, 1);
        //this.responseSrv.handleError(err, 1);
      });
  }

  update(id: number){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    this.crudSrv.update('admins', id, this.updateAdminForm.value).subscribe(
      res => {
        
        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.updateAdminForm.reset();
      },
      err => {
        this.responseSrv.handleErrorUpdate(err.error.errors, 1);
        //this.responseSrv.handleErrorStatusCode(err.status, err.error, 1);
      });
  }

  openModalDelete(id: number){
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.crudSrv.delete('admins', id).subscribe(
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

  alterarSenha(){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Caso o formulário seja inválido, não vai enviar
    if(!this.dataForm.valid){
      return;
    }

    this.sessionSrv.alterarSenha(this.dataForm.value).subscribe(
      res => {
        this.responseSrv.handleSuccess(res, 2);

        //Resetar o formulário
        this.dataForm.reset();
      },
      err => {
        console.log(err);
        //this.responseSrv.handleErrorStatusCode(err.status, err.error, 2);
      });
  }
}
