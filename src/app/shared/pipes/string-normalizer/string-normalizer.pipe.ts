import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringNormalizer'
})
export class StringNormalizerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return value;
    }
    let newValue = value;
      if (args.subString) {
        const fromIndex = args.subString.from ? args.subString.from : 0;
        const toIndex = args.subString.to ? args.subString.to : value.length;
        newValue = value.slice(fromIndex, toIndex);
      }
    return newValue;
  }

}
