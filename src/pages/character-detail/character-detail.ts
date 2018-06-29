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

  savingThrowClass(index: number) {
    return { 'saving-throw': this.character.hasSavingThrow(index) };
  }

  presentCharacterEntryModal() {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = JSON.parse(JSON.stringify(this.character));
    let entryModal = this.modalCtrl.create(CharacterEntryModal, data);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        for (const key in data) {
          let descriptor = Object.getOwnPropertyDescriptor(this.character, key);
          if (descriptor && descriptor.writable) {
            this.character[key] = data[key];
          }
        }
        this.character = data;
      }
    });

    entryModal.present({
      keyboardClose: false
    });
  }
}
