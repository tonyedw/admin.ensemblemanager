import { Component } from '@angular/core';

@Component({
  selector: 'app-blank-admin',
  template: `
    <div class="blank-admin">
      <h2>Admin Dashboard</h2>
      <p>Please select a menu option above to get started.</p>
    </div>
  `,
  styles: [
    `
      .blank-admin {
        padding: 20px;
        text-align: center;
        color: #666;
      }

      .blank-admin h2 {
        margin-bottom: 10px;
        color: #333;
      }
    `,
  ],
  standalone: true,
})
export class BlankAdminComponent {}
