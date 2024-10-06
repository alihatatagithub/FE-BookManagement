import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDTO } from '../../models/RegisterDTO';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public invalidLogin: boolean = false;
  form!: FormGroup;
    model:RegisterDTO = {email : '',password: ''};

  constructor(private router: Router, private http: HttpClient,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required,Validators.email]],
      password: ["", [Validators.required,Validators.maxLength(1000)]]
    });
  }

  public register = () => {
    this.model.email = this.form.controls['email'].value;
    this.model.password = this.form.controls['password'].value
    
    this.http.post("https://localhost:7022/Account/register",this.model

    ).subscribe((response : any )=>  {
        console.log(response.AccessToken)
        localStorage.setItem("accessToken", response.AccessToken);
        localStorage.setItem("refreshToken", response.RefreshToken);
        this.router.navigate(["/book"]);
    });
  }
  login(){
    return this.router.navigate(['']);
  }

}
