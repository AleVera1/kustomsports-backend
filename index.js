class Usuario {
  constructor(nombre, apellido, libros = [], mascotas = []) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.libros = libros;
      this.mascotas = mascotas;
  }
  getFullName() {
      return `${this.nombre} ${this.apellido}`;
  }
  addMascota(mascota) {
      this.mascotas.push(mascota);
  }
  countMascotas() {
      return `${this.mascotas.length}`;
  }
  addBook(nombre, autor) {
      this.libros.push({
        nombre: nombre,
        autor: autor
      });
  }
  getBookNames() {
      return this.libros.map(libro => libro.nombre);
  }
}

const usuario = new Usuario("Alejandro", "Vera")

usuario.addBook([{libro: "El Señor De Los Anillos", autor: "Autor"}])
usuario.addMascota([{mascota: "perro", nombre: "daisy"}])

console.log(usuario.getBookNames())
console.log(usuario.countMascotas())
console.log(usuario.getFullName())