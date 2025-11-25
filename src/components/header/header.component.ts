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
  templateUrl: './header.component.html',     // ← ahora usa archivos externos, che
  styleUrls: ['./header.component.scss']       // ← estilos externos, como se hace en el Uruguay
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('navLinks') navLinks!: ElementRef;
  @ViewChild('navToggle') navToggle!: ElementRef;
  
  usuario: any = null;
  hayToken = false;
  private routerSub!: Subscription;
  cerrandoSesion = false;

  constructor(
    private el: ElementRef,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.actualizarEstado();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarEstado());

    // Cuando cambia localStorage en otras pestañas
    window.addEventListener('storage', () => this.actualizarEstado());
    // Evento desde PerfilPage para actualizar al toque
    window.addEventListener('usuarioActualizado', () => this.actualizarEstado());

    // Aplicar blur según el scroll
    this.actualizarBlurPorScroll();
  }

  actualizarEstado() {
    const token = localStorage.getItem('token');
    this.hayToken = !!token;

    // Ver si hay que actualizar el usuario
    const usuarioActualizado = localStorage.getItem('usuarioActualizado');
    
    // Siempre cargar del localStorage primero
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }

    // Si hay token pero no hay usuario, o hay que actualizar
    if (token && (!this.usuario || usuarioActualizado)) {
      this.api.getMiPerfil().subscribe({
        next: (data) => {
          this.usuario = data;
          localStorage.setItem('usuario', JSON.stringify(data));
          // Limpiar la bandera de actualización
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
      // Si no hay token, limpiar todo
      this.usuario = null;
      this.hayToken = false;
    }
  }

  toggleMenu() {
    this.navToggle.nativeElement.classList.toggle('active');
    this.navLinks.nativeElement.classList.toggle('open');
    
    // Poner blur cuando se abre el menú móvil
    if (this.navLinks.nativeElement.classList.contains('open')) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  // Si falla la imagen del avatar
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Si falla, usar avatar por defecto
    img.src = 'assets/img/default-avatar.png';
  }

  closeMenu() {
    this.navToggle.nativeElement.classList.remove('active');
    this.navLinks.nativeElement.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Cerrar menú si se hace click afuera
    if (this.navLinks && this.navToggle) {
      const isClickInside = this.navLinks.nativeElement.contains(event.target) || 
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
    
    // Mostrar animación y después cerrar sesión
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
    // Asegurar el estado inicial
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
      // Cambiar a sticky después del hero
      header.classList.add('sticky-mode');
    } else {
      // Mantener fixed mientras está en el hero
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
}