import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor( private authService: AuthService, private alertController: AlertController, private router: Router ) { }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      await this.authService.logine(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Login Success',
        message: 'Your have logged in successfully',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/home']); //Redirigir a home despues del registro
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'An error occured during login.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  //Funcion para validar el formto del correo
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email); // Retorna true si el correo es valido
  }

  //Funcion para navegacion
  onSignUp() {
    this.router.navigateByUrl('home');
  }

}