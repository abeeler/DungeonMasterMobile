import { Component } from '@angular/core';
import { ViewController, AlertController, NavParams } from 'ionic-angular';
import { CharacterListPage } from '../character-list/character-list';
import { Character, SimpleCharacter, PlayerCharacter } from '../../classes/character';
import { CharacterProvider } from '../../providers/character/character';

@Component({
  selector: 'modal-character-entry',
  templateUrl: 'character-entry.html'
})
export class CharacterEntryModal {
  originatingCharacter: SimpleCharacter;
  character: Character;

  constructor(
      public characterProvider: CharacterProvider,
      public params: NavParams,
      public viewCtrl: ViewController,
      public alertCtrl: AlertController) {
    this.character = new PlayerCharacter();
    this.originatingCharacter = params.get(CharacterListPage.CHARACTER_PARAM);
    if (this.originatingCharacter) {
      characterProvider.getCharacterDetails(this.originatingCharacter.id)
        .then((character: Character) => this.character = character)
        .catch(e => console.log(JSON.stringify(e)));
    }
  }

  dismiss() {
    if (this.originatingCharacter) {
      this.originatingCharacter.name = this.character.name;
      this.originatingCharacter.characterType = this.character.characterType;
    }

    this.characterProvider.saveCharacter(this.character)
      .then(() => this.viewCtrl.dismiss(this.character))
      .catch(e => console.log(JSON.stringify(e)));
  }

  get characterTypeNames(): string[] {
    return Character.CHARACTER_TYPES;
  }

  get classNames(): string[] {
    return PlayerCharacter.CLASS_NAMES;
  }

  get backgroundNames(): string[] {
    return PlayerCharacter.BACKGROUND_NAMES;
  }

  get statisticStrings(): string[] {
    return Character.STATISTICS;
  }

  get skillNames(): string[] {
    return Character.SKILLS;
  }

  get inactiveSkills(): number[] {
    let inactiveSkills: number[] = [];
    for (let i = 0; i < Character.SKILLS.length; i++) {
      if (this.character.skills.indexOf(i) < 0) {
        inactiveSkills.push(i);
      }
    }
    return inactiveSkills;
  }

  typeChange(type: number) {
    console.log(type);
  }

  removeSkill(skill: number) {
    this.character.skills.splice(this.character.skills.indexOf(skill), 1);
  }

  addSkill(skill: number) {
    this.character.skills.push(skill);
    this.character.skills = this.character.skills.sort((a, b) => a - b);
  }

  presentSavingThrowList() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Saving Throws');

    this.statisticStrings.forEach((statisticString, index) => {
      alert.addInput({
        type: 'checkbox',
        label: statisticString,
        value: index.toString(),
        checked: this.character.hasSavingThrow(index)
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
