import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {
  id: string | null;
  empleados : any[] = [];
  uidUser: any= '';
  editUser: FormGroup;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authFire: AngularFireAuth,
    private aRoute: ActivatedRoute,
    private db: DatabaseService,
    private fb: FormBuilder,
  ){
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.editUser = this.fb.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      email: ['', Validators.required],
      nickname: ['', Validators.required],      
    })
  }

  ngOnInit(): void {
    this.getEmpleados()
    this.authFire.currentUser.then((data)=>{
      this.uidUser = data?.uid
      // console.log(data?.uid)
    })
    console.log("El Uid Guardado es ")
    console.log(this.uidUser)
    console.log(this.authFire.authState.subscribe((data)=>{
      // console.log(data?.delete())
      console.log(data?.email)
      console.log(data?.displayName)
      data?.providerData.forEach((data)=>{
        console.log(data?.email)
      })
    }))
  }
  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
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
  editarUsuario(id: string){
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
  saveChanges(id: string){
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
    this.db.changeinfo(id, userChange).then(() => {
      this.toastr.info("Usuario modificado con exito", "Modificado")
      this.router.navigate(['/configure']);
    })
  }
}
