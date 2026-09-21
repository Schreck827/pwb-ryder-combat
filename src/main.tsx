import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import OBR from "@owlbear-rodeo/sdk";
import {getSelectedRyder, saveRyder} from "./storage";
import {resolveAttack, rollDie} from "./rules";
import {crypto, defaultRyder, type RyderData, type Weapon, type ActionDef} from "./types";
import "./style.css";

function Num({value,onChange}:{value:number,onChange:(v:number)=>void}) { return <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))}/> }
function App(){
 const [ready,setReady]=useState(false); const [error,setError]=useState("");
 const [sel,setSel]=useState<any>(null); const [tab,setTab]=useState("stats"); const [msg,setMsg]=useState(""); const [lockedId,setLockedId]=useState<string|null>(null);
 const refresh=async()=>{
   try {
     if(!lockedId) setSel(await getSelectedRyder());
     setError("");
   } catch (e) {
     setError(e instanceof Error ? e.message : String(e));
   }
 };
 useEffect(()=>{
   let unsubscribe=()=>{};
   OBR.onReady(async()=>{
     setReady(true);
     await refresh();
     unsubscribe=OBR.player.onChange(()=>{ void refresh(); });
   });
   return ()=>unsubscribe();
 },[lockedId]);
 if(!ready) return <main><h2>PWB Ryder Combat</h2><p>Connecting to Owlbear Rodeo…</p></main>;
 if(error) return <main><h2>PWB Ryder Combat</h2><section><b>Extension error</b><p>{error}</p><button onClick={()=>void refresh()}>RETRY</button></section></main>;
 if(!sel) return <main><h2>PWB Ryder Combat</h2><p>Select a Character token.</p></main>;
 const {item}=sel; const d=sel.data as RyderData;
 const save=(patch:Partial<RyderData>)=>{const nd={...d,...patch};setSel({item,data:nd});saveRyder(item.id,nd)};
 const n=(k:keyof RyderData)=>(<Num value={d[k] as number} onChange={v=>save({[k]:v} as any)}/>);
 const startTurn=()=>{save({energy:Math.min(d.maxEnergy+d.energyBonus,d.energy+d.energyRefresh),heat:Math.max(0,d.heat-(d.heatVent+d.heatVentBonus)),});setMsg("Turn started: Energy refreshed and Heat vented.")};
 const addWeapon=()=>save({weapons:[...d.weapons,{id:crypto(),name:"New Weapon",ammo:10,ammoCost:1,energyCost:0,heatCost:0,damage:"1d10",toHit:0,range:1200,fireRate:1,critical:20,effect:""}]});
 const attack=async(w:Weapon)=>{ if(!lockedId){setMsg("Lock the attacker first, then select the target token.");return;} const ids=await OBR.player.getSelection(); const all=await OBR.scene.items.getItems(ids||[]); const target=all.find(x=>x.id!==lockedId&&x.layer==="CHARACTER"); if(!target){setMsg("Select a target token after locking the attacker.");return;} const td=target.metadata?.["com.pwb.ryder-combat/data"] as RyderData|undefined; if(!td){setMsg("Target is not configured as a Ryder.");return;} const count=Math.max(1,Math.floor(w.fireRate)); const affordable=Math.min(count,Math.floor((w.ammoCost>0?w.ammo/w.ammoCost:count)),w.energyCost>0?Math.floor(d.energy/w.energyCost):count); if(w.ammoCost>0&&affordable<count){setMsg(`Not enough ammo for ${count} attacks. Can make ${affordable}.`);return;} if(w.energyCost>0&&d.energy<w.energyCost*count){setMsg("Not enough Energy.");return;} let hits=0,crit=0,total=0,cover=0; for(let i=0;i<count;i++){const r=resolveAttack(w.toHit+d.attackBonus,(td.evasion||0)+(td.evasionBonus||0),w.damage,(td.armor||0)+(td.armorBonus||0),td.cover,w.critical);if(r.hit)hits++;if(r.critical)crit++;if(r.hitCover)cover++;total+=r.finalDamage;} await OBR.scene.items.updateItems([target.id],xs=>{for(const x of xs){const t=({...defaultRyder(),...((x.metadata?.["com.pwb.ryder-combat/data"] as RyderData)||{})});t.hp=Math.max(0,t.hp-total); if(t.hp<=0)t.disabled=true; x.metadata["com.pwb.ryder-combat/data"]=t;}}); const nw={...w,ammo:Math.max(0,w.ammo-w.ammoCost*count)}; save({energy:Math.max(0,d.energy-w.energyCost*count),heat:d.heat+w.heatCost*count,weapons:d.weapons.map(x=>x.id===w.id?nw:x)}); setMsg(`${w.name}: ${hits}/${count} hits, ${crit} critical, ${cover} hit cover, ${total} damage.`)};
 const updateW=(idx:number,p:Partial<Weapon>)=>save({weapons:d.weapons.map((w,i)=>i===idx?{...w,...p}:w)});
 return <main><h2>{item.name||"Ryder"}</h2><button onClick={()=>{setLockedId(lockedId?null:item.id);setMsg(lockedId?"Attacker unlocked.":"Attacker locked. Select the target token now.")}}>{lockedId?"UNLOCK ATTACKER":"LOCK ATTACKER"}</button><nav>{["stats","weapons","actions","systems"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</nav>
 {tab==="stats"&&<><section><h3>Core</h3><div className="grid">{[["HP","hp"],["Max HP","maxHp"],["HP Bonus","hpBonus"],["Armor","armor"],["Armor Bonus","armorBonus"],["Energy","energy"],["Max Energy","maxEnergy"],["Energy Bonus","energyBonus"],["Heat","heat"],["Heat Capacity","heatCapacity"],["Heat Cap Bonus","heatCapacityBonus"],["Heat Vent","heatVent"],["Heat Vent Bonus","heatVentBonus"],["Evasion","evasion"],["Evasion Bonus","evasionBonus"],["Sensor","sensor"],["Sensor Bonus","sensorBonus"],["Attack Bonus","attackBonus"],["Damage Bonus","damageBonus"],["Tech Attack Bonus","techAttackBonus"]].map(([l,k])=><label>{l}{n(k as keyof RyderData)}</label>)}</div></section><section><h3>Turn / Team</h3><label>Team<input value={d.team} onChange={e=>save({team:e.target.value})}/></label><label>Energy Refresh{n("energyRefresh")}</label><label>Heat Vent at Start{n("heatVentRefresh")}</label><button className="primary" onClick={startTurn}>START TURN</button></section><section><h3>Cover</h3><select value={d.cover} onChange={e=>save({cover:e.target.value as any})}><option value="none">None</option><option value="light">Light</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="full">Full</option></select></section></>}
 {tab==="weapons"&&<section><button onClick={addWeapon}>+ Weapon</button>{d.weapons.map((w,i)=><article><input className="wide" value={w.name} onChange={e=>updateW(i,{name:e.target.value})}/><div className="grid">{[["Ammo","ammo"],["Ammo Cost","ammoCost"],["Energy Cost","energyCost"],["Heat Cost","heatCost"],["To Hit","toHit"],["Range","range"],["Fire Rate","fireRate"],["Critical","critical"]].map(([l,k])=><label>{l}<Num value={(w as any)[k]} onChange={v=>updateW(i,{[k]:v} as any)}/></label>)}</div><label>Damage<input value={w.damage} onChange={e=>updateW(i,{damage:e.target.value})}/></label><label>Effect<textarea value={w.effect} onChange={e=>updateW(i,{effect:e.target.value})}/></label><button className="primary" onClick={()=>attack(w)}>ATTACK TARGET</button></article>)}</section>}
 {tab==="actions"&&<Actions data={d} save={save}/>} 
 {tab==="systems"&&<Systems data={d} save={save}/>} 
 {msg&&<p className="msg">{msg}</p>}</main>
}
function Actions({data,save}:{data:RyderData,save:(p:Partial<RyderData>)=>void}){const add=()=>save({actions:[...data.actions,{id:crypto(),name:"New Action",energyCost:0,heatCost:0,effect:""}]});return <section><button onClick={add}>+ Custom Action</button>{data.actions.map((a,i)=><article><input className="wide" value={a.name} onChange={e=>save({actions:data.actions.map((x,j)=>j===i?{...x,name:e.target.value}:x)})}/><div className="grid"><label>Energy Cost<Num value={a.energyCost} onChange={v=>save({actions:data.actions.map((x,j)=>j===i?{...x,energyCost:v}:x)})}/></label><label>Heat Cost<Num value={a.heatCost} onChange={v=>save({actions:data.actions.map((x,j)=>j===i?{...x,heatCost:v}:x)})}/></label></div><textarea value={a.effect} onChange={e=>save({actions:data.actions.map((x,j)=>j===i?{...x,effect:e.target.value}:x)})}/><button onClick={()=>{if(data.energy<a.energyCost)return;save({energy:data.energy-a.energyCost,heat:data.heat+a.heatCost})}}>USE ACTION</button></article>)}</section>}
function Systems({data,save}:{data:RyderData,save:(p:Partial<RyderData>)=>void}){const structure=()=>{const r=rollDie(6);if(r>=5) return "Minor Damage";if(r>=2)return "Major Damage";return "Critical Damage"};const over=()=>{const r=rollDie(6);if(r>=5)return "Reactor Stress";if(r>=2){save({energy:Math.floor(data.maxEnergy/2)});return "Reactor Overheat: Energy reduced to 50%."}save({meltdown:true});return "REACTOR MELTDOWN"};return <section><h3>Structure</h3><button onClick={()=>alert(`Structure Check: ${structure()}`)}>STRUCTURE CHECK</button><h3>Overheat</h3><button onClick={()=>alert(over())}>OVERHEAT CHECK</button><p>Disabled: {String(data.disabled)}</p><p>Meltdown: {String(data.meltdown)}</p><p>Unstable: {String(data.unstable)}</p><h3>System Save</h3><p>Target rolls 1d20 + Electronic Warfare + System against the attacker's Tech Roll. Add a dedicated target-save UI in the next rules pass.</p></section>}
createRoot(document.getElementById("root")!).render(<App/>);
