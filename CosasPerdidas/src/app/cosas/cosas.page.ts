import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonItem } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BaseService, Task } from '../base.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cosas',
  templateUrl: './cosas.page.html',
  styleUrls: ['./cosas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonGrid, IonRow, IonCol, IonItem]
})
export class CosasPage implements OnInit {
  constructor(
    private alertController: AlertController,
    public reviewService: BaseService,
    private router: Router,
    private authService: AuthService,

  ) { }

  ngOnInit() {
    this.tasks$ = this.reviewService.getTasks();
    console.log(this.tasks$);
  }
  PrendaInput: string = "";
  ColorInput: string = "";
  TallaInput: string = "";
  PersonaInput: string = "";
  items:any=[];
  tasks$: Observable<Task[]> = new Observable<Task[]>();

  async onSubmit() {
    if (this.PrendaInput && this.TallaInput && this.ColorInput && this.PersonaInput) {
      const newTask: Task = {
        Prenda: this.PrendaInput,
        Color: this.TallaInput,
        Talla: this.ColorInput,
        Persona: this.PersonaInput
      }
      await this.reviewService.addTask(newTask);
      this.PrendaInput = "";
      this.TallaInput = "";
      this.ColorInput = "";
      this.PersonaInput = "";
      const alert = await this.alertController.create({
        header: 'Review agregada',
        message: 'Tu review se agrego',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'ERROR',
        message: 'Tu review no se pudo agregar',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  borrar(id: string) {
    this.reviewService.deleteTask(id);
    const alert = this.alertController.create({
      header: 'review fue borrada',
      message: 'Tu review se borro',
      buttons: ['OK'],
    });
  }

  async Editar(id: string, task: Task) {
    const alert = await this.alertController.create({
      header: 'Editar Review',
      inputs: [
        {
          name: 'Prenda',
          type: 'text',
          placeholder: 'Prenda',
          value: task.Prenda
        },
        {
          name: 'Color',
          type: 'text',
          placeholder: 'Color',
          value: task.Color
        },
        {
          name: 'Talla',
          type: 'text',
          placeholder: 'Talla',
          value: task.Talla
        },
        {
          name: 'Persona',
          type: 'text',
          placeholder: 'Quien lo encontro',
          value: task.Persona
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.Prenda && data.Color && data.Talla && data.Persona) {
              const updatedTask: Partial<Task> = {
                Prenda: data.Prenda,
                Color: data.Color,
                Talla: data.Talla,
                Persona: data.Persona
              };
              this.reviewService.updateTask(id, updatedTask);
              this.showAlert('Review actualizada', 'La review ha sido actualizada correctamente.');
            } else {
              this.showAlert('Error', 'Todos los campos son obligatorios.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  onSignUp() {
    this.authService.logout();
    this.router.navigateByUrl("sign");
  }
  public stringToNumber(value: string): number {
    return parseFloat(value);
  }
} 