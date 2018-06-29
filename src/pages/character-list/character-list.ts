import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ModalController } from 'ionic-angular';
import { CharacterDetailPage } from '../character-detail/character-detail';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Character } from '../../classes/character';
import { Health } from '../../classes/combat';

@Component({
  selector: 'page-character-list',
  templateUrl: 'character-list.html'
})
export class CharacterListPage {
  static readonly STORED_CHARACTERS = 'characters';
  static readonly CHARACTER_PARAM = 'character';

  loaded: boolean;
  characters: Character[];

  constructor(public storage: Storage, public navCtrl: NavController, public modalCtrl: ModalController) {
    this.loaded = false;
    this.characters = [];
    storage.get(CharacterListPage.STORED_CHARACTERS).then((characters: Character[]) => {
      if (characters) {
        for(let character of characters) {
          this.characters.push(new Character(character));
        }
      } else {
        this.characters.push(new Character({
          name: "Johnson Jacobs",
          statistics: [6, 10, 14, 15, 9, 8],
          savingThrows: [2, 5],
          health: new Health(15),
          currentHitDie: 1,
          maxHitDie: 1,
          armorClass: 11,
          proficiencies: [2, 4, 8]
        }));
      }
    });
  }

  presentCharacterEntryModal() {
    let entryModal = this.modalCtrl.create(CharacterEntryModal);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        this.characters.push(data);
        this.storage.set(CharacterListPage.STORED_CHARACTERS, this.characters);
      }
    });

    entryModal.present({
      keyboardClose: false
    });
  }

  showCharacter(event, character) {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = character;
    this.navCtrl.push(CharacterDetailPage, data);
  }

  ionViewWillEnter() {
    if (!this.loaded) {
      this.loaded = true;
    } else {
      this.storage.set(CharacterListPage.STORED_CHARACTERS, this.characters);
    }
}
}
