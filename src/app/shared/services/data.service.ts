import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DetailOrder, Order } from "../interfaces/order.interface";
import { Store } from "../interfaces/store.interface";

@Injectable({
    providedIn: 'root'
})

export class DataService {

    private apiURL = "http://localhost:3000"

    constructor( private http: HttpClient ) { }

    getStores():Observable<Store[]>{
        return this.http.get<Store[]>(`${this.apiURL}/stores`)
      }

    saveOrder(order:Order):Observable<any>{
        return this.http.post<Order>(`${this.apiURL}/orders`, order)
      }

    saveDetailsOrder(details: DetailOrder):Observable<DetailOrder>{
        return this.http.post<DetailOrder>(`${this.apiURL}/detailsOrders`, details)
      }

}