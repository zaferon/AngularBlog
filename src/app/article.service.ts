import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Article } from './article';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class ArticleService {

  private articlesUrl = 'http://127.0.0.1:5000/articles';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET articles from the server */
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesUrl + "/all")
      .pipe(
        tap(_ => this.log('fetched articles')),
        catchError(this.handleError<Article[]>('getArticles', []))
      );
  }

  /** GET article by id. Return `undefined` when id not found */
  getArticleNo404<Data>(identification: number): Observable<Article> {
    const url = `${this.articlesUrl}/?identification=${identification}`;
    return this.http.get<Article[]>(url)
      .pipe(
        map(articles => articles[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} article identification=${identification}`);
        }),
        catchError(this.handleError<Article>(`getArticle identification=${identification}`))
      );
  }

  /** GET article by id. Will 404 if id not found */
  getArticle(identification: number): Observable<Article> {
    const url = `${this.articlesUrl}/${identification}`;
    return this.http.get<Article>(url).pipe(
      tap(_ => this.log(`fetched article identification=${identification}`)),
      catchError(this.handleError<Article>(`getArticle identification=${identification}`))
    );
  }

  /* GET articles whose name contains search term */
  searchArticles(term: string): Observable<Article[]> {
    if (!term.trim()) {
      // if not search term, return empty article array.
      return of([]);
    }
    return this.http.get<Article[]>(`${this.articlesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found articles matching "${term}"`) :
         this.log(`no articles matching "${term}"`)),
      catchError(this.handleError<Article[]>('searchArticles', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new article to the server */
  addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl + "/new", article, this.httpOptions).pipe(
      tap((newArticle: Article) => this.log(`added article w/ identification=${newArticle.identification}`)),
      catchError(this.handleError<Article>('addArticle'))
    );
  }

  /** DELETE: delete the article from the server */
  deleteArticle(article: Article | number): Observable<Article> {
    const identification = typeof article === 'number' ? article : article.identification;
    const url = `${this.articlesUrl + "delete"}/${identification}`;

    return this.http.delete<Article>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted article identification=${identification}`)),
      catchError(this.handleError<Article>('deleteArticle'))
    );
  }

  /** PUT: update the article on the server */
  updateArticle(article: Article): Observable<any> {
    return this.http.put(this.articlesUrl, article, this.httpOptions).pipe(
      tap(_ => this.log(`updated article identification=${article.identification}`)),
      catchError(this.handleError<any>('updateArticle'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ArticleService: ${message}`);
  }
}