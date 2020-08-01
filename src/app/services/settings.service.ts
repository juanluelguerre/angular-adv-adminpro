import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // theme id must be unique inside index.html
  public linkTheme = document.querySelector('#theme');

  constructor() {
    var url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
    this.linkTheme.setAttribute('href', url);
  }

  checkCurrentTheme() {
    // Cada vez que se haga este cambios se hace un salto al DOM. 
    // Pero nos permite tener un servicio y componente mucho mas limpio.
    // Un saolución podría ser, recibir como parámetro el listado de links recuperados del DOM desde los componentes y así se evitan.
    //       Al ser poco elementos, podemos evitar esta complejidad.
    const links = document.querySelectorAll('.selector');

    links.forEach(e => {
      e.classList.remove('working');
      const btnTheme = e.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`
      const currentTheme = this.linkTheme.getAttribute('href');
      if (btnThemeUrl === currentTheme) {
        e.classList.add('working');
      }
    })
  }

  changeTheme(theme: string) {

    const url = `./assets/css/colors/${theme}.css`;

    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
  }

}
