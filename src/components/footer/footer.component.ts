// src/app/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p> 2025 Bentasca. Todos los derechos reservados.</p>
        </div>
        
        <div class="footer-social">
          <a href="https://www.instagram.com/bentasca/" target="_blank" class="social-icon" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/bentasca.bentasca" target="_blank" class="social-icon" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://wa.me/59891227577" target="_blank" class="social-icon" aria-label="WhatsApp">
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>
        
        <div class="footer-links">
          <a href="/terminos" class="footer-link">Términos y condiciones</a>
          <span class="divider">|</span>
          <a href="/privacidad" class="footer-link">Política de privacidad</a>
        </div>
        
        <div class="footer-credits">
          <p>Diseño Web — Juan Navarrete <a href="tel:+59892454958" class="footer-phone">+598 92 454 958</a></p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }