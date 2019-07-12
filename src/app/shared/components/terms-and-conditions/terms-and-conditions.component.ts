import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'mp-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model and return the selected timezone to plan component
   */
  closeModal () {
    this.modalController.dismiss();
  }

}
