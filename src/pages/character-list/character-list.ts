import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { CharacterDetailPage } from '../character-detail/character-detail';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Character, SimpleCharacter } from '../../classes/character';
import { SQLite } from '@ionic-native/sqlite';
import { CharacterQueries } from '../../classes/character-sql';

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
      private sqlite: SQLite,
      public params: NavParams,
      public navCtrl: NavController,
      public modalCtrl: ModalController) {
    this.callback = params.get(CharacterListPage.CALLBACK_PARAM);
    this.filter = 'all';
    this.loaded = false;

    this.characters = [];
    this.loadFromDatabase();
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
      this.callback(character.id);
      this.navCtrl.pop();
    } else {
      let data = {};
      data[CharacterListPage.CHARACTER_PARAM] = character;
      this.navCtrl.push(CharacterDetailPage, data);
    }
  }

  loadFromDatabase() {
    CharacterQueries.getDatabase(this.sqlite)
      .then(db => {
        db.executeSql(CharacterQueries.CREATE_CHARACTER_TABLE, {})
          .then(() => db.executeSql(CharacterQueries.CREATE_STATISTIC_TABLE, {}))
          .then(() => db.executeSql(CharacterQueries.CREATE_SAVING_THROW_TABLE, {}))
          .then(() => db.executeSql(CharacterQueries.CREATE_SKILL_TABLE, {}))
          .then(() => db.executeSql(CharacterQueries.CREATE_VARIABLE_TABLE, {}))
          .then(() => db.executeSql(CharacterQueries.SELECT_ALL_NAMES, {}))
          .then(res => {
            for (let i = 0; i < res.rows.length; i++) {
              let resultRow = res.rows.item(i);
              this.characters.push(new SimpleCharacter(
                resultRow.id,
                resultRow.name,
                resultRow.characterType
              ));
            }
          }).catch(e => console.log(JSON.stringify(e)));
      });
  }
}
