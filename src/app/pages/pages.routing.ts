import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ProgressComponent } from './progress/progress.component';
// import { Grafica1Component } from './grafica1/grafica1.component';
// import { AccountSettingsComponent } from './account-settings/account-settings.component';
// import { PromesasComponent } from './promesas/promesas.component';
// import { RxjsComponent } from './rxjs/rxjs.component';
// import { PerfilComponent } from './perfil/perfil.component';

// import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
// import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
// import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
// import { MedicoComponent } from './mantenimientos/medicos/medico.component';
// import { BusquedaComponent } from './busqueda/busqueda.component';
// import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        // Lazy Load
        canLoad: [ AuthGuard ], // Load only when user has access.
        loadChildren: () => import ('./child-routes.module').then( m => m.ChildRoutesModule ) // Load dinamically as need them
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
