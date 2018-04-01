import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const d = new Date(value);
    return (d.getDate()>9?d.getDate().toString():'0'+d.getDate()) + '-'+
           (d.getMonth() + 1 >9?d.getMonth() + 1:'0'+ (d.getMonth() + 1)) + '-' +
           d.getFullYear();
  }

}
