import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DicePage } from '../pages/dice/dice';
import { CombatPage } from '../pages/combat/combat';

import { OrderEntryModal } from '../pages/combat/modals/order-entry/order-entry';
import { HealthEditModal } from '../pages/combat/modals/health-edit/health-edit';

import { CombatantGroupComponent } from '../pages/combat/components/combatant-group';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CharacterPage } from '../pages/character/character';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DicePage,
    CombatPage,
    CharacterPage,
    OrderEntryModal,
    HealthEditModal,
    CombatantGroupComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DicePage,
    CombatPage,
    CharacterPage,
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
