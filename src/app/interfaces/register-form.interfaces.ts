import { EmailValidator } from "@angular/forms";

export interface RegisterForm {
    nombre: string,
    email: string,
    password: string,
    passwor2: string,
    terminos: boolean
}