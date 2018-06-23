import { Component, Input } from '@angular/core';
import { CombatantGroup } from '../combat';

@Component({
    selector: 'combatant-group',
    templateUrl: 'combatant-group.html'
})
export class CombatantGroupComponent {
    @Input() group : CombatantGroup;
    @Input() active : boolean;
    @Input() memberIndex : number;

    get isIndividual() : boolean {
        return this.group.members.length === 1;
    }

    memberClasses(currentIndex : number) {
        return {
            'selected': this.active && this.memberIndex === currentIndex,
            'group': !this.isIndividual
        }
    }
}