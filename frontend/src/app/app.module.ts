import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BackgroundImgComponent } from './background-img/background-img.component';
import { SearchWrapperComponent } from './search-wrapper/search-wrapper.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { StockInfoComponent } from './stock-info/stock-info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import { InsightsComponent } from './insights/insights.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NewsModalsComponent } from './news-modals/news-modals.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SellModalComponent } from './sell-modal/sell-modal.component';
import { BuyModalComponent } from './buy-modal/buy-modal.component'
// import { HighchartsChartComponent } from 'highcharts-angular';
// import {MatIconModule} from '@angular/material/icon';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BackgroundImgComponent,
    SearchWrapperComponent,
    SearchBarComponent,
    PortfolioComponent,
    WatchlistComponent,
    StockInfoComponent,
    InsightsComponent,
    NewsModalsComponent,
    SellModalComponent,
    BuyModalComponent,
    // HighchartsChartComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule ,
    MatTabsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCardModule,
    HighchartsChartModule,
    NgbModule,
    // MatIconModule,
    // FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
