import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { CombatPage } from '../../combat';
import { Combatant } from '../../../../classes/combat';

@Component({
  selector: 'modal-health-edit',
  templateUrl: 'health-edit.html'
})
export class HealthEditModal {
  combatant: Combatant;

  constructor(
      public viewCtrl: ViewController,
      public params: NavParams) {
    this.combatant = params.get(CombatPage.COMBATANT_PARAM);
  }

  dismiss() {
    this.viewCtrl.dismiss(this.combatant);
  }
}
