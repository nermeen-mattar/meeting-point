import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedTextModifier'
})
export class LocalizedTextModifierPipe implements PipeTransform {

  transform(value: string, changeType: string, ...data): any {
    let newValue: string;
    switch (changeType) {
      case 'inject': {
        newValue = value.replace('$$', data[0]);
        break;
      }
    }
    return newValue;
  }

}
