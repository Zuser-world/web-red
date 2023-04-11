import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, uploadBytes, getDownloadURL, listAll, deleteObject,  } from '@angular/fire/storage';
import { GuardDashboardGuard } from 'src/app/guards/guard-dashboard.guard';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  images: any [] = [];
  existImg: boolean = false;
  file_data: any;
  imgRef: any;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authFire: AngularFireAuth, 
    private storage: Storage,
    private guard: GuardDashboardGuard,
  ){}

  ngOnInit(): void {
  }

  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
  }
  statusImg($event: any){
    console.log($event)
    this.file_data= $event.target.files[0]
    console.log(this.file_data['name'].split('.')[1])
    if (this.file_data['name'].split('.')[1] === 'png' || this.file_data['name'].split('.')[1] === 'jpg' || this.file_data['name'].split('.')[1] === 'jpeg' || this.file_data['name'].split('.')[1] === 'svg'){
      console.log("Es una imagen")
    }
    else {
      this.toastr.error("Archivo no permitido", "Error")
      this.file_data = null
    }
    this.imgRef = ref(this.storage, `img/${this.file_data.name}`);
  }
  statusDocument($event: any){
    console.log($event)
    this.file_data= $event.target.files[0]
    console.log(this.file_data['name'].split('.')[1])
    if (this.file_data['name'].split('.')[1] === 'pdf' || this.file_data['name'].split('.')[1] === 'txt'){
      console.log("Es una documento")
    }
    else {
      this.toastr.error("Archivo no permitido", "Error")
      this.file_data = null
    }
    this.imgRef = ref(this.storage, `document/${this.file_data.name}`);
  }
  statusAudio($event: any){
    console.log($event)
    this.file_data= $event.target.files[0]
    console.log(this.file_data['name'].split('.')[1])
    if (this.file_data['name'].split('.')[1] === 'ogg' || this.file_data['name'].split('.')[1] === 'wav' || this.file_data['name'].split('.')[1] === 'mp3'){
      console.log("Es una audio")
    }
    else {
      this.toastr.error("Archivo no permitido", "Error")
      this.file_data = null
    }
    this.imgRef = ref(this.storage, `audio/${this.file_data.name}`);
  }
  uploadImg(){
    if (this.file_data){
      uploadBytes(this.imgRef, this.file_data).then((x) => {
        console.log("Subiendo Imagen")
        this.toastr.success("Imagen Subida con Exito", "Success")
        console.log(x)
        this.guard.statePath = true
        this.router.navigate(['/dashboard'])
      }).catch((err) => {
        console.log(err)
        this.toastr.error("Error")
      })
    }
    else {
      this.toastr.error("No hay archivo","Error")
    }
  }
  uploadDocument(){
    if (this.file_data){
      uploadBytes(this.imgRef, this.file_data).then((x) => {
        console.log("Subiendo Documento")
        this.toastr.success("Documento Subido con Exito", "Success")
        console.log(x)
        this.guard.statePath = true
        this.router.navigate(['/dashboard'])
      }).catch((err) => {
        console.log(err)
        this.toastr.error("Error")
      })
    } else {
      this.toastr.error("No hay archivo","Error")
    }
  }
  uploadAudio(){
    if (this.file_data){
      uploadBytes(this.imgRef, this.file_data).then((x) => {
        console.log("Subiendo Audio")
        this.toastr.success("Audio Subido con Exito", "Success")
        console.log(x)
        this.guard.statePath = true
        this.router.navigate(['/dashboard'])
      }).catch((err) => {
        console.log(err)
        this.toastr.error("Error")
      })
    } else {
        this.toastr.error("No hay archivo","Error")
    }
  }
}
