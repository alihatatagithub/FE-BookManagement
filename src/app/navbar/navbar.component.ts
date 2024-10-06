import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {


  constructor() { }

  ngOnInit(): void {
  }


  public logOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // this.router.navigate(["login"]);
  }
}
