import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { registerDTO } from '../../dtos/user/register.dto';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { UserService } from '../../services/user.service';
// import { RegisterDTO } from '../../dtos/user/register.dto';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  // Khai báo các biến tương ứng với các trường dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address:string;
  isAccepted: boolean;
  dateOfBirth: Date;

  constructor(private router: Router, private userService: UserService){
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
    //inject

  }
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  register() {
    // const message =
    //   `phone: ${this.phoneNumber}` +
    //   `password: ${this.password}` +
    //   `retypePassword: ${this.retypePassword}` +
    //   `address: ${this.address}` +
    //   `fullName: ${this.fullName}` +
    //   `isAccepted: ${this.isAccepted}` +
    //   `dateOfBirth: ${this.dateOfBirth}`;
    //alert(message);
    const apiUrl = 'http://localhost:8088/api/v1/users/register';

  
      const registerDTO:registerDTO = {
        "fullName": this.fullName,
        "phone_number": this.phoneNumber,
        "address": this.address,
        "password": this.password,
        "retype_password": this.retypePassword,
        "date_of_birth": this.dateOfBirth,
        "facebook_account_id": 0,
        "google_account_id": 0,
        "role_id": 1
    
    };
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger;
        // trường hợp đăng nhập thành công
        if (response && (response.status === 200 || response.status === 201)) {
          // register thành công => sang login
          this.router.navigate(['login']);
        } else {
          // trường hợp đăng nhập không thành công
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(`Can't register, error: ${error.error}`);
      },
    });
    // this.http.post(apiUrl, registerData, { headers:headers }).subscribe();
  }
  //how to check password match ?
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({
        passwordMismatch: true,
      });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({
          invalidAge: true,
        });
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
