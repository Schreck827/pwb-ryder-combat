import OBR from "@owlbear-rodeo/sdk";
import { ID, defaultRyder, type RyderData } from "./types";

export const key = `${ID}/data`;
export async function getSelectedRyder() {
  const ids = await OBR.player.getSelection();
  if (!ids?.length) return null;
  const items = await OBR.scene.items.getItems(ids);
  const item = items.find(i => i.layer === "CHARACTER");
  if (!item) return null;
  return { item, data: ({...defaultRyder(), ...((item.metadata?.[key] as RyderData) || {})}) as RyderData };
}
export async function saveRyder(itemId:string, data:RyderData) {
  await OBR.scene.items.updateItems([itemId], items => { for (const item of items) item.metadata[key] = data; });
}
export async function getRyders() {
  const items = await OBR.scene.items.getItems(i => i.layer === "CHARACTER");
  return items.map(item => ({ item, data: ({...defaultRyder(), ...((item.metadata?.[key] as RyderData) || {})}) as RyderData })).filter(x => x.data.enabled);
}
