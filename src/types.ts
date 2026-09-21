export const ID = "com.pwb.ryder-combat";
export const KEY = `${ID}/data`;
export const CHANNEL = `${ID}/combat`;

export type Cover = "none" | "light" | "medium" | "hard" | "full";
export type Visibility = "everyone" | "owner_gm" | "gm";
export type AttackType = "ranged" | "melee" | "force";
export type CostMode = "fixed" | "percent";
export type ReactionTrigger = "before_attack" | "after_hit";
export type RollMode = "normal" | "advantage" | "disadvantage";

export interface ResourceCost { mode: CostMode; value: number; }
export interface Weapon {
  id:string; name:string; ammo:number; maxAmmo:number; ammoCost:ResourceCost; energyCost:ResourceCost; heatCost:ResourceCost;
  damage:string; toHit:number; range:number; fireRate:number; critical:number; effect:string;
  attackType:AttackType; status:string; soundUrl:string; traits:string; integrated:boolean; multi:number; scatter:number;
  damageType:string; reload:boolean; enabled:boolean;
}
export interface ActionDef { id:string; name:string; energyCost:ResourceCost; heatCost:ResourceCost; effect:string; soundUrl:string; enabled:boolean; }
export interface ReactionDef {
  id:string; name:string; trigger:ReactionTrigger; energyCost:ResourceCost; heatCost:ResourceCost;
  evasionBonus:number; damageReduction:number; counterattack:boolean; counterattackWeaponId:string; effect:string; enabled:boolean;
}
export interface TalentDef { id:string; name:string; description:string; energyCost:ResourceCost; heatCost:ResourceCost; kiCost:number; effect:string; enabled:boolean; }
export interface PilotData {
  proficiencyBonus:number; level:number; skills:{sharpshooting:number;closeCombat:number;advancedManeuver:number;reflex:number;electronicWarfare:number;systemAnalysis:number;heatManagement:number;maintenance:number};
  kiDice:number; maxKiDice:number; reactions:number; maxReactions:number; talents:TalentDef[];
}
export interface Component { id:string; name:string; kind:"limb"|"weapon"|"utility"|"system"; disabled:boolean; }
export interface RyderData {
  enabled:boolean; name:string; color:string;
  hp:number; maxHp:number; hpBonus:number; armor:number; armorBonus:number;
  energy:number; maxEnergy:number; energyBonus:number;
  heat:number; heatCapacity:number; heatCapacityBonus:number; heatVent:number; heatVentBonus:number;
  evasion:number; evasionBonus:number; sensor:number; sensorBonus:number; moveSpeed:number; moveSpeedBonus:number;
  attackBonus:number; damageBonus:number; techAttackBonus:number; frame:number; speed:number; system:number; engineering:number;
  team:string; cover:Cover; designType:string; productionType:string;
  disabled:boolean; meltdown:boolean; unstable:boolean; scrap:boolean; statuses:string[]; lockOnTargetId:string; lockOnUntil:number;
  weapons:Weapon[]; actions:ActionDef[]; reactions:ReactionDef[]; components:Component[]; visibility:Record<string,Visibility>; pilot:PilotData;
  ownerPlayerId:string; ownerPlayerName:string;
}
export interface CombatMessage { type:"result"|"reaction_request"|"reaction_response"; id:string; text?:string; color?:string; data?:unknown; }

export const fixed=(value=0):ResourceCost=>({mode:"fixed",value});
export const percent=(value=0):ResourceCost=>({mode:"percent",value});
export function crypto(){return Math.random().toString(36).slice(2)+Date.now().toString(36);}

const defaultPilot=():PilotData=>({
  proficiencyBonus:2,level:1,
  skills:{sharpshooting:0,closeCombat:0,advancedManeuver:0,reflex:0,electronicWarfare:0,systemAnalysis:0,heatManagement:0,maintenance:0},
  kiDice:0,maxKiDice:0,reactions:1,maxReactions:2,talents:[]
});
const weapon=():Weapon=>({id:crypto(),name:"New Weapon",ammo:10,maxAmmo:10,ammoCost:fixed(1),energyCost:fixed(0),heatCost:fixed(0),damage:"1d10",toHit:0,range:1200,fireRate:1,critical:20,effect:"",attackType:"ranged",status:"",soundUrl:"",traits:"",integrated:false,multi:1,scatter:1,damageType:"Piercing",reload:true,enabled:true});
export const defaultRyder=():RyderData=>({
  enabled:true,name:"Ryder",color:"#ffffff",hp:140,maxHp:140,hpBonus:0,armor:15,armorBonus:0,
  energy:100,maxEnergy:100,energyBonus:0,heat:0,heatCapacity:100,heatCapacityBonus:0,heatVent:30,heatVentBonus:0,
  evasion:15,evasionBonus:0,sensor:1200,sensorBonus:0,moveSpeed:400,moveSpeedBonus:0,
  attackBonus:0,damageBonus:0,techAttackBonus:0,frame:0,speed:0,system:0,engineering:0,team:"",cover:"none",designType:"General",productionType:"Mass Production",
  disabled:false,meltdown:false,unstable:false,scrap:false,statuses:[],lockOnTargetId:"",lockOnUntil:0,weapons:[weapon()],actions:[],reactions:[],components:[],visibility:{stats:"everyone",weapons:"everyone",attacks:"everyone",sensor:"everyone",structure:"everyone",heat:"everyone",saves:"everyone"},pilot:defaultPilot(),ownerPlayerId:"",ownerPlayerName:""
});
