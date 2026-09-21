import OBR from "@owlbear-rodeo/sdk";
import {getRyders} from "./storage";

OBR.onReady(async()=>{
  OBR.scene.items.onChange(async(items)=>{
    // Shared sensor-network calculation hook.
    // Owlbear's ordinary item.visible state is scene-wide, so this version does not
    // hide real tokens per player. Detection data is kept ready for a future
    // player-specific visibility mechanism.
    const ryders=await getRyders();
    for(const r of ryders){
      const range=(r.data.sensor||0)+(r.data.sensorBonus||0);
      const teammates=ryders.filter(x=>x.data.team && x.data.team===r.data.team);
      void range; void teammates; void items;
    }
  });
});
