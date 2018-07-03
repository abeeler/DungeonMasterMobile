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

    static readonly INSERT_CHARACTER = 'INSERT INTO character VALUES(NULL,?,?,?,?,?)';
    static readonly INSERT_STATISTICS = 'INSERT INTO statistic VALUES(?,?,?,?,?,?,?)';

    static readonly UPDATE_CHARACTER = 'UPDATE character SET name=?, maxHealth=?, speed=?, armorClass=?, characterType=? WHERE id=?';
    static readonly UPDATE_STATISTICS = 'UPDATE statistic SET strength=?, dexterity=?, constitution=?, intelligence=?, wisdom=?, charisma=? WHERE characterID=?';

    static readonly CLEAR_SAVING_THROWS = 'DELETE FROM saving_throw WHERE characterID = ?';
    static readonly CLEAR_SKILLS = 'DELETE FROM skill WHERE characterID = ?';

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