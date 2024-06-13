import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nif: string = '';
  contrasena: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  login(): void {
    if (this.usuarioService.login(this.nif, this.contrasena)) {
      this.router.navigate(['/tests']);
    } else {
      alert('NIF o contraseña incorrectos');
    }
  }
}
