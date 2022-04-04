import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import  { CompanyProfileService } from "../services/company-profile.service";
import  { CompanyPeerService } from "../services/company-peer.service";
import  { CompanyQuoteService } from "../services/company-quote.service";
import  { CompanyNewsService } from "../services/company-news.service";
import { CompanyChartService} from "../services/company-chart.service";
import { SummaryChartService} from "../services/summary-chart.service";
import { BackendCallService } from '../services/backend-call.service';
import { CompanyEarningsService } from '../services/company-earnings.service';
import { CompanySentimentsService } from '../services/company-sentiments.service';
import { CompanyRecService } from "../services/company-rec.service";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { ITickerInfo } from '../tickerInfo';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  filteredData = [];
  formGrp: FormGroup;
  filtered = [1, 2 ,3];
  private inputs = new Subject<string>();
  ticker: string;
  isLoading = false;
  validMsg = '';
  invalidTicker = false;
  private routerSubscription = Subscription.EMPTY;
  private validTickerSuccess = new Subject<string>();
  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
  constructor(
    private buildForm: FormBuilder,
    private router: Router,
    private backEndService: BackendCallService,
    private companyProfileService: CompanyProfileService,
     private compPeerService: CompanyPeerService, 
     private compQuoteService: CompanyQuoteService,
      private compNewsService: CompanyNewsService, 
      private compChartService: CompanyChartService, 
      private summaryChartService: SummaryChartService,
      private compEarningsService: CompanyEarningsService, 
      private compSentimentService: CompanySentimentsService, 
      private compRecService: CompanyRecService

  )
  {

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.invalidTicker = false;
        let tickerSym = this.router.url.split('/')[2]
        tickerSym = tickerSym.toUpperCase();
        if(tickerSym=='HOME') {
          this.formGrp = this.buildForm.group({ tickerIn: ''});          
        }   else {
          this.formGrp = this.buildForm.group({ tickerIn: tickerSym });
        }
        
      }
    })

  }

  ngOnInit(): void {

    this.companyProfileService.share.subscribe((data) =>{
      this.ticker = data.ticker;
    });

    // this.formGrp = this.buildForm.group({ tickerIn: '' });
    this.formGrp.get('tickerIn')
    .valueChanges.pipe(
      debounceTime(300), 
      tap(() => (this.isLoading = true)),
      switchMap((value) =>
        this.backEndService
          .getStockAutoComplete(value)
          .pipe(finalize(() => (this.isLoading = false)))
      )
    )
    .subscribe(data => {
      
      var i=0;
      this.filteredData = [];
      for(i = 0; i < data['count']; i++) {
        var temp_data = data['result'][i];
        if(temp_data['symbol'].includes('.')) {
          continue;
        }
        if(temp_data['type'] != "Common Stock") {
          continue;
        }
        console.log(temp_data);
        this.filteredData.push(temp_data);
      }
      console.log("Inside init");
      console.log(this.filteredData);
    });

    this.validTickerSuccess.subscribe(
      (message) => (this.validMsg = message)
    );
    this.validTickerSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.validMsg = ''));
    // this.backService.getStockProfile('TLSA').subscribe(data => {
    //   this.filteredData = data;
    //   console.log("Inside init");
    //   console.log(this.filteredData);
    // });
    // console.log(this.filteredData);
  }

  onSubmit(tickerData) {
    console.log("on submit called");
    if (tickerData.tickerIn.ticker) {
      this.ticker = tickerData.tickerIn.ticker;
    } else {
      this.ticker = tickerData.tickerIn;
    }

    if(this.checkIfTickerEmpty(this.ticker)) {
      this.validTickerSuccess.next('Message successfully changed.');
      return;
    }
    this.autocomplete.closePanel();
    console.log('ticker name in form: ', this.ticker);
    console.log(this.filteredData);
    this.filteredData=[];
    // this.formGrp.reset(this.ticker);
    // TODO: Check how to not lose form data on routing
    this.router.navigateByUrl('search/' + this.ticker);
    
  }
  onSubmitAutocomplete(tickerVal) {

    this.ticker = tickerVal;
    console.log('ticker name in form: ', this.ticker);
    console.log(this.filteredData);
    // TODO: Check how to not lose form data on routing
    this.router.navigateByUrl('search/' + this.ticker);
    // this.searchForm.reset();
  }
  clearDetails() {
    // TODO: Check what else to clear
    this.ticker = '';
    this.invalidTicker= false;
    console.log('ticker clear: ', this.ticker);
    this.filteredData = [];
    this.isLoading = false;
    this.validTickerSuccess.next('');
    console.log(this.filteredData);
    this.router.navigateByUrl('');
    this.formGrp.reset();
    this.clearStateInfo();

  }

  checkIfTickerEmpty(ticker) {
    console.log(ticker);
    if(ticker == '' ) {
      // this.validTicker = false;
      console.log("invalid");
      this.invalidTicker = true;
      return true;
    } else {
      console.log("valid");
      // this.validTicker = true;
      return false;
    }
  }
  changeInput(input: string): void {
    input = input.trim();
    if (input) {
      this.inputs.next(input);
    }
    this.ticker = '';
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
