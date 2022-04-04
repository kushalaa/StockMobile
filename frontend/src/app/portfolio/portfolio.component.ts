import { Component, OnInit } from '@angular/core';
import { BackendCallService } from '../services/backend-call.service';
import { Router } from '@angular/router';
import {forkJoin, Subject } from 'rxjs';
import  {IQuoteInfo } from "../models/stockQuoteInfo";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyModalComponent } from '../buy-modal/buy-modal.component';
import { PortfolioServiceService } from '../services/portfolio-service.service';
import { SellModalComponent } from '../sell-modal/sell-modal.component';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  ticker: string;
  quantityVal;
  private buySuccess = new Subject<string>();
  private sellSuccess = new Subject<string>(); 

  buyMsg = '';
  sellMsg = '';
  constructor(private router: Router, private backendCallService: BackendCallService,  private buyModalService: NgbModal, private portfolioService: PortfolioServiceService, private sellModalService: NgbModal) { }

  ngOnInit(): void {
    this.portfolioService.initializeWallet(25000);
    this.buySuccess.subscribe(
      (message) => (this.buyMsg = message)
    );
    this.buySuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.buyMsg = ''));
      this.sellSuccess.subscribe(
        (message) => (this.sellMsg = message)
      );
      this.sellSuccess
        .pipe(debounceTime(5000))
        .subscribe(() => (this.sellMsg = ''));
    // this.portfolioService.initializePortfolio();
    this.getPortfolioItems();
  }

  getBalance() {
    return this.portfolioService.getBalance();
  }

  updateBalance(value) {
    var balance = parseFloat(localStorage.getItem('wallet'));
    balance += value;
    console.log("Balance");
    localStorage.setItem('wallet', balance.toString());
    return balance;
  }


  getPortfolioItems()  {
    
    let resArr = [];
    var portfolioCollection = this.portfolioService.getPortfolio();
    portfolioCollection.forEach((item) => {
      var quoteInfo = this.backendCallService.getStockQuote(item.ticker);
      // resArr.push([item.ticker, quoteInfo]);
      resArr.push(quoteInfo);
    });   
    console.log(resArr);
    forkJoin(resArr).subscribe((qInfoObservable) => {

    qInfoObservable.forEach((qInfo: IQuoteInfo) => {  
      for(let value of portfolioCollection) {
        if(value.ticker == qInfo.ticker) {
          value.currentPrice = qInfo.c;
        }
      }

    });

    this.portfolioService.setPortfolio(portfolioCollection);
  });
}
isEmptyPortfolio() {
  console.log("Upper empty");
  var res = this.portfolioService.isEmptyPortfolio();
  console.log(res);
  return res;
}
getLocalStorage() {
    
  return this.portfolioService.getPortfolio();
}

  openBuyModal(ticker, currPrice) {
    const buyModalRef = this.buyModalService.open(BuyModalComponent);
    buyModalRef.componentInstance.ticker = ticker; 
    this.ticker = ticker;   
    buyModalRef.componentInstance.currPrice = currPrice;
    buyModalRef.result.then((recItem) => {
      // trigger opt alert
      console.log(recItem);
      // for buy alert
      this.buySuccess.next('Message successfully changed.');
    });
  }

  openSellModal(ticker, currPrice) {
    const sellModalRef = this.sellModalService.open(SellModalComponent);
    sellModalRef.componentInstance.ticker = ticker;    
    this.ticker = ticker;
    sellModalRef.componentInstance.currPrice = currPrice;
    sellModalRef.result.then((recItem) => {
      // trigger opt alert
      console.log(recItem);
      // for buy alert
      this.sellSuccess.next('Message successfully changed.');
    });
  }

  getChange(val) {
    return (val).toFixed(2);
  }
}
