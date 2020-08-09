import { Component } from '@angular/core';
import { Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter, map } from "rxjs/operators";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent {

  public titulo: string;
  public tituloSubs$: Subscription;

  constructor(private router: Router) {
    this.tituloSubs$ = this.getRoutArguments()
                          .subscribe( ({titulo})=> {
                            this.titulo = titulo;
                            document.title  = `Admin Pro - ${this.titulo}`;
                          });    
  }

  getRoutArguments() {
    return this.router.events
            .pipe(
              filter(ev => ev instanceof ActivationEnd),
              filter((ev: ActivationEnd) => ev.snapshot.firstChild == null),
              map((ev: ActivationEnd) => ev.snapshot.data)
            )

            // Option 1)
            // .subscribe(data => {
            //   this.titulo = data.titulo;
            //   document.title = `Admin Pro - ${this.titulo}`;
            // })

          // Opntion 2)
          // .subscribe( ({titulo})=> {
          //   this.titulo = titulo;
          //   document.title  = `Admin Pro - ${this.titulo}`;
          // });
  }
}
