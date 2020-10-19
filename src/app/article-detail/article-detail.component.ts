import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: [ './article-detail.component.css' ]
})
export class ArticleDetailComponent implements OnInit {
  article: Article;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    const identification = +this.route.snapshot.paramMap.get('identification');
    this.articleService.getArticle(identification)
      .subscribe(article => this.article = article);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.articleService.updateArticle(this.article)
      .subscribe(() => this.goBack());
  }
}