import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-dice',
  templateUrl: 'dice.html'
})
export class DicePage {
  dieSize: number;
  recentResult: string;
  results: string[];

  constructor(public navCtrl: NavController) {
    this.dieSize = 20;
    this.recentResult = '';
    this.results = [];
  }

  roll() {
    if (this.recentResult) {
      this.results.splice(0, 0, this.recentResult);
    }

    var roll = Math.floor(Math.random() * this.dieSize + 1);
    if (this.dieSize == 2) {
      this.recentResult = roll === 1 ? "Heads" : "Tails";
    } else {
      this.recentResult = roll.toLocaleString();
    }
  }
}
