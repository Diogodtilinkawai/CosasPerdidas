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

  }
  TituloInput: string = "";
  autorInput: string = "";
  opinionInput: string = "";
  calificacionInput: string = "";
  tasks$: Observable<Task[]> = new Observable<Task[]>();

  async onSubmit() {
    if (this.TituloInput && this.autorInput && this.opinionInput && this.calificacionInput) {
      const newTask: Task = {
        Titulo: this.TituloInput,
        autor: this.autorInput,
        opinion: this.opinionInput,
        calificacion: this.calificacionInput
      }
      await this.reviewService.addTask(newTask);
      this.TituloInput = "";
      this.autorInput = "";
      this.opinionInput = "";
      this.calificacionInput = "";
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
          name: 'Titulo',
          type: 'text',
          placeholder: 'Titulo',
          value: task.Titulo
        },
        {
          name: 'autor',
          type: 'text',
          placeholder: 'Autor',
          value: task.autor
        },
        {
          name: 'opinion',
          type: 'text',
          placeholder: 'Opinion',
          value: task.opinion
        },
        {
          name: 'calificacion',
          type: 'number',
          placeholder: 'Calificacion',
          value: task.calificacion
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
            if (data.Titulo && data.autor && data.opinion && data.calificacion) {
              const updatedTask: Partial<Task> = {
                Titulo: data.Titulo,
                autor: data.autor,
                opinion: data.opinion,
                calificacion: data.calificacion
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
  getCalificacionClass(calificacion: number): string {
    if (calificacion < 3) {
      return 'calificacion-baja';
    } else if (calificacion >= 3 && calificacion < 7) {
      return 'calificacion-media';
    } else {
      return 'calificacion-alta';
    }
  }
  public stringToNumber(value: string): number {
    return parseFloat(value);
  }
} 