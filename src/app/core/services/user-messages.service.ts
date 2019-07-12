import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { UserMessages } from '../models/user-messages.model';

@Injectable({
  providedIn: 'root'
})
export class UserMessagesService {

  constructor(public toastController: ToastController, private translateService: TranslateService) {}

  showUserMessage(userMessages: UserMessages, messageType, err ? ) {
    if (messageType === 'fail') {
      if (userMessages && userMessages.fail === 'NO_ERROR_MESSAGE') {
        return; // do not display an error message
      }
      if (!userMessages || userMessages.fail === undefined) {
        userMessages = this.getFailMessage(userMessages, err);
      }
    }
    if (userMessages && userMessages[messageType]) {
      this.translateService.get('USER_MESSAGES.'.concat(userMessages[messageType])).subscribe(
        translatedMessage => {
          this.presentMessage({
            message: translatedMessage,
            duration: 1500,
            cssClass: messageType === 'success' ? 'bg-success' : 'bg-error'
          });
        }
      );
    }
  }

  async presentMessage({message = '', duration = 3000, cssClass = ''}) {
    const toast = await this.toastController.create({
      message,
      duration,
      cssClass
    });
    toast.present();
  }

  getFailMessage(userMessages: UserMessages, err): UserMessages {
    const userFailMessage = {
      fail: null
    };
    if (err && err.error && err.error.message) {
      const translationKey = 'BACKEND.'.concat(err.error.message.toUpperCase());
      this.translateService.get('USER_MESSAGES.'.concat(translationKey)).subscribe(
        translatedMessage => {
          if (!translatedMessage.includes(translationKey)) {
            userFailMessage.fail = translationKey;
          }
          /* else if check status code (use constants and requests class)
            ex else if(reqeuestsClass.unauthorized(err)) {
              // 403 and 401 same handling

            }
          */
        }
      );
    }
    if (!userFailMessage.fail) {
      userFailMessage.fail = userMessages && userMessages.failDefault ? userMessages.failDefault : 'SOMETHING_WENT_WRONG';
    }
    return userFailMessage;
  }
}
