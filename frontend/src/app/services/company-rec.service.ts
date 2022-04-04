import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";  
import { BehaviorSubject } from 'rxjs';
import { BackendCallService } from './backend-call.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyRecService {

  recsDetails:any = [];
  public content = new BehaviorSubject<any>(this.recsDetails);
  public share = this.content.asObservable();  
  ticker: string = '';  
  constructor(private http: HttpClient, private backendService: BackendCallService) { }
  getRecsVal(ticker: string) {
    console.log("In recs");
    console.log(ticker);
    console.log(this.recsDetails);
    if(this.checkExists(ticker)) {
      console.log("check exists recs returned");
      return;
    }

    this.backendService.getRecommendations(ticker).subscribe( (data) => {
      console.log("subscribed recs");
      this.recsDetails = data;
      this.setValue(data);
      this.ticker = ticker;
    }
    );
  }

  setValue(data) {
    console.log("setValue recs");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    console.log(this.recsDetails.ticker);
    if(this.ticker == ticker) {
      console.log("checkExist recs True");
      return true;
    }
    return false;
  }

  clearState() {
    this.ticker = '';
    this.recsDetails = [];
    this.setValue(this.recsDetails);
  }
}
