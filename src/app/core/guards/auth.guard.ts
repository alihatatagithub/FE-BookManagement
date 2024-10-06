import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom } from 'rxjs';
import { UserTokensDTO } from '../../models/DTOTokensResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public jwtHelper: JwtHelperService = new JwtHelperService();
  model:UserTokensDTO = {AccessToken:'',RefreshToken:''};

  constructor(private router: Router, private http: HttpClient) {
  }
  async canActivate() {
    //debugger;
    const token = localStorage.getItem("accessToken");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    const isRefreshSuccess = await this.refreshingTokens(token);
    if (!isRefreshSuccess) {
      this.router.navigate(["login"]);
    }

    return isRefreshSuccess;
  }

  private async refreshingTokens(token: string | null): Promise<boolean> {
    const refreshToken: string | null = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      return false;
    }

    const tokenModel = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    this.model.AccessToken = token;
    this.model.RefreshToken = refreshToken ;

    let isRefreshSuccess: boolean;
    try {

      const response = await lastValueFrom(this.http.post("https://localhost:7022/Account/" + "refresh-token", this.model));
      const newToken = (<any>response).accessToken;
      const newRefreshToken = (<any>response).refreshToken;
      localStorage.setItem("accessToken", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      console.log("Token renewed successfully", "Success")
      isRefreshSuccess = true;
    }
    catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }

}