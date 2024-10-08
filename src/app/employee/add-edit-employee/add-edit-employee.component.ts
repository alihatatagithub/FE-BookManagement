import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DTODepartmentListResponse } from '../../models/DTODepartmentListResponse';
import { EmployeeService } from '../../services/employee.service';
import { MatSelectModule } from '@angular/material/select';
import { DTOAddEmployee } from '../../models/DTOAddEmployee';
import { AppSignalRService } from '../../services/AppSignalRService';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, 
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.scss'
})
export class AddEditEmployeeComponent {
depts : DTODepartmentListResponse[] = [];
readonly employeeService = inject(EmployeeService);
form!: FormGroup;
selectedDepartmentId:number = 0 ;
model:DTOAddEmployee = {Email:'',DepartmentId:0,PhoneNumber : ''}


constructor(private formBuilder: FormBuilder,private signalRService:AppSignalRService ){

  this.employeeService.getDepartments().subscribe((a:any) => {
    this.depts = a;
    this.selectedDepartmentId = this.depts[0].Id;
  })
}

ngOnInit(): void {
  this.form = this.formBuilder.group({
    email: ["", [Validators.required,Validators.email]],
    phoneNumber: ["", [Validators.required]]
  });
  // this.signalRService.startConnection().subscribe(() => {
  //   this.signalRService.receive().subscribe((message) => {
  //     console.log('-----,', message) ;
  //   });
  // });
}
  addEmployee(){
    this.model.Email = this.form.controls['email'].value;
    this.model.PhoneNumber = this.form.controls['phoneNumber'].value;
    this.model.DepartmentId = this.selectedDepartmentId;
    this.employeeService.addEditUser(this.model).subscribe(a => {

      this.signalRService.addEmployeeNotifer("message");

      // console.log("Add ",a);
    })
  }
  selectDepartment(event: Event){
    this.selectedDepartmentId = (Number) ((event.target as HTMLSelectElement).value);
    // console.log(this.selectedDepartmentId);
  }
}
