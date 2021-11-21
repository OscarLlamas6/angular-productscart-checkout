import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Detail, Order } from 'src/app/shared/interfaces/order.interface';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interfaces/product.interface';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  model = {
    name:"",
    store:"",
    shippingAddress:"",
    city: ""
  }

  isDelivery: boolean = false;

  cart : Product [] = [];

  stores: Store[] = [];

  constructor( 
    private dataSvc: DataService,
    private shoppingCartSvc: ShoppingCartService, 
    private router: Router,
    private productsSvc : ProductsService ) { 

      this.checkIfCartIsempty();

    }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetail();
  }

  onPickUporDelivery(value:boolean): void {
    this.isDelivery = value
  }

  onSubmit({value: formData}: NgForm): void { 
    console.log("Guardar", formData);
    const data: Order = {
      ...formData,
      date: this.getCurrentDay(),
      pickup: !this.isDelivery
    }

    this.dataSvc.saveOrder(data)
    .pipe(
      tap(res => console.log('Order -> ',res)),
      switchMap( ({ id: orderId }) => {
        const details = this.prepareDetail();
        return this.dataSvc.saveDetailsOrder({details, orderId})
      }),
      tap(res => console.log('Finish -> ',res)),
      tap(() => this.router.navigate(["/checkout/thanks-page"])),
      delay(2000),
      tap(() => this.shoppingCartSvc.resetCart())
    )
    .subscribe()
  }

  private getStores(): void {
    this.dataSvc.getStores()
    .pipe( tap( (response:Store[]) => this.stores = response ) )
    .subscribe()
  }

  private getCurrentDay(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetail(): Detail[] {
    console.log("Preparing details")
    const details: Detail[] = [];
    this.cart.forEach( (product:Product) => {
      const { id: productId, name: productName, qty: quantity, stock } = product;
      const updateStock = ( stock - quantity);

      this.productsSvc.updateStock(productId, updateStock)
      .pipe(
        tap( () => details.push({ productId, productName, quantity }))
      )
      .subscribe()
      
    })
    return details
  }

  private getDataCart(): void {
    console.log("Getting data cart")
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap( (products: Product[]) => this.cart = products )
    )
    .subscribe()
  }

  private checkIfCartIsempty(): void {
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap( (products:Product[]) => {
        if(Array.isArray(products) && !products.length){
            this.router.navigate(['/products']);
        }
      } )
    )
    .subscribe()
  }

}
