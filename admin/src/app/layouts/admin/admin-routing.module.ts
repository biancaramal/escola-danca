import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoletosComponent } from 'src/app/pages/boletos/boletos.component';
import { ConfiguracoesComponent } from 'src/app/pages/configuracoes/configuracoes.component';
import { ContatosComponent } from 'src/app/pages/contatos/contatos.component';
import { ImagensComponent } from 'src/app/pages/imagens/imagens.component';
import { ModalidadesComponent } from 'src/app/pages/modalidades/modalidades.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { VideosComponent } from 'src/app/pages/videos/videos.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../../_services/_auth/auth.service';

const routes: Routes = [
  {
    path: 'administrativo',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PerfilComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
      { path: 'modalidades', component: ModalidadesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'boletos', component: BoletosComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'imagens', component: ImagensComponent },
      { path: 'contatos', component: ContatosComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AdminRoutingModule { }
