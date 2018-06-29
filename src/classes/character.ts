import { Health, Combatant } from "./combat";

export class Character implements Combatant {
    public name: string;
    public statistics?: number[];
    public savingThrows?: number[];
    public health: Health;
    public hitDie?: number;
    public currentHitDie?: number;
    public maxHitDie?: number;
    public speed?: number;
    public armorClass?: number;
    public proficiencies?: number[];
  
    public constructor(character: Character = {} as Character) {
      let {
        name = "Default Name",
        statistics = [10, 10, 10, 10, 10, 10],
        savingThrows = [],
        health = new Health(10),
        hitDie = 6,
        currentHitDie = 1,
        maxHitDie = 1,
        speed = 30,
        armorClass = 10,
        proficiencies = []
      } = character;
  
      this.name = name;
      this.statistics = statistics;
      this.savingThrows = savingThrows;
      this.health = health;
      this.hitDie = hitDie;
      this.currentHitDie = currentHitDie;
      this.maxHitDie = maxHitDie;
      this.speed = speed;
      this.armorClass = armorClass;
      this.proficiencies = proficiencies;
    }
  
    public getModifier?(statIndex: number): number {
      return Math.floor((this.statistics[statIndex] - 10) / 2);
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
  
    static readonly PROFICIENCIES: string[] = [
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
  