export class Health {
  max: number;
  current: number;

  constructor(max: number, current: number = max) {
    this.max = Math.floor(max);
    this.current = max;
    this.change(-(this.max - Math.floor(current)));
  }   

  public change(delta: number) {
    this.current += delta;
    this.current = Math.min(Math.max(this.current, 0), this.max);
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
