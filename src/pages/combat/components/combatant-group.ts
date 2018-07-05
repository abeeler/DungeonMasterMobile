import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CombatPage } from '../combat';
import { HealthEditModal } from '../modals/health-edit/health-edit';
import { CombatantGroup, Combatant } from '../../../classes/combat';

@Component({
    selector: 'combatant-group',
    templateUrl: 'combatant-group.html'
})
export class CombatantGroupComponent {
    @Input() group: CombatantGroup;
    @Input() active: boolean;
    @Input() memberIndex: number;

    @Output() updated = new EventEmitter<any>();

    constructor(public modalCtrl: ModalController) { 
    }

    get isIndividual(): boolean {
        return this.group.members.length === 1;
    }

    memberClasses(currentIndex: number) {
        return {
            'selected': this.active && this.memberIndex === currentIndex,
            'group': !this.isIndividual
        }
    }

    removeMember(index: number) {
        this.group.members.splice(index, 1);
        if (this.group.members.length == 1) {
            this.group.members[0].name = this.group.name + " - " + this.group.members[0].name;
        }

        if (this.active && this.memberIndex > index) {
            this.updated.emit(this.memberIndex);
        } else {
            this.updated.emit();
        }
    }

    editCombatant(combatant: Combatant) {
        let originalName = combatant.name;
        let originalHealth = combatant.health.current;

        let data = {};
        data[CombatPage.COMBATANT_PARAM] = combatant;
        let editModal = this.modalCtrl.create(HealthEditModal, data);
        editModal.onDidDismiss((data: Combatant) => {
            if (!data) {
                combatant.name = originalName;
                combatant.health.current = originalHealth;
            } else {
                this.updated.emit();
            }
        });
        editModal.present();
    }
}