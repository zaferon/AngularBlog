import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Article } from './article';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const articles = [
      {title: 'first article', id: 1, date: '8/19/2020', author: 'Jane Doe', text: 'Hello how are you?  Good hope you are having a good day.'},
      {title: 'second article', id: 2, date: '8/19/2020', author: 'Fred Doe', text: 'Did you do something interesting today? That sounds fun.'},
      {title: 'third article', id: 3, date: '8/20/2020', author: 'Tom Doe', text: 'Yeah my day has been okay. I mean I do have school and all so nothing too special.'},
      {title: 'fourth article', id: 4, date: '8/20/2020', author: 'Nancy Doe', text: 'I just joined in a zoom call for 3 classes and did some homework you know.'},
      {title: 'fifth article', id: 5, date: '8/21/2020', author: 'Velma Doe', text: 'Yeah I hope this whole quarentinnne thing ends soon so that school can go back. Zoom is getting quite old.'} ,
      {title: 'sixth article', id: 6, date: '8/21/2020', author: 'Natalie Snake', text: 'Well I have to go now goodbye. Talk to you later, not.'},
  ];
    return {articles};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(articles: Article[]): number {
    return articles.length > 0 ? Math.max(...articles.map(article => article.identification)) + 1 : 0;
  }
}