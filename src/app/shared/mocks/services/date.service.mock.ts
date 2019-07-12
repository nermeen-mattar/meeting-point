export class DateServiceMock {

  selectedDateRange;
  constructor() {
    this.selectedDateRange = {
      dateFrom: new Date('2019-02-01T00:00:00.000Z'),
      dateTo: new Date('2019-03-03T00:00:00.000Z')
    };
  }

  resetData() {
    this.selectedDateRange = null;
  }
}
