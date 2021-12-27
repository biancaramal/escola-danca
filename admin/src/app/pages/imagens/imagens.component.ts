import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Imagem } from '../../_interfaces/interfaces.service';
import { ResponseService } from 'src/app/_config/response.service';
import { CrudService } from '../../_services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-imagens',
  templateUrl: './imagens.component.html',
  styleUrls: ['./imagens.component.css']
})
export class ImagensComponent implements OnInit {
	//Formulário
  dataForm: FormGroup;
  updateForm: FormGroup;

  //Controlar a exibição da view
  //1 - Imagens, 2 - Adicionar, 3 - Editar
  openViewAction: number = 1;

  //Dados
  data: any;
  file: any;
  dataGetByID: any;

  //Table
  dataSource: MatTableDataSource<Imagem>;
  displayed = ['nome', 'path', 'acoes'];
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
      path: ['', Validators.required],
    });

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    // //Se estiver na view de exibir, carregar admins
    if(this.openViewAction === 1){
      this.get();
    }
  }

  //Controle de views
  openView(view: number, id: any) {
    this.openViewAction = view;

    if(view === 3 && id != null){
      this.getByID(id);
      this.openViewAction = view;
    }

    if(view === 1){
      this.get();
      this.dataForm.reset();
      this.updateForm.reset();
    }
  }

  get() {
    this.crudSrv.get('imagens').subscribe(
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
    this.crudSrv.getByID('imagens', id).subscribe(
      res => {
        this.dataGetByID = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  fileSelected(e: any){
    if(e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        //para b64
        this.file = event.target.result;

        //para Blob
        //this.file = this.b64ToBlob(event.target.result);
      }
    }
  }

  b64ToBlob(base64: string) {
    var byteString = atob(base64.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  post(){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    //Caso o formulário seja inválido, não vai enviar
    if(!this.dataForm.valid){
      return;
    }

    this.dataForm.value.path = this.file;

    this.crudSrv.postImage(this.dataForm.value).subscribe(
      res => {

        this.responseSrv.handleSuccess(res, 1);

        //Resetar o formulário
        this.dataForm.reset();
        this.file = [];
      },
      err => {
        this.responseSrv.handleErrorStatusCode(err.status, err.error, 1);
      });
  }

  update(id: number){
    //Reseta os erros até o momento
    this.responseSrv.alertResponse = [];

    this.crudSrv.update('imagens', id, this.updateForm.value).subscribe(
      res => {
        this.responseSrv.handleSuccess(res, 2);

        //Resetar o formulário
        this.updateForm.reset();
      },
      err => {
        //this.responseSrv.handleError(err, 2);
        this.responseSrv.handleErrorStatusCode(err.status, err.error, 2);
      });
  }

  openModalDelete(id: number){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.crudSrv.delete('imagens', id).subscribe(
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
