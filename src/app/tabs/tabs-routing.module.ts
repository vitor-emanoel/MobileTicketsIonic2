import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
          import('../pages/totem/totem.module').then(m => m.TotemPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../pages/attendant/attendant.module').then(m => m.AttendantPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () =>
          import('../pages/panel/panel.module').then(m => m.PanelPageModule)
      },
      {
        path: 'tab4',
        loadChildren: () =>
          import('../pages/reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
