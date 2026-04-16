import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AppointmentService } from '../../core/services/appointment.service';
import { PatientService }     from '../../core/services/patient.service';
import { DoctorService }      from '../../core/services/doctor.service';
import { AuthService }        from '../../core/services/auth.service';
import {
  Appointment,
  Patient,
  Doctor,
  CreateAppointmentRequest
} from '../../core/models/index';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.scss']
})
export class AppointmentsComponent implements OnInit {
  private appointmentSvc = inject(AppointmentService);
  private patientSvc     = inject(PatientService);
  private doctorSvc      = inject(DoctorService);
  private authSvc        = inject(AuthService);
  private fb             = inject(FormBuilder);

  // ── Data ────────────────────────────────────────────
  appointments: Appointment[] = [];
  patients:     Patient[]     = [];
  doctors:      Doctor[]      = [];

  isLoading    = true;
  dataLoading  = true;
  errorMsg     = '';
  successMsg   = '';
  showConfetti = false;

  // ── View Toggle ──────────────────────────────────────
  activeTab: 'list' | 'book' = 'list';

  // ── Time Slots ───────────────────────────────────────
  timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM'
  ];
  selectedTime = '';

  // ── Delete ───────────────────────────────────────────
  showDeleteConfirm = false;
  deletingId: number | null = null;

  // ── Form ─────────────────────────────────────────────
  appointmentForm: FormGroup = this.fb.group({
    patientId:       ['', Validators.required],
    doctorId:        ['', Validators.required],
    appointmentDate: ['', Validators.required]
  });

  get isAdmin():    boolean { return this.authSvc.isAdmin(); }
  get patientId()   { return this.appointmentForm.get('patientId');       }
  get doctorId()    { return this.appointmentForm.get('doctorId');        }
  get apptDate()    { return this.appointmentForm.get('appointmentDate'); }
  get minDate():    string  {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading   = true;
    this.dataLoading = true;

    // Load dropdowns
    this.patientSvc.getAll().subscribe(p => { this.patients = p; });
    this.doctorSvc.getAll().subscribe(d  => { this.doctors  = d; this.dataLoading = false; });

    // Load appointments list
    this.appointmentSvc.getAll().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading    = false;
      },
      error: () => {
        this.errorMsg  = 'Failed to load appointments.';
        this.isLoading = false;
      }
    });
  }

  // ── Tab Switch ───────────────────────────────────────
  switchTab(tab: 'list' | 'book'): void {
    this.activeTab = tab;
    this.errorMsg  = '';
    this.successMsg = '';
    this.appointmentForm.reset();
    this.selectedTime = '';
  }

  // ── Time Slot Selection ──────────────────────────────
  selectTime(slot: string): void {
    this.selectedTime = slot;
  }

  // ── Convert time to ISO ──────────────────────────────
  private buildDateTime(): string {
    const dateVal = this.appointmentForm.value.appointmentDate;
    if (!dateVal) return '';

    let hours = 9;
    if (this.selectedTime) {
      const [timePart, meridiem] = this.selectedTime.split(' ');
      const [h]                  = timePart.split(':').map(Number);
      hours = meridiem === 'PM' && h !== 12 ? h + 12
            : meridiem === 'AM' && h === 12 ? 0
            : h;
    }
    const d = new Date(dateVal);
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
  }

  // ── Submit ───────────────────────────────────────────
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    if (!this.selectedTime) {
      this.errorMsg = 'Please select a time slot.';
      return;
    }

    const payload: CreateAppointmentRequest = {
      patientId:       Number(this.appointmentForm.value.patientId),
      doctorId:        Number(this.appointmentForm.value.doctorId),
      appointmentDate: this.buildDateTime()
    };

    this.appointmentSvc.create(payload).subscribe({
      next: () => {
        this.successMsg  = 'Appointment booked successfully!';
        this.showConfetti = true;
        this.appointmentForm.reset();
        this.selectedTime = '';
        this.loadAll();
        setTimeout(() => {
          this.showConfetti = false;
          this.activeTab    = 'list';
          this.successMsg   = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to book appointment.';
      }
    });
  }

  // ── Delete ───────────────────────────────────────────
  confirmDelete(id: number): void {
    this.deletingId       = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.deletingId        = null;
    this.showDeleteConfirm = false;
  }

  executeDelete(): void {
    if (this.deletingId === null) return;
    this.appointmentSvc.delete(this.deletingId).subscribe({
      next: () => {
        this.successMsg = '✅ Appointment cancelled.';
        this.cancelDelete();
        this.loadAll();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = '⚠️ Failed to cancel appointment.';
        this.cancelDelete();
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────
  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  getPatientName(id: number): string {
    return this.patients.find(p => p.id === id)?.name ?? '—';
  }

  getDoctorName(id: number): string {
    return this.doctors.find(d => d.id === id)?.name ?? '—';
  }
}