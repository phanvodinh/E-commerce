import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from 'src/app/services/token.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/model/role';
import { UserResponse } from 'src/app/responses/user/user.responses';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  // Khai báo các biến tương ứng với các trường dữ liệu trong form
  phoneNumber: string = '';
  password: string = '';

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {
    // this.phoneNumber = '00000';
    // this.password = 'admin';
  }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger;
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        // Sử dụng kiểu Role[]
        debugger;
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error getting roles:', error);
      },
    });
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  login() {
    const message = `phone: ${this.phoneNumber}` + `password: ${this.password}`;
    //alert(message);
    debugger;

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1,
    };
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        const { token } = response;
        if (this.rememberMe) {          
          this.tokenService.setToken(token);
          debugger;
          this.userService.getUserDetails(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };    
              this.userService.saveUserResponseToLocalStorage(this.userResponse); 
              this.router.navigate(['/']);                      
            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              debugger;
              alert(error.error.message);
            }
          })
        }                        
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error.message);
      }
    });
  }
}
