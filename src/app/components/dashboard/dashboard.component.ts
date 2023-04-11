import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GuardDashboardGuard } from 'src/app/guards/guard-dashboard.guard';
import { Storage, ref, uploadBytes, getDownloadURL, listAll, deleteObject,  } from '@angular/fire/storage';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  images: string[] = [];
  existImg: boolean = false;
  a: [name: string, url: string][] = [];
  emailUser: any = ''
  constructor(
    private authFire: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private state: GuardDashboardGuard,
    private storage: Storage,
    private db: DatabaseService
  ){}
  ngOnInit(): void {
    this.getImg()
  }
  UserUsing(){
    this.authFire.currentUser.then((data) => {
      data?.getIdToken().then((token)=> {
        console.log(token)
      })
    })
  }
  configure(){
    this.state.statePath = true
    this.router.navigate(['/configure'])
    console.log("Por que no salgo")
  }
  upload(){
    this.router.navigate(['/upload'])
  }
  remove(){
    this.router.navigate(['/remove'])
  }
  admin(){
    this.router.navigate(['/admin'])
  }
  logOut(){
    this.authFire.signOut()
    this.toastr.success("Hasta Luego", "Sucess") 
    this.router.navigate(['/login'])
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
        let nameImg = image.name
        getDownloadURL(image).then((x) => {
          let newImage: string | any = [ nameImg, x]
          this.a.push(newImage)
          this.images.push(x)
          this.existImg = true;
        })
      }
    }).catch((err) => {
      console.log(err)
    })
    console.log(this.images)
  }
  saveDatosAboutUsers(): void{
    this.authFire.authState.subscribe((data) => {
    this.emailUser = data?.email
    const usersSave: any = {
      name : data?.displayName,
      email: data?.email,
      nickname: data?.displayName,
      apellido: data?.displayName,
      fechaCreacion: new Date()
    }
    this.db.getDataUserinDataBase().subscribe(data => {
      data.forEach((dataUsers: any) => {
        if (dataUsers.payload.doc.data().email === this.emailUser){
          console.log("Este Usuario Ya Existe")
          return
        }
        else {
          this.save(usersSave)
          return
        }
      })
    })

    })

  }
  save(usersSave: any) {
    this.db.saveDataUserinDataBase(usersSave).then(() => {
      console.log("resgistrado")
  })
  }

}
