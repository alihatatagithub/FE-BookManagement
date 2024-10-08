import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { DTOAddEmployee } from "../models/DTOAddEmployee";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { DTODepartmentListResponse } from "../models/DTODepartmentListResponse";
import { SortDirection } from "@angular/material/sort";
import { DTOEmployeeListResponse } from "../models/DTOEmployeeListResponse";

@Injectable({
    providedIn: 'root'
  })

export class EmployeeService {
    private readonly http: HttpClient = inject(HttpClient);
      EndPointBase: string = environment.apiBaseUrl;

    addEditUser(model: DTOAddEmployee) {
        const action = 'Employee/add-employee';
        return this.http.post<{ success: boolean }>(this.EndPointBase + action, model);
      }

      getDepartments()  {
        const action = 'Department/department-list';
        return this.http.get<DTODepartmentListResponse>(this.EndPointBase + action);
      }

      getEmployee(OrderName: string , direction: SortDirection, page: number = 0) {
        const action = this.EndPointBase +'Employee/employee-list';
        const requestUrl = `${action}?OrderName=${OrderName}&Direction=${direction}&PageNumber=${
          page + 1
        }`;
    
        return this.http.get<DTOEmployeeListResponse>(requestUrl);
      }

}