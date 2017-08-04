declare var require: any;

import { Component, NgZone } from '@angular/core';
import { NgStyle } from '@angular/common';
var imdb = require('imdb-api');
var API_KEY = 'cd71bc9e';

@Component({
  selector: 'series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent {
  constructor(private zone:NgZone) {
    this.zone;
  }

  series:any;
  episodes:any;
  episodesRatings:number[] = [];
  range:string;
  average:string;
  median:number;

  searchForEpisodes(title?: string) {
    if (!title) {
      let inputField = document.getElementsByClassName('input-box')[0] as HTMLInputElement;
      title = inputField.value;
    }
    imdb.search({ title: title }, { apiKey: API_KEY }).then(data => {
    var showId:string = data.results[0].type === 'series' ? data.results[0].imdbid : data.results[1].imdbid;
    imdb.getById(showId, {apiKey: API_KEY}).then(show => {
      this.series = show;
      show.episodes().then(episodes => {
        this.episodes = episodes.sort((ep1, ep2) => { return parseFloat(ep2.rating) - parseFloat(ep1.rating) });
        let sum:number = 0;
        this.episodesRatings = [];
        for (let ep of episodes) {
          let rating:number = parseFloat(ep.rating);
          this.episodesRatings.push(rating);
          sum += rating;
        }
        this.range = (this.episodesRatings[0] - this.episodesRatings[this.episodesRatings.length-1]).toFixed(1);
        this.average = (sum / this.episodesRatings.length).toFixed(2);
        this.median = this.medianOfArray(this.episodesRatings);
        this.zone.run(() => {});
      });
    });
  });
  }
  
  medianOfArray(array:number[]) {
    let half:number = Math.floor(array.length / 2);
    if (array.length % 2) {
      return array[half];
    } else {
      return (array[half-1] + array[half]) / 2.0;
    }
  }
}
