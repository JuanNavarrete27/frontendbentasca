import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private profileImageSubject = new BehaviorSubject<string | null>(null);
  profileImage$ = this.profileImageSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('profileImage');
    if (stored) this.profileImageSubject.next(stored);
  }

  updateProfileImage(image: string) {
    this.profileImageSubject.next(image);
    localStorage.setItem('profileImage', image);
  }
}
