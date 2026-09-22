export const ID = "com.pwb.ryder-combat";
export const KEY = `${ID}/data`;
export const PLAYER_KEY = `${ID}/player`;
export const CHANNEL = `${ID}/combat`;
export const SCHEMA_VERSION = 4;

export type Cover = "none" | "light" | "medium" | "hard" | "full";
export type Visibility = "everyone" | "owner_gm" | "gm";
export type AttackType = "ranged" | "melee";
export type CostMode = "fixed" | "percent";
export type ReactionTrigger = "before_attack" | "after_hit";
export type RollMode = "normal" | "advantage" | "disadvantage";
export type EntryKind = "system" | "utility" | "retrofit" | "relic" | "soul";

export interface ResourceCost { mode: CostMode; value: number; }
export interface Weapon {
  id:string; name:string; ammo:number; maxAmmo:number; ammoCost:ResourceCost; energyCost:ResourceCost; heatCost:ResourceCost;
  damage:string; toHit:number; range:number; fireRate:number; critical:number; effect:string;
  attackType:AttackType; status:string; soundUrl:string; damageType:string; traits:string; enabled:boolean;
}
export interface ActionDef {
  id:string; name:string; energyCost:ResourceCost; heatCost:ResourceCost; effect:string; soundUrl:string;
  charges:number; enabled:boolean;
}
export interface ReactionDef {
  id:string; name:string; trigger:ReactionTrigger; energyCost:ResourceCost; heatCost:ResourceCost;
  evasionBonus:number; damageReduction:number; counterattack:boolean; counterattackWeaponId:string;
  effect:string; charges:number; enabled:boolean;
}
export interface TalentDef {
  id:string; name:string; description:string; energyCost:ResourceCost; heatCost:ResourceCost; charges:number; enabled:boolean;
}
export interface Component { id:string; name:string; kind:"limb"|"weapon"|"utility"|"system"; disabled:boolean; }
export interface PilotData {
  level:number; proficiencyBonus:number;
  sharpshooting:number; closeCombat:number; advancedManeuver:number; reflex:number;
  electronicWarfare:number; systemAnalysis:number; heatManagement:number; maintenance:number;
  portraitUrl:string; talents:TalentDef[];
}
export interface EquipmentEntry {
  id:string; name:string; kind:EntryKind; description:string; enabled:boolean;
  energyCost:ResourceCost; heatCost:ResourceCost; charges:number; soundUrl:string;
}
export interface NamedGroup<T> { id:string; name:string; entries:T[]; enabled:boolean; }

export interface RyderData {
  schemaVersion:number; enabled:boolean; name:string; color:string;
  faction:string; factionBannerUrl:string;
  hp:number; maxHp:number; hpBonus:number; armor:number; armorBonus:number;
  energy:number; maxEnergy:number; energyBonus:number; energyRefresh:number;
  heat:number; heatCapacity:number; heatCapacityBonus:number; heatVent:number; heatVentBonus:number; heatVentRefresh:number;
  evasion:number; evasionBonus:number; sensor:number; sensorBonus:number; moveSpeed:number; moveSpeedBonus:number;
  attackBonus:number; damageBonus:number; techAttackBonus:number; frame:number; speed:number; system:number; engineering:number;
  team:string; cover:Cover; disabled:boolean; meltdown:boolean; unstable:boolean; scrap:boolean; statuses:string[];
  weaponGroups:NamedGroup<Weapon>[]; actionGroups:NamedGroup<ActionDef>[]; reactionGroups:NamedGroup<ReactionDef>[];
  systemEntries:EquipmentEntry[]; utilityEntries:EquipmentEntry[]; retrofitEntries:EquipmentEntry[];
  components:Component[]; visibility:Record<string,Visibility>; ownerPlayerId:string; ownerPlayerName:string;
  pilot:PilotData;
}

export interface CombatMessage {
  type:"result"|"reaction_request"|"reaction_response"|"ping";
  id:string; text?:string; color?:string; data?:unknown;
}

export const fixed=(value=0):ResourceCost=>({mode:"fixed",value});
export const percent=(value=0):ResourceCost=>({mode:"percent",value});
export function crypto(){return Math.random().toString(36).slice(2)+Date.now().toString(36);}

export const defaultWeapon=():Weapon=>({id:crypto(),name:"New Weapon",ammo:10,maxAmmo:10,ammoCost:fixed(1),energyCost:fixed(0),heatCost:fixed(0),damage:"1d10",toHit:0,range:1200,fireRate:1,critical:20,effect:"",attackType:"ranged",status:"",soundUrl:"",damageType:"",traits:"",enabled:true});
export const defaultAction=():ActionDef=>({id:crypto(),name:"New Action",energyCost:fixed(0),heatCost:fixed(0),effect:"",soundUrl:"",charges:-1,enabled:true});
export const defaultReaction=():ReactionDef=>({id:crypto(),name:"New Reaction",trigger:"before_attack",energyCost:fixed(0),heatCost:fixed(0),evasionBonus:0,damageReduction:0,counterattack:false,counterattackWeaponId:"",effect:"",charges:-1,enabled:true});
export const defaultTalent=():TalentDef=>({id:crypto(),name:"New Talent",description:"",energyCost:fixed(0),heatCost:fixed(0),charges:-1,enabled:true});
export const defaultEntry=(kind:EntryKind="system"):EquipmentEntry=>({id:crypto(),name:`New ${kind}`,kind,description:"",enabled:true,energyCost:fixed(0),heatCost:fixed(0),charges:-1,soundUrl:""});

export const defaultRyder=():RyderData=>({
  schemaVersion:SCHEMA_VERSION,enabled:true,name:"Ryder",color:"#ffffff",faction:"",factionBannerUrl:"",
  hp:140,maxHp:140,hpBonus:0,armor:15,armorBonus:0,energy:100,maxEnergy:100,energyBonus:0,energyRefresh:0,
  heat:0,heatCapacity:100,heatCapacityBonus:0,heatVent:30,heatVentBonus:0,heatVentRefresh:0,evasion:15,evasionBonus:0,
  sensor:1200,sensorBonus:0,moveSpeed:400,moveSpeedBonus:0,attackBonus:0,damageBonus:0,techAttackBonus:0,
  frame:0,speed:0,system:0,engineering:0,team:"",cover:"none",disabled:false,meltdown:false,unstable:false,scrap:false,statuses:[],
  weaponGroups:[{id:crypto(),name:"Weapons",enabled:true,entries:[defaultWeapon()]}],
  actionGroups:[{id:crypto(),name:"Actions",enabled:true,entries:[defaultAction()]}],
  reactionGroups:[{id:crypto(),name:"Reactions",enabled:true,entries:[defaultReaction()]}],
  systemEntries:[],utilityEntries:[],retrofitEntries:[],components:[],
  visibility:{stats:"everyone",weapons:"everyone",actions:"everyone",reactions:"everyone",sensor:"everyone",pilot:"everyone",systems:"everyone",log:"everyone"},
  ownerPlayerId:"",ownerPlayerName:"",
  pilot:{level:1,proficiencyBonus:2,sharpshooting:0,closeCombat:0,advancedManeuver:0,reflex:0,electronicWarfare:0,systemAnalysis:0,heatManagement:0,maintenance:0,portraitUrl:"",talents:[]}
});
