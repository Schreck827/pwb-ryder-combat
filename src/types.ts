export const ID = "com.pwb.ryder-combat";
export const KEY = `${ID}/data`;
export const PLAYER_KEY = `${ID}/player`;
export const CHANNEL = `${ID}/combat`;

export type Cover = "none" | "light" | "medium" | "hard" | "full";
export type Visibility = "everyone" | "owner_gm" | "gm";
export type AttackType = "ranged" | "melee";
export type CostMode = "fixed" | "percent";
export type ReactionTrigger = "before_attack" | "after_hit";

export interface ResourceCost { mode: CostMode; value: number; }
export interface Weapon {
  id:string; name:string; ammo:number; ammoCost:ResourceCost; energyCost:ResourceCost; heatCost:ResourceCost;
  damage:string; toHit:number; range:number; fireRate:number; critical:number; effect:string;
  attackType:AttackType; status:string; soundUrl:string;
}
export interface ActionDef {
  id:string; name:string; energyCost:ResourceCost; heatCost:ResourceCost; effect:string; soundUrl:string;
}
export interface ReactionDef {
  id:string; name:string; trigger:ReactionTrigger; energyCost:ResourceCost; heatCost:ResourceCost;
  evasionBonus:number; effect:string; enabled:boolean;
}
export interface Component { id:string; name:string; kind:"limb"|"weapon"|"utility"|"system"; disabled:boolean; }

export interface RyderData {
  enabled:boolean; name:string; color:string;
  hp:number; maxHp:number; hpBonus:number; armor:number; armorBonus:number;
  energy:number; maxEnergy:number; energyBonus:number;
  heat:number; heatCapacity:number; heatCapacityBonus:number; heatVent:number; heatVentBonus:number;
  evasion:number; evasionBonus:number; sensor:number; sensorBonus:number;
  attackBonus:number; damageBonus:number; techAttackBonus:number;
  team:string; energyRefresh:number; heatVentRefresh:number; cover:Cover;
  disabled:boolean; meltdown:boolean; unstable:boolean; scrap:boolean; statuses:string[];
  weapons:Weapon[]; actions:ActionDef[]; reactions:ReactionDef[]; components:Component[]; visibility:Record<string,Visibility>;
}

export interface CombatMessage { type:"result"|"reaction_request"|"reaction_response"; id:string; text?:string; color?:string; data?:unknown; }

export const fixed=(value=0):ResourceCost=>({mode:"fixed",value});
export const percent=(value=0):ResourceCost=>({mode:"percent",value});
export function crypto(){return Math.random().toString(36).slice(2)+Date.now().toString(36);}
export const defaultRyder=():RyderData=>({
  enabled:true,name:"Ryder",color:"#ffffff",hp:140,maxHp:140,hpBonus:0,armor:15,armorBonus:0,
  energy:100,maxEnergy:100,energyBonus:0,heat:0,heatCapacity:100,heatCapacityBonus:0,heatVent:30,heatVentBonus:0,
  evasion:15,evasionBonus:0,sensor:1200,sensorBonus:0,attackBonus:0,damageBonus:0,techAttackBonus:0,team:"",
  energyRefresh:0,heatVentRefresh:30,cover:"none",disabled:false,meltdown:false,unstable:false,scrap:false,statuses:[],
  weapons:[{id:crypto(),name:"New Weapon",ammo:10,ammoCost:fixed(1),energyCost:fixed(0),heatCost:fixed(0),damage:"1d10",toHit:0,range:1200,fireRate:1,critical:20,effect:"",attackType:"ranged",status:"",soundUrl:""}],
  actions:[],reactions:[],components:[],visibility:{stats:"everyone",weapons:"everyone",attacks:"everyone",sensor:"gm",structure:"everyone",heat:"everyone",saves:"everyone"}
});
