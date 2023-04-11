import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  editUser: FormGroup;
  empleados : any[] = [];
  createUserModal: FormGroup;
  userId: string = ''
  constructor (
    private router: Router,
    private toastr: ToastrService,
    private authFire: AngularFireAuth,
    private fb: FormBuilder,
    private db: DatabaseService,
  ){
    this.editUser = this.fb.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      email: ['', Validators.required],
      nickname: ['', Validators.required],  
    })
    this.createUserModal = this.fb.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      email: ['', Validators.required],
      nickname: ['', Validators.required],  
    })
  }

  ngOnInit(): void {
    this.getEmpleados()
    // this.api()
  }

  getEmpleados(){
    this.authFire.currentUser.then((user) => {})
    this.db.getDataUserinDataBase().subscribe(data => {
    data.forEach((a:any)=>{
      
      if (a.payload.doc.data().email === "juanmapipa4@gmail.com"){
        console.log(a.payload.doc.data())
        console.log(a.payload.doc.id)
      }
    })
    this.empleados = []
      data.forEach((elemet:any) => {
        // console.log(elemet.id)
        this.empleados.push({
          id: elemet.payload.doc.id,
          ...elemet.payload.doc.data()
        })
      })
    })
  }

  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
  }
  editarUsuario(id: string){
    this.userId = id
    console.log(id)
    console.log("Usuario Id: " + id)
    this.db.editEmpleado(id).subscribe((data: any) =>{
      console.log(data.payload.data()['name'])
      this.editUser.setValue({
        name: data.payload.data()['name'],
        apellido: data.payload.data()['apellido'],
        edad: data.payload.data()['edad'],
        nickname: data.payload.data()['nickname'],
        email: data.payload.data()['email'],
      })
      
    })
  }
  saveChanges(){
    console.log(this.userId)
    const name = this.editUser.value.name;
    const apellido = this.editUser.value.apellido;
    const edad = this.editUser.value.edad;
    const nickname = this.editUser.value.nickname;
    const email = this.editUser.value.email;

    const userChange: any = {
      name : name,
      apellido : apellido,
      edad : edad,
      nickname : nickname,
      email: email,
    }
      this.db.changeinfo(this.userId, userChange).then(() => {
      this.toastr.info("Usuario modificado con exito", "Modificado")
    })
  }

  deleteUser(id: any) {
    this.db.eliminarEmpleado(id).then(() => {
      this.toastr.success("Usuario Eliminado Con Exito", "Success!")
      
    }).catch(() => {
      this.toastr.error("Ha ocurrido un Error", "Error!")
    })
  }

  createUser(){
    const name = this.createUserModal.value.name;
    const apellido = this.createUserModal.value.apellido;
    const edad = this.createUserModal.value.edad;
    const nickname = this.createUserModal.value.nickname;
    const email = this.createUserModal.value.email;

    const userCreate: any = {
      name : name,
      apellido : apellido,
      edad : edad,
      nickname : nickname,
      email: email,
      fechaCreacion: new Date()
    }
    this.db.saveDataUserinDataBase(userCreate).then(() => {
      this.toastr.success("Usuario Creado con Exito", "Success!");
    }).catch(err => {console.log(err);});
  }

  api(){
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '7f88199890mshb3f7805f721a98dp1d605cjsnd6c07be7290e',
        'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
      }
    };
    
    fetch('https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/?ip=77.211.4.112', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }
  text($event: any) {
    console.log($event.target.value)
  }
}
