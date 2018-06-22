import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { OrderEntryModal } from './order-entry/order-entry';

@Component({
  selector: 'page-combat',
  templateUrl: 'combat.html'
})
export class CombatPage {
  combatants : Combatant[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.combatants = [];
    this.insertEntry = this.insertEntry.bind(this);
  }

  presentOrderEntryModal() {
    let entryModal = this.modalCtrl.create(OrderEntryModal);
    entryModal.onDidDismiss(this.insertEntry);
    entryModal.present();
  }

  insertEntry(combatant : Combatant) {
    this.combatants.push(combatant);
  }
}

export interface Combatant {
  name: string;
  initiative: number;
}