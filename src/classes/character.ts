import { Health, Combatant } from "./combat";

export class SimpleCharacter {
  constructor(
    public id: number,
    public name: string,
    public characterType: number
  ) {}
}

export class Character extends SimpleCharacter {
    public statistics?: number[];
    public savingThrows?: number[];
    public maxHealth: number;
    public speed?: number;
    public armorClass?: number;
    public skills?: number[];
  
    public constructor(character: any = {} as Character) {
      let {
        id = null,
        name = "Default Name",
        statistics = [10, 10, 10, 10, 10, 10],
        savingThrows = [],
        maxHealth = 12,
        speed = 30,
        armorClass = 10,
        proficiencies = [],
        characterType = 0
      } = character;

      super(id, name, characterType);
  
      this.name = name;
      this.statistics = statistics;
      this.savingThrows = savingThrows;
      this.maxHealth = maxHealth;
      this.speed = speed;
      this.armorClass = armorClass;
      this.skills = proficiencies;
    }
  
    public getModifier?(statIndex: number): number {
      return Math.floor((this.statistics[statIndex] - 10) / 2);
    }

    public hasSavingThrow?(statIndex: number): boolean {
      return this.savingThrows.indexOf(statIndex) >= 0;
    }

    public get passivePerception(): number {
      return this.getModifier(Character.WISDOM) + 10;
    }
  
    public get initiative(): number {
      return this.getModifier(Character.DEXTERITY);
    }
  
    public get hitDieBonus(): number {
      return this.getModifier(Character.CONSTITUTION);
    }
  
    static readonly STRENGTH = 0;
    static readonly DEXTERITY = 1;
    static readonly CONSTITUTION = 2;
    static readonly INTELLIGENCE = 3;
    static readonly WISDOM = 4;
    static readonly CHARISMA = 5;
  
    static readonly STATISTICS: string[] = [
      'Strength',
      'Dexterity',
      'Constitution',
      'Intelligence',
      'Wisdom',
      'Charisma'
    ];
  
    static readonly STATS: string[] = Character.STATISTICS.map(stat => stat.substr(0, 3).toLocaleUpperCase());
  
    static readonly SKILLS: string[] = [
      'Acrobatics',
      'Animal Handling',
      'Arcana',
      'Athletics',
      'Deception',
      'History',
      'Insight',
      'Intimidation',
      'Investigation',
      'Medicine',
      'Nature',
      'Perception',
      'Performance',
      'Persuasion',
      'Religion',
      'Sleight of Hand',
      'Stealth',
      'Survival',
      'Technology'
    ];
  }
  