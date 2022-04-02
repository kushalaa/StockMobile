import { Component, OnInit } from '@angular/core';
import { BackendCallService } from '../services/backend-call.service';
import { Router } from '@angular/router';
import {forkJoin } from 'rxjs';
import  {IQuoteInfo } from "../models/stockQuoteInfo";


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})

export class WatchlistComponent implements OnInit {
  emptyList;
  listCollection;
  listDetails;
  // fetchSubscribe: Subscription;

  constructor(private router: Router, private backendCallService: BackendCallService) { }

  ngOnInit(): void {
    this.getInfoItems();
    // addLocalStorage();
    // this.isEmptyList();
    // this.listDetails = mockInfoArr;
    // this.removeItem('AAPL');

  }
  // get from watch list
  // add to watchlist
  // call for change percent and what not
  // remove from watch list
  isEmptyList() {
    this.listCollection = localStorage.getItem('watchlist');

    if(this.listCollection) {
      this.listCollection = JSON.parse(localStorage.getItem('watchlist'));
    } else {
      this.listCollection = [];
    }

    if(this.listCollection.length == 0) {
      this.emptyList = true;
    } else {
      this.emptyList = false;
    }
  }

  getInfoItems() {
      this.isEmptyList();
      let resArr = [];
      this.listCollection.forEach((item) => {
        var quoteInfo = this.backendCallService.getStockQuote(item.ticker);
        // resArr.push([item.ticker, quoteInfo]);
        resArr.push(quoteInfo);
      });   
      console.log(resArr);
      forkJoin(resArr).subscribe((qInfoObservable) => {
      console.log("Result is");
      console.log(qInfoObservable[0]);
      let details = [];
      console.log(qInfoObservable.length);
       
      qInfoObservable.forEach((qInfo: IQuoteInfo) => {  
        console.log("Inside loop");
        console.log( qInfo.ticker);
        let tickerName = this.listCollection.filter((data) => data.ticker === qInfo.ticker)[0].name;
        let tickerDetails = {
          ticker: qInfo.ticker,
          change: qInfo.d,
          changePercent: qInfo.dp,
          lastPrice: qInfo.l,
          name: tickerName

        }
        console.log(tickerDetails);
        details.push(tickerDetails);
      });
      console.log("Info Arr");
      console.log(details);
      this.listDetails = details;
      console.log(this.listDetails);
    });
  }

  public removeItem(tickerInfo) {
    console.log('remove');
    console.log(tickerInfo);
    var indexToRem = this.listDetails.indexOf(tickerInfo);
    this.listDetails.splice(indexToRem, 1);
    let prevList = JSON.parse(localStorage.getItem('watchlist'));
    let updatedList = prevList.filter((data) => data.ticker != tickerInfo.ticker);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
    this.isEmptyList();
  }

  routeToDetails(ticker) {
    this.router.navigateByUrl('search/' + ticker);
  }
}
