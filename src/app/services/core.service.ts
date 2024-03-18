import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, defaults } from '../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http:HttpClient, ){ }
  get notify(): Observable<Record<string, any>> {
    return this.notify$.asObservable();
  }

  private notify$ = new BehaviorSubject<Record<string, any>>({});

  getOptions() {
    return this.options;
  }

  setOptions(options: AppSettings) {
    this.options = Object.assign(defaults, options);
    this.notify$.next(this.options);
  }

  private options = defaults;

  getLanguage() {
    return this.options.language;
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    this.notify$.next({ lang });
  }

  postAdmin(payload:any){
    let url = 'http://localhost:5000/api/adminLogin/';
    return this.http.post(url,payload);
  }

  getContact(): Observable<any>{
    let url = "http://localhost:5000/api/contactDisplay";
    return this.http.get(url);
  }

  setCar(payload:any): Observable<any>{

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    const options = {
      headers
    };
    let url = 'http://localhost:5000/api/caradd';
    return this.http.post(url,payload, options);
  }

  setCarUpdate(payload:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    const options = {
      headers
    };
    let url = 'http://localhost:5000/api/carupdate';
    return this.http.post(url, payload, options)
    }


  // setCarDelete(payload:any): Observable<any>{
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //   });
  //   const options = {
  //     headers
  //   };
  //   let url = 'http://localhost:5000/api/cardelete';
  //   return this.http.post(url, payload, options);
  // }

  getCar(): Observable<any>{
    let url = "http://localhost:5000/api/cardisplay";
    return this.http.get(url);
  }

  getuser(): Observable<any>{
    let url = "http://localhost:5000/api/admindisplayuser";
    return this.http.get(url);
  }
}
