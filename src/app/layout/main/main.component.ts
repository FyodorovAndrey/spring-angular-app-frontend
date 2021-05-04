import { Component, OnInit } from '@angular/core';
import {Post} from '../../model/Post';
import {User} from '../../model/User';
import {PostService} from '../../service/post.service';
import {UserService} from '../../service/user.service';
import {NotificationService} from '../../service/notification.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {CommentService} from '../../service/comment.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isPostsDataLoaded = false;
  isUserDataLoaded = false;
  // @ts-ignore
  posts: Post[];
  // @ts-ignore
  user: User;

  constructor(private postService: PostService,
              private commentService: CommentService,
              private userService: UserService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService) {
  }

  ngOnInit(): void {
    this.postService.getAllPosts()
      .subscribe(value => {
        console.log(value);
        this.posts = value;
        this.getImageToPost(this.posts);
        this.getCommentsToPost(this.posts);
        this.isPostsDataLoaded = true;
      });

    this.userService.getCurrentUser()
      .subscribe(value => {
        console.log(value);
        this.user = value;
        this.isUserDataLoaded = true;
      });
  }

  getImageToPost(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getPostImage(p.id)
        .subscribe(i => {
          p.image = i.bytes;
        });
    });
  }

  getCommentsToPost(posts: Post[]): void {
    posts.forEach(p => {
      // @ts-ignore
      this.commentService.getAllCommentsForPost(p.id)
        .subscribe(c => {
          p.comments = c;
        });
    });
  }

  likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    if (!post.usersLiked?.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          post.usersLiked?.push(this.user.username);
          this.notificationService.showSnackBar('Liked!');
        });
    } else {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          const index = post.usersLiked?.indexOf(this.user.username, 0);
          console.log(index);
          if (index > -1) {
            post.usersLiked?.splice(index, 1);
          }
        });
    }
  }

  postComment(message: string, postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    this.commentService.createComment(postId, message)
      .subscribe(value => {
        post.comments?.push(value);
        console.log(value);
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}
