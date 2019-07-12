import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalizedAlertService {

  constructor(private translateService: TranslateService, private alertController: AlertController) { }

  /**
   * @author Nermeen Mattar
   * @description localizes all the texts alert dialogs
   * @param alertObj
   */
  async displayLocalizedAlert(alertObj, addExtraContent?: string, noMessagetranslate?: boolean) {
    this.updateWithLocalizedTextIfExist(alertObj, 'header');
    if (!noMessagetranslate) {
      this.updateWithLocalizedTextIfExist(alertObj, 'message', addExtraContent);
    }
    if (alertObj.buttons) {
      alertObj.buttons.forEach(button => {
        this.updateWithLocalizedTextIfExist(button, 'text');
      });
    }
    if (alertObj.inputs) {
      alertObj.inputs.forEach(input => {
        this.updateWithLocalizedTextIfExist(input, 'placeholder');
        this.updateWithLocalizedTextIfExist(input, 'label');
      });
    }
    const alertController = await this.alertController.create(alertObj);
    alertController.present();
  }

  /**
   * @author Nermeen Mattar
   * @description Updated the passed property "propertyName" with its translation if it exists in the passed object
   * @param obj
   * @param propertyName
   */
  updateWithLocalizedTextIfExist(obj, propertyName: string, addExtraContent = '') {
    if (obj[propertyName]) {
      this.translateService.get(obj[propertyName])
        .pipe(
          first()
        )
        .subscribe(translated => obj[propertyName] = translated + ' ' + addExtraContent);
    }
  }
}
