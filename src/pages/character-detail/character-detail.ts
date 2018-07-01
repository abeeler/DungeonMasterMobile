import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CharacterListPage } from '../character-list/character-list';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Character, SimpleCharacter } from '../../classes/character';
import { SQLite } from '@ionic-native/sqlite';
import { CharacterQueries } from '../../classes/character-sql';

@Component({
  selector: 'page-character-detail',
  templateUrl: 'character-detail.html'
})
export class CharacterDetailPage {
  section: string;
  originatingCharacter: SimpleCharacter;
  character: Character;

  constructor(
      private sqlite: SQLite,
      public navCtrl: NavController,
      public params: NavParams,
      public modalCtrl: ModalController) {
    this.section = 'stats';
    this.character = new Character();
    this.originatingCharacter = params.get(CharacterListPage.CHARACTER_PARAM);
    CharacterQueries.getDatabase(this.sqlite)
        .then((db) => CharacterQueries.getFullCharacter(db, this.originatingCharacter.id))
        .then(character => this.character = character)
        .catch(e => console.log(JSON.stringify(e)));
  }

  get statisticStrings(): string[] {
    return Character.STATISTICS;
  }

  get skillNames(): string[] {
    return Character.SKILLS;
  }

  get characterTypeColor(): string {
    switch(this.character.characterType) {
      case 0: return 'secondary';
      case 1: return 'primary';
      case 2: return 'danger';
    }
  }

  savingThrowClass(index: number) {
    return { 'saving-throw': this.character.hasSavingThrow(index) };
  }

  presentCharacterEntryModal() {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = this.originatingCharacter;
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
