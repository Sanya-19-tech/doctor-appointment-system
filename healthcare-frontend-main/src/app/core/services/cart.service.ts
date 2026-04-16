import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Medicine } from '../models/index';

@Injectable({ providedIn: 'root' })
export class CartService {

  // ── Reactive cart using Angular signals ──────────────
  private _items = signal<CartItem[]>([]);

  // Public readable signals
  items         = this._items.asReadonly();
  totalItems    = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );
  totalAmount   = computed(() =>
    this._items().reduce((sum, i) => sum + i.medicine.price * i.quantity, 0)
  );

  // ── Add to cart ──────────────────────────────────────
  addToCart(medicine: Medicine): void {
    const current = this._items();
    const existing = current.find(i => i.medicine.id === medicine.id);

    if (existing) {
      this._items.set(
        current.map(i =>
          i.medicine.id === medicine.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      this._items.set([...current, { medicine, quantity: 1 }]);
    }
  }

  // ── Remove from cart ─────────────────────────────────
  removeFromCart(medicineId: number): void {
    this._items.set(
      this._items().filter(i => i.medicine.id !== medicineId)
    );
  }

  // ── Update quantity ──────────────────────────────────
  updateQuantity(medicineId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(medicineId);
      return;
    }
    this._items.set(
      this._items().map(i =>
        i.medicine.id === medicineId ? { ...i, quantity } : i
      )
    );
  }

  // ── Clear cart ───────────────────────────────────────
  clearCart(): void {
    this._items.set([]);
  }
}