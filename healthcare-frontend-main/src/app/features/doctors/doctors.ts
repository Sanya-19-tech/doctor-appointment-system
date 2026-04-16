import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { AuthService }   from '../../core/services/auth.service';
import { Doctor, CreateDoctorRequest } from '../../core/models/index';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.scss']
})
export class DoctorsComponent implements OnInit {
  private doctorSvc = inject(DoctorService);
  private authSvc   = inject(AuthService);
  private fb        = inject(FormBuilder);

  // ── Data ────────────────────────────────────────────
  doctors:         Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  isLoading  = true;
  errorMsg   = '';
  successMsg = '';
  searchTerm = '';

  // ── Modal ────────────────────────────────────────────
  showModal    = false;
  isEditMode   = false;
  editingId:   number | null = null;
  modalLoading = false;

  // ── Delete ───────────────────────────────────────────
  showDeleteConfirm = false;
  deletingId:   number | null = null;
  deletingName  = '';

  // ── Card Colors (cycling) ────────────────────────────
  cardColors = [
    { ring: '#e53935', light: '#ffebee', text: '#c62828' },
    { ring: '#1e88e5', light: '#e3f2fd', text: '#1565c0' },
    { ring: '#43a047', light: '#e8f5e9', text: '#2e7d32' },
    { ring: '#fb8c00', light: '#fff3e0', text: '#e65100' },
    { ring: '#8e24aa', light: '#f3e5f5', text: '#6a1b9a' },
    { ring: '#00897b', light: '#e0f2f1', text: '#00695c' },
  ];

  // ── Form ─────────────────────────────────────────────
  doctorForm: FormGroup = this.fb.group({
    name:           ['', [Validators.required, Validators.minLength(2)]],
    specialization: ['', [Validators.required, Validators.minLength(2)]]
  });

  get isAdmin(): boolean  { return this.authSvc.isAdmin(); }
  get name()           { return this.doctorForm.get('name');           }
  get specialization() { return this.doctorForm.get('specialization'); }

  ngOnInit(): void { this.loadDoctors(); }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorSvc.getAll().subscribe({
      next: (data) => {
        this.doctors         = data;
        this.filteredDoctors = data;
        this.isLoading       = false;
      },
      error: () => {
        this.errorMsg  = 'Failed to load doctors.';
        this.isLoading = false;
      }
    });
  }

  // ── Search ───────────────────────────────────────────
  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm      = term;
    this.filteredDoctors = this.doctors.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.specialization.toLowerCase().includes(term)
    );
  }

  // ── Get card color by index ───────────────────────────
  getColor(index: number) {
    return this.cardColors[index % this.cardColors.length];
  }

  // ── Get initials ─────────────────────────────────────
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(w => w.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // ── Modals ───────────────────────────────────────────
  openAddModal(): void {
    this.isEditMode = false;
    this.editingId  = null;
    this.doctorForm.reset();
    this.errorMsg   = '';
    this.showModal  = true;
  }

  openEditModal(doctor: Doctor): void {
    this.isEditMode = true;
    this.editingId  = doctor.id;
    this.doctorForm.patchValue({
      name:           doctor.name,
      specialization: doctor.specialization
    });
    this.errorMsg  = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.doctorForm.reset();
    this.errorMsg  = '';
  }

  // ── Submit ───────────────────────────────────────────
  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.modalLoading = true;
    const payload: CreateDoctorRequest = this.doctorForm.value;

    const request$ = this.isEditMode && this.editingId !== null
      ? this.doctorSvc.update(this.editingId, payload)
      : this.doctorSvc.create(payload);

    request$.subscribe({
      next: () => {
        this.modalLoading = false;
        this.successMsg   = this.isEditMode
          ? '✅ Doctor updated successfully!'
          : '✅ Doctor added successfully!';
        this.closeModal();
        this.loadDoctors();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.modalLoading = false;
        this.errorMsg     = err?.error?.message ?? 'Operation failed.';
      }
    });
  }

  // ── Delete ───────────────────────────────────────────
  confirmDelete(doctor: Doctor): void {
    this.deletingId       = doctor.id;
    this.deletingName     = doctor.name;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingId        = null;
    this.deletingName      = '';
  }

  executeDelete(): void {
    if (this.deletingId === null) return;
    this.doctorSvc.delete(this.deletingId).subscribe({
      next: () => {
        this.successMsg = '✅ Doctor deleted successfully!';
        this.cancelDelete();
        this.loadDoctors();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = '⚠️ Failed to delete doctor.';
        this.cancelDelete();
      }
    });
  }
}