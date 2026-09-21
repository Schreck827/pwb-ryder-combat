import OBR from "@owlbear-rodeo/sdk";
import {CHANNEL} from "./types";
OBR.onReady(()=>{OBR.broadcast.onMessage(CHANNEL,()=>{});});
