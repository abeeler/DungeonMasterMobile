import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, NavController, AlertController, NavParams } from 'ionic-angular';
import { OrderEntryModal } from './modals/order-entry/order-entry';
import { Health, CombatantGroup } from '../../classes/combat';
import { Character } from '../../classes/character';

@Component({
  selector: 'page-combat',
  templateUrl: 'combat.html'
})
export class CombatPage {
  static readonly COMBATANT_PARAM = 'COMBATANT';
  static readonly CHARACTERS_PARAM = 'characters';
  static readonly STORED_GROUP = 'combat.stored_group';
  static readonly STORED_INDICES = 'combat.stored_indices';

  groups: CombatantGroup[];
  groupIndex: number;
  memberIndex: number;

  constructor(
      params: NavParams,
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      public storage: Storage) {
    this.groups = [];
    this.groupIndex = 0;
    this.memberIndex = 0;

    this.insertEntry = this.insertEntry.bind(this);

    storage.get(CombatPage.STORED_GROUP).then((groups: CombatantGroup[]) => {
      if (groups) {
        this.groups = groups;
        for(let group of groups) {
          for (let member of group.members) {
            let health = member.health;
            let current = health.current;
            member.health = new Health(health.max);
            member.health.current = current;
          }
        }
      }

      let charactersToAdd = params.get(CombatPage.CHARACTERS_PARAM);
      if (charactersToAdd) {
        this.addPassedCombatants(0, charactersToAdd);
      }
    });

    storage.get(CombatPage.STORED_INDICES).then((indices: number[]) => {
      if (indices) {
        this.groupIndex = indices[0];
        this.memberIndex = indices[1];
      }
    })
  }

  presentOrderEntryModal() {
    let entryModal = this.modalCtrl.create(OrderEntryModal);
    entryModal.onDidDismiss(this.insertEntry);
    entryModal.present({
      keyboardClose: false
    });
  }

  insertEntry(group: CombatantGroup) {
    if (!group) {
      return;
    }

    // Otherwise loop over each group to find sorted initiative
    let inserted = false;
    for (let index = 0; index < this.groups.length && !inserted; index++) {
      if (this.groups[index].initiative < group.initiative) {
        this.groups.splice(index, 0, group);
        inserted = true;
      }
    }
    
    // If no saved groups had a lower initiative, add the new one to the end
    if (!inserted) {
      this.groups.push(group);
    }

    this.groupsUpdated(null);
  }

  nextCombatant() {
    if (this.groups.length === 0) {
      return;
    }

    if (++this.memberIndex >= this.groups[this.groupIndex].members.length) {
      this.memberIndex = 0;
      if (++this.groupIndex >= this.groups.length) {
        this.groupIndex = 0;
      }
    }

    this.storage.set(CombatPage.STORED_INDICES, [this.groupIndex, this.memberIndex]);
  }

  resetCombat() {
    let confirmAlert = this.alertCtrl.create({
      title: 'Confirm combat reset',
      message: 'Remove all combatants from the current combat?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Reset',
        handler: () => {
          this.groups = [];
          this.groupIndex = 0;
          this.memberIndex = 0;
          this.storage.remove(CombatPage.STORED_GROUP);
        }
      }]
    });
    confirmAlert.present();
  }

  groupsUpdated(newMemberIndex: number) {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].members.length == 0) {
        if (this.groupIndex > i) {
          this.groupIndex--;
          this.memberIndex = 0;
        }
        this.groups.splice(i, 1);
      } else if (this.groupIndex == i){
        if (this.groups[i].members.length <= this.memberIndex) {
          this.memberIndex = this.groups[i].members.length - 1;
        } else if (newMemberIndex) {
          this.memberIndex = newMemberIndex - 1;
        }
      }
    }

    if (this.groupIndex >= this.groups.length) {
      this.groupIndex = this.groups.length - 1;
      this.memberIndex = 0;
    }

    this.storage.set(CombatPage.STORED_INDICES, [this.groupIndex, this.memberIndex]);
    this.storage.set(CombatPage.STORED_GROUP, this.groups);
  }

  addPassedCombatants(index: number, combatants: Character[]) {
    if (index >= combatants.length) return;
    let alert = this.alertCtrl.create({
      title: 'Add Combatant',
      message: `Enter total initiative for ${combatants[index].name}`,
      inputs: [{
        name: 'initiative',
        placeholder: 'Initiative',
        type: 'number'
      }],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Skip',
          handler: () => this.addPassedCombatants(index + 1, combatants)
        }, {
          text: 'Enter',
          handler: data => {
            this.insertEntry({
              name: combatants[index].name,
              initiative: Math.floor(data.initiative),
              members: [{
                name: combatants[index].name,
                health: combatants[index].health
              }]
            });
            this.addPassedCombatants(index + 1, combatants);
          }
        }
      ]
    });
    alert.present();
  }
}
