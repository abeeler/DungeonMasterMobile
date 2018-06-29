import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Health } from '../combat/combat';
import { CharacterListPage } from '../character-list/character-list';
import { CharacterEntryModal } from '../character-entry/character-entry';

@Component({
  selector: 'page-character-detail',
  templateUrl: 'character-detail.html'
})
export class CharacterDetailPage {
  section: string;
  character : Character;

  constructor(public navCtrl: NavController, public navParams : NavParams, public modalCtrl : ModalController) {
    this.section = 'stats';
    this.character = navParams.get(CharacterListPage.CHARACTER_PARAM);
  }

  get statisticStrings() : string[] {
    return Character.STATISTICS;
  }

  get proficiencyNames() : string[] {
    return Character.PROFICIENCIES;
  }

  get passivePerception() : number {
    return 10 + this.character.getModifier(Character.WISDOM);
  }

  get initiative() : number {
    return this.character.getModifier(Character.DEXTERITY);
  }

  get hitDieBonus() : number {
    return this.character.getModifier(Character.CONSTITUTION);
  }

  savingThrowClass(index : number) {
    return { 'saving-throw': this.character.savingThrows.indexOf(index) >= 0 };
  }

  presentCharacterEntryModal() {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = JSON.parse(JSON.stringify(this.character));
    let entryModal = this.modalCtrl.create(CharacterEntryModal, data);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        for (const key in data) {
          this.character[key] = data[key];
        }
        this.character = data;
      }
    });

    entryModal.present({
      keyboardClose: false
    });
  }
}

export class Character {
  public name: string;
  public statistics? : number[];
  public savingThrows? : number[];
  public health? : Health;
  public hitDie? : number;
  public currentHitDie? : number;
  public maxHitDie? : number;
  public speed? : number;
  public armorClass? : number;
  public proficiencies? : number[];

  public constructor(character : Character = {} as Character) {
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

  public getModifier?(statIndex : number) : number {
    return Math.floor((this.statistics[statIndex] - 10) / 2);
  }

  static readonly STRENGTH = 0;
  static readonly DEXTERITY = 1;
  static readonly CONSTITUTION = 2;
  static readonly INTELLIGENCE = 3;
  static readonly WISDOM = 4;
  static readonly CHARISMA = 5;

  static readonly STATISTICS : string[] = [
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Wisdom',
    'Charisma'
  ];

  static readonly STATS : string[] = Character.STATISTICS.map(stat => stat.substr(0, 3).toLocaleUpperCase());

  static readonly PROFICIENCIES : string[] = [
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