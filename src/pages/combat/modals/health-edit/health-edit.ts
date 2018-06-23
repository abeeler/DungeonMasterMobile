import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Health, CombatPage } from '../../combat';

@Component({
  selector: 'modal-health-edit',
  templateUrl: 'health-edit.html'
})
export class HealthEditModal {
  health: Health;

  constructor(
      public viewCtrl: ViewController,
      public params: NavParams) {
    this.health = params.get(CombatPage.HEALTH_PARAMETER);
  }

  dismiss() {
    this.viewCtrl.dismiss(this.health);
  }
}
