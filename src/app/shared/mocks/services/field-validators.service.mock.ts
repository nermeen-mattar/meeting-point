import { ValidatorFn, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class FieldValidatorsMockService {

  public getValidator(validatorName: string, specifications ? ): ValidatorFn {
   return  (): ValidatorFn => {
    return (group: FormGroup): {
      [key: string]: any
    } => {
      return group.controls.startTime.value < group.controls.endTime.value ?
        null : {
          validateSecondGreaterThanFirst: {
            errorMsg: 'END_SHOULD_BE_AFTER_START'
          }
        };
    };
   };
  }
}
