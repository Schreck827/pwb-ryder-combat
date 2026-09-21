export const ID = "com.pwb.ryder-combat";

export type Cover = "none" | "light" | "medium" | "hard" | "full";
export type Visibility = "everyone" | "owner_gm" | "gm";

export interface Weapon {
  id: string;
  name: string;
  ammo: number;
  ammoCost: number;
  energyCost: number;
  heatCost: number;
  damage: string;
  toHit: number;
  range: number;
  fireRate: number;
  critical: number;
  effect: string;
}

export interface ActionDef {
  id: string;
  name: string;
  energyCost: number;
  heatCost: number;
  effect: string;
}

export interface Component {
  id: string;
  name: string;
  kind: "limb" | "weapon" | "utility" | "system";
  disabled: boolean;
}

export interface RyderData {
  enabled: boolean;
  hp: number; maxHp: number; hpBonus: number;
  armor: number; armorBonus: number;
  energy: number; maxEnergy: number; energyBonus: number;
  heat: number; heatCapacity: number; heatCapacityBonus: number; heatVent: number; heatVentBonus: number;
  evasion: number; evasionBonus: number;
  sensor: number; sensorBonus: number;
  attackBonus: number; damageBonus: number; techAttackBonus: number;
  team: string;
  energyRefresh: number; heatVentRefresh: number;
  cover: Cover;
  disabled: boolean;
  meltdown: boolean;
  unstable: boolean;
  scrap: boolean;
  weapons: Weapon[];
  actions: ActionDef[];
  components: Component[];
  visibility: Record<string, Visibility>;
}

export const defaultRyder = (): RyderData => ({
  enabled: true, hp: 140, maxHp: 140, hpBonus: 0, armor: 15, armorBonus: 0,
  energy: 100, maxEnergy: 100, energyBonus: 0, heat: 0, heatCapacity: 100, heatCapacityBonus: 0,
  heatVent: 30, heatVentBonus: 0, evasion: 15, evasionBonus: 0, sensor: 1200, sensorBonus: 0,
  attackBonus: 0, damageBonus: 0, techAttackBonus: 0, team: "", energyRefresh: 0, heatVentRefresh: 30,
  cover: "none", disabled: false, meltdown: false, unstable: false, scrap: false,
  weapons: [{ id: crypto(), name: "New Weapon", ammo: 10, ammoCost: 1, energyCost: 0, heatCost: 0, damage: "1d10", toHit: 0, range: 1200, fireRate: 1, critical: 20, effect: "" }],
  actions: [], components: [], visibility: { stats: "everyone", weapons: "everyone", attacks: "everyone", sensor: "gm", structure: "everyone", heat: "everyone", saves: "everyone" }
});

export function crypto() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
