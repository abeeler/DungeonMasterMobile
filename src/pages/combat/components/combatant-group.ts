import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CombatantGroup, Combatant, CombatPage } from '../combat';
import { HealthEditModal } from '../modals/health-edit/health-edit';

@Component({
    selector: 'combatant-group',
    templateUrl: 'combatant-group.html'
})
export class CombatantGroupComponent {
    @Input() group : CombatantGroup;
    @Input() active : boolean;
    @Input() memberIndex : number;

    @Output() updated = new EventEmitter<any>();

    constructor(public modalCtrl : ModalController) { 
    }

    get isIndividual() : boolean {
        return this.group.members.length === 1;
    }

    memberClasses(currentIndex : number) {
        return {
            'selected': this.active && this.memberIndex === currentIndex,
            'group': !this.isIndividual
        }
    }

    editCombatant(combatant : Combatant) {
        console.log("editting");

        let originalName = combatant.name;
        let originalHealth = combatant.health.current;

        let data = {};
        data[CombatPage.COMBATANT_PARAM] = combatant;
        let editModal = this.modalCtrl.create(HealthEditModal, data);
        editModal.onDidDismiss((data : Combatant) => {
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