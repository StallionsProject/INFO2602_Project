import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import { DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  playlistItems = [];

  constructor(private http: Http,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadPlaylist();
  }

  loadPlaylist(){
    let playlistId = "PLYH8WvNV1YEn_iiBMZiZ2aWugQfN1qVfM",
      APIKey = "AIzaSyAczn2x8oxAtOHsVxpHMcNK4iwkHnueuNw",
      baseURL = "https://www.googleapis.com/youtube/v3/";

    this.http.get(baseURL + "playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=" + APIKey)
      .map(res => res.json())
      .subscribe(
        (data) => {
          this.playlistItems = data.items;
        }
      );
  }

  getEmbedUrl(item){
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + item.snippet.resourceId.videoId)
  }


}
