export class UserModel {
    id: string;
    email: string;
    nombre: string;
    apaterno: string;
    amaterno: string;
    carrera_id: number;
    rol: number;

    constructor(
      id: string,
      email: string,
      nombre: string,
      apaterno: string,
      amaterno: string,
      carrera_id: number,
      rol: number
    ) {
      this.id = id;
      this.email = email;
      this.nombre = nombre;
      this.apaterno = apaterno;
      this.amaterno = amaterno;
      this.carrera_id = carrera_id;
      this.rol = rol;
    }
  }
/* export class UserModel {
    id: string;
    email: string;
    nombre: string;
    apaterno: string;
    amaterno: string;
    carrera_id: number;
    rol: number;

    constructor(
      id: string,
      email: string,
      nombre: string,
      apaterno: string,
      amaterno: string,
      carrera_id: number,
      rol: number
    ) {
      this.id = id;
      this.email = email;
      this.nombre = nombre;
      this.apaterno = apaterno;
      this.amaterno = amaterno;
      this.carrera_id = carrera_id;
      this.rol = rol;
    }
  } */