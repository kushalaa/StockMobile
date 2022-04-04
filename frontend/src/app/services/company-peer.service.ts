import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";  
import { BehaviorSubject } from 'rxjs';
import { BackendCallService } from './backend-call.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPeerService {
  companyPeers: any = [];
  ticker = '';
  public content = new BehaviorSubject<any>(this.companyPeers);
  public share = this.content.asObservable(); 
  constructor(private http: HttpClient, private backendService: BackendCallService) { }

  getPeerVal(ticker: string) {
    console.log("In Peers");
    console.log(ticker);
    if(this.checkExists(ticker)) {
      console.log("check exists Peers returned ");
      return;
    }

    this.backendService.getStockPeers(ticker).subscribe( (data) => {
      console.log("subscribed Peers");
      this.companyPeers = data;
      this.setValue(data);
      this.ticker = ticker;
    }
    );
  }

  setValue(data) {
    console.log("setValue Peers");
    this.content.next(data);
  }

  checkExists(ticker) {
    
    if(this.ticker == ticker) {
      console.log("checkExists Peers true");
      return true;
    }
    return false;
  } 

  clearState() {
    this.ticker = '';
    this.companyPeers= [];
    this.setValue(this.companyPeers);
  }
}
