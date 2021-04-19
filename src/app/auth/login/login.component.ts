import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @ts-ignore
  public loginForm: FormGroup;

  constructor(private authService: AuthService,
              private tokenStorageService: TokenStorageService,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder,
              private router: Router) {
    if (this.tokenStorageService.getUser()) {
      this.router.navigate(['main']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  submit(): void {
    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(value => {
      console.log(value);

      this.tokenStorageService.saveToken(value.token);
      this.tokenStorageService.saveUser(value);

      this.notificationService.showSnackBar('Successfully login');

      this.router.navigate(['/']);
      window.location.reload();
    }, error => {
      this.notificationService.showSnackBar(error.message);
    });
  }
}
