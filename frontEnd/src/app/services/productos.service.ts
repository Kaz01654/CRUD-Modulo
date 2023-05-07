import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  baseUrl: any = 'http://localhost:3000'
  constructor(private http: HttpClient) {}

  //Obtiene los productos
  getProducts() {
    return this.http.get(`${ this.baseUrl + environment.urlAPI }getProducts`).toPromise().then(res => { return res; });
  }

  //Agrega un producto
  insertProd(object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.post(`${ this.baseUrl + environment.urlAPI }insertProd`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Actualiza un producto
  updateProd(id: any, object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.put(`${ this.baseUrl + environment.urlAPI }updateProd/${id}`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Actualiza un producto
  prodControl(id: any, cant: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { cant: cant };
    return this.http.put(`${ this.baseUrl + environment.urlAPI }updateProdCont/${id}`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Elimina un producto
  deleteProd(id: any) {
    return this.http.delete(`${ this.baseUrl + environment.urlAPI }deleteProd/${id}`).toPromise().then(res => { return res; });
  }
}
