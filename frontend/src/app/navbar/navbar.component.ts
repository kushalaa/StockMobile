import { Component, OnInit } from '@angular/core';
import { CompanyProfileService } from '../services/company-profile.service';
import  { CompanyPeerService } from "../services/company-peer.service";
import  { CompanyQuoteService } from "../services/company-quote.service";
import { Router } from '@angular/router';
import  { CompanyNewsService } from "../services/company-news.service";
import { CompanyChartService} from "../services/company-chart.service";
import { SummaryChartService} from "../services/summary-chart.service";
import { BackendCallService } from '../services/backend-call.service';
import { CompanyEarningsService } from '../services/company-earnings.service';
import { CompanySentimentsService } from '../services/company-sentiments.service';
import { CompanyRecService } from "../services/company-rec.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  searchLinkActiveStatus:string = '';
  constructor(private companyProfileService: CompanyProfileService,
    private router: Router,
    private backEndService: BackendCallService,
     private compPeerService: CompanyPeerService, 
     private compQuoteService: CompanyQuoteService,
      private compNewsService: CompanyNewsService, 
      private compChartService: CompanyChartService, 
      private summaryChartService: SummaryChartService,
      private compEarningsService: CompanyEarningsService, 
      private compSentimentService: CompanySentimentsService, 
      private compRecService: CompanyRecService
    ) { }
  ticker = '';
  ngOnInit(): void {
    this.companyProfileService.share.subscribe((data) =>{
      this.ticker = data.ticker;
    });
  }

  getTickerOrHome() {
    var ticker = this.companyProfileService.getCurrTicker();
    // console.log("Sending the ticker");
    // console.log(ticker);

    if(ticker == null || ticker == '') {
      this.searchLinkActiveStatus = ''
      return '/search/home';
    } 
    this.searchLinkActiveStatus = 'active'
    return 'search/' + ticker;
  }

  clearDetails() {
    // TODO: Check what else to clear
    this.ticker = '';
    console.log('ticker clear: ', this.ticker);

    // this.clearStateInfo();
    this.router.navigateByUrl('');
  }
  clearStateInfo() {
    this.companyProfileService.clearState();
    this.compChartService.clearState();
    this.compNewsService.clearState();
    this.compPeerService.clearState();
    this.compQuoteService.clearState();
    this.summaryChartService.clearState();
    this.compEarningsService.clearState();
    this.compRecService.clearState();
    this.compSentimentService.clearState();
  }
}
