import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService }  from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CartItem, CreateOrderRequest } from '../../core/models/index';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent {
  private cartSvc  = inject(CartService);
  private orderSvc = inject(OrderService);

  // ── Cart Signals ─────────────────────────────────────
  cartItems   = this.cartSvc.items;
  totalItems  = this.cartSvc.totalItems;
  totalAmount = this.cartSvc.totalAmount;

  // ── State ────────────────────────────────────────────
  isPlacing    = false;
  orderSuccess = false;
  errorMsg     = '';
  orderId:     number | null = null;

  // ── Cart Operations ──────────────────────────────────
  increment(medicineId: number, currentQty: number): void {
    const item = this.cartItems().find(i => i.medicine.id === medicineId);
    if (!item) return;
    if (currentQty >= item.medicine.stock) return; // respect stock
    this.cartSvc.updateQuantity(medicineId, currentQty + 1);
  }

  decrement(medicineId: number, currentQty: number): void {
    if (currentQty <= 1) {
      this.removeItem(medicineId);
      return;
    }
    this.cartSvc.updateQuantity(medicineId, currentQty - 1);
  }

  removeItem(medicineId: number): void {
    this.cartSvc.removeFromCart(medicineId);
  }

  clearCart(): void {
    this.cartSvc.clearCart();
  }

  // ── Helpers ──────────────────────────────────────────
  getItemTotal(item: CartItem): number {
    return item.medicine.price * item.quantity;
  }

  // ── Place Order ──────────────────────────────────────
  placeOrder(): void {
    if (this.cartItems().length === 0) return;

    this.isPlacing = true;
    this.errorMsg  = '';

    const payload: CreateOrderRequest = {
      items: this.cartItems().map(i => ({
        medicineId: i.medicine.id,
        quantity:   i.quantity
      }))
    };

    this.orderSvc.create(payload).subscribe({
      next: (response) => {
        this.isPlacing    = false;
        this.orderSuccess = true;
        this.orderId      = response.id;
        this.cartSvc.clearCart();
      },
      error: (err) => {
        this.isPlacing = false;
        this.errorMsg  =
          err?.error?.message ?? 'Failed to place order. Please try again.';
      }
    });
  }

  // ── Reset ────────────────────────────────────────────
  resetOrder(): void {
    this.orderSuccess = false;
    this.orderId      = null;
    this.errorMsg     = '';
  }
}