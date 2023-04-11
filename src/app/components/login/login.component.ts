import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from 'src/app/services/errors.service';
import { GoogleAuthProvider, GithubAuthProvider,getAuth, signInWithPopup, getRedirectResult } from 'firebase/auth';
import { GuardDashboardGuard } from 'src/app/guards/guard-dashboard.guard';
import { DatabaseService } from 'src/app/services/database.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser: FormGroup;
  loading: boolean =false;
  emailUser : any = "";
  ngOnInit(): void {}
  random :number = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
  constructor (
    private AngularFirestore: AngularFirestore,
    private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    private errorService: ErrorsService,
    private toastr : ToastrService,
    private guard: GuardDashboardGuard,
    private db: DatabaseService,
  ){
    this.loginUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  UserLogin(){
    const email = this.loginUser.value.email
    const password = this.loginUser.value.password
    console.log(`Login del Usuario\n
    ${email}\nPassword:\n${password}`)
    this.loading = true;
    
    this.afAuth.signInWithEmailAndPassword(email, password).then((user) => {
      console.log(user)
      if (user.user?.emailVerified){
        this.guard.statePath = true
        this.router.navigate(['/dashboard']);
      } else {
        console.log("Error")
        this.router.navigate(['/verficar-correo']);
      }
    }).catch((error) => {
      this.loading = false;
      console.log(error)
      this.toastr.error(this.errorService.firebaseError(error.code), "Error")
    })
  }
  loginGoogle(){
    console.log("Login with Google...")
    const provider = new GoogleAuthProvider()
    const auth = getAuth();
    auth.languageCode = 'es';
    signInWithPopup(auth, provider).then((result) => {
      console.log(result)
      const credentials = GoogleAuthProvider.credentialFromResult( result );
      const token  = credentials?.accessToken;
      console.log("Lo del token")
      console.log(credentials)
      console.log(token)
      this.router.navigate(['/dashboard']);
      this.saveDatosAboutUsers()

    }).catch((error) => {
      // Handle Errors here.
      this.toastr.error(this.errorService.firebaseError(error.code), "Error")
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)});

    // this.afAuth.signInWithPopup( new GoogleAuthProvider()).then((data) => {
    //   this.toastr.success("Login with Google", "Success")
      
    // }).catch((error) => {
    //   console.log(error)
    //   this.toastr.error("Ha ocurrido un error", "Error")
    // })

  }
  loginGithub(){
    console.log("Login with Github...")
    this.afAuth.signInWithPopup( new GithubAuthProvider()).then((data) => {
      this.toastr.success("Login with Github", "Success")
      this.router.navigate(['/dashboard']);
      this.saveDatosAboutUsers()
    }).catch((error) => {
      console.log(error)
      this.toastr.error(this.errorService.firebaseError(error.code), "Error")
    })
  }
  saveDatosAboutUsers(): void{
    this.afAuth.authState.pipe(take(1)).subscribe((data) => {
    this.emailUser = data?.email
    const usersSave: any = {
      name : data?.displayName,
      email: data?.email,
      nickname: data?.displayName,
      apellido: data?.displayName,
      edad: this.random,
      fechaCreacion: new Date()
    }
    this.saveUserData(usersSave)

    })

  }
  save(usersSave: any) {
    this.db.saveDataUserinDataBase(usersSave).then(() => {
      console.log("resgistrado")
  })
  }

  saveUserData(usersSave: any){
    this.db.getDataUserinDataBase().pipe(take(1)).subscribe(data => {
      let userExists = false;
      data.forEach((dataUsers: any) => {
        if (dataUsers.payload.doc.data().email === this.emailUser){
          userExists = true;
          console.log("Ya Existe")
        }
      })
      if (!userExists) {
        this.db.saveDataUserinDataBase(usersSave);
        console.log("Registrado ahora")

      }})
  }
}
