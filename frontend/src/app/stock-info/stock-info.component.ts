import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendCallService } from '../services/backend-call.service';
import { PortfolioServiceService } from '../services/portfolio-service.service';
import { IQuoteInfo } from '../models/stockQuoteInfo';
import { ITickerInfo } from '../models/tickerInfo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsModalsComponent } from '../news-modals/news-modals.component';
import { BuyModalComponent } from '../buy-modal/buy-modal.component';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
import {from, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SellModalComponent } from '../sell-modal/sell-modal.component';
import  { CompanyProfileService } from "../services/company-profile.service";
import  { CompanyPeerService } from "../services/company-peer.service";
import  { CompanyQuoteService } from "../services/company-quote.service";
import  { CompanyNewsService } from "../services/company-news.service";
import { CompanyChartService} from "../services/company-chart.service";
import { SummaryChartService} from "../services/summary-chart.service";
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

IndicatorsCore(Highcharts);
vbp(Highcharts);
var NUM_SECONDS = 300;
// declare var require: any;
// require('highcharts/indicators/indicators')(Highcharts);
// require('highcharts/indicators/volume-by-price')(Highcharts);


@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css']
})
export class StockInfoComponent implements OnInit {
  ticker: string = '';
  logo: string = '';
  tickerProfile: ITickerInfo;
  tickerPeer: any;
  highcharts = Highcharts;
  tickerQuote: IQuoteInfo;
  tickerNews = [];
  isLoading = false;
  highChartOption;
  tickerCharts: any;
  marketOpen: boolean;
  currTime;
  timeFromQuoteInfo;
  tickerSummaryChart;
  dailyChartsFinish = false;
  histChartsFinish = false;
  profileInfoFinish = false;
  quoteInfoFinish = false;
  newsInfoFinish = false;
  peerInfoFinish = false;

  chartOptionsSummary;
  refreshed: boolean = false;
  inWatchList = false;
  private starSuccess = new Subject<string>();
  private buySuccess = new Subject<string>();
  private sellSuccess = new Subject<string>(); 
  invalidData: boolean = false;
  starMsg = '';
  buyMsg = '';
  sellMsg = '';

  constructor(private route: ActivatedRoute, private router: Router, private backEndService: BackendCallService,  private newsModalService: NgbModal, private portfolioService: PortfolioServiceService, private buyModalService: NgbModal, private sellModalService: NgbModal, private companyProfileService: CompanyProfileService, private compPeerService: CompanyPeerService, private compQuoteService: CompanyQuoteService, private compNewsService: CompanyNewsService, private compChartService: CompanyChartService, private summaryChartService: SummaryChartService) 
  { 
 
  }

  ngOnInit(): void {

    this.companyProfileService.share.subscribe( (res) => {
      console.log("THE RESULT IN TICKER PROFILE");
      // debugger
      this.profileInfoFinish = false;
      console.log(res);

      if(res.ticker == '') {
        this.invalidData = true;
        this.ticker = '';
        console.log(this.invalidData);
        // this.clearStateInfo();
      } else {
        // debugger
        this.invalidData = false;
      }
      this.tickerProfile = res;
      this.profileInfoFinish = true;
    }
    );

    this.compPeerService.share.subscribe((res) => {
      this.peerInfoFinish = false;
      var filteredPeers =[];
      for(let value of res) {
        // value == '' || value.includes('.')
        if(value == '') {
          continue;
        }
        filteredPeers.push(value);
      }
      this.tickerPeer = filteredPeers;
      this.peerInfoFinish = true;
    }
    );

    this.compQuoteService.share.subscribe((res) => {
      this.quoteInfoFinish = false;
      console.log(res);
      this.tickerQuote = res;
      this.timeFromQuoteInfo = this.tickerQuote['t']*1000;

    //   this.tickerQuote.ticker = this.ticker;
    //   this.timeFromQuoteInfo = this.tickerQuote['t']*1000;
      this.setMarketOpen(this.tickerQuote['t']*1000);
      this.getSummaryChartInfo(this.tickerQuote['t'], this.tickerQuote.ticker);
      this.quoteInfoFinish = true;
    }
    );

    this.compNewsService.share.subscribe((newsInfo) => {
      this.newsInfoFinish = false;
      console.log("news Info");
      console.log(newsInfo);
      this.tickerNews = newsInfo;
      var i=0;
      this.tickerNews = [];
      var total = 0;
      for(i = 0; i < newsInfo.length && total < 20; i++) {
        var temp_data = newsInfo[i];
        if(temp_data['image'] == '') {
          continue;
        }
        var dateNews = new Date(temp_data['datetime']*1000);
        temp_data['dateStr'] = dateNews.toDateString();
        this.tickerNews.push(temp_data);
        total++;
        this.newsInfoFinish = true;
      }
      // //console.log(newsInfo);
      // //console.log(this.tickerNews);
    });

    this.compChartService.shareVolume.subscribe((chartInfo) => {
        this.tickerCharts = chartInfo;
        console.log(this.tickerCharts);
        this.histChartsFinish = false;

          this.addCharts(this.tickerCharts);


        this.histChartsFinish = true;
    });

    this.summaryChartService.shareSummary.subscribe((chartInfo) => {
      this.tickerSummaryChart = chartInfo;
      console.log(this.tickerSummaryChart);
      this.dailyChartsFinish = false;

        this.addSummaryChart(this.tickerSummaryChart);
      this.dailyChartsFinish = true;
  });

    this.route.paramMap.subscribe((params) => {
      this.portfolioService.initializeWallet(25000);
      
      this.ticker = params.get('ticker').toUpperCase();
      // this.isLoading= true;
      // this.invalidData = false;
      console.log('ticker name in details: ' + this.ticker);
      setInterval( () => {
        if(this.ticker !='' && this.marketOpen) {
          console.log("Inside Refresh");
          this.refreshSummary();
        }
     }, 15000);

     setInterval( () => {
      if(this.ticker !='') {
        console.log("Inside Refresh");
        this.updateCurrTime();
      }
   }, 15000);
        this.getProfileInfo();
        this.presentInList();
        this.getQuoteInfo();
        this.getPeerInfo();
        this.getNewsInfo();
        this.getChartInfo();
        // this.getSummaryChartInfo(this.tickerQuote['t']);
        // for star alert -------
        this.starSuccess.subscribe(
          (message) => (this.starMsg = message)
        );
        this.starSuccess
          .pipe(debounceTime(5000))
          .subscribe(() => (this.starMsg = ''));

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
    });

  }

  clearStateInfo() {
    this.compChartService.clearState();
    this.compNewsService.clearState();
    this.compPeerService.clearState();
    this.compQuoteService.clearState();
    this.summaryChartService.clearState();
  }

  refreshSummary() {

      // this.getProfileInfo();
      this.getQuoteInfo();

    }

  getProfileInfo() {
    // this.backEndService.getStockProfile(this.ticker).subscribe((profileInfo) => {
    //   this.tickerProfile = profileInfo;
    //   // this.isLoading= false;
    // });

    if(this.marketOpen) {
      this.companyProfileService.getProfileVal(this.ticker, true);
    } else {
      this.companyProfileService.getProfileVal(this.ticker, false);
    }
    
  }

  getQuoteInfo() {
    // this.backEndService.getStockQuote(this.ticker).subscribe((quoteInfo) => {
    //   this.tickerQuote = quoteInfo;
    //   this.tickerQuote.ticker = this.ticker;
    //   this.timeFromQuoteInfo = this.tickerQuote['t']*1000;
    //   this.setMarketOpen(this.tickerQuote['t']);
    //   this.getSummaryChartInfo(this.tickerQuote['t']);

    // });
    if(this.marketOpen) {
      this.compQuoteService.getQuoteVal(this.ticker, true);
    } else {
      this.compQuoteService.getQuoteVal(this.ticker, false);
    }
    

  }

  getPeerInfo() {
    // this.backEndService.getStockPeers(this.ticker).subscribe((peerInfo) => {
    //   this.tickerPeer = peerInfo;
      // this.isLoading= false;
    // });   
      this.compPeerService.getPeerVal(this.ticker);

  }

  getNewsInfo() {
    // this.backEndService.getStockNews(this.ticker).subscribe((newsInfo) => {
    //   console.log("news Info");
    //   console.log(newsInfo);
    //   this.tickerNews = newsInfo;
    //   var i=0;
    //   this.tickerNews = [];
    //   var total = 0;
    //   for(i = 0; i < newsInfo.length && total < 20; i++) {
    //     var temp_data = newsInfo[i];
    //     if(temp_data['image'] == '') {
    //       continue;
    //     }
    //     var dateNews = new Date(temp_data['datetime']*1000);
    //     temp_data['dateStr'] = dateNews.toDateString();
    //     this.tickerNews.push(temp_data);
    //     total++;
    //   }
    //   // //console.log(newsInfo);
    //   // //console.log(this.tickerNews);
    //   this.isLoading= false;
    // });

    this.compNewsService.getNewsVal(this.ticker);
  }

  openNewsModals(news) {
    const newsModalRef = this.newsModalService.open(NewsModalsComponent);
    newsModalRef.componentInstance.news = news;
  }


  getChartInfo() {
    console.log(this.currTime);
    var dateTwoYears = new Date();
    var date = new Date();
    dateTwoYears.setFullYear( date.getFullYear() - 2);
    console.log("two years ago");
    console.log(dateTwoYears);
    this.updateCurrTime();
    var to = Math.floor(this.currTime.valueOf() / 1000);
    var from =Math.floor(dateTwoYears.valueOf() / 1000);
    console.log(from);
    this.compChartService.getChartsVolume(this.ticker, 'D', from, to);
    // this.backEndService.getHistCandles(this.ticker, 'D', from).subscribe((chartInfo) => {
    //   this.tickerCharts = chartInfo;
    //   console.log(this.tickerCharts);
    //   this.addCharts(this.tickerCharts);
    // });
    // this.isLoading= false;
  }

  getSummaryChartInfo(timeQuote, ticker) {
      console.log("Summary chart ticker");
      console.log(this.ticker);
      this.updateCurrTime();
      var to;
      if(this.marketOpen) {
        to = this.currTime.valueOf();
        console.log(new Date(to));
        console.log("in summary chart func open");
      } else {
        to = timeQuote * 1000;
        console.log("in summary chart func close");
        console.log(new Date(to));
      }
      var toDate = new Date(to);
      var fromDate = new Date(to);
      fromDate.setHours(fromDate.getHours() - 6);
      var from = fromDate.valueOf();
      from = Math.floor (from / 1000);
      to = Math.floor(to/1000);
      console.log("from date summary");
      console.log(fromDate);
      console.log(toDate);
      if(this.marketOpen) {
        this.summaryChartService.getChartsSummary(ticker, '5', from, to, true);
      } else {
        this.summaryChartService.getChartsSummary(ticker, '5', from, to, false);
      }
      
      // this.backEndService.getHistCandles(this.ticker, '5', from).subscribe((chartInfo) => {
      //   this.tickerSummaryChart = chartInfo;
      //   console.log(this.tickerSummaryChart);
      //   this.addSummaryChart(this.tickerSummaryChart);
      // });      
    }

  setMarketOpen(timeQuote) {
    this.updateCurrTime();
    var timeDiff = Math.floor((this.currTime - timeQuote)/1000);
    console.log("time difference");
    console.log(timeQuote);
    console.log(timeDiff);
    if(timeDiff >= NUM_SECONDS) {
      this.marketOpen = false;
    } else {
      this.marketOpen = true;
    }    
  }

  addSummaryChart(summaryChart) {
    let valuesArr = [], timeArr=[], dataLen;

    if(summaryChart['t']) {
      dataLen = summaryChart['t'].length; 
    } else {
      dataLen = 0;
    }

    for(var i = 0; i < dataLen; i++) {
      var  time = summaryChart['t'][i];
      valuesArr.push([time * 1000,summaryChart['c'][i]]);
    }
    console.log("value Arr");
    console.log(valuesArr);
    this.chartOptionsSummary = {

      title: {
        text: this.ticker + ' Hourly Price Variation',
        // useHTML: true,
      },

      chart: {
        marginRight: 20,
        marginLeft: 20
      },
      xAxis: {
          type: 'datetime',
          useUTC: false,
          scrollbar: {
              enabled: true
          }
      },
      yAxis: [{
          labels: {
              align: 'right',
          },
          title: {
              text: '',
          },
          opposite: true,
      }],   
      legend: {
      enabled: false
      },      
      series: [{
        type: 'line',
        name: 'Stock Price',
        data: valuesArr,
        color: (this.tickerQuote.d > 0 ) ? "var(--bs-success)" : "var(--bs-danger)",
        // Need to add color here
        marker: {
            enabled: false
        },
        threshold: null
      },

    ],
    time: {
      timezoneOffset: 7 * 60
    },

    };

  }

  addCharts(chart) {
  // split the data set into ohlc and volume
  //console.log('inside add charts');
  //console.log(chart);
  var ohlc = [],
    volume = [],
    dataLength,
    // set the allowed units for data grouping
    groupingUnits = [[
      'week',             // unit name
      [1]               // allowed multiples
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]],

    i = 0;
    if(chart['t']) {
      dataLength = chart['t'].length; 
    } else {
      dataLength = 0;
    }
  for (i; i < dataLength; i++) {
   var  time = chart['t'][i];
   var timeStp = time * 1000;
    // //console.log(chart['t'][i]);
    ohlc.push([
      // the date
      timeStp,
      chart['o'][i], // open
      chart['h'][i], // high
      chart['l'][i], // low
      chart['c'][i] // close
    ]);

    volume.push([
      timeStp, // the date
      chart['v'][i] // the volume
    ]);
  }

  // //console.log('OLC');
  // //console.log(ohlc);

  // //console.log('Vol');
  // //console.log(volume);
  // create the chart
  this.highChartOption = {

    rangeSelector: {
      enabled: true,
      buttons: [
        {
          type: 'month',
          count: 1,
          text: '1m',
        },
        {
          type: 'month',
          count: 3,
          text: '3m',
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
        },
        {
          type: 'ytd',
          text: 'YTD',
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
        },
        {
          type: 'all',
          text: 'All',
        },
      ],
      selected: 2,
    },

    title: {
      text: this.ticker + ' Historical'
    },

    subtitle: {
      text: 'With SMA and Volume by Price technical indicators'
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [{
      startOnTick: false,
      endOnTick: false,
      opposite: true,
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
        enabled: true
      }
    }, {
      labels: {
        align: 'right',
        x: -3
      },
      opposite: true,
      title: {
        text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2
    }],
    legend: {
      enabled: false
    },
    tooltip: {
      split: true
    },
      navigator:{
        enabled:true,
    },
    scrollbar: {
        enabled: true
    },
    // plotOptions: {
    //   series: {
    //     pointWidth: 3
    //   }
    // },

    series: [{
      type: 'candlestick',
      name: this.ticker,
      id: 'olhc',
      zIndex: 2,
      data: ohlc
    }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: volume,
      yAxis: 1
    }, {
      type: 'vbp',
      linkedTo: 'olhc',
      params: {
        volumeSeriesID: 'volume'
      },
      dataLabels: {
        enabled: false
      },
      zoneLines: {
        enabled: false
      }
    }, {
      type: 'sma',
      linkedTo: 'olhc',
      zIndex: 5,
      marker: {
        enabled: false
      }
    }]
  };    
  }

  updateCurrTime() {
    this.currTime = Date.now();
  }

  isinValidData() {
    console.log("IS INVALID DATA");
    console.log(this.invalidData);
    return this.invalidData;
  }

presentInList() {
  let watchlistArr = localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : [];
  let result = watchlistArr.filter(
    (data) => data.ticker === this.ticker.toUpperCase()
  );
  if (result.length) {
    this.inWatchList = true;
  } else {
    this.inWatchList = false;
  }
}

starClicked() {
  this.inWatchList = !this.inWatchList;
  let watchlistArr, watchlistArrNew;

  watchlistArr = localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')): [];
  if (this.inWatchList) {
    // add ticker to watchlist
    let watchlistItemNew = {
      ticker: this.ticker.toUpperCase(),
      name: this.tickerProfile.name,
    };
    watchlistArr.push(watchlistItemNew);
    localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
  } else {
    // remove ticker from watchlist
    watchlistArrNew = watchlistArr.filter(
      (data) => data.ticker != this.ticker.toUpperCase()
    );
    localStorage.setItem('watchlist', JSON.stringify(watchlistArrNew));
  }
  this.starSuccess.next('Message successfully changed.');
}

openBuyModal() {
  const buyModalRef = this.buyModalService.open(BuyModalComponent);
  buyModalRef.componentInstance.ticker = this.ticker;    
  buyModalRef.componentInstance.currPrice = this.tickerQuote.c;
  buyModalRef.componentInstance.company = this.tickerProfile.name;
  buyModalRef.result.then((recItem) => {
    // trigger opt alert
    console.log(recItem);
    // for buy alert
    this.buySuccess.next('Message successfully changed.');
  });
}

canBuy() {
  var balance = this.portfolioService.getBalance();
  if(balance == null || balance < 0) {
    return false;
  } 
  return true;
}

openSellModal() {
  const sellModalRef = this.sellModalService.open(SellModalComponent);
  sellModalRef.componentInstance.ticker = this.ticker;    
  sellModalRef.componentInstance.currPrice = this.tickerQuote.c;
  sellModalRef.result.then((recItem) => {
    // trigger opt alert
    console.log(recItem);
    // for buy alert
    this.sellSuccess.next('Message successfully changed.');
  });
}

canSell() {
  var portfolio = this.portfolioService.getPortfolio(); 
  for(let value of portfolio) {
    if(value.ticker == this.ticker) {
      if(value.quantity > 0) {
        return true;
      }
    }
  }
  return false;
}

getChange(change) {
  return change.toFixed(2);
}

getTicker(option) {
  
  var str = 'search/' + option;
  this.router.navigateByUrl(str);
}
}