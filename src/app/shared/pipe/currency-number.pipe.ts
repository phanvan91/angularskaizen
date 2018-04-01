import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalNumber'
})
export class CurrencyNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const input = ('' + value).replace(/[^0-9.]/g, '');
    return parseFloat(input).toLocaleString('en-US');
  }

}
