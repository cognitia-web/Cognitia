import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-premium-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="premium-footer">
      <div class="footer-container">
        <!-- Top Section -->
        <div class="footer-top">
          <!-- Brand -->
          <div class="footer-brand">
            <div class="brand-logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span class="brand-name">Cognitia</span>
            </div>
            <p class="brand-description">
              AI-powered learning platform helping students achieve their academic goals with smart tools and personalized insights.
            </p>
            <!-- Social Links -->
            <div class="social-links">
              <a href="#" class="social-link twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="social-link github">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" class="social-link linkedin">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" class="social-link instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Links Columns -->
          <div class="footer-links">
            <div class="link-column">
              <h3 class="column-title">Product</h3>
              <ul class="link-list">
                <li><a routerLink="/features">Features</a></li>
                <li><a routerLink="/pricing">Pricing</a></li>
                <li><a routerLink="/integrations">Integrations</a></li>
                <li><a routerLink="/changelog">Changelog</a></li>
              </ul>
            </div>
            
            <div class="link-column">
              <h3 class="column-title">Resources</h3>
              <ul class="link-list">
                <li><a routerLink="/docs">Documentation</a></li>
                <li><a routerLink="/guides">Guides</a></li>
                <li><a routerLink="/blog">Blog</a></li>
                <li><a routerLink="/support">Support</a></li>
              </ul>
            </div>
            
            <div class="link-column">
              <h3 class="column-title">Company</h3>
              <ul class="link-list">
                <li><a routerLink="/about">About</a></li>
                <li><a routerLink="/careers">Careers</a></li>
                <li><a routerLink="/contact">Contact</a></li>
                <li><a routerLink="/partners">Partners</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Divider -->
        <div class="footer-divider"></div>
        
        <!-- Bottom Section -->
        <div class="footer-bottom">
          <p class="copyright">
            © {{ currentYear }} Cognitia. All rights reserved.
          </p>
          <div class="legal-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span class="separator">•</span>
            <a routerLink="/terms">Terms of Service</a>
            <span class="separator">•</span>
            <a routerLink="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .premium-footer {
      background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
      color: #e0e0e0;
      padding: 4rem 0 2rem;
      margin-top: 6rem;
    }
    
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .footer-top {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 4rem;
      margin-bottom: 3rem;
      
      @media (max-width: 968px) {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }
    
    .footer-brand {
      max-width: 400px;
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 28px;
        height: 28px;
        color: white;
      }
    }
    
    .brand-name {
      font-size: 1.75rem;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .brand-description {
      font-size: 0.9375rem;
      line-height: 1.75;
      color: #a0a0a0;
      margin-bottom: 2rem;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
    }
    
    .social-link {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a0a0a0;
      transition: all 0.3s ease;
      
      svg {
        width: 20px;
        height: 20px;
      }
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }
      
      &.twitter:hover {
        background: #1DA1F2;
        color: white;
      }
      
      &.github:hover {
        background: #333;
        color: white;
      }
      
      &.linkedin:hover {
        background: #0077B5;
        color: white;
      }
      
      &.instagram:hover {
        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
        color: white;
      }
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
    
    .link-column {
      .column-title {
        font-size: 1rem;
        font-weight: 700;
        color: white;
        margin-bottom: 1.25rem;
      }
      
      .link-list {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: 0.75rem;
        }
        
        a {
          color: #a0a0a0;
          text-decoration: none;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          display: inline-block;
          
          &:hover {
            color: #667eea;
            transform: translateX(4px);
          }
        }
      }
    }
    
    .footer-divider {
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      margin: 3rem 0;
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }
    }
    
    .copyright {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }
    
    .legal-links {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      
      a {
        color: #6b7280;
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.3s ease;
        
        &:hover {
          color: #667eea;
        }
      }
      
      .separator {
        color: #4b5563;
      }
    }
  `]
})
export class PremiumFooterComponent {
  currentYear = new Date().getFullYear();
}
