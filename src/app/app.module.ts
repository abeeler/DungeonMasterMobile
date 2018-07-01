import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DicePage } from '../pages/dice/dice';
import { CombatPage } from '../pages/combat/combat';

import { OrderEntryModal } from '../pages/combat/modals/order-entry/order-entry';
import { HealthEditModal } from '../pages/combat/modals/health-edit/health-edit';

import { CombatantGroupComponent } from '../pages/combat/components/combatant-group';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CharacterListPage } from '../pages/character-list/character-list';
import { CharacterDetailPage } from '../pages/character-detail/character-detail';
import { CharacterEntryModal } from '../pages/character-entry/character-entry';
import { PartyPage } from '../pages/party/party';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DicePage,
    CombatPage,
    CharacterDetailPage,
    CharacterListPage,
    CharacterEntryModal,
    OrderEntryModal,
    HealthEditModal,
    CombatantGroupComponent,
    PartyPage
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
    DicePage,
    CombatPage,
    CharacterDetailPage,
    CharacterListPage,
    PartyPage,
    CharacterEntryModal,
    OrderEntryModal,
    HealthEditModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite
  ]
})
export class AppModule {}
