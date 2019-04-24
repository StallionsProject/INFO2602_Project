import { Component, OnInit } from '@angular/core';
import {Headers, Http} from "@angular/http";
import { AuthService } from '../../services/auth.service';
import {log} from "util";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  following: String;

  constructor(private http: Http, private authService:AuthService,) { }

  ngOnInit() {
    this.authService.getFollowing()
      .subscribe(data => {
        console.log(data.following.forEach(x => this.getAccountData(x)));
        console.log(data.following[0]);
        },
      err => {
        console.log(err);
        return false;
      });
    // this.getAccountData('iLoveRobot');

  }

  getAccountData(account){
    if (account === null)
      return;
    let baseURL = 'https://api.imgur.com/3/';
    const headers = new Headers();
    headers.append('Authorization', 'Client-ID 31e856379dfed98');
    this.http.get(baseURL +'account/'+ account +'/submissions/0', {headers: headers})
      .map(res => res.json())
      .subscribe(
        (data) => {
          data[`data`].forEach(post => {
            if (post.images !== undefined) {

              const row = document.getElementsByClassName('row')[0];
              const containerDiv = document.createElement('div');
              containerDiv.className = 'col-12 col-md-6 col-lg-5';
              containerDiv.id = 'containerDiv';

              const portfolioContent = document.createElement('div');
              portfolioContent.className = 'portfolio-content w3-hover-opacity';

              const figure = document.createElement('figure');

              const titleDiv = document.createElement('div');
              titleDiv.className = 'entry-content flex flex-column align-items-center justify-content-center';

              const paragraph = document.createElement('p');
              paragraph.className ='postTitle';
              paragraph.innerHTML = post.title;
              titleDiv.appendChild(paragraph);
              portfolioContent.appendChild(titleDiv);

              const a = document.createElement('a');
              a.setAttribute('href', post.link);

              //if video
              if (post.images[0].type === 'video/mp4'){
                const video = document.createElement('video');
                const source = document.createElement('source');
                video.setAttribute("controls", "controls");
                video.setAttribute("width", "350");
                video.setAttribute("height", "350");
                source.src = post.images[0].link;
                video.appendChild(source);
                figure.appendChild(video);

              }
              else{
                //if image
                const img = document.createElement('img');
                img.setAttribute('class', 'postImg');
                img.src = post.images[0].link;
                // img.height = Number('350');
                img.width = Number('350');
                figure.appendChild(img);
              }


              a.appendChild(figure);
              portfolioContent.appendChild(a);

              containerDiv.appendChild(portfolioContent);
              row.appendChild(containerDiv);
            }

          });
        }
      );
  }

  addFollowing() {
    const data = localStorage.getItem('user');
    let jsonStr = JSON.parse(data);
    const id = jsonStr.id;
    let arr1 = jsonStr.following;
    // console.log("stuff" + arr1);
    arr1.push(this.following);
    const info ={
      id: id,
      following: arr1
    };
    // console.log(data);

    this.authService.updateFollowing(info).subscribe(data => {
      if (data.success) {
        this.authService.updateUserData(data.user);
        console.log("Success");
        location.reload();
      }
    });
  }

}
