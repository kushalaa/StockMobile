import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";  
import { BehaviorSubject } from 'rxjs';
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyEarningsService {
  earningsDetails:any = [];
  public content = new BehaviorSubject<any>(this.earningsDetails);
  public share = this.content.asObservable();  
  ticker: string = '';  
  constructor(private http: HttpClient, private backendService: BackendCallService) { }
  getEarningsVal(ticker: string) {
    console.log("In earnings");
    console.log(ticker);
    console.log(this.earningsDetails);
    if(this.checkExists(ticker)) {
      console.log("check exists earnings returned");
      return;
    }

    this.backendService.getEarnings(ticker).subscribe( (data) => {
      console.log("subscribed earnings");
      this.earningsDetails = data;
      this.setValue(data);
      this.ticker = ticker;
    }
    );
  }

  setValue(data) {
    console.log("setValue earnings");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    console.log(this.earningsDetails.ticker);
    if(this.ticker == ticker) {
      console.log("checkExist earnings True");
      return true;
    }
    return false;
  }
}
