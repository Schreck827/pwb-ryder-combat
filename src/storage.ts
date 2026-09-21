import OBR from "@owlbear-rodeo/sdk";
import {defaultRyder,KEY,type ActionDef,type ReactionDef,type ResourceCost,type RyderData,type Weapon,type TalentDef} from "./types";
function normalizeCost(value:unknown):ResourceCost{if(typeof value==="number")return{mode:"fixed",value};if(value&&typeof value==="object"&&"mode"in value&&"value"in value)return value as ResourceCost;return{mode:"fixed",value:0};}
function normalizeRyder(raw:Partial<RyderData>|undefined):RyderData{
 const d={...defaultRyder(),...(raw||{})} as RyderData;
 d.weapons=(d.weapons||[]).map((w:any):Weapon=>({...w,maxAmmo:w.maxAmmo??w.ammo??0,ammo:w.ammo??0,ammoCost:normalizeCost(w.ammoCost),energyCost:normalizeCost(w.energyCost),heatCost:normalizeCost(w.heatCost),attackType:w.attackType??"ranged",status:w.status??"",soundUrl:w.soundUrl??"",traits:w.traits??"",integrated:w.integrated??false,multi:w.multi??1,scatter:w.scatter??1,damageType:w.damageType??"Piercing",reload:w.reload??true,enabled:w.enabled??true}));
 d.actions=(d.actions||[]).map((a:any):ActionDef=>({...a,energyCost:normalizeCost(a.energyCost),heatCost:normalizeCost(a.heatCost),soundUrl:a.soundUrl??"",enabled:a.enabled??true}));
 d.reactions=(d.reactions||[]).map((r:any):ReactionDef=>({...r,energyCost:normalizeCost(r.energyCost),heatCost:normalizeCost(r.heatCost),trigger:r.trigger??"before_attack",evasionBonus:r.evasionBonus??0,damageReduction:r.damageReduction??0,counterattack:r.counterattack??false,counterattackWeaponId:r.counterattackWeaponId??"",enabled:r.enabled??true}));
 const old:any=d.pilot||{}; const p:any={...defaultRyder().pilot,...old,skills:{...defaultRyder().pilot.skills,...(old.skills||{})},talents:(old.talents||[]).map((t:any):TalentDef=>({...t,energyCost:normalizeCost(t.energyCost),heatCost:normalizeCost(t.heatCost),kiCost:t.kiCost??0,enabled:t.enabled??true}))}; d.pilot=p;
 d.statuses=d.statuses??[];d.name=d.name??"Ryder";d.color=d.color??"#ffffff";d.ownerPlayerId=d.ownerPlayerId??"";d.ownerPlayerName=d.ownerPlayerName??"";d.lockOnTargetId=d.lockOnTargetId??"";d.lockOnUntil=d.lockOnUntil??0;
 return d;
}
export async function getSelectedRyder(){const ids=await OBR.player.getSelection();if(!ids?.length)return null;const items=await OBR.scene.items.getItems(ids);const item=items.find(i=>i.layer==="CHARACTER");if(!item)return null;return{item,data:normalizeRyder(item.metadata?.[KEY] as RyderData|undefined)};}
export async function getRyderById(id:string){const items=await OBR.scene.items.getItems([id]);const item=items.find(i=>i.layer==="CHARACTER");if(!item)return null;return{item,data:normalizeRyder(item.metadata?.[KEY] as RyderData|undefined)};}
export async function saveRyder(itemId:string,data:RyderData){await OBR.scene.items.updateItems([itemId],items=>{for(const item of items)item.metadata[KEY]=data;});}
export async function getRyders(){const items=await OBR.scene.items.getItems(i=>i.layer==="CHARACTER");return items.map(item=>({item,data:normalizeRyder(item.metadata?.[KEY] as RyderData|undefined)})).filter(x=>x.data.enabled);}
export {normalizeRyder};
