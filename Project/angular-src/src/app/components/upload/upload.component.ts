import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private http: Http) { }

  ngOnInit() {
  }

  private uploadedFile = null;
  private imgURL = "";
  private imgID = "";
  private imgType = "";

  onFileSelected(event) {
    this.uploadedFile = event.target.files[0];
  }

  uploadImage() {
    const headers = new Headers();
    headers.set('Authorization', 'Client-ID 31e856379dfed98');
    this.http.post(
      'https://api.imgur.com/3/image', this.uploadedFile, {headers})
      .subscribe(res => {
        console.log(res.json().data.link);
        console.log(res.json().data.id);

        this.imgURL = res.json().data.link;
        this.imgID = res.json().data.id;
        this.imgType = res.json().data.type;

        if (this.imgType.indexOf('image')){
          this.imgType = '.png';
        } else {
          this.imgType = '.mp4';
        }

        displayResults(this.imgURL, this.imgType);
      });
  }

  deleteImage() {
    const headers = new Headers();
    let url = 'https://api.imgur.com/3/image/' + this.imgID;
    headers.set('Authorization', 'Bearer aba8caf19ef0de963f1a6803bca66f8ea899336a');
    this.http.delete(url,{headers})
      .subscribe(res => {
        deleteResults(res.json().success);
      });
  }
}

function deleteResults(result) {
  if (result === true){
    const img = document.getElementById("imgEle");
    const responseText = document.getElementById('respon');
    responseText.innerHTML = 'Deleted!';
    img.style.display = 'none';
  }
}

function displayResults(imgURL, imgType) {
  const resultsDiv = document.getElementById("confirmation");

  let imgSrc = imgURL + imgType;

  resultsDiv.style.display = "block";
  const imgTag = document.createElement("img");
  imgTag.id = "imgEle";
  imgTag.src = imgSrc;
  imgTag.alt = "Response Image";
  imgTag.style.height = '400px';
  const responseMsg = document.createElement('span');
  responseMsg.id = "respon";
  responseMsg.innerHTML = 'Successfully Uploaded';
  resultsDiv.appendChild(imgTag);
  resultsDiv.appendChild(document.createElement('br'));
  resultsDiv.appendChild(responseMsg);
}


