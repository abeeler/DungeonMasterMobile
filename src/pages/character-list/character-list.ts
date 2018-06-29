import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Character, CharacterDetailPage } from '../character-detail/character-detail';
import { Health } from '../combat/combat';
import { CharacterEntryModal } from '../character-entry/character-entry';

@Component({
  selector: 'page-character-list',
  templateUrl: 'character-list.html'
})
export class CharacterListPage {
  static readonly CHARACTER_PARAM = 'character';

  characters : Character[];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.characters = [];
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

  presentCharacterEntryModal() {
    let entryModal = this.modalCtrl.create(CharacterEntryModal);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        this.characters.push(data);
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
}
