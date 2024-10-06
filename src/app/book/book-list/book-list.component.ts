import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, inject} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe, NgIf} from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe,NgIf,MatButtonModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['Id', 'Title', 'PublicationDate', 'Quantity','Author'];
  exampleDatabase!: ExampleHttpDatabase | null;
  data: DTOBookList[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort ) {
      // This example uses English messages. If your application supports
      // multiple language, you would internationalize these strings.
      // Furthermore, you can customize the message to add additional
      // details about the values being sorted.
      console.log('sortState.direction', sortState.direction)
      if (sortState.direction =='asc') {
        sortState.direction ='desc'
      }
      else  {
        sortState.direction ='asc'
      }
      // if (sortState.direction) {
      //   this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      // } else {
      //   this._liveAnnouncer.announce('Sorting cleared');
      // }
    }
  ngAfterViewInit() {
    // this.data.sort = this.sort.sortChange
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
    // this.sort.direction = 'asc';

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange,  this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active,
            // 'asc',
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

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.Count;
          return data.BookList;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

export interface DTOBookListResponse {
  BookList: DTOBookList[];
  Count: number;
}

export interface DTOBookList {
  Id: number;
  Title: string;
  PublicationDate: string;
  Quantity: number;
  Author: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(OrderName: string , direction: SortDirection, page: number = 0): Observable<DTOBookListResponse> {
    const href = 'https://localhost:7022/Book/book-list';
    const requestUrl = `${href}?OrderName=${OrderName}&Direction=${direction}&PageNumber=${
      page + 1
    }`;

    return this._httpClient.get<DTOBookListResponse>(requestUrl);
  }
}
export enum OrderName
    {
        Title = 1,
        PublicationDate = 2,
        Quantity = 3,
        Author = 4

    }


    //////
    