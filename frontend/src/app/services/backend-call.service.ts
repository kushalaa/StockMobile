import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ITickerInfo} from '../models/tickerInfo';
import { Observable } from 'rxjs';
import { IQuoteInfo } from '../models/stockQuoteInfo';
import { INewsInfo } from '../models/newsInfo';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendCallService {
  dataType: any;
  uri = 'https://stockbackend-346205.wl.r.appspot.com/';

  constructor(private http: HttpClient) {}

  getStockProfile(ticker: string): Observable<ITickerInfo>{
    // this.http.get(`${this.uri}/stock_profile?stockName=AAPL`).subscribe(data => {
    //   this.dataType = data;
    //   console.log(this.dataType);
    //   }, error => console.error(error));
    // console.log('Inside stock profile func');
    return this.http.get<ITickerInfo>(`${this.uri}/stock_profile?stockName=`+ticker); // TODO: Error handling
  }

  getStockQuote(tickerName: string): Observable<IQuoteInfo>{
    // console.log('Inside stock quote func');
    return this.http.get<IQuoteInfo>(`${this.uri}/stock_quote?stockName=`+tickerName).pipe(map(response => ({...response, 'ticker': tickerName})));; // TODO: Error handling
  }

  // getStockAutoComplete(ticker: string): Observable<IAutoCompleteInfo[]>{
  //   return this.http.get<IAutoCompleteInfo[]>(`${this.uri}/stock_autocomplete?stockName=`+ticker); // TODO: Error handling
  // }
  getStockAutoComplete(ticker: string) {

    return this.http.get(`${this.uri}/stock_autocomplete?stockName=`+ticker); // TODO: Error handling
  } 

  getStockPeers(ticker: string) {

    return this.http.get(`${this.uri}/stock_peers?stockName=`+ticker); // TODO: Error handling
  }

  getStockNews(ticker: string): Observable<INewsInfo[]> {
    return this.http.get<INewsInfo[]>(`${this.uri}/stock_news?stockName=`+ticker); // TODO: Error handling
  }

  getInsights(ticker: string) {

    return this.http.get(`${this.uri}/stock_sentiment?stockName=`+ticker); // TODO: Error handling
  }

  getRecommendations(ticker: string) {
    return this.http.get(`${this.uri}/stock_recommendations?stockName=`+ticker); // TODO: Error handling 
  }

  getEarnings(ticker:string) {
    return this.http.get(`${this.uri}/stock_earnings?stockName=`+ticker); // TODO: Error handling  
  }

  getHistCandles(ticker:string, resolution: string, from, to) {
    console.log(`${this.uri}/stock_candle?stockName=`+ticker+'&resolution='+resolution+'&from='+ from+'&to=' + to);
    return this.http.get(`${this.uri}/stock_candle?stockName=`+ticker+'&resolution='+resolution+'&from='+ from + '&to=' + to); // TODO: Error handling  
  }
}
