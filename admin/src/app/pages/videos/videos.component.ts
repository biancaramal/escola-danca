import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Modalidade } from '../../_interfaces/interfaces.service';
import { ResponseService } from 'src/app/_config/response.service';
import { CrudService } from '../../_services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
	 //Formulário
  dataForm: FormGroup;

  //Controlar a exibição da view
  //1 - Videos, 2 - Adicionar, 3 - Editar
  openViewAction: number = 1;

  //Dados
  data: any;
  dataGetByID: any;

  //Table
  dataSource: MatTableDataSource<Modalidade>;
  displayed = ['nome', 'url', 'acoes'];
  pageSizeOptions = [5, 10];

  //Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public responseSrv: ResponseService,
    private crudSrv: CrudService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
  ) {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
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
    }
  }

  get() {
    this.crudSrv.get('videos').subscribe(
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
    this.crudSrv.getByID('videos', id).subscribe(
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

    this.crudSrv.post('videos', this.dataForm.value).subscribe(
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

    this.crudSrv.update('videos', id, this.dataForm.value).subscribe(
      res => {
        console.log(res);

        this.responseSrv.handleSuccess(res, 2);

        //Resetar o formulário
        this.dataForm.reset();
      },
      err => {
        this.responseSrv.handleErrorStatusCode(err.status, err.error, 2);
      }
    );
  }

  openModalDelete(id: number){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.crudSrv.delete('videos', id).subscribe(
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
