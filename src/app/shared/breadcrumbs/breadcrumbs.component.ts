import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { filter, map } from "rxjs/operators";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string;
  public tituloSubs$: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {

    // Alternative to get title from route, but, it's necesary to subscrive events, in other wise title is all time the same.
    // console.log(route.snapshot.children[0].data);

    this.tituloSubs$ = this.getRoutArguments()
                          .subscribe( ({titulo})=> {
                            this.titulo = titulo;
                            document.title  = `Admin Pro - ${this.titulo}`;
                          });    
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
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
