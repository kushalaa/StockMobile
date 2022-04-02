import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";  
import { BehaviorSubject } from 'rxjs';
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class CompanySentimentsService {
  sentimentsDetails:any = [];
  public content = new BehaviorSubject<any>(this.sentimentsDetails);
  public share = this.content.asObservable();  
  ticker: string = '';  
  constructor(private http: HttpClient, private backendService: BackendCallService) { }
  getSentimentsVal(ticker: string) {
    console.log("In sentiments");
    console.log(ticker);
    console.log(this.sentimentsDetails);
    if(this.checkExists(ticker)) {
      console.log("check exists sentiments returned");
      return;
    }

    this.backendService.getInsights(ticker).subscribe( (data) => {
      console.log("subscribed sentiments");
      this.sentimentsDetails = data;
      this.setValue(data);
      this.ticker = ticker;
    }
    );
  }

  setValue(data) {
    console.log("setValue sentiments");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    console.log(this.sentimentsDetails.ticker);
    if(this.ticker == ticker) {
      console.log("checkExist sentiments True");
      return true;
    }
    return false;
  }
}
