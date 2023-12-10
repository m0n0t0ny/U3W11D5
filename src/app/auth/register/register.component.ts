import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }
  onSubmit() {
    console.log(this.registerForm);
    try {
      this.authSrv.register(this.registerForm.value).subscribe();
    } catch (error: any) {
      console.log(error);
      alert(error);
      this.router.navigate(['/register']);
    }
  }
}
