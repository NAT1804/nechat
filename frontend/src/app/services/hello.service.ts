import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Hello {
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class HelloService {

  constructor(private http: HttpClient) { }

  getHello(): Observable<Hello> {
    console.log('hello')
    return this.http.get<Hello>('api')
  }
}
