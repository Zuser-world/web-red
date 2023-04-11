import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorsService } from 'src/app/services/errors.service';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../services/database.service'
import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  createUser: FormGroup;
  dataUser: any = [];
  email: string = "";
  password: string = "";
  loading: boolean = false;
  ngOnInit(): void {}

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private authFire: AngularFireAuth,
    private errorEmail: ErrorsService,
    private toastr: ToastrService,
    private dataService: DatabaseService,
    private auth: AngularFireAuthModule, 
  ){
    this.createUser = this.fb.group({
      name: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.max(80)]],
      nickname: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatpassword: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  registerUser(){
    const name = this.createUser.value.name;
    const apellido = this.createUser.value.apellido;
    const edad = this.createUser.value.edad;
    const nickname = this.createUser.value.nickname;
    this.email = this.createUser.value.email;
    this.password = this.createUser.value.password;
    const repeatpassword = this.createUser.value.repeatpassword;
    console.log(`Usuario \n==> ${name}\nApellido\n==> ${apellido}\nEdad\n==> ${edad}\nNickName\n==> ${nickname}\nEmail\n==> ${this.email}\nRepeatPassword\n==> ${repeatpassword}`)
    this.dataUser  = {
      name: name,
      apellido:apellido,
      edad:edad,
      nickname:nickname,
      email:this.email,
      password: this.password,
      repeatpassword:repeatpassword,
      fechaCreacion: new Date()
    }
    this.loading = true;
    
    this.registerUserWithEmail()
  }
  async registerUserWithEmail(){
    this.authFire.createUserWithEmailAndPassword(this.email, this.password).then(
      () => {
      this.verificarCorreo();
    }).catch((error) => {
      // this.loading = false;
      console.log(error)
      this.toastr.error(this.errorEmail.firebaseError(error.code), "Error")
      this.loading = false;
    })
  }
  registerUserWithGoogle(){
    console.log("Registrandose")
    this.authFire.signInWithPopup( new GoogleAuthProvider()).then((data) => {
      this.toastr.success("Register with Google", "Success")
      this.router.navigate(['/login'])
      console.log(data)
    }).catch((error) => {
      console.log(error)
    })
  }
  registerUserWithGithub(){
    this.authFire.signInWithPopup( new GithubAuthProvider()).then((data) => {
      this.toastr.success("Register with Github", "Success")
      this.router.navigate(['/login'])
    }).catch((error) => {
      console.log(error)
      this.toastr.error("Ha ocurrido un error", "Error")
    })
  }
  saveData(){
    this.dataService.saveDataUserinDataBase(this.dataUser).then(() => {
      this.router.navigate(['/login'])
    }).catch((err) => {
      console.log(err.message)
      // this.loading = false
    })
  }
  verificarCorreo(){
    this.authFire.currentUser
    .then(user => user?.sendEmailVerification())
    .then(() => {
      this.toastr.info("Le enviamos un correo para la verificación", "Verificar Correo")
      this.saveData()
      this.router.navigate(['/login']);
    })
  }
}
