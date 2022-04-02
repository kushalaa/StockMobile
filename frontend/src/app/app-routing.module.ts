import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchWrapperComponent } from './search-wrapper/search-wrapper.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { StockInfoComponent } from './stock-info/stock-info.component';

const routes: Routes = [
  {path: 'search/home', component: SearchWrapperComponent},
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: '',redirectTo: '/search/home', pathMatch: 'full' },
  { path: 'search/:ticker', component: StockInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
