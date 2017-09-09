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

  searchResults:any;
  series:any;
  episodes:any;
  episodesRatings:number[] = [];
  range:string;
  average:string;
  median:number;
  showOtherResults:boolean = false;

  searchForEpisodes(title?: string) {
    if (!title) {
      let inputField = document.getElementsByClassName('input-box')[0] as HTMLInputElement;
      title = inputField.value;
    }
    console.log(title);
    imdb.search({ title: title }, { apiKey: API_KEY }).then(data => {
      if (data.results.length > 1) {
        this.searchResults = data.results;
      }
      // var showId:string = data.results[0].type === 'series' ? data.results[0].imdbid : data.results[1].imdbid;
      var showId:string = data.results[0].imdbid;
      imdb.getById(showId, {apiKey: API_KEY}).then(show => {
        this.series = show;
        this.series.debuted = this.series.released.toString().split(' ').splice(0,4).join(' ');
        show.episodes().then(episodes => {
          var sortedEpisodes = episodes.sort((ep1, ep2) => { return parseFloat(ep2.rating) - parseFloat(ep1.rating) });
          this.episodes = sortedEpisodes;
          this.series._episodes = sortedEpisodes;
          let sum:any = 0;
          this.episodesRatings = [];
          for (let ep of this.episodes) {
            let episodeRating:any = parseFloat(ep.rating);
            if (!!episodeRating) {
              this.episodesRatings.push(episodeRating);
              sum += episodeRating;
            }
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

  clearSeries() {
    this.series = {};
  }

  showOtherSearchResults() {
    this.showOtherResults = !this.showOtherResults;
  }
}
