import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'getLocalTime'
})
export class GetLocalTimePipe extends DatePipe implements PipeTransform {

  transform(value: any, timeFormat: string): any {

    if (!value) {
      return '';
    }

    return super.transform(new Date(value), timeFormat);
  }
}
