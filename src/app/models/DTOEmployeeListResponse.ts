export interface DTOEmployeeListResponse {
    EmployeeList: DTOEmployeeList[];
    Count: number;
  }
  
  export interface DTOEmployeeList {
    Id: string;
    Email: string;
    PhoneNumber: string;
    Department: number;
    DateOfJoining: Date;
  }