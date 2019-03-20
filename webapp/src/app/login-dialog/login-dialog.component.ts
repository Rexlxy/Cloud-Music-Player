import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../file-explorer/file-explorer.component';
import {UserService} from '../services/user/user.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  username: string;
  password: string;
  error: string;
  isAuthenticated: boolean;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    public userService: UserService) {
    this.isAuthenticated = false;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public login() {
    this.userService.login(this.username, this.password).subscribe(result => {
      console.log(result);
      if (result.Authenticated) {
        this.isAuthenticated = true;
        this.userService.isLogin = true;
      } else {
        this.error = result.Message;
      }
    });
  }

}
