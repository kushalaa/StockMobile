import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";  
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class SummaryChartService {
  chartDetailsSummary:any = [];
  public contentSummary = new BehaviorSubject<any>(this.chartDetailsSummary);
  public shareSummary = this.contentSummary.asObservable();    
  tickerSummary:string = '';
  constructor(private http: HttpClient, private backendService: BackendCallService) { }
  getChartsSummary(ticker: string, resolution, from, refresh: boolean) {
    console.log(ticker);
    console.log("In Charts Summary");
    // console.log(this.newsDetails);
    if(!refresh && this.checkExistsSummary(ticker)) {
      console.log("check exists charts summary returned");
      return;
    }

    console.log("Old ticker");
    console.log(this.tickerSummary);
    this.backendService.getHistCandles(ticker, resolution, from).subscribe( (data) => {
      console.log("subscribed charts summary");
      this.chartDetailsSummary = data;
      this.setValueSummary(data);
      this.tickerSummary = ticker;
      console.log("Sent ticker");
      console.log(ticker);
      console.log("New ticker");
      console.log(this.tickerSummary);
    }
    );   
  }
  
  setValueSummary(data) {
    console.log("setValue charts summary");
    this.contentSummary.next(data);
  }

  checkExistsSummary(ticker) {
    console.log("Inside charts summary check exist func")
    console.log(this.tickerSummary);
    console.log(this.tickerSummary)
    if(this.tickerSummary == ticker) {
      console.log("checkExist charts summary True");
      return true;
    }
    return false;
  }  
}
