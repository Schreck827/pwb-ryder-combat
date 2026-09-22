import OBR from "@owlbear-rodeo/sdk";
import {defaultAction,defaultEntry,defaultReaction,defaultRyder,defaultTalent,defaultWeapon,KEY,SCHEMA_VERSION,type ActionDef,type EquipmentEntry,type NamedGroup,type ReactionDef,type ResourceCost,type RyderData,type TalentDef,type Weapon} from "./types";

function normalizeCost(value:unknown):ResourceCost{if(typeof value==="number")return{mode:"fixed",value};if(value&&typeof value==="object"&&"mode"in value&&"value"in value)return value as ResourceCost;return{mode:"fixed",value:0};}
function group<T>(name:string,entries:T[]):NamedGroup<T>[] {return [{id:Math.random().toString(36).slice(2),name,enabled:true,entries}];}
function normalizeRyder(raw:Partial<RyderData>|undefined):RyderData{
  const base=defaultRyder(); const d={...base,...(raw||{})} as RyderData;
  d.schemaVersion=SCHEMA_VERSION; d.statuses=Array.isArray(d.statuses)?d.statuses:[];
  const oldWeapons:any[]=(raw as any)?.weapons||[];
  const oldActions:any[]=(raw as any)?.actions||[];
  const oldReactions:any[]=(raw as any)?.reactions||[];
  const rawGroups=(raw as any)?.weaponGroups;
  d.weaponGroups=Array.isArray(rawGroups)&&rawGroups.length?rawGroups.map((g:any)=>({...g,entries:(g.entries||[]).map((w:any)=>normalizeWeapon(w))})):group("Weapons",oldWeapons.length?oldWeapons.map(normalizeWeapon):[defaultWeapon()]);
  const rawActionGroups=(raw as any)?.actionGroups;
  d.actionGroups=Array.isArray(rawActionGroups)&&rawActionGroups.length?rawActionGroups.map((g:any)=>({...g,entries:(g.entries||[]).map((a:any)=>normalizeAction(a))})):group("Actions",oldActions.length?oldActions.map(normalizeAction):[defaultAction()]);
  const rawReactionGroups=(raw as any)?.reactionGroups;
  d.reactionGroups=Array.isArray(rawReactionGroups)&&rawReactionGroups.length?rawReactionGroups.map((g:any)=>({...g,entries:(g.entries||[]).map((r:any)=>normalizeReaction(r))})):group("Reactions",oldReactions.length?oldReactions.map(normalizeReaction):[defaultReaction()]);
  d.systemEntries=((raw as any)?.systemEntries||[]).map((x:any)=>normalizeEntry(x,"system"));
  d.utilityEntries=((raw as any)?.utilityEntries||[]).map((x:any)=>normalizeEntry(x,"utility"));
  d.retrofitEntries=((raw as any)?.retrofitEntries||[]).map((x:any)=>normalizeEntry(x,"retrofit"));
  d.pilot={...base.pilot,...((raw as any)?.pilot||{}),talents:(((raw as any)?.pilot?.talents)||[]).map((t:any)=>normalizeTalent(t))};
  d.name=d.name||"Ryder";d.color=d.color||"#ffffff";d.faction=d.faction||"";d.factionBannerUrl=d.factionBannerUrl||"";
  return d;
}
function normalizeWeapon(w:any):Weapon{return{...defaultWeapon(),...w,maxAmmo:w.maxAmmo??w.ammo??10,ammo:w.ammo??10,ammoCost:normalizeCost(w.ammoCost),energyCost:normalizeCost(w.energyCost),heatCost:normalizeCost(w.heatCost),attackType:w.attackType==="melee"?"melee":"ranged",damageType:w.damageType??"",traits:w.traits??"",enabled:w.enabled??true};}
function normalizeAction(a:any):ActionDef{return{...defaultAction(),...a,energyCost:normalizeCost(a.energyCost),heatCost:normalizeCost(a.heatCost),charges:a.charges??-1,enabled:a.enabled??true};}
function normalizeReaction(r:any):ReactionDef{return{...defaultReaction(),...r,energyCost:normalizeCost(r.energyCost),heatCost:normalizeCost(r.heatCost),evasionBonus:r.evasionBonus??0,damageReduction:r.damageReduction??0,counterattack:r.counterattack??false,counterattackWeaponId:r.counterattackWeaponId??"",charges:r.charges??-1,enabled:r.enabled??true};}
function normalizeTalent(t:any):TalentDef{return{...defaultTalent(),...t,energyCost:normalizeCost(t.energyCost),heatCost:normalizeCost(t.heatCost),charges:t.charges??-1,enabled:t.enabled??true};}
function normalizeEntry(x:any,kind:any):EquipmentEntry{return{...defaultEntry(kind),...x,kind,energyCost:normalizeCost(x.energyCost),heatCost:normalizeCost(x.heatCost),charges:x.charges??-1,enabled:x.enabled??true};}

export async function getSelectedRyder(){const ids=await OBR.player.getSelection();if(!ids?.length)return null;const items=await OBR.scene.items.getItems(ids);const item=items.find(i=>i.layer==="CHARACTER");if(!item)return null;return{item,data:normalizeRyder(item.metadata?.[KEY] as RyderData|undefined)};}
export async function getRyderById(id:string){const items=await OBR.scene.items.getItems([id]);const item=items.find(i=>i.layer==="CHARACTER");if(!item||!item.metadata?.[KEY])return null;return{item,data:normalizeRyder(item.metadata[KEY] as RyderData)};}
export async function saveRyder(itemId:string,data:RyderData){await OBR.scene.items.updateItems([itemId],items=>{for(const item of items)item.metadata[KEY]=data;});}
export async function getRyders(){const items=await OBR.scene.items.getItems(i=>i.layer==="CHARACTER"&&!!i.metadata?.[KEY]);return items.map(item=>({item,data:normalizeRyder(item.metadata?.[KEY] as RyderData)})).filter(x=>x.data.enabled);}
export {normalizeRyder};
