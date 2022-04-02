import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";  
import { INewsInfo } from "../models/newsInfo";
import { BackendCallService } from './backend-call.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyNewsService {
  newsDetails = [];
  public content = new BehaviorSubject<INewsInfo[]>(this.newsDetails);
  public share = this.content.asObservable();    
  ticker:string = '';
  constructor(private http: HttpClient, private backendService: BackendCallService) { }

  getNewsVal(ticker: string) {
    console.log("In news");
    console.log(ticker);
    // console.log(this.newsDetails);
    if(this.checkExists(ticker)) {
      console.log("check exists news returned");
      return;
    }

    this.backendService.getStockNews(ticker).subscribe( (data) => {
      console.log("subscribed News");
      this.newsDetails = data;
      this.setValue(data);
      this.ticker = ticker;
    }
    );
  }

  setValue(data) {
    console.log("setValue news");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    console.log(this.ticker);
    if(this.ticker == ticker) {
      console.log("checkExist news True");
      return true;
    }
    return false;
  }
}
