import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  lightboxActive = false;
  currentImage = 1;

  scrollTo(sectionId: string, event?: Event) {
    // Prevenir el comportamiento por defecto del enlace
    if (event) {
      event.preventDefault();
    }

    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      const headerOffset = 80; // Ajusta según la altura de tu header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Actualizar la URL sin recargar la página
      if (typeof history !== 'undefined' && history.pushState) {
        const newUrl = `${window.location.pathname}#${sectionId.toLowerCase()}`;
        history.pushState({ path: newUrl }, '', newUrl);
      }
    }
  }

  openLightbox(imageNumber: number) {
    this.currentImage = imageNumber;
    this.lightboxActive = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxActive = false;
    document.body.style.overflow = 'auto';
  }

  // Manejar el scroll al cargar la página si hay un hash en la URL
  ngOnInit() {
    if (window.location.hash) {
      // Esperar a que la vista se renderice completamente
      setTimeout(() => {
        const sectionId = window.location.hash.substring(1);
        this.scrollTo(sectionId);
      }, 0);
    }
  }
}