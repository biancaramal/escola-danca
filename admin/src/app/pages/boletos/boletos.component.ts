import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Boleto } from '../../_interfaces/interfaces.service';
import { ResponseService } from 'src/app/_config/response.service';
import { CrudService } from '../../_services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-boletos',
  templateUrl: './boletos.component.html',
  styleUrls: ['./boletos.component.css']
})
export class BoletosComponent implements OnInit {
	//Formulário
  dataForm: FormGroup;
  updateForm: FormGroup;

  //Controlar a exibição da view
  //1 - Boletos, 2 - Adicionar, 3 - Editar
  openViewAction: number = 1;

  //Dados
  data: any;
  dataGetByID: any;
  users: any;
  modalidades: any;

  //Table
  dataSource: MatTableDataSource<Boleto>;
  displayed = ['referencia', 'cod', 'modalidade', 'usuario', 'status', 'acoes'];
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
      reference: ['', Validators.required],
      status: ['', Validators.required],
      cod: ['', Validators.required],
      modalidade_id: ['', Validators.required],
      user_id: ['', Validators.required],
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
      this.getUsers();
      this.getModalidades();
    }

    if(view === 2) {
    	this.getUsers();
    	this.getModalidades();
    }

    if(view === 1){
      this.get();
      this.dataForm.reset();
    }
  }
  
  get() {
    this.crudSrv.get('boletos').subscribe(
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

  getUsers() {
  	this.crudSrv.get('users').subscribe(
    res => {
      this.users = res;
    },
    err => {
      this.responseSrv.handleErrorStatusCode(err.status, err.error, 0);
    });
  }

  getModalidades() {
  	this.crudSrv.get('modalidades').subscribe(
    res => {
      this.modalidades = res;
    },
    err => {
      this.responseSrv.handleErrorStatusCode(err.status, err.error, 0);
    });
  }

  getByID(id: number){
    this.crudSrv.getByID('boletos', id).subscribe(
      res => {
        this.dataGetByID = res;
        console.log(this.dataGetByID);
        console.log(this.dataGetByID.reference);
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

    this.crudSrv.post('boletos', this.dataForm.value).subscribe(
      res => {
        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.dataForm.reset();

      },
      err => {
        console.log(err);
    		this.responseSrv.handleErrorStatusCode(err.status, err.error, 1);
        //this.responseSrv.handleError(err, 1);
      });
  }

  update(id: number){

    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    this.crudSrv.update('boletos', id, this.dataForm.value).subscribe(
      res => {

        this.responseSrv.handleSuccess(res, 2);

        //Resetar o formulário
        this.dataForm.reset();
      },
      err => {
        console.log(err);
        this.responseSrv.handleError(err, 2);
      });
  }

  openModalDelete(id: number){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.crudSrv.delete('boletos', id).subscribe(
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
