import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";  
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyChartService {
  chartDetailsVolume:any = [];
  public contentVolume = new BehaviorSubject<any>(this.chartDetailsVolume);
  public shareVolume = this.contentVolume.asObservable();    
  tickerVol:string = '';
  constructor(private http: HttpClient, private backendService: BackendCallService) { }

  getChartsVolume(ticker: string, resolution, from, to) {
    console.log("In Charts volume");
    console.log(ticker);
    // console.log(this.newsDetails);
    if(this.checkExistsVol(ticker)) {
      console.log("check exists charts volume returned");
      return;
    }
    this.backendService.getHistCandles(ticker, resolution, from, to).subscribe( (data) => {
      console.log("subscribed charts volume");
      this.chartDetailsVolume = data;
      this.setValueVol(data);
      this.tickerVol = ticker;
    }
    );
  }



  setValueVol(data) {
    console.log("setValue charts volume");
    this.contentVolume.next(data);
  }

  checkExistsVol(ticker) {
    
    console.log(this.tickerVol);
    if(this.tickerVol == ticker) {
      console.log("checkExist charts volume True");
      return true;
    }
    return false;
  } 

}
