import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private firestore: AngularFirestore,
  ) { }
  saveDataUserinDataBase(newUser: any): Promise <any>{
    return this.firestore.collection('users').add(newUser);
  };
  getDataUserinDataBase(): Observable<any>{
    return this.firestore.collection('users', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }
  editEmpleado(id: string): Observable<any>{
    return this.firestore.collection('users').doc(id).snapshotChanges();
  }
  changeinfo(id: string, data: any): Promise<any>{
    return this.firestore.collection('users').doc(id).update(data);
  }
  eliminarEmpleado(id: any): Promise<any>{
    return this.firestore.collection('users').doc(id).delete();
  } 
}
