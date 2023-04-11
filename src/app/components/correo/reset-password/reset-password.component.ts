import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from 'src/app/services/errors.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  loading: boolean = false;
  resetPassword: FormGroup;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private fb: FormBuilder,
    private error: ErrorsService,
    private toastr: ToastrService,
  ){
    this.resetPassword = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }
  reset(){
    const email = this.resetPassword.value.email
    this.loading = true;
    this.afauth.sendPasswordResetEmail(email).then(() => {
      this.toastr.success("Correo enviado con exito", "Success")
      this.router.navigate(['/login']);
    }).catch((error) => {
      this.loading = false;
      console.log(error)
      alert(this.error.firebaseError(error.code))
    })
  }
}
