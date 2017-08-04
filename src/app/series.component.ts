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

  searchForEpisodes(title?: string) {
    if (!title) {
      let inputField = document.getElementsByClassName('input-box')[0] as HTMLInputElement;
      console.log(inputField)
      title = inputField.value;
    }
    imdb.search({ title: title }, { apiKey: API_KEY }).then(data => {
    var showId:string = data.results[0].type === 'series' ? data.results[0].imdbid : data.results[1].imdbid;
    imdb.getById(showId, {apiKey: API_KEY}).then(show => {
      this.series = show;
      console.log(this.series);
      show.episodes().then(episodes => {
        this.episodes = episodes.sort((ep1, ep2) => { return parseFloat(ep2.rating) - parseFloat(ep1.rating) });
        // this.series._episodes = episodes.sort((ep1, ep2) => { return parseFloat(ep2.rating) - parseFloat(ep1.rating) });
        console.log(this.series.poster);
        this.zone.run(() => {});
      });
    });
  });
  }
}
