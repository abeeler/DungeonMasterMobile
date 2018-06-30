import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CharacterListPage } from '../character-list/character-list';
import { Character } from '../../classes/character';
import { CharacterDetailPage } from '../character-detail/character-detail';

@Component({
  selector: 'page-party',
  templateUrl: 'party.html'
})
export class PartyPage {
  static readonly STORED_MEMBERS = 'members';

  members: Character[];

  constructor(public navCtrl: NavController, public storage: Storage) {
    this.members = [];
    storage.get(PartyPage.STORED_MEMBERS).then((characters: Character[]) => {
      if (characters) {
        for(let character of characters) {
          this.members.push(new Character(character));
        }
      }
    });
  }

  presentCharacterList() {
    let data = {};
    data[CharacterListPage.CALLBACK_PARAM] = (character: Character) => {
      this.members.push(character);
      this.saveParty();
    };

    this.navCtrl.push(CharacterListPage, data);
  }

  clickCharacter($event, character) {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = character;
    this.navCtrl.push(CharacterDetailPage, data);
  }

  saveParty() {
    this.storage.set(PartyPage.STORED_MEMBERS, this.members);
  }
}
