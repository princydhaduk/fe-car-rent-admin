import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgIf } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router, private toastr:ToastrService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    // console.log(this.form.value);
    const payload ={
      "email": this.form.value.email,
      "password": this.form.value.password,
    }
    this.settings.postAdminLogin(payload).subscribe((res:any) => {
      if(res && res.status === 200){
        localStorage.setItem('token', res?.token)
        this.router.navigate(['/dashboards/dashboard2']);
        this.toastr.success(res.message);
      }
      else{
        this.toastr.error(res.message);
      }
    })
  }
}
