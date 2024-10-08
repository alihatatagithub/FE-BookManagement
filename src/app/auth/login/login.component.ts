import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
import { RegisterDTO } from '../../models/RegisterDTO';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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

  public login = () => {
    this.model.email = this.form.controls['email'].value;
    this.model.password = this.form.controls['password'].value

    this.http.post("https://localhost:7022/Account/login",this.model

    ).subscribe((response : any )=>  {
        console.log(response.AccessToken)
        localStorage.setItem("accessToken", response.AccessToken);
        localStorage.setItem("refreshToken", response.RefreshToken);
        this.router.navigate(["/employee"]);
    });
  }
  register(){
    return this.router.navigate(['/register']);
  }
}
