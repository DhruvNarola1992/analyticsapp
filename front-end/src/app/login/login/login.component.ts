import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  checkoutForm;
  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }
  onLogin() {
    if(this.checkoutForm.get('email').value === "dhruv@mount.com" && this.checkoutForm.get('password').value === "123456") {
      localStorage.setItem('isLoggedin', 'true');
      this.router.navigate(['/dashboard']);
    } else {
      this.checkoutForm.reset();
    }
  }
}
