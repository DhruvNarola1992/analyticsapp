export const childRoutes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { icon: 'dashboard', text: 'Dashboard' }
  },

  {
    path: 'appdashboard',
    loadChildren: () =>
      import('./dashboardapp/dashboard.module').then(m => m.ApplicationDashboardModule),
    data: { icon: 'dashboard', text: 'App Dashboard' }
  },
  
  {
    path: 'application',
    loadChildren: () => import('./application/forms.module').then(m => m.ApplicationModule),
    data: { icon: 'android', text: 'Application' }
  },
  {
    path: 'keyword',
    loadChildren: () => import('./keyword/forms.module').then(m => m.KeywordsModule),
    data: { icon: 'vpn_key', text: 'Keyword' }
  },
  {
    path: 'task',
    loadChildren: () => import('./task/forms.module').then(m => m.TaskModule),
    data: { icon: 'notes', text: 'Task' }
  },
  {
    path: 'scratch',
    loadChildren: () => import('./scratch/forms.module').then(m => m.ScratchModule),
    data: { icon: 'style', text: 'Scratch' }
  },
  {
    path: 'notify',
    loadChildren: () => import('./notify/forms.module').then(m => m.NotifyModule),
    data: { icon: 'notifications', text: 'Notify' }
  },

  {
    path: 'constant',
    loadChildren: () => import('./constant/forms.module').then(m => m.ConstantModule),
    data: { icon: 'settings', text: 'Const' }
  },

  {
    path: 'withdraw',
    loadChildren: () => import('./withdraw/forms.module').then(m => m.WithdrawModule),
    data: { icon: 'payment', text: 'Payment' }
  },

  {
    path: 'user',
    loadChildren: () => import('./user/forms.module').then(m => m.UserModule),
    data: { icon: 'account_box', text: 'User' }
  },

  {
    path: 'userreport',
    loadChildren: () => import('./userreport/forms.module').then(m => m.UserReportModule),
    data: { icon: 'report', text: 'ReportUser' }
  },

  {
    path: 'appreport',
    loadChildren: () => import('./applicationreport/forms.module').then(m => m.ApplicationReportModule),
    data: { icon: 'assignment', text: 'ReportApps' }
  },

  {
    path: 'support',
    loadChildren: () => import('./support/forms.module').then(m => m.SupportModule),
    data: { icon: 'email', text: 'Support' }
  },

  {
    path: 'bulk',
    loadChildren: () => import('./bulk/forms.module').then(m => m.BulkModule),
    data: { icon: 'delete', text: 'Bulk' }
  }
  

  
  
  // {
  //   path: 'constant',
  //   loadChildren: () => import('./constant/forms.module').then(m => m.ConstantModule),
  //   data: { icon: 'assignment', text: 'Const' }
  // }
  // {
  //   path: 'charts',
  //   loadChildren: () =>
  //     import('./charts/charts.module').then(m => m.ChartsModule),
  //   data: { icon: 'bar_chart', text: 'Charts' }
  // },
  // {
  //   path: 'tables',
  //   loadChildren: () =>
  //     import('./tables/tables.module').then(m => m.TablesModule),
  //   data: { icon: 'table_chart', text: 'Tables' }
  // },
  // ,{
  //   path: 'forms',
  //   loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
  //   data: { icon: 'assignment', text: 'Forms' }
  // },
  // {
  //   path: 'mat-grid',
  //   loadChildren: () =>
  //     import('./mat-grid/mat-grid.module').then(m => m.MatGridModule),
  //   data: { icon: 'grid_on', text: 'Flex Grid' }
  // },
  // {
  //   path: 'mat-components',
  //   loadChildren: () =>
  //     import('./mat-components/mat-components.module').then(
  //       m => m.MatComponentsModule
  //     ),
  //   data: { icon: 'code', text: 'Material Components' }
  // },
  // {
  //   path: 'animations',
  //   loadChildren: () =>
  //     import('./animations/animations.module').then(m => m.AnimationsModule),
  //   data: { icon: 'perm_media', text: 'Animations' }
  // },
  // {
  //   path: 'google-maps',
  //   loadChildren: () =>
  //     import('./google-map-demo/google-map-demo.module').then(
  //       m => m.GoogleMapDemoModule
  //     ),
  //   data: { icon: 'place', text: 'Google Maps' }
  // }
];
