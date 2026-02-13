import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-toast />
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 64px);
      padding: 2rem;
      max-width: 1280px;
      margin: 0 auto;
    }
  `],
})
export class AppComponent {}
