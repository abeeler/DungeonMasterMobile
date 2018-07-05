import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { SQLiteObject, SQLite } from "@ionic-native/sqlite";
import { CharacterQueries } from "../../classes/character-sql";
import { SimpleCharacter, Character, PlayerCharacter } from "../../classes/character";

@Injectable()
export class CharacterProvider {
  database: SQLiteObject;

  constructor(private sqlite: SQLite, private platform: Platform) {
  }

  get openDatabase(): Promise<SQLiteObject> {
    if (this.database) {
      return Promise.resolve(this.database);
    }

    return this.platform.ready()
      //.then(() => this.sqlite.deleteDatabase(CharacterQueries.DATABASE))
      .then(() => this.sqlite.create(CharacterQueries.DATABASE))
      .then((db: SQLiteObject) => Promise.resolve(this.database = db))
      .then(() => this.database.executeSql(CharacterQueries.CREATE_CHARACTER_TABLE, {}))
      .then(() => this.database.executeSql(CharacterQueries.CREATE_STATISTIC_TABLE, {}))
      .then(() => this.database.executeSql(CharacterQueries.CREATE_SAVING_THROW_TABLE, {}))
      .then(() => this.database.executeSql(CharacterQueries.CREATE_SKILL_TABLE, {}))
      .then(() => this.database.executeSql(CharacterQueries.CREATE_VARIABLE_TABLE, {}))
      .then(() => Promise.resolve(this.database));
  }

  getSimpleCharacterList(): Promise<SimpleCharacter[]> {
    return this.openDatabase
      .then(db => db.executeSql(CharacterQueries.SELECT_ALL_NAMES, {}))
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
        return Promise.resolve(characters);
      });
  }

  getCharacterDetails(id: number): Promise<Character> {
    let character = new Character();
    return this.openDatabase
      .then(db => db.executeSql(CharacterQueries.SELECT_SPECIFIC_CHARACTER, [id]))
      .then(res => {
        if (res.rows.length === 0) {
            throw new Error(`Expected character with id ${id} but found none`);
        }
        let resultRow = res.rows.item(0);
        character.id = resultRow.id;
        character.name = resultRow.name;
        character.maxHealth = resultRow.maxHealth;
        character.speed = resultRow.speed;
        character.armorClass = resultRow.armorClass;
        character.characterType = resultRow.characterType;
      })
      .then(() => this.database.executeSql(CharacterQueries.SELECT_CHARACTER_STATISTICS, [id]))
      .then(res => {
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
      })
      .then(() => this.database.executeSql(CharacterQueries.SELECT_CHARACTER_SAVING_THROWS, [id]))
      .then(res => {
        for (let i = 0; i < res.rows.length; i++) {
          character.savingThrows.push(res.rows.item(i).statistic);
        }
      })
      .then(() => this.database.executeSql(CharacterQueries.SELECT_CHARACTER_SKILLS, [id]))
      .then(res => {
        for (let i = 0; i < res.rows.length; i++) {
          character.skills.push(res.rows.item(i).skill);
        }
      })
      .then(() => this.getPlayerCharacterDetails(character));
  }

  private getPlayerCharacterDetails(character: Character): Promise<Character> {
    if (!character.isPlayerCharacter) return Promise.resolve(character);
    let playerCharacter = new PlayerCharacter(character);
    return this.database.executeSql(CharacterQueries.SELECT_CHARACTER_VARIABLES, [character.id])
      .then(res => {
        if (res.rows.length == 0) return;

        let resultRow = res.rows.item(0);
        playerCharacter.experience = resultRow.experience;
        playerCharacter.hitPoints = resultRow.hitPoints;
        playerCharacter.currentHitDie = resultRow.currentHitDie;
        playerCharacter.classType = resultRow.classType;
        playerCharacter.backgroundType = resultRow.backgroundType;
      })
      .then(() => playerCharacter);
  }

  saveCharacter(character: Character): Promise<void> {
    if (character.id) {
      return this.openDatabase
        .then(() => this.saveBasicData(character, false))
        .then(() => this.saveStatistics(character, false))
        .then(() => this.clearSavingThrows(character))
        .then(() => this.createMapping('saving_throw', character.id, character.savingThrows))
        .then(() => this.clearSkills(character))
        .then(() => this.createMapping('skill', character.id, character.skills))
        .then(() => this.saveVariables(character, false));
    } else {
      return this.openDatabase
        .then(() => this.saveBasicData(character, true))
        .then(() => this.saveStatistics(character, true))
        .then(() => this.createMapping('saving_throw', character.id, character.savingThrows))
        .then(() => this.createMapping('skill', character.id, character.skills))
        .then(() => this.saveVariables(character, true));
    }
  }

  private clearSavingThrows(character: Character): Promise<void> {
    return this.openDatabase
      .then(() => this.database.executeSql(CharacterQueries.CLEAR_SAVING_THROWS, [character.id]));
  }

  private clearSkills(character: Character): Promise<void> {
    return this.openDatabase
      .then(() => this.database.executeSql(CharacterQueries.CLEAR_SKILLS, [character.id]));
  }

  private createMapping(
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

    return this.openDatabase
      .then(() => this.database.executeSql(insertQuery, {}));
  }

  private saveBasicData(character: Character, isInsert: boolean): Promise<void> {
    if (isInsert) {
      return this.database.executeSql(CharacterQueries.INSERT_CHARACTER, [character.name, character.maxHealth, character.speed, character.armorClass, character.characterType])
        .then((res) => character.id = res.insertId)
    } else {
      return this.database.executeSql(CharacterQueries.UPDATE_CHARACTER, [character.name, character.maxHealth, character.speed, character.armorClass, character.characterType, character.id]);
    }
  }

  private saveStatistics(character: Character, isInsert: boolean): Promise<void> {
    let values = [];
    if (isInsert) values.push(character.id);
    for (let stat of character.statistics) {
        values.push(stat);
    }
    if (!isInsert) values.push(character.id);
    return this.openDatabase
      .then(() => this.database.executeSql(isInsert ? CharacterQueries.INSERT_STATISTICS : CharacterQueries.UPDATE_STATISTICS, values));
  }

  private saveVariables(character: Character, isInsert: boolean): Promise<void> {
    if (!(character instanceof PlayerCharacter)) return Promise.resolve();

    let playerCharacter = character as PlayerCharacter;
    let values = [];
    if (isInsert) values.push(character.id);
    values.push(playerCharacter.experience, playerCharacter.hitPoints, playerCharacter.currentHitDie, playerCharacter.classType, playerCharacter.backgroundType);
    if (!isInsert) values.push(character.id);
    return this.openDatabase
      .then(() => this.database.executeSql(isInsert ? CharacterQueries.INSERT_VARIABLES : CharacterQueries.UPDATE_VARIABLES, values));
  }
}
