import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CharacterListPage } from '../character-list/character-list';
import { Character } from '../../classes/character';
import { CharacterDetailPage } from '../character-detail/character-detail';

@Component({
  selector: 'page-party',
  templateUrl: 'party.html'
})
export class PartyPage {
  members: Character[];

  constructor(public navCtrl: NavController) {
    this.members = [];
  }

  presentCharacterList() {
    this.navCtrl.push(CharacterListPage, { 
      callback: (character: Character) => {
        this.members.push(character);
      }
    });
  }

  clickCharacter($event, character) {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = character;
    this.navCtrl.push(CharacterDetailPage, data);
  }
}
