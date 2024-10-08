import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe, NgIf} from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { AppSignalRService } from '../../services/AppSignalRService';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe,NgIf,MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private _signalRService = inject(AppSignalRService);
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['Email', 'PhoneNumber', 'Department','DateOfJoining'];
  exampleDatabase!: ExampleHttpDatabase | null;
  data: DTOEmployeeList[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this._signalRService.startConnection().subscribe(() => {
      this._signalRService.receive().subscribe((message) => {
        console.log('-----,', message) ;
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange,  this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.exampleDatabase!.getRepoIssues(
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
              ).pipe(catchError(() => observableOf(null)));
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isRateLimitReached = data === null;
    
              if (data === null) {
                return [];
              }
              this.resultsLength = data.Count;
              return data.EmployeeList;
            }),
          )
          .subscribe(data => (this.data = data));
          this.dialog.closeAll();
      });
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddEditEmployeeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      
    });

    
    
    
  }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort ) {
      console.log('sortState.direction', sortState.direction)
      if (sortState.direction =='asc') {
        sortState.direction ='desc'
      }
      else  {
        sortState.direction ='asc'
      }
    }
  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient,this._signalRService);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange,  this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }
          this.resultsLength = data.Count;
          return data.EmployeeList;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

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

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient,private _signalRService:AppSignalRService) {}

  getRepoIssues(OrderName: string , direction: SortDirection, page: number = 0): Observable<DTOEmployeeListResponse> {
    const href = 'https://localhost:7022/Employee/employee-list';
    const requestUrl = `${href}?OrderName=${OrderName}&Direction=${direction}&PageNumber=${
      page + 1
    }`;

    return this._httpClient.get<DTOEmployeeListResponse>(requestUrl);
  }
}
    