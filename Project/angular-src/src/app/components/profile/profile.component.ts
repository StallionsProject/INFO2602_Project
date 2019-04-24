import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  description: String;
  user:Object;

  constructor(private authService:AuthService,
              private router:Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
        this.user = profile.user;
      },
      err => {
        console.log(err);
        return false;
      });
  }

  showForm() {
    let x = document.getElementById('descriptionForm');
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  onEditDescription() {
    const data ={
      user: localStorage.getItem('user'),
      description: this.description
    };
    console.log(data);

    this.authService.updateProfile(data).subscribe(data => {
      if (data.success) {
        console.log("Success");
        location.reload();
      }
    });
  }

  promptUser() {
    if (confirm('Are you sure you want to delete your account?')) {
      const data= localStorage.getItem('user');
      let jsonStr = JSON.parse(data);
      const id = jsonStr.id;
      this.authService.deleteUser(id).subscribe(data => {
        if (data.success) {
          console.log("Success");
          this.authService.logout();
          this.flashMessage.show('Your account has been deleted.', {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/login']);
        }
      });
    } else {
      // Do nothing!
    }
  }
}
