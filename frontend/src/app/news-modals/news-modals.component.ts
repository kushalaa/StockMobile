import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-modals',
  templateUrl: './news-modals.component.html',
  styleUrls: ['./news-modals.component.css']
})
export class NewsModalsComponent implements OnInit {
  @Input() public news: any;
  constructor(public newsModalService: NgbActiveModal) { }
  facebookLink;
  ngOnInit(): void {
    this.facebookLink =
      'https://www.facebook.com/sharer/sharer.php?u=' +
      encodeURIComponent(this.news.url) +
      '&amp;src=sdkpreparse';
  }

  redirectUrl(url: string) {
    window.open(url, '_blank');
  }

}
