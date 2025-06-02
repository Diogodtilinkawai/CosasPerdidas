import { CommonModule } from '@angular/common';
import {
  IonicModule,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class CosasPage implements OnInit {
  PrendaInput = '';
  ColorInput = '';
  TallaInput = '';
  PersonaInput = '';
  ImagenInput = '';
  selectedImageFile: File | null = null;

  tasks$: Observable<Task[]> = new Observable<Task[]>();
  eliminatedTasks$: Observable<Task[]> = new Observable<Task[]>();
  filteredTasks: Task[] = [];
  searchColor = '';
  searchTalla = '';

  constructor(
    private alertController: AlertController,
    public reviewService: BaseService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.tasks$ = this.reviewService.getTasks();
    this.eliminatedTasks$ = this.reviewService.getEliminatedTasks();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.ImagenInput = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  async onSubmit() {
    if (this.PrendaInput && this.TallaInput && this.ColorInput && this.PersonaInput) {
      const newTask: Task = {
        Prenda: this.PrendaInput,
        Color: this.TallaInput,
        Talla: this.ColorInput,
        Persona: this.PersonaInput,
        Imagen: this.ImagenInput
      };
      await this.reviewService.addTask(newTask);
      this.PrendaInput = '';
      this.TallaInput = '';
      this.ColorInput = '';
      this.PersonaInput = '';
      this.ImagenInput = '';
      this.selectedImageFile = null;
      const alert = await this.alertController.create({
        header: 'Review agregada',
        message: 'Tu review se agregó',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'ERROR',
        message: 'Completa todos los campos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async borrar(id: string) {
    this.tasks$.subscribe(tasks => {
      const taskToRemove = tasks.find(task => task.id === id);
      if (taskToRemove) {
        this.reviewService.addEliminatedTask(taskToRemove);
        this.reviewService.deleteTask(id);
        this.showAlert('Review borrada', 'Tu review se borró');
      }
    });
  }

  async Editar(id: string, task: Task) {
    const alert = await this.alertController.create({
      header: 'Editar Review',
      inputs: [
        { name: 'Prenda', type: 'text', placeholder: 'Prenda', value: task.Prenda },
        { name: 'Color', type: 'text', placeholder: 'Color', value: task.Color },
        { name: 'Talla', type: 'text', placeholder: 'Talla', value: task.Talla },
        { name: 'Persona', type: 'text', placeholder: 'Quien lo encontró', value: task.Persona },
        { name: 'Imagen', type: 'text', placeholder: 'Imagen (base64)', value: task.Imagen || '' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
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
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  onSignUp() {
    this.authService.logout();
    this.router.navigateByUrl("sign");
  }

  buscarPorFiltros() {
    this.tasks$.subscribe(tasks => {
      if (this.searchColor.trim() && !this.searchTalla.trim()) {
        this.filteredTasks = tasks.filter(task => task.Talla.toLowerCase().includes(this.searchColor.toLowerCase()));
      } else if (!this.searchColor.trim() && this.searchTalla.trim()) {
        this.filteredTasks = tasks.filter(task => task.Color.toLowerCase().includes(this.searchTalla.toLowerCase()));
      } else if (this.searchColor.trim() && this.searchTalla.trim()) {
        this.filteredTasks = tasks.filter(task =>
          task.Talla.toLowerCase().includes(this.searchColor.toLowerCase()) &&
          task.Color.toLowerCase().includes(this.searchTalla.toLowerCase())
        );
      } else {
        this.filteredTasks = tasks;
      }
    });
  }
}

