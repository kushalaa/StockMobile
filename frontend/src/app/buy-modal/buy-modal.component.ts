import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioServiceService } from '../services/portfolio-service.service';
@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.css']
})
export class BuyModalComponent implements OnInit {
  quantityVal;
  ticker;
  company;
  currPrice;

  constructor(public buyModalService: NgbActiveModal, private portfolioService : PortfolioServiceService){ }

  ngOnInit(): void {
    this.portfolioService.initializeWallet(25000);
  }


  getBalance() {
    return this.portfolioService.getBalance();
  }

  quantityValid(quantity) {
    if(quantity < 0) {
      return false;
    }
    return true;
  }
  validInput(quantity) {
    if(quantity == null) {
      return false;
    }
    return true;
  }
  sufficientMoney(currentPrice, quantity) {
    var totalPrice = currentPrice*quantity;
    if(totalPrice > this.portfolioService.getBalance()) {
      return false;
    }
    return true;
  }
  updateBalance(currPrice, tickerVal, quantityVal) {
    var balance = this.portfolioService.getBalance();
    var totalPrice = currPrice*quantityVal;
    balance -= totalPrice;
    this.portfolioService.setBalance(balance);


    var portfolioCollection = this.portfolioService.getPortfolio();
    for(let value of portfolioCollection) {
      console.log(value);
      if(value.ticker == tickerVal) {
        console.log("inside");
        value.totalCost += totalPrice;
        value.quantity += quantityVal;
        value.avgCost = (value.totalCost/value.quantity);
        console.log(value.totalCost);
        this.portfolioService.setPortfolio(portfolioCollection);
        return balance;
      }
    }

    var tickerDetails = {
      ticker: tickerVal,
      companyName: this.company,
      totalCost: totalPrice,
      avgCost:totalPrice/quantityVal,
      currentPrice: currPrice,
      quantity: quantityVal
    }

    portfolioCollection.push(tickerDetails);
    this.portfolioService.setPortfolio(portfolioCollection);

    return balance;
  }

  isEmptyPortfolio() {
    return this.portfolioService.isEmptyPortfolio();
  }

}
