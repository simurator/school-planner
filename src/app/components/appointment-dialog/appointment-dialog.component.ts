import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormArray } from '@angular/forms';
import { DateService } from "../../services/date.service";
import { timeRangeValidator } from "../../validators/time-range.validator";
import { HighlightDirective } from '../../highlight.directive';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
  standalone: true,
  imports: [
    HighlightDirective,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class AppointmentDialogComponent {
  appointmentForm: FormGroup;
  selectedWeekday: string;

  @Input() appointmentData!: {
    uuid: string;
    date: Date;
    title: string;
    teacher: string;
    startTime: string;
    endTime: string;
  };
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uuid: string;
      date: Date;
      title: string;
      teacher: string;
      startTime: string;
      endTime: string;
      color: string;
    },
    private formBuilder: FormBuilder,
    private dateService: DateService // Inject DateService
  ) {
    this.appointmentForm = new FormGroup({
      title: new FormControl('', Validators.required),
      teacher: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      startTime: new FormControl('', [Validators.required, this.timeValidator]),
      endTime: new FormControl('', [Validators.required, this.timeValidator]),
      timeRangeInvalid: new FormControl(false), // This could be used for custom validation
      timeOutOfBounds: new FormControl(false) // Custom validation for time range
    });
    this.selectedWeekday = this.dateService.getWeekdayFromDate(this.data.date || new Date());

    this.appointmentForm = this.formBuilder.group(
      {
        title: [this.data.title || '', Validators.required],
        teacher: [this.data.teacher || '', Validators.required],
        date: [this.selectedWeekday, Validators.required], // Weekday selected instead of date
        startTime: [this.data.startTime || '', Validators.required],
        endTime: [this.data.endTime || '', Validators.required],
      },
      { validators: timeRangeValidator }
    );
  }

  timeValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {
      const time = control.value;
      const hours = parseInt(time.split(':')[0], 10);
      const minutes = parseInt(time.split(':')[1], 10);
      if (hours < 8 || (hours === 17 && minutes > 30) || hours > 17) {
        return { 'timeOutOfBounds': true };
      }
    }
    return null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      const data = {
        title: this.appointmentForm.controls['title'].value,
        teacher: this.appointmentForm.controls['teacher'].value,
        date: this.getSelectedDate(), // Convert weekday to actual date
        startTime: this.appointmentForm.controls['startTime'].value,
        endTime: this.appointmentForm.controls['endTime'].value,
        uuid: this.data.uuid,
      };
      this.dialogRef.close(data);
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
  }

  getSelectedDate(): Date {
    return this.dateService.getSelectedDate(new Date(this.data.date), this.selectedWeekday);
  }

  get weekdays() {
    return this.dateService.weekdays;
  }

  onCancelClick(): void {
    this.cancel.emit();
  }
}
