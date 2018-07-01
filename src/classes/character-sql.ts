import { Character } from "./character";
import { SQLiteObject, SQLite } from "@ionic-native/sqlite";

export class CharacterQueries {
    static readonly DATABASE = {
        name: 'dnd.db',
        location: 'default'
    };

    static readonly SELECT_ALL_NAMES = 'SELECT id, name, characterType FROM character';
    static readonly SELECT_SPECIFIC_CHARACTER = 'SELECT * FROM character WHERE id = ?';
    static readonly SELECT_CHARACTER_STATISTICS = 'SELECT * FROM statistic WHERE characterID = ?';
    static readonly SELECT_CHARACTER_SAVING_THROWS = 'SELECT * FROM saving_throw WHERE characterID = ?';
    static readonly SELECT_CHARACTER_SKILLS = 'SELECT * FROM skill WHERE characterID = ?';

    static getFullCharacter(db: SQLiteObject, id: number): Promise<Character> {
        let character = new Character();
        return new Promise<Character>((resolve, reject) => {
            db.executeSql(CharacterQueries.SELECT_SPECIFIC_CHARACTER, [id]).then(res => {
                if (res.rows.length === 0) {
                    // TODO: Expected character but found none?
                    resolve(new Character());
                    return;
                }

                CharacterQueries.populateCharacterFromRow(res.rows.item(0), character);

                db.executeSql(CharacterQueries.SELECT_CHARACTER_STATISTICS, [id]).then(res => {
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
                    
                    db.executeSql(CharacterQueries.SELECT_CHARACTER_SAVING_THROWS, [id]).then(res => {
                        for (let i = 0; i < res.rows.length; i++) {
                            character.savingThrows.push(res.rows.item(i).statistic);
                        }

                        db.executeSql(CharacterQueries.SELECT_CHARACTER_SKILLS, [id]).then(res => {
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

    static populateCharacterFromRow(resultRow, character: Character) {
        character.id = resultRow.id;
        character.name = resultRow.name;
        character.maxHealth = resultRow.maxHealth;
        character.speed = resultRow.speed;
        character.armorClass = resultRow.armorClass;
        character.characterType = resultRow.characterType;
    }

    static readonly INSERT_CHARACTER = 'INSERT INTO character VALUES(NULL,?,?,?,?,?)';
    static readonly INSERT_STATISTICS = 'INSERT INTO statistic VALUES(?,?,?,?,?,?,?)';

    static readonly UPDATE_CHARACTER = 'UPDATE character SET name=?, maxHealth=?, speed=?, armorClass=?, characterType=? WHERE id=?';
    static readonly UPDATE_STATISTICS = 'UPDATE statistic SET strength=?, dexterity=?, constitution=?, intelligence=?, wisdom=?, charisma=? WHERE characterID=?';

    static readonly CLEAR_SAVING_THROWS = 'DELETE FROM saving_throw WHERE characterID = ?';
    static readonly CLEAR_SKILLS = 'DELETE FROM skill WHERE characterID = ?';

    static saveCharacter(db: SQLiteObject, character: Character): Promise<void> {
        if (character.id) {
            return db.executeSql(CharacterQueries.UPDATE_CHARACTER, [character.name, character.maxHealth, character.speed, character.armorClass, character.characterType, character.id])
                .then(() => CharacterQueries.saveStatistics(db, character, false))
                .then(() => db.executeSql(CharacterQueries.CLEAR_SAVING_THROWS, [character.id]))
                .then(() => CharacterQueries.createMapping(db, 'saving_throw', character.id, character.savingThrows))
                .then(() => db.executeSql(CharacterQueries.CLEAR_SKILLS, [character.id]))
                .then(() => CharacterQueries.createMapping(db, 'skill', character.id, character.skills));
        } else {
            return db.executeSql(CharacterQueries.INSERT_CHARACTER, [character.name, character.maxHealth, character.speed, character.armorClass, character.characterType])
                .then(() => CharacterQueries.saveStatistics(db, character, true))
                .then(() => CharacterQueries.createMapping(db, 'saving_throw', character.id, character.savingThrows))
                .then(() => CharacterQueries.createMapping(db, 'skill', character.id, character.skills));
        }
    }

    static saveStatistics(db: SQLiteObject, character: Character, isInsert: boolean): Promise<void> {
        let values = [];
        if (isInsert) values.push(character.id);
        for (let stat of character.statistics) {
            values.push(stat);
        }
        if (!isInsert) values.push(character.id);
        return db.executeSql(isInsert ? CharacterQueries.INSERT_STATISTICS : CharacterQueries.UPDATE_STATISTICS, values);
    }

    static createMapping(
            db: SQLiteObject,
            tableName: string,
            id: number,
            arr: number[]): Promise<void> {
        if (!arr || arr.length == 0) {
            return new Promise((resolve, reject) => resolve());
        }

        let insertQuery = `INSERT INTO ${tableName} VALUES`;
        for (let i = 0; i < arr.length; i++) {
            if (i > 0) insertQuery += ',';
            insertQuery += `(${id}, ${arr[i]})`; 
        }

        return db.executeSql(insertQuery, {});
    }

    static getDatabase(sqlite: SQLite): Promise<SQLiteObject> {
        return sqlite.create(CharacterQueries.DATABASE);
    }

    static readonly CREATE_CHARACTER_TABLE = `
        CREATE TABLE IF NOT EXISTS character(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name NVARCHAR(100),
            maxHealth INTEGER,
            speed INTEGER,
            armorClass INTEGER,
            characterType TINYINT
        )
    `;

    static readonly CREATE_STATISTIC_TABLE = `
        CREATE TABLE IF NOT EXISTS statistic(
            characterID INTEGER PRIMARY KEY,
            strength TINYINT,
            dexterity TINYINT,
            constitution TINYINT,
            intelligence TINYINT,
            wisdom TINYINT,
            charisma TINYINT,
            FOREIGN KEY(characterID) REFERENCES character(id)
        )
    `;

    static readonly CREATE_SAVING_THROW_TABLE = `
        CREATE TABLE IF NOT EXISTS saving_throw(
            characterID INTEGER,
            statistic TINYINT,
            PRIMARY KEY(characterID, statistic),
            FOREIGN KEY(characterID) REFERENCES character(id)
        )
    `;

    static readonly CREATE_SKILL_TABLE = `
        CREATE TABLE IF NOT EXISTS skill(
            characterID INTEGER,
            skill TINYINT,
            PRIMARY KEY(characterID, skill),
            FOREIGN KEY(characterID) REFERENCES character(id)
        )
    `;

    static readonly CREATE_VARIABLE_TABLE = `
        CREATE TABLE IF NOT EXISTS variable(
            characterID INTEGER PRIMARY KEY,
            experience INTEGER,
            hitPoints TINYINT,
            currentHitDie TINYINT,
            hitDieType TINYINT,
            FOREIGN KEY(characterID) REFERENCES character(id)
        )
    `
}