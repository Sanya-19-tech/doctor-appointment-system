import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MedicineService } from '../../core/services/medicine.service';
import { CartService }     from '../../core/services/cart.service';
import { AuthService }     from '../../core/services/auth.service';
import { Medicine, CreateMedicineRequest } from '../../core/models/index';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './medicines.html',
  styleUrls: ['./medicines.scss']
})
export class MedicinesComponent implements OnInit {
  private medicineSvc = inject(MedicineService);
  private cartSvc     = inject(CartService);
  private authSvc     = inject(AuthService);
  private fb          = inject(FormBuilder);

  // ── Data ────────────────────────────────────────────
  medicines:         Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  isLoading   = true;
  errorMsg    = '';
  successMsg  = '';
  searchTerm  = '';

  // ── Filter ───────────────────────────────────────────
  activeCategory = 'All';
  categories:      string[] = ['All'];

  // ── Cart Feedback ────────────────────────────────────
  addedToCartId: number | null = null;

  // ── Modal ────────────────────────────────────────────
  showModal    = false;
  isEditMode   = false;
  editingId:   number | null = null;
  modalLoading = false;

  // ── Delete ───────────────────────────────────────────
  showDeleteConfirm = false;
  deletingId:   number | null = null;
  deletingName  = '';

  // ── Form ─────────────────────────────────────────────
  medicineForm: FormGroup = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
    price:    ['', [Validators.required, Validators.min(1)]],
    stock:    ['', [Validators.required, Validators.min(0)]]
  });

  // ── Cart signal ──────────────────────────────────────
  cartItems    = this.cartSvc.items;
  totalInCart  = this.cartSvc.totalItems;

  get isAdmin(): boolean { return this.authSvc.isAdmin(); }
  get name()     { return this.medicineForm.get('name');     }
  get category() { return this.medicineForm.get('category'); }
  get price()    { return this.medicineForm.get('price');    }
  get stock()    { return this.medicineForm.get('stock');    }

  ngOnInit(): void { this.loadMedicines(); }

  loadMedicines(): void {
    this.isLoading = true;
    this.medicineSvc.getAll().subscribe({
      next: (data) => {
        this.medicines = data;
        this.buildCategories(data);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg  = 'Failed to load medicines.';
        this.isLoading = false;
      }
    });
  }

  // ── Categories ───────────────────────────────────────
  buildCategories(meds: Medicine[]): void {
    const cats = [...new Set(meds.map(m => m.category).filter(Boolean))];
    this.categories = ['All', ...cats];
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.applyFilters();
  }

  // ── Search + Filter ──────────────────────────────────
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.medicines;

    if (this.activeCategory !== 'All') {
      result = result.filter(m => m.category === this.activeCategory);
    }

    if (this.searchTerm) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(this.searchTerm) ||
        m.category.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredMedicines = result;
  }

  // ── Stock Status ─────────────────────────────────────
  getStockStatus(stock: number): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (stock === 0)   return 'out-of-stock';
    if (stock <= 10)   return 'low-stock';
    return 'in-stock';
  }

  getStockLabel(stock: number): string {
    if (stock === 0)  return 'Out of Stock';
    if (stock <= 10)  return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  }

  // ── Cart ─────────────────────────────────────────────
  addToCart(medicine: Medicine): void {
    if (medicine.stock === 0) return;
    this.cartSvc.addToCart(medicine);
    this.addedToCartId = medicine.id;
    setTimeout(() => this.addedToCartId = null, 1500);
  }

  isInCart(medicineId: number): boolean {
    return this.cartItems().some(i => i.medicine.id === medicineId);
  }

  getCartQty(medicineId: number): number {
    return this.cartItems().find(i => i.medicine.id === medicineId)?.quantity ?? 0;
  }

  // ── Modal ────────────────────────────────────────────
  openAddModal(): void {
    this.isEditMode = false;
    this.editingId  = null;
    this.medicineForm.reset();
    this.errorMsg   = '';
    this.showModal  = true;
  }

  openEditModal(med: Medicine): void {
    this.isEditMode = true;
    this.editingId  = med.id;
    this.medicineForm.patchValue({
      name:     med.name,
      category: med.category,
      price:    med.price,
      stock:    med.stock
    });
    this.errorMsg  = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.medicineForm.reset();
    this.errorMsg  = '';
  }

  // ── Submit ───────────────────────────────────────────
  onSubmit(): void {
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    this.modalLoading = true;
    const payload: CreateMedicineRequest = {
      ...this.medicineForm.value,
      price: Number(this.medicineForm.value.price),
      stock: Number(this.medicineForm.value.stock)
    };

    const request$ = this.isEditMode && this.editingId !== null
      ? this.medicineSvc.update(this.editingId, payload)
      : this.medicineSvc.create(payload);

    request$.subscribe({
      next: () => {
        this.modalLoading = false;
        this.successMsg   = this.isEditMode
          ? '✅ Medicine updated!' : '✅ Medicine added!';
        this.closeModal();
        this.loadMedicines();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.modalLoading = false;
        this.errorMsg     = err?.error?.message ?? 'Operation failed.';
      }
    });
  }

  // ── Delete ───────────────────────────────────────────
  confirmDelete(med: Medicine): void {
    this.deletingId        = med.id;
    this.deletingName      = med.name;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingId        = null;
    this.deletingName      = '';
  }

  executeDelete(): void {
    if (this.deletingId === null) return;
    this.medicineSvc.delete(this.deletingId).subscribe({
      next: () => {
        this.successMsg = '✅ Medicine deleted!';
        this.cancelDelete();
        this.loadMedicines();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = '⚠️ Failed to delete.';
        this.cancelDelete();
      }
    });
  }
}