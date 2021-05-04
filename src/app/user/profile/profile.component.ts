import { Component, OnInit } from '@angular/core';
import {User} from '../../model/User';
import {UserService} from '../../service/user.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {MatDialog, MatDialogConfig, MatDialogContent} from '@angular/material/dialog';
import {NotificationService} from '../../service/notification.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {PostService} from '../../service/post.service';
import {EditUserComponent} from '../edit-user/edit-user.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isUserDataLoaded = false;
  user: User;
  selectedFile: File;
  userProfileImage: File;
  previewImageUrl: any;

  constructor(private userService: UserService,
              private postService: PostService,
              private tokenStorageService: TokenStorageService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private imageUploadService: ImageUploadService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });

    this.imageUploadService.getProfileImage()
      .subscribe(data => {
        this.userProfileImage = data.bytes;
      });
  }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImageUrl = reader.result;
    };
  }

  openEditDialog(): void {
    const dialogUserEditConfig = new MatDialogConfig();

    dialogUserEditConfig.width = '400px';
    dialogUserEditConfig.data = {
      user: this.user
    };
    this.dialog.open(EditUserComponent, dialogUserEditConfig);
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }


  onUpload(): void {
    if (this.selectedFile != null) {
      this.imageUploadService.uploadProfileImage(this.selectedFile)
        .subscribe(() => {
          this.notificationService.showSnackBar('User profile image upload successfully');
        });
    }
  }
}
