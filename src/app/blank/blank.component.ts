import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blank',
  template: `
    <div class="main-page">
      <div class="content">
        <h1>Ensemble Manager Admin</h1>
        <p>Welcome to the Ensemble Manager Administration Portal</p>
        <div class="login-section">
          <p>Please log in to continue to the admin panel.</p>
          <a routerLink="/admin" class="admin-link">Go to Admin Panel</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .main-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .content {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 400px;
        width: 90%;
      }

      h1 {
        color: #333;
        margin-bottom: 20px;
        font-size: 2.5em;
        font-weight: 300;
      }

      p {
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
      }

      .login-section {
        border-top: 1px solid #eee;
        padding-top: 30px;
      }

      .admin-link {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 5px;
        transition: background 0.3s ease;
        font-weight: 500;
      }

      .admin-link:hover {
        background: #5a6fd8;
      }
    `,
  ],
  standalone: true,
  imports: [RouterModule],
})
export class BlankComponent {}
