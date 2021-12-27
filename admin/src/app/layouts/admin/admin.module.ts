import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { ConfiguracoesComponent } from 'src/app/pages/configuracoes/configuracoes.component';
import { ModalidadesComponent } from 'src/app/pages/modalidades/modalidades.component';
import { ContatosComponent } from 'src/app/pages/contatos/contatos.component';
import { BoletosComponent } from 'src/app/pages/boletos/boletos.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { VideosComponent } from 'src/app/pages/videos/videos.component';
import { ImagensComponent } from 'src/app/pages/imagens/imagens.component';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    PerfilComponent,
    ConfiguracoesComponent,
    ModalidadesComponent,
    ContatosComponent,
    BoletosComponent,
    UsuariosComponent,
    VideosComponent,
    ImagensComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot()
  ],
  providers: [],
})
export class AdminModule { }
