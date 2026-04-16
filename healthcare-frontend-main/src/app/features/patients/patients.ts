import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';
import { AuthService }    from '../../core/services/auth.service';
import { Patient, CreatePatientRequest } from '../../core/models/index';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.scss']
})
export class PatientsComponent implements OnInit {
  private patientSvc = inject(PatientService);
  private authSvc    = inject(AuthService);
  private fb         = inject(FormBuilder);

  // ── Data ────────────────────────────────────────────
  patients:         Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading  = true;
  errorMsg   = '';
  successMsg = '';

  // ── Modal State ──────────────────────────────────────
  showModal    = false;
  isEditMode   = false;
  editingId:   number | null = null;
  modalLoading = false;

  // ── Delete Confirm ───────────────────────────────────
  showDeleteConfirm = false;
  deletingId: number | null = null;
  deletingName = '';

  // ── Search ───────────────────────────────────────────
  searchTerm = '';

  // ── Form ─────────────────────────────────────────────
  patientForm: FormGroup = this.fb.group({
    name:           ['', [Validators.required, Validators.minLength(2)]],
    age:            ['', [Validators.required, Validators.min(1), Validators.max(150)]],
    contact:        ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    medicalHistory: ['']
  });

  get isAdmin(): boolean { return this.authSvc.isAdmin(); }
  get name()    { return this.patientForm.get('name');    }
  get age()     { return this.patientForm.get('age');     }
  get contact() { return this.patientForm.get('contact'); }

  // ── Lifecycle ────────────────────────────────────────
  ngOnInit(): void { this.loadPatients(); }

  loadPatients(): void {
    this.isLoading = true;
    this.patientSvc.getAll().subscribe({
      next: (data) => {
        this.patients         = data;
        this.filteredPatients = data;
        this.isLoading        = false;
      },
      error: () => {
        this.errorMsg  = 'Failed to load patients.';
        this.isLoading = false;
      }
    });
  }

  // ── Search ───────────────────────────────────────────
  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm      = term;
    this.filteredPatients = this.patients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.contact.includes(term) ||
      p.medicalHistory?.toLowerCase().includes(term)
    );
  }

  // ── Open Add Modal ───────────────────────────────────
  openAddModal(): void {
    this.isEditMode = false;
    this.editingId  = null;
    this.patientForm.reset();
    this.showModal  = true;
  }

  // ── Open Edit Modal ──────────────────────────────────
  openEditModal(patient: Patient): void {
    this.isEditMode = true;
    this.editingId  = patient.id;
    this.patientForm.patchValue({
      name:           patient.name,
      age:            patient.age,
      contact:        patient.contact,
      medicalHistory: patient.medicalHistory
    });
    this.showModal = true;
  }

  // ── Close Modal ──────────────────────────────────────
  closeModal(): void {
    this.showModal = false;
    this.patientForm.reset();
    this.errorMsg = '';
  }

  // ── Submit Form ──────────────────────────────────────
  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.modalLoading = true;
    const payload: CreatePatientRequest = this.patientForm.value;

    const request$ = this.isEditMode && this.editingId !== null
      ? this.patientSvc.update(this.editingId, payload)
      : this.patientSvc.create(payload);

    request$.subscribe({
      next: () => {
        this.modalLoading = false;
        this.successMsg   = this.isEditMode
          ? 'Patient updated successfully!'
          : 'Patient added successfully!';
        this.closeModal();
        this.loadPatients();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.modalLoading = false;
        this.errorMsg     = err?.error?.message ?? 'Operation failed.';
      }
    });
  }

  // ── Delete ───────────────────────────────────────────
  confirmDelete(patient: Patient): void {
    this.deletingId   = patient.id;
    this.deletingName = patient.name;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingId        = null;
    this.deletingName      = '';
  }

  executeDelete(): void {
    if (this.deletingId === null) return;
    this.patientSvc.delete(this.deletingId).subscribe({
      next: () => {
        this.successMsg = 'Patient deleted successfully!';
        this.cancelDelete();
        this.loadPatients();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = 'Failed to delete patient.';
        this.cancelDelete();
      }
    });
  }
}