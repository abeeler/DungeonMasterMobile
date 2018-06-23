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
    // If no combatants, push immediately
    if (this.combatants.length == 0) {
      this.combatants.push(combatant);
    } else {
      // Otherwise loop over each combatant to find sorted position
      for (var index = 0; index < this.combatants.length; index++) {
        if (this.combatants[index].initiative < combatant.initiative) {
          this.combatants.splice(index, 0, combatant);
          return;
        }
      }
      
      // If no saved combatants had a lower initiative, add the new one to the end
      this.combatants.push(combatant);
    }
  }
}

export interface Combatant {
  name: string;
  initiative: number;
}