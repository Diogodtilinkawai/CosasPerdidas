import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
export interface Task {
  id?: string;
  Prenda : string;
  Color  : string;
  Talla  : string;
  Persona : string;
}


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private tasksCollection = collection(this.firestore, 'tasks');
  private eliminatedTasksCollection = collection(this.firestore, 'eliminatedTasks');

  constructor(private firestore: Firestore) { }

  getTasks(): Observable<Task[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<Task[]>;
  }
  getEliminatedTasks(): Observable<Task[]> {
    return collectionData(this.eliminatedTasksCollection, { idField: 'id' }) as Observable<Task[]>;
  }
  addTask(task: Task) {
    return addDoc(this.tasksCollection, task);
  }
  addEliminatedTask(task: Task) {
    return addDoc(this.eliminatedTasksCollection, task);
  }
  updateTask(id: string, data: Partial<Task>) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return updateDoc(taskDoc, data);
  }
  deleteTask(id: string) {
    const taskDoc = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDoc);
  }
}