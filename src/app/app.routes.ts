import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blank/blank.component').then((c) => c.BlankComponent),
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((c) => c.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/blank-admin/blank-admin.component').then(
            (c) => c.BlankAdminComponent
          ),
        pathMatch: 'full',
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./admin/accounts/accounts.component').then(
            (c) => c.AccountsComponent
          ),
      },
      {
        path: 'newsletter',
        loadComponent: () =>
          import('./admin/newsletter/newsletter.component').then(
            (c) => c.NewsletterComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./admin/members/members.component').then(
            (c) => c.MembersComponent
          ),
      },
      {
        path: 'email',
        loadComponent: () =>
          import('./admin/email/email.component').then((c) => c.EmailComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/reports/reports.component').then(
            (c) => c.ReportsComponent
          ),
      },
      {
        path: 'member/:id',
        loadComponent: () =>
          import('./admin/members/process/process.component').then(
            (c) => c.MemberProcessComponent
          ),
      },
      {
        path: 'account/:id',
        loadComponent: () =>
          import('./admin/accounts/process/process.component').then(
            (c) => c.AccountProcessComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./blank/blank.component').then((c) => c.BlankComponent),
  },
];
