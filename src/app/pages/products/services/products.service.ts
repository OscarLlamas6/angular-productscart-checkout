import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiURL = "http://localhost:3000"
  constructor( private http: HttpClient ) { }

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiURL}/products`)
  }

  updateStock(productId: number, stock: number):Observable<any>{
    const body = { stock : stock }
    return this.http.patch<any>(`${this.apiURL}/products/${productId}`, body)
  }

}
