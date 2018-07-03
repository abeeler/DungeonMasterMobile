import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { SQLiteObject, SQLite } from "@ionic-native/sqlite";
import { CharacterQueries } from "../../classes/character-sql";
import { SimpleCharacter, Character } from "../../classes/character";

@Injectable()
export class CharacterProvider {
  database: SQLiteObject;

  constructor(private sqlite: SQLite, private platform: Platform) {
      this.platform.ready().then(() => {
          this.sqlite.create(CharacterQueries.DATABASE)
          .then((db: SQLiteObject) => {
              this.database = db;
              db.executeSql(CharacterQueries.CREATE_CHARACTER_TABLE, {})
              .then(() => db.executeSql(CharacterQueries.CREATE_STATISTIC_TABLE, {}))
              .then(() => db.executeSql(CharacterQueries.CREATE_SAVING_THROW_TABLE, {}))
              .then(() => db.executeSql(CharacterQueries.CREATE_SKILL_TABLE, {}))
              .then(() => db.executeSql(CharacterQueries.CREATE_VARIABLE_TABLE, {}));
          });
      });
  }

  getSimpleCharacterList(): Promise<SimpleCharacter[]> {
    return new Promise((resolve, reject) => {
      this.database.executeSql(CharacterQueries.SELECT_ALL_NAMES, {})
        .then(res => {
          let characters: SimpleCharacter[] = [];
          for (let i = 0; i < res.rows.length; i++) {
              let resultRow = res.rows.item(i);
              characters.push(new SimpleCharacter(
                  resultRow.id,
                  resultRow.name,
                  resultRow.characterType
              ));
          }
          resolve(characters);
        }).catch(reject);
    });
  }

  getCharacterDetails(id: number): Promise<Character> {
    let character = new Character();
    return new Promise<Character>((resolve, reject) => {
      this.database.executeSql(CharacterQueries.SELECT_SPECIFIC_CHARACTER, [id]).then(res => {
        if (res.rows.length === 0) {
            // TODO: Expected character but found none?
            resolve(character);
            return;
        }
        let resultRow = res.rows.item(0);
        character.id = resultRow.id;
        character.name = resultRow.name;
        character.maxHealth = resultRow.maxHealth;
        character.speed = resultRow.speed;
        character.armorClass = resultRow.armorClass;
        character.characterType = resultRow.characterType;

        this.database.executeSql(CharacterQueries.SELECT_CHARACTER_STATISTICS, [id]).then(res => {
          if (res.rows.length > 0) {
            let resultRow = res.rows.item(0);
            character.statistics = [
              resultRow.strength,
              resultRow.dexterity,
              resultRow.constitution,
              resultRow.intelligence,
              resultRow.wisdom,
              resultRow.charisma,
            ];
          }
          
          this.database.executeSql(CharacterQueries.SELECT_CHARACTER_SAVING_THROWS, [id]).then(res => {
            for (let i = 0; i < res.rows.length; i++) {
              character.savingThrows.push(res.rows.item(i).statistic);
            }

            this.database.executeSql(CharacterQueries.SELECT_CHARACTER_SKILLS, [id]).then(res => {
              for (let i = 0; i < res.rows.length; i++) {
                  character.skills.push(res.rows.item(i).skill);
              }
              resolve(character);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }

  saveCharacter(character: Character): Promise<void> {
    if (character.id) {
      return this.database.executeSql(CharacterQueries.UPDATE_CHARACTER, [character.name, character.maxHealth, character.speed, character.armorClass, character.characterType, character.id])
          .then(() => this.saveStatistics(character, false))
          .then(() => this.clearSavingThrows(character))
          .then(() => this.createMapping('saving_throw', character.id, character.savingThrows))
          .then(() => this.clearSkills(character))
          .then(() => this.createMapping('skill', character.id, character.skills));
    } else {
      return this.database.executeSql(CharacterQueries.INSERT_CHARACTER, [character.name, character.maxHealth, character.speed, character.armorClass, character.characterType])
          .then(() => this.saveStatistics(character, true))
          .then(() => this.createMapping('saving_throw', character.id, character.savingThrows))
          .then(() => this.createMapping('skill', character.id, character.skills));
    }
  }

  clearSavingThrows(character: Character): Promise<void> {
    return this.database.executeSql(CharacterQueries.CLEAR_SAVING_THROWS, [character.id]);
  }

  clearSkills(character: Character): Promise<void> {
    return this.database.executeSql(CharacterQueries.CLEAR_SKILLS, [character.id]);
  }

  createMapping(
      tableName: string,
      id: number,
      arr: number[]): Promise<void> {
    if (!arr || arr.length == 0) {
      return new Promise(resolve => resolve());
    }

    let insertQuery = `INSERT INTO ${tableName} VALUES`;
    for (let i = 0; i < arr.length; i++) {
      if (i > 0) insertQuery += ',';
      insertQuery += `(${id}, ${arr[i]})`; 
    }

    return this.database.executeSql(insertQuery, {});
  }

  saveStatistics(character: Character, isInsert: boolean): Promise<void> {
    let values = [];
    if (isInsert) values.push(character.id);
    for (let stat of character.statistics) {
        values.push(stat);
    }
    if (!isInsert) values.push(character.id);
    return this.database.executeSql(isInsert ? CharacterQueries.INSERT_STATISTICS : CharacterQueries.UPDATE_STATISTICS, values);
  }
}
