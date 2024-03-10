import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { registerDTO } from 'src/app/dtos/user/register.dto';
import { LoginDTO } from 'src/app/dtos/user/login.dto';
import { environment } from 'src/app/environments/environment';
import { UserResponse } from '../responses/user/user.responses';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetails = `${environment.apiBaseUrl}/users/details`;
  private apiConfig = { headers: this.httpUtilService.createHeaders() };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}
  // private createHeader(): HttpHeaders {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept-Language': 'vi',
  //   });
  //   return headers;
  // }

  register(registerDTO: registerDTO): Observable<any> {
    // param registerData cần được chuân hóa kiểu dữ liệu cụ thể tại dtos. registerDto
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }
  login(loginDTO: LoginDTO): Observable<any> {
    // loginDTO: LoginDTO tương tự như java  method(param1, param2, ...)
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }
  getUserDetails(token: string) {
    return this.http.post(this.apiUserDetails, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJson = JSON.stringify(userResponse);
      localStorage.setItem('user', userResponseJson);
      console.log('User response save to local storage');
    } catch (error) {
      console.log('error saving user response to local storage', error);
    }
  }
  getUserResponseFromLocalStorage() {
    try {
      const userResponseJson = localStorage.getItem('user');
      if (userResponseJson == null || userResponseJson == undefined) {
        return;
      }
      const userResponse = JSON.parse(userResponseJson!);
      console.log('User response save to local storage');
    } catch (error) {
      console.log('error saving user response to local storage', error);
    }
  }
}
