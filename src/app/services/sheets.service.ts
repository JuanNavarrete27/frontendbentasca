import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  constructor(private http: HttpClient) {}

  getSheet(scriptUrl: string, sheet: string): Observable<any> {
    return this.http.get(`${scriptUrl}?sheet=${sheet}`);
  }

  exportPDF(scriptUrl: string, sheet: string): Observable<string> {
    return this.http.get(`${scriptUrl}?sheet=${sheet}&action=pdf`, { responseType: 'text' });
  }

  saveTable(scriptUrl: string, data: any[][]): Observable<string> {
    return this.http.post(scriptUrl, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    });
  }
}