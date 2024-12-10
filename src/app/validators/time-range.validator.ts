import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;

  if (startTime && endTime) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    const openingTime = new Date();
    openingTime.setHours(8, 0, 0, 0);

    const closingTime = new Date();
    closingTime.setHours(17, 30, 0, 0);

    if (startDate >= endDate) {
      return { timeRangeInvalid: true };
    }

    if (startDate < openingTime || endDate < openingTime || startDate > closingTime || endDate > closingTime) {
      return { timeOutOfBounds: true };
    }
  }

  return null;
};

