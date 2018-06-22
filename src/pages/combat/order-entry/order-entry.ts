import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Combatant } from '../combat';

@Component({
  selector: 'modal-order-entry',
  templateUrl: 'order-entry.html'
})
export class OrderEntryModal {
  combatant : Combatant;

  constructor(public viewCtrl: ViewController) {
    this.combatant = {
      name: '',
      initiative: 0
    }
  }

  dismiss() {
    this.combatant.initiative = Math.floor(this.combatant.initiative);
    this.viewCtrl.dismiss(this.combatant);
  }
}
