import { SLOT_BG_CONFIG } from "./SlotBGConfig";
import { SLOT_MACHINE_CONFIG } from "./SlotMachineConfig";
import { AUTOPLAY_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/AutoplayConfig";
import { DESKTOP_SETTINGS_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/DesktopSettingsConfig";
import { MOBILE_BET_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/MobileBetConfig";
import { MESSAGE_POPUP_CONFIG } from './MessagePopupConfig';
import { ALERT_POPUP_CONFIG } from '../../../../../../../../Microslots-FE-SlotCore/corelib/config/AlertPopupConfig';
import { GIFT_FREE_SPINS_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/GiftFreeSpinsConfig";
import { PRIZE_POPUP_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/PrizePopupConfig";
import { ASSET_LOADER_ANIM_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/AssetLoaderAnimConfig";
import { SIDEPANEL_CONFIG } from "../../../../../../../../Microslots-FE-SlotCore/corelib/config/SidePanelConfig";
import { SLOT_PANEL_CONFIG } from "./MPSlotPanelConfig";
import { WIN_PANEL_CONFIG } from "./winPanelConfig";

export const SLOT_GAMEVIEW_CONFIG = {
    name: "SLOT_GAMEVIEW_CONFIG",
    Elements: [
        SLOT_BG_CONFIG,
        SLOT_MACHINE_CONFIG,
        SLOT_PANEL_CONFIG,
        WIN_PANEL_CONFIG,
        SIDEPANEL_CONFIG,
        AUTOPLAY_CONFIG,
        MOBILE_BET_CONFIG,
        DESKTOP_SETTINGS_CONFIG,
        // MESSAGE_POPUP_CONFIG,
        ASSET_LOADER_ANIM_CONFIG,
        GIFT_FREE_SPINS_CONFIG,
        PRIZE_POPUP_CONFIG,
        ALERT_POPUP_CONFIG
    ]
}
