// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: 'admin',
//     loadChildren: () =>
//       import('./admin/admin.module').then((m) => m.AdminModule),
//   },
// ];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((c) => c.AdminComponent),
    children: [
      {
        path: 'accounts',
        loadComponent: () =>
          import('./admin/accounts/accounts.component').then(
            (c) => c.AccountsComponent
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
        path: 'report',
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
];
