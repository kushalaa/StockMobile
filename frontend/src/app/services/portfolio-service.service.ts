import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/* Service is going to handle all portfolio related local storage operations
*/
export class PortfolioServiceService {

  constructor() { }
  initializeWallet(val) {
    if(localStorage.getItem('wallet') == null) {
      localStorage.setItem('wallet', val.toString());
    }
  }
  getBalance() {
    return  parseFloat(localStorage.getItem('wallet'));
  }

  setBalance(balance: number) {
    localStorage.setItem('wallet', balance.toString());
  }

  getPortfolio() {
    var portfolio = JSON.parse(localStorage.getItem('portfolio'));
    if(portfolio != null) {
      return portfolio;
    }
    return [];
  }

  setPortfolio(portfolio) {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }

  isEmptyPortfolio() {
    var portfolioCollection = JSON.parse(localStorage.getItem('portfolio'));
    console.log(portfolioCollection.length);
    if(portfolioCollection == null || portfolioCollection.length == 0) {
      console.log("inside is empty portfolio and it is emtpy");
      return true;
    } 
    return false;
  }
}
