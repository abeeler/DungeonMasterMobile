import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { CharacterDetailPage } from '../character-detail/character-detail';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Character, SimpleCharacter } from '../../classes/character';
import { CharacterProvider } from '../../providers/character/character';

@Component({
  selector: 'page-character-list',
  templateUrl: 'character-list.html'
})
export class CharacterListPage {
  static readonly STORED_CHARACTERS = 'characters';
  static readonly CHARACTER_PARAM = 'character';
  static readonly CALLBACK_PARAM = 'callback';

  callback: (Character) => void;
  filter: string;
  loaded: boolean;
  characters: SimpleCharacter[];

  constructor(
      public characterProvider: CharacterProvider,
      public params: NavParams,
      public navCtrl: NavController,
      public modalCtrl: ModalController) {
    this.callback = params.get(CharacterListPage.CALLBACK_PARAM);
    this.filter = 'all';
    this.loaded = false;

    this.characters = [];
    this.characterProvider.getSimpleCharacterList()
        .then(characters => this.characters = characters)
        .catch(e => console.log(JSON.stringify(e)));
  }

  get filteredCharacters() {
    return this.filter == 'all' ?
        this.characters :
        this.characters.filter((character: SimpleCharacter) => character.characterType === 0);
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

  clickCharacter(event, character: SimpleCharacter) {
    if (this.callback) {
      this.callback(character);
      this.navCtrl.pop();
    } else {
      let data = {};
      data[CharacterListPage.CHARACTER_PARAM] = character;
      this.navCtrl.push(CharacterDetailPage, data);
    }
  }
}
