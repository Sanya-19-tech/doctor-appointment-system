import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PatientService }     from '../../core/services/patient.service';
import { DoctorService }      from '../../core/services/doctor.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { MedicineService }    from '../../core/services/medicine.service';
import { AuthService }        from '../../core/services/auth.service';
import { Patient }            from '../../core/models/index';

interface StatCard {
  title:    string;
  value:    number;
  icon:     string;
  color:    string;
  route:    string;
  bgColor:  string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  private patientSvc     = inject(PatientService);
  private doctorSvc      = inject(DoctorService);
  private appointmentSvc = inject(AppointmentService);
  private medicineSvc    = inject(MedicineService);
  authService            = inject(AuthService);

  isLoading = true;
  statCards: StatCard[] = [];
  recentPatients: Patient[] = [];

  get userName(): string { return this.authService.getUserName(); }
  get isAdmin():  boolean { return this.authService.isAdmin(); }

  ngOnInit(): void {
    forkJoin({
      patients:     this.patientSvc.getAll(),
      doctors:      this.doctorSvc.getAll(),
      appointments: this.appointmentSvc.getAll(),
      medicines:    this.medicineSvc.getAll()
    }).subscribe({
      next: (data) => {
        this.statCards = [
          {
            title:   'Total Patients',
            value:   data.patients.length,
            icon:    '🧑‍⚕️',
            color:   '#1565c0',
            bgColor: '#e3f2fd',
            route:   '/patients'
          },
          {
            title:   'Total Doctors',
            value:   data.doctors.length,
            icon:    '👨‍⚕️',
            color:   '#2e7d32',
            bgColor: '#e8f5e9',
            route:   '/doctors'
          },
          {
            title:   'Appointments',
            value:   data.appointments.length,
            icon:    '📅',
            color:   '#e65100',
            bgColor: '#fff3e0',
            route:   '/appointments'
          },
          {
            title:   'Medicines',
            value:   data.medicines.length,
            icon:    '💊',
            color:   '#6a1b9a',
            bgColor: '#f3e5f5',
            route:   '/medicines'
          }
        ];
        // Show last 5 patients
        this.recentPatients = data.patients.slice(-5).reverse();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }
}