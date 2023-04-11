import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, uploadBytes, getDownloadURL, listAll, deleteObject,  } from '@angular/fire/storage';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.css']
})
export class RemoveComponent implements OnInit {
  images: string[] = []; //
  existImg: boolean = false;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authFire: AngularFireAuth,

    private storage: Storage,
  ){}
  ngOnInit(): void {
    this.getImg()
  }

  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
  }
  deleteImg(url: any){
  
    console.log(url)
    // const imgRef = ref(this.storage, 'img/angular.svg');
    const imgRef = ref(this.storage, url);
    deleteObject(imgRef).then(() => {
      this.toastr.success("Imagen Borrada Con Exito", "Success!");
      this.getImg()
    })
    
  }
  getImg(){
    const imgRef = ref(this.storage, 'img');
    console.log("Referencia:")

    console.log(imgRef)
    this.images = [];
    listAll(imgRef).then((x) => {
      console.log("La parte de la x")
      console.log(x)

      for(let image of x.items){
        getDownloadURL(image).then((x) => {
          this.images.push(x)
          this.existImg = true
        })
      }
    }).catch((err) => {
      console.log(err)
    })
    console.log(this.images)
  }
}
