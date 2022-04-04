import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BackendCallService } from '../services/backend-call.service';
import * as Highcharts from 'highcharts';
import { splitNsName } from '@angular/compiler';
import { CompanyEarningsService } from '../services/company-earnings.service';
import { CompanySentimentsService } from '../services/company-sentiments.service';
import { CompanyRecService } from "../services/company-rec.service";
@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit, OnChanges {
  @Input() ticker:string;
  @Input() companyName: string;
  // redditInfo = [];
  highcharts = Highcharts;
  positiveMentionsReddit = 0;
  negativeMentionsReddit = 0;
  positiveMentionsTwitter = 0;
  negativeMentionsTwitter = 0;
  totalMentionsReddit = 0;
  totalMentionsTwitter = 0;
  isLoadingInsight = false;
  chartOptionsRec;
  chartOptionsEarnings;
  earningsInfo;
  constructor(private backEndService: BackendCallService, private compEarningsService: CompanyEarningsService, private compSentimentService: CompanySentimentsService, private compRecService: CompanyRecService) { }
  // twitterInfo = [];
  ngOnInit(): void {
    this.compEarningsService.share.subscribe((res) => {

      if(this.ticker == '') {
        this.clearStateInfo();
      } else {
        this.createHistoricalChart(this.getESPInfo(res));
      }
      // this.earningsInfo = res;
    }
    );

    this.compSentimentService.share.subscribe((insight) => {
      this.positiveMentionsReddit = 0;
      this.negativeMentionsReddit = 0;
      this.positiveMentionsTwitter = 0;
      this.negativeMentionsTwitter = 0;
      this.totalMentionsReddit = 0;
      this.totalMentionsTwitter = 0;
      var i = 0;
      console.log("insights sentiment");
      console.log(insight);
      for(i; i < insight['reddit'].length; i++) {

        this.positiveMentionsReddit += insight['reddit'][i]['positiveMention'];
        this.negativeMentionsReddit += insight['reddit'][i]['negativeMention'];
        this.totalMentionsReddit += insight['reddit'][i]['mention'];
      }
      i = 0;
      for(i; i < insight['twitter'].length; i++) {

        this.positiveMentionsTwitter += insight['twitter'][i]['positiveMention'];
        this.negativeMentionsTwitter += insight['twitter'][i]['negativeMention'];
        this.totalMentionsTwitter += insight['twitter'][i]['mention'];
      }
      // this.insightInfo = insight;
      //console.log('Insight');
      //console.log(insight);
      // this.isLoading= false;      
    }
    );

    this.compRecService.share.subscribe((res) => {
      this.createRecommendChart(this.getRecInfo(res));
      // this.isLoading= false;
    }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.getInsights();
      this.getRecommendations();
      this.getEarnings();
  }

  clearStateInfo() {
    this.compEarningsService.clearState();
    this.compRecService.clearState();
    this.compSentimentService.clearState();
  }
  getInsights() {
    // this.backEndService.getInsights(this.ticker).subscribe((insight) => {
    //   this.positiveMentionsReddit = 0;
    //   this.negativeMentionsReddit = 0;
    //   this.positiveMentionsTwitter = 0;
    //   this.negativeMentionsTwitter = 0;
    //   this.totalMentionsReddit = 0;
    //   this.totalMentionsTwitter = 0;
    //   var i = 0;
    //   for(i; i < insight['reddit'].length; i++) {

    //     this.positiveMentionsReddit += insight['reddit'][i]['positiveMention'];
    //     this.negativeMentionsReddit += insight['reddit'][i]['negativeMention'];
    //     this.totalMentionsReddit += insight['reddit'][i]['mention'];
    //   }
    //   i = 0;
    //   for(i; i < insight['twitter'].length; i++) {

    //     this.positiveMentionsTwitter += insight['twitter'][i]['positiveMention'];
    //     this.negativeMentionsTwitter += insight['twitter'][i]['negativeMention'];
    //     this.totalMentionsTwitter += insight['twitter'][i]['mention'];
    //   }
    //   // this.insightInfo = insight;
    //   //console.log('Insight');
    //   //console.log(insight);
    //   // this.isLoading= false;
    // });

    this.compSentimentService.getSentimentsVal(this.ticker);

  }
  
  getRecommendations() {
    // this.backEndService.getRecommendations(this.ticker).subscribe((recommendations) => {
    //   console.log(recommendations);   
    //   this.createRecommendChart(this.getRecInfo(recommendations));
    //   // this.isLoading= false;
    // });
    this.compRecService.getRecsVal(this.ticker);
  }

  getRecInfo(rec) {
    var i;
    var strongSell=[];
    var sell = [];
    var buy = [];
    var strongBuy = [];
    var hold = [];
    var periods = [];

    for(i = 0; i < rec.length; i++) {
      var strongSellVal = rec[i].strongSell == null ? 0: rec[i].strongSell;
      strongSell.push(strongSellVal);

      var sellVal = rec[i].sell == null ? 0: rec[i].sell;
      sell.push(sellVal);

      var holdVal = rec[i].hold == null ? 0: rec[i].hold;
      hold.push(holdVal);
      var buyVal = rec[i].buy == null ? 0: rec[i].buy;
      buy.push(buyVal);
      var strongBuyVal = rec[i].strongBuy == null ? 0: rec[i].strongBuy;
      strongBuy.push(strongBuyVal);

      periods.push(rec[i].period);
    }

    return {
        "strongSell": strongSell,
        "sell": sell,
        "hold": hold,
        "buy": buy,
        "strongBuy": strongBuy,
        "period": periods
      }
  }
  createRecommendChart(recommendations) {
    console.log(recommendations);

    this.chartOptionsRec = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: recommendations.period,
        scrollbar: {
          enabled: true
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis'
        },

        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray'
          }
        }
      },
      // legend: {
      //   align: 'center',
      //   x: -30,
      //   verticalAlign: 'bottom',
      //   y: 30,
      //   floating: true,
      //   backgroundColor:
      //     Highcharts.defaultOptions.legend.backgroundColor || 'white',
      //   borderColor: '#CCC',
      //   borderWidth: 1,
      //   shadow: false
      // },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
      {
          name: 'Strong Buy',
          data: recommendations.strongBuy,
          color: "#166f36",
      },
      {
        name: 'Buy',
        data: recommendations.buy,
        color: "#1db24e"
      },
      {
        name: 'Hold',
        data: recommendations.hold,
        color: "#a17918"
      },

      {
        name: 'Sell',
        data: recommendations.sell,
        color: "#ce4c4f"
      },
      {
        name: 'Strong Sell',
        data: recommendations.strongSell,
        color: "#692728"
      }
    ]
    };    
  }

  getEarnings() {
    // this.backEndService.getEarnings(this.ticker).subscribe((earnings) => {
    //   // this.insightInfo = insight;
    //   //console.log('Earnings');
    //   //console.log(earnings);
    //   //console.log(earnings[0]['period']);
    //   //console.log(earnings[0]['actual']);
    //   this.createHistoricalChart(this.getESPInfo(earnings));

    //   // this.isLoading= false;
    // });

    this.compEarningsService.getEarningsVal(this.ticker);
    }

  getESPInfo(earnings) {
    var i;
    var categories=[];
    var actual = [];
    var estimate = [];

    for(i = 0; i < earnings.length; i++) {
      var surpriseVal = earnings[i].surprise == null ? 0: earnings[i].surprise;
      categories.push(earnings[i].period + ` \n Surprise:  ${surpriseVal}`);
      var actualVal = earnings[i].actual == null ? 0: earnings[i].actual; 
      actual.push(actualVal);
      var estVal = earnings[i].estimate == null ? 0: earnings[i].estimate; 
      estimate.push(estVal);
    }

    return {
        "categories": categories,
        "actual": actual,
        "estimate": estimate
      }
  }

  createHistoricalChart(earnings) {
    this.chartOptionsEarnings = {

      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
          type: 'linear',
          scrollbar: {
            enabled: true
          },
      categories: earnings.categories

      },
      yAxis: [{
        title: {
          text: 'Quarterly EPS'
        },
        // labels: {
        //   format: '{value}'
        // },
      }],
      legend: {
        enabled: false
      },
      tooltip: {
        shared: true
      },

      series: [{
        type: 'spline',
        name: 'Actual',
        data: earnings.actual,
        color: "#7bb5ec"
      },
      {
        type: 'spline',
        name: 'Estimate',
        data: earnings.estimate,
        color: "#434343"
      }
    ]
    };
  }
}
