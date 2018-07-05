import { Health } from "./combat";

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
        skills = [],
        characterType = 0
      } = character;

      super(id, name, characterType);
  
      this.name = name;
      this.statistics = statistics;
      this.savingThrows = savingThrows;
      this.maxHealth = maxHealth;
      this.speed = speed;
      this.armorClass = armorClass;
      this.skills = skills;
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

    public get isPlayerCharacter(): boolean {
      return this.characterType === 0;
    }

    public get health(): Health {
      return new Health(this.maxHealth);
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

    static readonly CHARACTER_TYPES: string[] = [
      'Player Character',
      'Non-Player Character',
      'Monster'
    ];
  }

  export class PlayerCharacter extends Character {
    public experience?: number;
    public hitPoints?: number;
    public currentHitDie?: number;
    public classType?: number;
    public backgroundType: number;

    constructor(character: any = {} as PlayerCharacter) {
      super(character);

      let {
        experience = 0,
        hitPoints = this.maxHealth,
        currentHitDie = experience,
        classType = 0,
        backgroundType = 0
      } = character;

      this.experience = experience;
      this.hitPoints = hitPoints;
      this.currentHitDie = currentHitDie;
      this.classType = classType;
      this.backgroundType = backgroundType;
    }

    get class(): string {
      return PlayerCharacter.CLASS_NAMES[this.classType];
    }

    get hitDieType(): number {
      return PlayerCharacter.CLASS_DIE_TYPES[this.classType];
    }

    get background(): string {
      return PlayerCharacter.BACKGROUND_NAMES[this.backgroundType];
    }

    get level(): number {
      let level = 1;
      for (let requiredExperience of PlayerCharacter.REQUIRED_EXPERIENCE) {
        if (this.experience < requiredExperience) break;
        level++;
      }
      return level;
    }

    get nextLevelExperience(): number {
      return PlayerCharacter.REQUIRED_EXPERIENCE[Math.min(this.level - 1, 18)];
    }

    get proficiencyBonus(): number {
      switch (true) {
        case (this.level < 5): return 2;
        case (this.level < 9): return 3;
        case (this.level < 13): return 4;
        case (this.level < 17): return 5;
        default: return 6;
      }
    }

    public get health(): Health {
      return new Health(this.maxHealth, this.hitPoints);
    }

    static readonly CLASS_NAMES: string[] = [
      'Barbarian',
      'Bard',
      'Cleric',
      'Druid',
      'Fighter',
      'Monk',
      'Paladin',
      'Ranger',
      'Rogue',
      'Sorceror',
      'Warlock',
      'Wizard'
    ];

    static readonly CLASS_DIE_TYPES: number[] = [
      12,
      8,
      8,
      8,
      10,
      8,
      10,
      10,
      8,
      6,
      8,
      6
    ];

    static readonly BACKGROUND_NAMES: string[] = [
      'Acolyte',
      'Charlatan',
      'Criminal',
      'Entertainer',
      'Folk Hero',
      'Guild Artisan',
      'Hermit',
      'Noble',
      'Outlander',
      'Sage',
      'Sailor',
      'Soldier',
      'Urchin',
      'Inquirer'
    ];

    static readonly REQUIRED_EXPERIENCE: number[] = [
      300,
      900,
      2700,
      6500,
      14000,
      23000,
      34000,
      48000,
      64000,
      85000,
      100000,
      120000,
      140000,
      165000,
      195000,
      225000,
      265000,
      305000,
      355000
    ];
  }
  