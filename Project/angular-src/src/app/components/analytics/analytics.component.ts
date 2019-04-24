import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {Http, Headers, Response} from '@angular/http';
import {type} from "os";

let newData;

const temp_max = '1';
const temp_min = '2';
let commentArray = [];
let temp1="",temp2="",temp3="";
let temp4,temp5,temp6;
let data;
let arr2=[], arr=[];

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

export class AnalyticsComponent implements OnInit {
  chart;
  chart2;
  commentArray;
  dataArray;
  title;

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.getData1();
    this.getData2();
  } //end ngOnInit<3

  getData1() {
    this.chart = new Chart('canvas2', {
      type: 'bar',
      data: {
        labels: ["2017", "2018", "2019"],
        datasets: [{
          label: 'Instagram',
          backgroundColor: '#ff6384',
          data: [
            200000000, 800000000, 1000000000
          ],
          fill: false,
        }
          , {
            label: 'Imgur',
            backgroundColor: '#0092FF',
            fill: false,
            data: [
              130000000, 200000000, 250000000
            ],
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Amount of Users in Competing Apps'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    });
  }
  //
  getData2() {

    this.chart2 = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ["stringTitle1", "stringTitle2", "stringTitle3"],
        datasets: [{
          label: 'Comment',
          backgroundColor: '#ff6384',
          data: [
            1, 2, 3
          ],
          fill: true,
        }

        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Line Chart Showing Top Favourited Posts'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    });
  }



  ajaxGet(dataURL) {
    let arr = [];

    const Http = new XMLHttpRequest();
    Http.open("GET", dataURL);
    Http.setRequestHeader('Authorization', 'Client-ID 31e856379dfed98');
    Http.send();

    Http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200){
        data = JSON.parse(this.responseText);
        data[`data`].forEach(post => {
          let obj = {
            'Title' : post.title,
            'Comments' : post.comment_count
          };
          arr.push(obj);
        });
      }

    };

  return;
  }

  getImgurTrending() {
    const headers = new Headers();
    headers.append('Authorization', 'Client-ID 31e856379dfed98');
    this.http.get('https://api.imgur.com/3/gallery/hot/viral/0.json', {headers: headers})
      .map(res => res.json())
      .subscribe(
        (data) => {
          data[`data`].forEach(post => {
              let obj = {
                'title': post.title,
                'comment_count': post.comment_count
              };
              arr.push(obj);
              // console.log(arr);
              console.log(obj);
          });
        }
      );
    return arr;
  }

} //end export
