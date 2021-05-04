import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../service/user.service';
import {NotificationService} from '../../service/notification.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public profileEditForm: FormGroup;

  constructor(private matDialogRef: MatDialogRef<EditUserComponent>,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.profileEditForm = this.createProfileForm();
  }

  createProfileForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [
        this.data.user.firstName,
        Validators.compose([Validators.required])
      ],
      lastName: [
        this.data.user.lastName,
        Validators.compose([Validators.required])
      ],
      bio: [
        this.data.user.bio,
        Validators.compose([Validators.required])
      ]
    });
  }

  private updateUser(): User {
    this.data.user.firstName = this.profileEditForm.value.firstName;
    this.data.user.lastName = this.profileEditForm.value.lastName;
    this.data.user.bio = this.profileEditForm.value.bio;
    return this.data.user;
  }

  submit(): void {
    this.userService.updateUser(this.updateUser())
      .subscribe(() => {
        this.notificationService.showSnackBar('User updated successfully');
        this.matDialogRef.close();
      });
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }
}
