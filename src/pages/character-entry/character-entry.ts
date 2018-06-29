import { Component } from '@angular/core';
import { ViewController, AlertController, NavParams } from 'ionic-angular';
import { Character } from '../character-detail/character-detail';
import { CharacterListPage } from '../character-list/character-list';

@Component({
  selector: 'modal-character-entry',
  templateUrl: 'character-entry.html'
})
export class CharacterEntryModal {
  character: Character;

  constructor(public params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    this.character = new Character(params.get(CharacterListPage.CHARACTER_PARAM));
  }

  dismiss() {
    console.log("test")
    this.viewCtrl.dismiss(this.character);
  }

  get statisticStrings() : string[] {
    return Character.STATISTICS;
  }

  get proficiencyNames() : string[] {
    return Character.PROFICIENCIES;
  }

  get inactiveProficiencies() : number[] {
    let inactiveProficiencies: number[] = [];
    for (let i = 0; i < Character.PROFICIENCIES.length; i++) {
      if (this.character.proficiencies.indexOf(i) < 0) {
        inactiveProficiencies.push(i);
      }
    }
    return inactiveProficiencies;
  }

  removeSkill(skill: number) {
    this.character.proficiencies.splice(this.character.proficiencies.indexOf(skill), 1);
  }

  addSkill(skill: number) {
    this.character.proficiencies.push(skill);
    this.character.proficiencies = this.character.proficiencies.sort((a, b) => a - b);
  }

  presentSavingThrowList() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Saving Throws');

    this.statisticStrings.forEach((statisticString, index) => {
      alert.addInput({
        type: 'checkbox',
        label: statisticString,
        value: index.toString(),
        checked: this.character.savingThrows.indexOf(index) >= 0
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Done',
      handler: data => {
        let newSavingThrows: number[] = [];
        for (let savingThrowIndex of data) {
          newSavingThrows.push(+savingThrowIndex);
        }
        this.character.savingThrows = newSavingThrows;
      }
    });
    alert.present();
  }
}
