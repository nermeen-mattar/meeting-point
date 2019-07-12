import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { format } from 'date-fns';

import { LocalizedAlertService } from './../core/services/localized-alert.service';
import { EventsService } from '../core/services/events.service';
import { TeamsService } from '../core/services/teams.service';
import { FieldValidatorsService } from '../core/services/field-validators.service';
import { MpEvent } from '../core/models/mp-event.model';
import { MpEventTypeValues } from '../core/models/mp-event-type-values';
import * as moment from 'moment-timezone';
import { MpDateAdapter } from '../core/services/mp-date-adapter';
import { ModalController } from '@ionic/angular';
import { TimezoneSelectorComponent } from '../shared/components/timezone-selector/timezone-selector.component';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
})
export class EventFormPage implements OnInit {
  selectedTeamId: number;
  eventGroup: FormGroup;
  displaySpinner = true;
  eventId: number; /* is undefined (in the case of event creation) */
  minDate: string;
  maxYear: string;
  minYear: string;
  categoriesList: any;
  addCategoryDialog: any;
  selectedCategory: any = null;
  newCategoryName: string;
  isCopyEvent: boolean;
  isEditEvent: boolean;
  endDateLimit: Date;
  constructor(private eventsService: EventsService, private teamsService: TeamsService,
    private localizedAlertService: LocalizedAlertService, private fieldValidatorsService: FieldValidatorsService,
    private route: ActivatedRoute, private router: Router, private dateAdapterService: MpDateAdapter,
    private modalController: ModalController, private userService: UserService) {
    this.route.queryParams.subscribe(params => {
      if (params && params.copy) {
        this.isCopyEvent = params.copy;
      }
    });
    this.endDateLimit = moment().add(1, 'years').format('YYYY-MM-DD');
  }

  updatetMinAndMaxDates() {
    const todayDate = new Date();
    let currDay = String(todayDate.getDate());
    let currMonth = String(todayDate.getMonth() + 1);
    const currYear = todayDate.getFullYear();
    if (currMonth.length === 1) {
      currMonth = '0' + currMonth;
    }
    if (currDay.length === 1) {
      currDay = '0' + currDay;
    }
    this.minYear = String(currYear);
    this.maxYear = String(currYear + 10);
    this.minDate = currYear + '-' + currMonth + '-' + currDay;
  }

  ionViewDidEnter() {
    this.updatetMinAndMaxDates();
    this.selectedTeamId = this.teamsService.selectedTeamId;
    this.initFormEditingOrCreating();
  }

  ngOnInit() { }

  changeSelectedTeam() {
    this.teamsService.selectedTeamId = this.selectedTeamId;
  }

  /**
   * @author Nermeen Mattar
   * @description checks the eventId param passed in the route to know
   * if the user is trying to create a new event or edit an existing event
   * if the eventId param not equal to 'create', a request is sent to get the event with that Id.
   */
  initFormEditingOrCreating() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
      this.isEditEvent = this.isCopyEvent ? false : true;
      this.leavePageIfWrongId();
      this.eventsService.getEvent(this.eventId).subscribe(res => {
        this.createEventForm(res);
      });
    } else {
      this.createEventForm();
    }
  }

  /**
   * @author Nermeen Mattar
   * @description navigates back if the id passed in the route does not include numbers (wrong id)
   */
  leavePageIfWrongId() {
    if (this.eventId && String(this.eventId).match(/[1-9]/g) === null) {
      this.navigateToEventsList(false);
    }
  }

  /**
   * @author Nermeen Mattar
   * @description creates the event's form groups along with their form controls. With each created form control two things are passed;
   * First the field's value which is in the recevied parameter in the case of editing, and default value in the case of creating.
   * @param {MpEvent} eventValue
   */
  createEventForm(eventValue?: MpEvent) {
    const recurringObj = eventValue && eventValue.recurringEvent ? {
      recurring: eventValue.recurringEvent.type,
      endDate: eventValue.recurringEvent.endDate
    } : {
        recurring: null,
        endDate: null
      };
    this.selectedCategory = eventValue ? eventValue.category ? eventValue.category.id : 'none' : 'none';
    this.eventGroup = new FormGroup({
      eventName: new FormControl(eventValue ? eventValue.eventName : '', [Validators.required]),
      category: new FormControl(eventValue ? eventValue.category : null),
      timezone: new FormControl(
        {
          value: this.checkTimezoneCase(), disabled: eventValue ? this.eventsService.isPast(new Date(eventValue.startTime)) : false
        }, [Validators.required]),
      startTime: new FormControl(eventValue ? this.dateAdapterService.getFormattedTime(eventValue.startTime) : '', [Validators.required]),
      endTime: new FormControl(eventValue ? this.dateAdapterService.getFormattedTime(eventValue.endTime) : '', [Validators.required]),
      /* TODO: check if they Tobi wants a toggeler then this will be uncommented. isRecurring: new FormControl(eventValue ?
        recurringObj.recurring : null), */
      recurring: new FormControl(eventValue ? recurringObj.recurring : null),
      endDate: new FormControl(eventValue ? recurringObj.endDate : '', [Validators.required]),
      date: new FormControl(eventValue ? this.dateAdapterService.getFormattedFormDate(eventValue.startTime) : '', [Validators.required]),
      location: new FormControl(eventValue ? eventValue.location : '', [Validators.required]),
      type: new FormControl(eventValue ? JSON.stringify(eventValue.type) : '0', [Validators.required]),

      min: new FormControl(eventValue ? eventValue.minCriticalValue : '', [
        this.fieldValidatorsService.getValidator('validatePositive')
      ]),
      max: new FormControl(eventValue ? eventValue.maxCriticalValue : '', [
        this.fieldValidatorsService.getValidator('validatePositive')
      ]),
      comment: new FormControl(eventValue ? eventValue.comment : '', [Validators.maxLength(600)]) // need to check the actual max
    },
      [this.fieldValidatorsService.getValidator('validateSecondGreaterThanFirst', {
        field1: 'startTime',
        field2: 'endTime'
      }),
      this.validateTimeInFuture(),
      this.fieldValidatorsService.getValidator('validateSecondGreaterThanFirst', {
        field1: 'min',
        field2: 'max'
      })
      ]
    );
    if (this.eventGroup.errors && this.eventGroup.errors.validateTimeInFuture) {
      this.eventGroup.disable();
      this.eventGroup.get('category').enable();
      this.eventGroup.clearValidators();
    }
    this.onEventTypeChange();
    this.getTeamCategories();
  }

  /**
   * @author Gurpreet Singh
   * @description returns a validator that check if the combination of the selected event date along with time are in the future.
   * @returns {ValidatorFn}
   */
  validateTimeInFuture(): ValidatorFn {
    return (group: FormGroup): {
      [key: string]: any
    } => {
      let eventDate;
      if (group.controls.date.value) {
        eventDate = new Date(group.controls.date.value);
      } else if (group.controls.startTime.value && Number(new Date(group.controls.startTime.value))) {
        eventDate = new Date(group.controls.startTime.value);
      } else {
        return null;
      }
      const isToday = eventDate.toDateString() === (new Date()).toDateString();
      const isTimeRangeSet = group.controls.startTime.value && group.controls.endTime.value;
      if (isToday) {
        if (isTimeRangeSet) {
          const hours = group.controls.startTime.value.slice(0, 2);
          const minutes = group.controls.startTime.value.slice(3, 5);
          eventDate.setHours(hours);
          eventDate.setMinutes(minutes);
        } else {
          return null;
        }
      }
      return this.eventsService.isPast(eventDate) ? {
        validateTimeInFuture: {
          isToday: isToday
        }
      } : null;
    };
  }

  /**
   * @author Nermeen Mattar
   * @description takes the user changes map properties to match the ones required by the backend then either updates or creates an event
   * and navigates back upon successfully saving the event.
   */
  save() {
    const eventValue: MpEvent = this.eventGroup.getRawValue();
    if (this.eventGroup.invalid) {
      Object.values(this.eventGroup.controls).forEach(control => control.markAsDirty());
    }
    eventValue.timezone = eventValue.timezone['id'];
    eventValue.recurring = (eventValue.recurring === '') ? null : eventValue.recurring;
    const eventValueForBackend = this.getEventInBackendStructure(eventValue);
    eventValueForBackend.type = eventValueForBackend.type;
    if (this.eventId && !this.isCopyEvent) {
      this.eventsService.updateEvent(this.eventId, this.selectedTeamId,
        eventValueForBackend).subscribe(res => {
          this.navigateToEventsList(true);
        });
    } else {
      this.eventsService.createEvent(this.selectedTeamId, eventValueForBackend).subscribe(res => {
        this.navigateToEventsList(true);
      });
    }
  }

  /**
   * @author Nermeen Mattar
   * @description disbales the max critical value field when the event type is cancelation
   */
  onEventTypeChange() {
    const maxFormControl = (<FormGroup>this.eventGroup.get('max'));
    switch (Number(this.eventGroup.controls.type.value)) {
      case MpEventTypeValues.CANCELATION:
        maxFormControl.setValue(null);
        maxFormControl.disable();
        break;
      case MpEventTypeValues.PARTICIPATION:
        maxFormControl.enable();
        break;
    }
  }

  /**
   * @author Nermeen Mattar
   * @description maps the properties in the received object to the structure required by the backend and formats the date.
   * @param {any} eventValue
   */
  getEventInBackendStructure(eventValue): MpEvent {
    const eventValueCopy: MpEvent = {
      eventName: eventValue.eventName,
      category: this.getSelectedCategory(),
      timezone: eventValue.timezone,
      date: format(eventValue.date, 'YYYY-MM-DD'),
      recurring: eventValue.recurring,
      endDate: eventValue.endDate ? format(eventValue.endDate, 'YYYY-MM-DD') : null,
      startTime: eventValue.startTime,
      endTime: eventValue.endTime,
      minCriticalValue: eventValue.min,
      maxCriticalValue: eventValue.max,
      type: Number(eventValue.type),
      location: eventValue.location,
      comment: eventValue.comment
    };
    if (eventValueCopy.type === MpEventTypeValues.CANCELATION) {
      eventValueCopy.maxCriticalValue = null;
    }
    return eventValueCopy;
  }

  /**
   * @author Nermeen Mattar
   * @description navigates to events list after saving event successfully
   */
  navigateToEventsList(needUpdateEvents) {
    if (needUpdateEvents) {
      this.router.navigateByUrl('/events-list');
    } else {
      this.router.navigate(['/events-list'], { queryParams: { updateEvents: false } });
    }
  }

  getSelectedCategory() {
    if (this.selectedCategory === this.newCategoryName) {
      return {
        name: this.selectedCategory
      };
    }
    if (this.selectedCategory === 'none') {
      return null;
    }
    return {
      id: this.selectedCategory
    };
  }


  onCancelDatePicker(dateFormControl: FormControl) {
    if (!dateFormControl.dirty) {
      dateFormControl.setValue('');
      dateFormControl.markAsUntouched();
    }
  }

  onOpenDatePicker(dateFormControl: FormControl) {
    if (!dateFormControl.dirty) {
      dateFormControl.setValue(this.minDate);
    }
  }

  /**
   * @author Nermeen Mattar
   * @description get saved categories for the selected Team
   * @param selectedTeamId
   */
  getTeamCategories() {
    this.teamsService.getCategories(this.selectedTeamId).subscribe(res => {
      this.categoriesList = res;
      this.displaySpinner = false;
    });
  }

  /**
   * @author Nermeen Mattar
   * @description create a new category to be attached to the event
   */
  displayAddCategoryAlert() {
    const addCategoryAlert = {
      header: 'EVENT.ADD_CATEGORY',
      inputs: [{
        name: 'name',
        type: 'text',
        placeholder: 'EVENT.CATEGORY_NAME'
      }],
      buttons: [{
        text: 'CANCEL',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => { }
      }, {
        text: 'CREATE',
        handler: (newCategory) => {
          this.newCategoryName = newCategory.name;
          this.categoriesList.push({
            id: newCategory.name,
            name: newCategory.name
          });
          setTimeout(() => {
            this.selectedCategory = newCategory.name;
          }, 0);
        }
      }]
    };
    this.localizedAlertService.displayLocalizedAlert(addCategoryAlert);
  }

  /**
   * @author Syed Saad Qamar
   * @description open the timezone modal and get timezone from the modal
   * and set the timezone control value
   */
  async openTimezoneTypeaheadModal() {
    const modal = await this.modalController.create({
      component: TimezoneSelectorComponent,
      componentProps: {
        selectedTimeZone: this.eventGroup.get('timezone').value
      }
    });
    modal.onWillDismiss().then((value) => {
      if (value.data && value.data.result) {
        this.eventGroup.get('timezone').setValue(value.data.result);
      }
    });
    return await modal.present();
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description To check that local timezone is same as saved timezone.
  */
  checkTimezoneCase() {
    const savedTimezone = this.userService.timezone;
    if (savedTimezone) {
      return { id: savedTimezone, name: '( ' + moment.tz(savedTimezone).format('Z') + ' )  ' + savedTimezone };
    } else {
      return { id: null, name: null };
    }
  }
}
