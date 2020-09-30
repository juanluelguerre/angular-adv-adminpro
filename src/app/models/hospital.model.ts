interface _HopitalUser{
    _id: string;
    nombre: string;
    img: string;

}

export class Hospital {
    constructor(
        public nombre: string,
        public _id?: string,        
        public usuario?: _HopitalUser,
        public img?: string,        
    ) {

    }
    
}