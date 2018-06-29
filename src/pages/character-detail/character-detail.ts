import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CharacterListPage } from '../character-list/character-list';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Character } from '../../classes/character';

@Component({
  selector: 'page-character-detail',
  templateUrl: 'character-detail.html'
})
export class CharacterDetailPage {
  section: string;
  character: Character;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.section = 'stats';
    this.character = navParams.get(CharacterListPage.CHARACTER_PARAM);
  }

  get statisticStrings(): string[] {
    return Character.STATISTICS;
  }

  get proficiencyNames(): string[] {
    return Character.PROFICIENCIES;
  }

  get passivePerception(): number {
    return 10 + this.character.getModifier(Character.WISDOM);
  }

  get initiative(): number {
    return this.character.getModifier(Character.DEXTERITY);
  }

  get hitDieBonus(): number {
    return this.character.getModifier(Character.CONSTITUTION);
  }

  savingThrowClass(index: number) {
    return { 'saving-throw': this.character.savingThrows.indexOf(index) >= 0 };
  }

  presentCharacterEntryModal() {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = JSON.parse(JSON.stringify(this.character));
    let entryModal = this.modalCtrl.create(CharacterEntryModal, data);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        for (const key in data) {
          this.character[key] = data[key];
        }
        this.character = data;
      }
    });

    entryModal.present({
      keyboardClose: false
    });
  }
}
