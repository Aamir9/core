import { Directive, Optional, Self } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import * as moment from 'moment';

// create directive for input type date to work with moment.Moment type in angular
@Directive({
  selector: '[dateConverter]',
  providers: [{ provide: NgControl, useExisting: DateConverterDirective }]
})
export class DateConverterDirective {
  constructor(@Self() @Optional() public ngModel: NgModel) {
    
    ngModel.valueAccessor = this;
  }
  writeValue(value: any): void {
    console.log("working");
    const date = moment(value, 'YYYY-MM-DD');
    this.viewToModelUpdate(date);
  }

  registerOnChange(fn: any): void {
    this.viewToModelUpdate = fn;
  }

  registerOnTouched(fn: any): void {
    this.viewToModelUpdate = fn;
  }
  viewToModelUpdate(value: any) {
    this.ngModel.viewToModelUpdate(value);
  }
}