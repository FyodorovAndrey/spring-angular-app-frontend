import { Component, OnInit } from '@angular/core';
import {User} from '../../model/User';
import {TokenStorageService} from '../../service/token-storage.service';
import {UserService} from '../../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isLoggedIn = false;
  isLoadedData = false;
  // @ts-ignore
  user: User;

  constructor(private tokenStorageService: TokenStorageService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      this.userService.getCurrentUser()
        .subscribe(value => {
          this.user = value;
          this.isLoadedData = true;
        });
    }
  }

  logout(): void {
    this.tokenStorageService.logOut();
    this.router.navigate(['/login']);
  }

}
