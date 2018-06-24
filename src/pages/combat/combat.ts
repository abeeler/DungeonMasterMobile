import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, NavController } from 'ionic-angular';
import { OrderEntryModal } from './modals/order-entry/order-entry';

@Component({
  selector: 'page-combat',
  templateUrl: 'combat.html'
})
export class CombatPage {
  static readonly COMBATANT_PARAM = 'COMBATANT';
  static readonly STORED_GROUP = 'combat.stored_group';

  groups : CombatantGroup[];
  groupIndex : number;
  memberIndex : number;

  constructor(
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      public storage: Storage) {
    this.groups = [];
    this.groupIndex = 0;
    this.memberIndex = 0;

    this.insertEntry = this.insertEntry.bind(this);

    storage.get(CombatPage.STORED_GROUP).then((groups : CombatantGroup[]) => {
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
    });
  }

  presentOrderEntryModal() {
    let entryModal = this.modalCtrl.create(OrderEntryModal);
    entryModal.onDidDismiss(this.insertEntry);
    entryModal.present({
      keyboardClose: false
    });
  }

  insertEntry(group : CombatantGroup) {
    if (!group) {
      return;
    }
    
    // If no saved groups, push immediately
    if (this.groups.length == 0) {
      this.groups.push(group);
      return;
    }

    // Otherwise loop over each group to find sorted initiative
    let inserted = false;
    for (var index = 0; index < this.groups.length; index++) {
      if (this.groups[index].initiative < group.initiative) {
        this.groups.splice(index, 0, group);
        inserted = true;
        break;
      }
    }
    
    // If no saved groups had a lower initiative, add the new one to the end
    if (!inserted) {
      this.groups.push(group);
    }

    this.groupsUpdated();
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
  }

  groupsUpdated() {
    this.storage.set(CombatPage.STORED_GROUP, this.groups);
  }
}

export interface CombatantGroup {
  name: string;
  initiative: number;
  members: Combatant[];
}

export interface Combatant {
  name: string;
  health: Health;
}

export class Health {
  max: number;
  current: number;

  constructor(max: number) {
    this.max = this.current = Math.floor(max);
  }

  public change(delta : number) {
    this.current += delta;
    this.current = Math.min(Math.max(this.current, 0), this.max);
  }
}
