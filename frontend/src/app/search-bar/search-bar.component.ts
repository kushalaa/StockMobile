import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';

import { BackendCallService } from '../services/backend-call.service';
// import { ITickerInfo } from '../tickerInfo';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  filteredData = [];
  formGrp!: FormGroup;
  filtered = [1, 2 ,3];
  private inputs = new Subject<string>();
  ticker!: string;
  isLoading = false;

  constructor(
    private buildForm: FormBuilder,
    private router: Router,
    private backEndService: BackendCallService
  ){}

  ngOnInit(): void {

    this.formGrp = this.buildForm.group({ tickerIn: '' });
    this.formGrp.get('tickerIn')
    .valueChanges.pipe(
      debounceTime(300),
      tap(() => (this.isLoading = true)),
      switchMap((value) =>
        this.backEndService
          .getStockAutoComplete(value)
          .pipe(finalize(() => (this.isLoading = false)))
      )
    )
    .subscribe(data => {
      
      var i=0;
      this.filteredData = [];
      for(i = 0; i < data['count']; i++) {
        var temp_data = data['result'][i];
        if(temp_data['symbol'].includes('.')) {
          continue;
        }
        if(temp_data['type'] != "Common Stock") {
          continue;
        }
        console.log(temp_data);
        this.filteredData.push(temp_data);
      }
      console.log("Inside init");
      console.log(this.filteredData);
    });
    // this.backService.getStockProfile('TLSA').subscribe(data => {
    //   this.filteredData = data;
    //   console.log("Inside init");
    //   console.log(this.filteredData);
    // });
    // console.log(this.filteredData);
  }

  onSubmit(tickerData) {
    if (tickerData.tickerIn.ticker) {
      this.ticker = tickerData.tickerIn.ticker;
    } else {
      this.ticker = tickerData.tickerIn;
    }
    console.log('ticker name in form: ', this.ticker);
    console.log(this.filteredData);
    // TODO: Check how to not lose form data on routing
    this.router.navigateByUrl('search/' + this.ticker);
    // this.searchForm.reset();
  }

  clearDetails() {
    // TODO: Check what else to clear
    this.ticker = '';
    console.log('ticker clear: ', this.ticker);
    this.router.navigateByUrl('');
    this.filteredData = [];
    console.log(this.filteredData);
    this.formGrp.reset();
    this.isLoading = false;
  }

  changeInput(input: string): void {
    input = input.trim();
    if (input) {
      this.inputs.next(input);
    }
    this.ticker = '';
  }


}
