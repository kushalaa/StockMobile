import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";  
import { BehaviorSubject } from 'rxjs';
import { IQuoteInfo } from "../models/stockQuoteInfo";
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyQuoteService {
  quoteDetails: IQuoteInfo = {
    c: 0, //last price
    d: 0,// change 
    dp: 0, // change percent
    h: 0, // high price
    l: 0, // low price
    o: 0, // open price
    pc: 0, // prev close
    t: 0, // timestamp
    ticker: ""
  };  
  public content = new BehaviorSubject<IQuoteInfo>(this.quoteDetails);
  public share = this.content.asObservable();    
  constructor(private http: HttpClient, private backendService: BackendCallService) { }

  getQuoteVal(ticker: string, refresh: boolean) {
    console.log("In quote");
    console.log(ticker);
    console.log(this.quoteDetails);
    if(!refresh && this.checkExists(ticker)) {
      console.log("check exists Quote returned");
      return;
    }

    this.backendService.getStockQuote(ticker).subscribe( (data) => {
      console.log("subscribed Quote");
      this.quoteDetails = data;
      this.setValue(data);
    }
    );
  }

  setValue(data) {
    console.log("setValue Quote");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    console.log(this.quoteDetails.ticker);
    if(this.quoteDetails.ticker == ticker) {
      console.log("checkExist Quote True");
      return true;
    }
    return false;
  }
}
