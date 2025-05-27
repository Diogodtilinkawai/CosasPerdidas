import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonItem,IonCard,IonCardContent,IonLabel } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BaseService, Task } from '../base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cosas',
  templateUrl: './cosas.page.html',
  styleUrls: ['./cosas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonGrid, IonRow, IonCol, IonItem, IonCard,IonCardContent,IonLabel]
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
    this.eliminatedTasks$ = this.reviewService.getEliminatedTasks();
    console.log(this.eliminatedTasks$);
 
  }
  PrendaInput: string = "";
  ColorInput: string = "";
  TallaInput: string = "";
  PersonaInput: string = "";
  searchTalla: string = '';
  ImagenInput: string = "";
  items:any=[];
  tasks$: Observable<Task[]> = new Observable<Task[]>();
  searchColor: string = '';
  filteredTasks: Task[] = []
  removedTasks: Task[] = [];
  eliminatedTasks$: Observable<Task[]> = new Observable<Task[]>();

  async onSubmit() {
    if (this.PrendaInput && this.TallaInput && this.ColorInput && this.PersonaInput) {
      const newTask: Task = {
        Prenda: this.PrendaInput,
        Color: this.TallaInput,
        Talla: this.ColorInput,
        Persona: this.PersonaInput,
        Imagen: this.ImagenInput
      }
      await this.reviewService.addTask(newTask);
      this.PrendaInput = "";
      this.TallaInput = "";
      this.ColorInput = "";
      this.PersonaInput = "";
      this.ImagenInput = "";
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
    this.tasks$.subscribe(tasks => {
      const taskToRemove = tasks.find(task => task.id === id);
       this.reviewService.addEliminatedTask(taskToRemove!);
    this.reviewService.deleteTask(id);
    const alert = this.alertController.create({
      header: 'review fue borrada',
      message: 'Tu review se borro',
      buttons: ['OK'],
    });
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
        },
        {
          name: 'Imagen',
          type: 'text',
          placeholder: 'Link de la imagen',
          value: task.Imagen || ''
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
                Persona: data.Persona,
                Imagen: data.Imagen
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
  buscarPorFiltros() {
    console.log('Buscando por color:', this.searchColor);
    console.log('Buscando por talla:', this.searchTalla);
    
    this.tasks$.subscribe(tasks => {
      // Si hay texto en el campo de color
      if (this.searchColor.trim() && !this.searchTalla.trim()) {
        this.filteredTasks = tasks.filter(task =>
          task.Talla.toLowerCase().includes(this.searchColor.toLowerCase())
        );
      } 
      // Si hay texto en el campo de talla
      else if (!this.searchColor.trim() && this.searchTalla.trim()) {
        this.filteredTasks = tasks.filter(task =>
          task.Color.toLowerCase().includes(this.searchTalla.toLowerCase())
        );
      }
      // Si hay texto en ambos campos
      else if (this.searchColor.trim() && this.searchTalla.trim()) {
        this.filteredTasks = tasks.filter(task =>
          task.Talla.toLowerCase().includes(this.searchColor.toLowerCase()) &&
          task.Color.toLowerCase().includes(this.searchTalla.toLowerCase())
        );
      }
      // Si ambos campos están vacíos
      else {
        this.filteredTasks = tasks;
      }
      
      console.log('Tareas filtradas:', this.filteredTasks);
    });
  }
}

 