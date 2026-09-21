import type { Cover } from "./types";

export function rollDie(sides: number) { return Math.floor(Math.random() * sides) + 1; }
export function rollD20() { return rollDie(20); }

export function rollExpression(expr: string): number {
  const m = expr.trim().replace(/\s+/g, "").match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!m) return Number(expr) || 0;
  const count = Number(m[1] || 1), sides = Number(m[2]), mod = Number(m[3] || 0);
  let total = mod; for (let i=0;i<count;i++) total += rollDie(sides); return total;
}

export function coverResult(cover: Cover) {
  if (cover === "none") return { hitsCover: false, roll: 0 };
  if (cover === "full") return { hitsCover: true, roll: 0 };
  const r = rollDie(4);
  if (cover === "light") return { hitsCover: r === 1, roll: r };
  if (cover === "medium") return { hitsCover: r <= 2, roll: r };
  return { hitsCover: r <= 3, roll: r };
}

export interface AttackResult { roll:number; total:number; hit:boolean; critical:boolean; coverRoll:number; hitCover:boolean; damage:number; finalDamage:number; }

export function resolveAttack(toHit:number, targetEvasion:number, damageExpr:string, armor:number, cover:Cover, critical:number): AttackResult {
  const roll = rollD20(), total = roll + toHit;
  const hit = roll === 20 || total >= targetEvasion;
  if (!hit) return { roll,total,hit:false,critical:false,coverRoll:0,hitCover:false,damage:0,finalDamage:0 };
  const cr = coverResult(cover);
  if (cr.hitsCover) return { roll,total,hit:true,critical:roll >= critical,coverRoll:cr.roll,hitCover:true,damage:0,finalDamage:0 };
  const damage = rollExpression(damageExpr);
  const finalDamage = Math.max(0, damage - armor);
  return { roll,total,hit:true,critical:roll >= critical,coverRoll:cr.roll,hitCover:false,damage,finalDamage };
}
