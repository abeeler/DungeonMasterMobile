import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CharacterListPage } from '../character-list/character-list';
import { Character, SimpleCharacter } from '../../classes/character';
import { CharacterDetailPage } from '../character-detail/character-detail';
import { CombatPage } from '../combat/combat';
import { CharacterProvider } from '../../providers/character/character';

@Component({
  selector: 'page-party',
  templateUrl: 'party.html'
})
export class PartyPage {
  static readonly STORED_MEMBERS = 'members';

  members: Character[];
  memberIDs: number[];

  constructor(
      public navCtrl: NavController,
      public storage: Storage,
      public characterProvider: CharacterProvider,
      public toastCtrl: ToastController) {
    this.members = [];
    this.memberIDs = [];
    storage.get(PartyPage.STORED_MEMBERS).then((memberIDs: number[]) => {
      if (memberIDs) {
        for(let characterID of memberIDs) {
          this.memberIDs.push(characterID);
          characterProvider.getCharacterDetails(characterID)
            .then(character => this.members.push(character));
        }
      }
    });
  }

  presentCharacterList() {
    let data = {};
    data[CharacterListPage.CALLBACK_PARAM] = (character: SimpleCharacter) => {
      if (this.memberIDs.indexOf(character.id) === -1) {
        this.characterProvider.getCharacterDetails(character.id)
          .then(character => {
            this.members.push(character);
            this.memberIDs.push(character.id);
            this.saveParty();
          });
      } else {
        let toast = this.toastCtrl.create({
          message: `${character.name} is already in the party!`,
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      }
    };

    this.navCtrl.push(CharacterListPage, data);
  }

  clickCharacter($event, character) {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = character;
    this.navCtrl.push(CharacterDetailPage, data);
  }

  removeMember(index) {
    let removed: Character = this.members.splice(index, 1)[0];
    this.memberIDs.splice(this.memberIDs.indexOf(removed.id), 1);
    this.saveParty();
  }

  saveParty() {
    this.storage.set(PartyPage.STORED_MEMBERS, this.memberIDs);
  }

  startCombat() {
    let data = {};
    data[CombatPage.CHARACTERS_PARAM] = this.members;
    this.navCtrl.push(CombatPage, data, {
      keyboardClose: false
    });
  }
}
