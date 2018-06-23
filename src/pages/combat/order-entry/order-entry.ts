import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Combatant, Health } from '../combat';

@Component({
  selector: 'modal-order-entry',
  templateUrl: 'order-entry.html'
})
export class OrderEntryModal {
  name : string;
  initiative : number;
  maxHealth : number;

  constructor(public viewCtrl: ViewController) {
    this.name = '';
    this.initiative = 0;
    this.maxHealth = 0;
  }

  dismiss() {
    this.viewCtrl.dismiss({
      name: this.name,
      initiative: Math.floor(this.initiative),
      health: new Health(Math.floor(this.maxHealth))
    });
  }
}
