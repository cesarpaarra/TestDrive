import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  usuario: Usuario = { id: 0, nombre: '', contrasena: '', nif: '', email: '' };
  confirmarContrasena: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  register(): void {
    if (this.usuario.nombre === '') {
      alert('El nombre no puede estar vacío.');
    } else if (this.usuario.nif === '') {
      alert('El NIF no puede estar vacío.');
    } else if (this.usuario.email === '') {
      alert('El email no puede estar vacío.');
    } else if (this.usuario.contrasena === '') {
      alert('La contraseña no puede estar vacía.');
    } else if (this.usuario.contrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
    } else {
      if (this.usuarioService.register(this.usuario)) {
        alert('Usuario registrado con éxito');
        this.router.navigate(['login']);
      } else {
        alert('El usuario introducido ya existe.');
      }
    }
  }
}
