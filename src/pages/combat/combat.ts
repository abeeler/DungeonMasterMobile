import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { OrderEntryModal } from './order-entry/order-entry';
import { HealthEditModal } from './health-edit/health-edit';

@Component({
  selector: 'page-combat',
  templateUrl: 'combat.html'
})
export class CombatPage {
  static readonly HEALTH_PARAMETER = 'health';

  combatants : Combatant[];
  activeIndex : number;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.combatants = [];
    this.activeIndex = 0;

    this.insertEntry = this.insertEntry.bind(this);
  }

  presentOrderEntryModal() {
    let entryModal = this.modalCtrl.create(OrderEntryModal);
    entryModal.onDidDismiss(this.insertEntry);
    entryModal.present({
      keyboardClose: false
    });
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

  nextCombatant() {
    if (++this.activeIndex == this.combatants.length) {
      this.activeIndex = 0;
    }
  }

  editHealth(health : Health) {
    let data = {};
    data[CombatPage.HEALTH_PARAMETER] = health;

    let healthModal = this.modalCtrl.create(HealthEditModal, data);
    healthModal.present();
  }
}

export interface Combatant {
  name: string;
  initiative: number;
  health: Health;
}

export class Health {
  max: number;
  current: number;

  constructor(max: number) {
    this.max = this.current = max;
  }

  public change(delta : number) {
    this.current += delta;
    this.current = Math.min(Math.max(this.current, 0), this.max);
  }
}