import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";  
import { ITickerInfo } from "../models/tickerInfo";
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {
  companyDetails: ITickerInfo = {
    name: "",
    ticker: "",
    country: "",
    currency: "",
    exchange: "",
    finnhubIndustry: "",
    ipo: "",
    logo: "",
    // marketCapitalization: 
    phone: "",
    // shareOutstanding: 16319.44
    weburl: ""
  };
  public content = new BehaviorSubject<ITickerInfo>(this.companyDetails);
  public share = this.content.asObservable(); 
  ticker: string = '';   
  constructor(private http: HttpClient, private backendService: BackendCallService) { }

  getProfileVal(ticker: string) {
    console.log("In profile");
    console.log(ticker);
    console.log(this.companyDetails);
    if(this.checkExists(ticker)) {
      console.log("check exists Profile returned");
      return;
    }

    this.backendService.getStockProfile(ticker).subscribe( (data) => {
      console.log("subscribed Profile");
      this.companyDetails = data;
      this.setValue(data);
      this.ticker = ticker;
    }
    );
  }

  setValue(data) {
    console.log("setValue Profile");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    console.log(this.companyDetails.ticker);
    if(this.companyDetails.ticker == ticker) {
      console.log("checkExist Profile True");
      return true;
    }
    return false;
  }

  getCurrTicker() {
    return this.ticker;
  }
}
