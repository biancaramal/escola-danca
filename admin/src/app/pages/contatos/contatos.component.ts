import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Contato } from '../../_interfaces/interfaces.service';
import { ResponseService } from 'src/app/_config/response.service';
import { CrudService } from '../../_services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {
	//Formulário
  dataForm: FormGroup;
  placeholder: string = 'Selecione o tipo de contato para verificar a formatação correta de inserir os dados';

  //Controlar a exibição da view
  //1 - Contatos, 2 - Adicionar, 3 - Editar
  openViewAction: number = 1;

  //Dados
  data: any;
  dataGetByID: any;

  //Table
  dataSource: MatTableDataSource<Contato>;
  displayed = ['nome', 'tipo', 'valor', 'acoes'];
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
      type: ['', Validators.required],
      value: ['', Validators.required],
    });
  }
  ;
 
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
    }
  }
  
  get() {
    this.crudSrv.get('contatos').subscribe(
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
    this.crudSrv.getByID('contatos', id).subscribe(
      res => {
        this.dataGetByID = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  placeholderSelect(value: string){
    if(value === ''){
      this.placeholder = 'Selecione o tipo de contato para verificar a formatação correta de inserir os dados';
      return;
    }

    if(value === 'whatsapp' || value === 'celular'){
      this.placeholder = '13991712584';
      return;
    }

    if(value === 'telefone'){
      this.placeholder = '1333289652';
      return;
    }

    if(value === 'email'){
      this.placeholder = 'exemplo@gmail.com';
      return;
    }

    if(value === 'local'){
      this.placeholder = '-23.9663515, -46.3814979';
      return;
    }
  }

  post(){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Caso o formulário seja inválido, não vai enviar
    if(!this.dataForm.valid){
      return;
    }

    this.crudSrv.post('contatos', this.dataForm.value).subscribe(
      res => {
        console.log(res);

        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.dataForm.reset();

        this.placeholderSelect('');

      },
      err => {
        console.log(err);
        this.responseSrv.handleError(err, 1);
      }
    );
  }

  update(id: number){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    this.crudSrv.update('contatos', id, this.dataForm.value).subscribe(
      res => {

        this.responseSrv.handleSuccess(res, 2);

        //Resetar o formulário
        this.dataForm.reset();
      },
      err => {
        console.log(err);
        this.responseSrv.handleError(err, 2);
      }
    );
  }

  openModalDelete(id: number){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.crudSrv.delete('contatos', id).subscribe(
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
