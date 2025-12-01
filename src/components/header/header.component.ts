import { Component, ElementRef, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service';
import { Subscription, filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('navLinks') navLinks!: ElementRef;
  @ViewChild('navToggle') navToggle!: ElementRef;
  @ViewChild('logoElement') logoElement!: ElementRef;

  usuario: any = null;
  hayToken = false;
  private routerSub!: Subscription;
  cerrandoSesion = false;

  isTouchDevice = false;
  private logoGlowTimeout: any;

  constructor(
    private el: ElementRef,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isTouchDevice =
      'ontouchstart' in window ||
      (navigator as any).maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    this.actualizarEstado();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarEstado());

    window.addEventListener('storage', () => this.actualizarEstado());
    window.addEventListener('usuarioActualizado', () => this.actualizarEstado());

    this.actualizarBlurPorScroll();
  }

  actualizarEstado() {
    const token = localStorage.getItem('token');
    this.hayToken = !!token;

    const usuarioActualizado = localStorage.getItem('usuarioActualizado');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }

    if (token && (!this.usuario || usuarioActualizado)) {
      this.api.getMiPerfil().subscribe({
        next: (data) => {
          this.usuario = data;
          localStorage.setItem('usuario', JSON.stringify(data));
          localStorage.removeItem('usuarioActualizado');
        },
        error: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          this.hayToken = false;
          this.usuario = null;
        }
      });
    } else if (!token) {
      this.usuario = null;
      this.hayToken = false;
    }
  }

  toggleMenu() {
    this.navToggle.nativeElement.classList.toggle('active');
    this.navLinks.nativeElement.classList.toggle('open');

    if (this.navLinks.nativeElement.classList.contains('open')) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/default-avatar.png';
  }

  closeMenu() {
    this.navToggle.nativeElement.classList.remove('active');
    this.navLinks.nativeElement.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.navLinks && this.navToggle) {
      const isClickInside =
        this.navLinks.nativeElement.contains(event.target) ||
        this.navToggle.nativeElement.contains(event.target);

      if (!isClickInside && this.navLinks.nativeElement.classList.contains('open')) {
        this.closeMenu();
      }
    }
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = window.innerWidth > 860 ? 100 : 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      });
    }
  }

  logout() {
    this.cerrandoSesion = true;
    this.closeMenu();

    setTimeout(() => {
      this.api.logout();
      this.usuario = null;
      this.hayToken = false;
      this.cerrandoSesion = false;
      this.router.navigate(['/']);
    }, 1500);
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  ngAfterViewInit() {
    this.actualizarEstadoHeader();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.actualizarEstadoHeader();
    this.actualizarBlurPorScroll();
  }

  private actualizarEstadoHeader() {
    const header = this.el.nativeElement.querySelector('.site-header');
    const hero = document.querySelector('.hero');

    if (!hero) return;

    const heroHeight = hero.clientHeight;
    const scrollPosition = window.scrollY;

    if (scrollPosition >= heroHeight) {
      header.classList.add('sticky-mode');
    } else {
      header.classList.remove('sticky-mode');
    }
  }

  private actualizarBlurPorScroll() {
    const threshold = 40;
    if (window.scrollY >= threshold) {
      document.body.classList.add('blur-bg');
    } else {
      document.body.classList.remove('blur-bg');
    }
  }

  onLogoHover(enter: boolean) {
    if (this.isTouchDevice) return;

    const el = this.logoElement?.nativeElement as HTMLElement;
    if (!el) return;

    if (enter) {
      el.classList.add('logo-glow');
    } else {
      el.classList.remove('logo-glow');
    }
  }

  onLogoTouchStart(event: TouchEvent) {
    if (!this.isTouchDevice) return;

    const el = this.logoElement?.nativeElement as HTMLElement;
    if (!el) return;

    if (this.logoGlowTimeout) clearTimeout(this.logoGlowTimeout);

    el.classList.add('logo-glow');

    this.logoGlowTimeout = setTimeout(() => {
      el.classList.remove('logo-glow');
    }, 600);
  }
}
