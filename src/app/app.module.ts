import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DicePage } from '../pages/dice/dice';
import { CombatPage } from '../pages/combat/combat';
import { OrderEntryModal } from '../pages/combat/order-entry/order-entry';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HealthEditModal } from '../pages/combat/health-edit/health-edit';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DicePage,
    CombatPage,
    OrderEntryModal,
    HealthEditModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DicePage,
    CombatPage,
    OrderEntryModal,
    HealthEditModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
