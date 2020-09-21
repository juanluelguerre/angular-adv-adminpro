import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private fb: FormBuilder,
    private usuarioServie: UsuarioService,
    private router: Router,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {

    this.usuarioServie.login(this.loginForm.value)
      .subscribe(resp => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        // console.log(`User logged successfully`);
        // console.log(resp);

        // Navigate to Dashboard
        this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  // onSuccess(googleUser) {
  //   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  //   var id_token = googleUser.getAuthResponse().id_token;
  //   console.log(id_token);
  // }

  // onFailure(error) {
  //   console.log(error);
  // }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      // 'onsuccess': this.onSuccess,
      // 'onfailure': this.onFailure
    });

    this.startApp();

  }

  async startApp () {

    await this.usuarioServie.googleInit();
    this.auth2 = this.usuarioServie.auth2;

    this.attachSignin(document.getElementById('my-signin2'));

  };

  attachSignin(element) {

    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        //console.log(id_token);
        this.usuarioServie.loginGoogle(id_token)
          .subscribe( resp => {            
            this.ngZone.run(() => {
              // Navigate to Dashboard
              this.router.navigateByUrl('/');
            })
          });

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
