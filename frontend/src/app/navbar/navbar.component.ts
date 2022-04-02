import { Component, OnInit } from '@angular/core';
import { CompanyProfileService } from '../services/company-profile.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private companyProfileService: CompanyProfileService) { }
  ticker = '';
  ngOnInit(): void {
    this.companyProfileService.share.subscribe((data) =>{
      this.ticker = data.ticker;
    });
  }

  getTickerOrHome() {
    var ticker = this.companyProfileService.getCurrTicker();
    if(ticker == null || ticker == '') {
      return '/search/home';
    } 

    return 'search/' + ticker;
  }

}
