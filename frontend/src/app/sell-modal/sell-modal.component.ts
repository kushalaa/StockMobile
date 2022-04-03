import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioServiceService } from '../services/portfolio-service.service';
@Component({
  selector: 'app-sell-modal',
  templateUrl: './sell-modal.component.html',
  styleUrls: ['./sell-modal.component.css']
})
export class SellModalComponent implements OnInit {
  quantityVal;
  ticker;
  currPrice;
  constructor(public sellModalService: NgbActiveModal, private portfolioService : PortfolioServiceService) { }

  ngOnInit(): void {
    this.portfolioService.initializeWallet(25000);

  }


  getBalance() {
    return this.portfolioService.getBalance();
  }

  quantityValidLess(quantity) {
    if(quantity < 0) {
      return false;
    }
    return true; 
  }

  quantityValidGreater(quantity) {
    var quantityTicker = -1;
    var portfolio = this.portfolioService.getPortfolio();
    for(let value of portfolio) {
      if(value.ticker == this.ticker) {
        quantityTicker = value.quantity;
        break;
      }
    }

    if(quantityTicker == -1 || quantity > quantityTicker) {
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

  existsInPortfolio() {
    var portfolio = this.portfolioService.getPortfolio();
    for(let value of portfolio) {
      if(value.ticker == this.ticker) {
        return true;
      }
    }
    
    return false;
  }
  removeBalance(currPrice, tickerVal, quantityVal) {
    var balance = this.portfolioService.getBalance();
    var totalPrice = currPrice*quantityVal;
    balance += totalPrice;
    this.portfolioService.setBalance(balance);


    var portfolioCollection = this.portfolioService.getPortfolio();
    for(let value of portfolioCollection) {
      console.log(value);
      if(value.ticker == tickerVal) {

        if(value.quantity == quantityVal) {
          //remove from portfolio
          const index = portfolioCollection.indexOf(value, 0);
          if (index > -1) {
            portfolioCollection.splice(index, 1);
          }
        } else {
          // modify portfolio 
          console.log("inside");
          value.totalCost = value.totalCost - (quantityVal * value.avgCost);
          value.quantity -= quantityVal;
          value.avgCost = (value.totalCost/value.quantity);
          console.log(value.totalCost);
        }
        break;
      }
    }

    this.portfolioService.setPortfolio(portfolioCollection);
    return balance;
  }

  isEmptyPortfolio() {
    return this.portfolioService.isEmptyPortfolio();
  }
}
