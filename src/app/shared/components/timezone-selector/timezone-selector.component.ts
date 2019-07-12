import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Component({
  selector: 'app-timezone-selector',
  templateUrl: './timezone-selector.component.html',
  styleUrls: ['./timezone-selector.component.scss'],
})
export class TimezoneSelectorComponent implements OnInit {

  timezonesList: any[];
  filteredTimezones: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  selectedTimeZone;
  constructor(
    public modalController: ModalController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.selectedTimeZone = this.navParams.data.selectedTimeZone;
    const timezonesArray = moment.tz.names();
    this.getTimezonesList(timezonesArray);
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model and return the selected timezone to plan component
   */
  closeModal (timezone = null) {
    this.modalController.dismiss({
      'result': timezone
    });
  }

  /**
   * @author Syed Saad Qamar
   * @description user select a timezone and assign to the selectedTimezone
   * @param color selected color
   */
  timeZoneSelect(timezone) {
    this.selectedTimeZone = timezone;
    this.closeModal(timezone);
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description push timezones list in an array with key values
  * @returns {timezonesArray}
  */
  getTimezonesList(timezonesArray) {
    this.timezonesList = [];
    timezonesArray.forEach((zone) => {
      this.timezonesList.push({ id: zone, name: '( ' + moment.tz(zone).format('Z') + ' )  ' + zone });
    });
    // load the initial bank list
    this.filteredTimezones.next(this.timezonesList.slice());
  }

  onTimezoneSearch(event) {
    this.filterTimzones(event.target.value);
  }

  filterTimzones(filterVal) {
    if (!this.timezonesList) {
      return;
    }
    // get the search keyword
    let search = filterVal;
    if (!search) {
      this.filteredTimezones.next(this.timezonesList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTimezones.next(
      this.timezonesList.filter(tz => tz.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
