import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

let  postedData = `not posted yet`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Stallions';
  dataJSON;
  postedData = `not posted yet`;

  constructor(private http: Http) { }

  ngOnInit() {
    this.getImgurTrending();
  }

  getImgurTrending() {
    const headers = new Headers();
    headers.append('Authorization', 'Client-ID 31e856379dfed98');
    this.http.get('https://api.imgur.com/3/gallery/hot/viral/0.json', {headers: headers})
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


}


