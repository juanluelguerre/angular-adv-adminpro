import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnDestroy {

  intervalSubs: Subscription;

  constructor() {

    // this.getObservable().pipe(
    //   retry(2) /* n: Número de reintentos. */
    // ).subscribe(
    //   value => console.log('Subs: ', value),
    //   error => console.error('Error', error),
    //   () => console.info('Obs Terminado') /* Observer completed !∫ */
    // );

    // this.getInterval().subscribe(
    //   value => console.log(value));

    // Simplified version of subscribe. Javascript send parameter value directly to console.log function
    // this.getInterval().subscribe(console.log);

    this.intervalSubs = this.getInterval().subscribe(console.log);
  }

  ngOnDestroy(): void {
    /* When navigate to others pages, unsubscribe lauch. Best Practice to avoid memory leeks, etc.... */
    this.intervalSubs.unsubscribe(); 
  }

  getInterval(): Observable<number> {
    return interval(100)
      .pipe(
        // take(10),
        map(v => v + 1), /*  Transform initial value. Also allow clean, parser and organize de retur as we need */
        filter(v => v % 2 == 0)

      );
  }

  getObservable(): Observable<number> {

    let i = -1;

    return new Observable<number>(observer => {

      const interval = setInterval(() => {

        i++;
        observer.next(i);

        // Demo to show how observer complete
        if (i === 4) {
          clearInterval(interval);
          observer.complete();
        }

        // Demo to show how observer error works
        if (i === 2) {
          i = 0;
          observer.error('Error: i = 2. ');
        }

      }, 1000);
    });
  }
}
