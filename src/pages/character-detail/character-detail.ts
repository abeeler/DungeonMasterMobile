import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, Slides } from 'ionic-angular';
import { CharacterListPage } from '../character-list/character-list';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Character, SimpleCharacter, PlayerCharacter } from '../../classes/character';
import { CharacterProvider } from '../../providers/character/character';

@Component({
  selector: 'page-character-detail',
  templateUrl: 'character-detail.html'
})
export class CharacterDetailPage {
  @ViewChild(Slides) slides: Slides;
  
  currentSegment: string;
  originatingCharacter: SimpleCharacter;
  character: Character;

  constructor(
      public characterProvider: CharacterProvider,
      public navCtrl: NavController,
      public params: NavParams,
      public modalCtrl: ModalController,
      public toastCtrl: ToastController) {
    this.currentSegment = "1";
    this.character = new Character({name: 'Loading...'});
    this.originatingCharacter = params.get(CharacterListPage.CHARACTER_PARAM);

    characterProvider.getCharacterDetails(this.originatingCharacter.id)
      .then(character => {
        this.character = character;
        if (character.isPlayerCharacter) this.currentSegment = "0";
      })
      .catch(e => console.log(JSON.stringify(e)));
  }

  get statisticStrings(): string[] {
    return Character.STATISTICS;
  }

  get skillNames(): string[] {
    return Character.SKILLS;
  }

  get characterTypeColor(): string {
    switch(this.character.characterType) {
      case 0: return 'secondary';
      case 1: return 'primary';
      case 2: return 'danger';
    }
  }

  get isPlayerCharacter(): boolean {
    return this.character instanceof PlayerCharacter;
  }

  savingThrowClass(index: number) {
    return { 'saving-throw': this.character.hasSavingThrow(index) };
  }

  presentCharacterEntryModal() {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = this.originatingCharacter;
    let entryModal = this.modalCtrl.create(CharacterEntryModal, data);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        for (const key in data) {
          let descriptor = Object.getOwnPropertyDescriptor(this.character, key);
          if (descriptor && descriptor.writable) {
            this.character[key] = data[key];
          }
        }
        this.character = data;
        if (this.currentSegment == '0' && !this.character.isPlayerCharacter) {
          this.currentSegment = '1';
        }
      }
    });

    entryModal.present({
      keyboardClose: false
    });
  }

  showCharacterType() {
    let toast = this.toastCtrl.create({
      message: Character.CHARACTER_TYPES[this.character.characterType],
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  slideChanged() {
    let activeIndex = this.slides.getActiveIndex();
    if (activeIndex > (this.character.isPlayerCharacter ? 3 : 2)) return;
    if (!this.character.isPlayerCharacter) activeIndex++;
    this.currentSegment = activeIndex + "";
  }

  segmentChange(event) {
    let slideIndex = Math.floor(event.value);
    if (!this.character.isPlayerCharacter) slideIndex--;
    this.slides.slideTo(slideIndex, 500);
  }
}
