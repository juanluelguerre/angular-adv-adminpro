import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    //   const promesa = new Promise((resolve, reject) => {
    //     if (true) {
    //       resolve('Hello wolrd'); 
    //     }else {
    //       reject('Something was wronng');
    //     }      
    //   }).then((mensaje) => {
    //     console.log(mensaje);
    //   }).catch(err =>{
    //     console.log(err)  ;
    //   });

    //   console.log('Fin init !');
    // }

    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    });

  }

  getUsuarios() {

   return new Promise(resolve => {
      fetch('https://reqres.in/api/users?page=2')
        .then(resp => resp.json()
          .then(body => resolve(body.data))
        )
    });
  }


}
