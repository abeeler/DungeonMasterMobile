import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Health, CombatantGroup, Combatant } from '../../combat';

@Component({
  selector: 'modal-order-entry',
  templateUrl: 'order-entry.html'
})
export class OrderEntryModal {
  name : string;
  initiative : number;
  maxHealth : number;
  isIndividual : boolean;
  memberCount : number;

  constructor(public viewCtrl: ViewController) {
    this.name = '';
    this.initiative = 0;
    this.maxHealth = 0;
    this.isIndividual = true;
    this.memberCount = 2;
  }

  dismiss() {
    let members : Combatant[] = [];
    if (this.isIndividual) {
      members.push({
        name: this.name,
        health: new Health(this.maxHealth)
      })
    } else {
      for (let i = 0; i < this.memberCount; i++) {
        members.push({
          name: (i + 1).toLocaleString(),
          health: new Health(this.maxHealth)
        })
      }
    }

    let newGroup : CombatantGroup = {
      name: this.name,
      initiative: Math.floor(this.initiative),
      members: members
    };
    this.viewCtrl.dismiss(newGroup);
  }
}
