import { coreClassUtil } from "../../../../../../Microslots-FE-SlotCore/corelib/core/CoreClassUtil";
import { slotModel } from "../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { GameSlotMachine } from "./views/comp/GameSlotMachine";
import { GameSplashComp } from './views/comp/GameSplashComp'
import { GameBigWinComp } from './views/comp/GameBigWinComp'
import { GameSlotMachineComp } from "./views/comp/GameSlotMachineComp";
import { SlotPanelCompV2 } from "./views/comp/SlotPanelCompV2";
import { PopupCompV2 } from "./views/comp/PopupCompV2";
import { GamePaylinesComp } from "./views/comp/GamePaylinesComp";
import { PaytablePagesV2 } from "./views/comp/PaytablePagesV2";
import { GameBGCompV2 } from "./views/comp/GameBGCompV2";
import { MessagePopupViewV2 } from "./views/comp/MessagePopupViewV2";
import { SlotWinAmountSequentialSpineCompV3 } from "./views/comp/SlotWinAmountSequentialSpineCompV3";
import { JackpotPaytable } from "./views/comp/JackpotPaytable";
import { MPSlotPanelComp } from "./views/comp/MPSlotPanelComp";
import { FSPanelComp } from "./views/comp/FSpanelComp";
import { SpinButtonV2 } from "./views/comp/SpinButtonV2";
import { SlotMachineV2 } from "./views/comp/SlotMachineV2";
import { MessageTextComp } from "./views/comp/MessageTextComp";
import { SpinCounterV2 } from "./views/comp/SpinCounterV2";
import { SlotSpinWinAnimAmountCompV2 } from "./views/comp/SlotSpinWinAnimAmountCompV2";
import { WinPanelComp } from "./views/comp/WinPanelComp";


class GameUtil {
    constructor() {
    }
    getGameClass(string, config) {
        let element = null;
        switch (string) {
            case "SlotMachineV2":
                element = new SlotMachineV2(config);
                break;
            case "GameSlotMachine":
                element = new GameSlotMachine(config);
                break;
            case "GameSplashComp":
                element = new GameSplashComp(config);
                break;
            case "GameBigWinComp":
                element = new GameBigWinComp(config);
                break;
            case "GameSlotMachineComp":
                element = new GameSlotMachineComp(config);
                break;
            case "PaytablePagesV2":
                element = new PaytablePagesV2(config);
                break;
            case "SlotPanelCompV2":
                element = new SlotPanelCompV2(config);
                break;
            case "PopupCompV2":
                element = new PopupCompV2(config);
                break;
            case "GamePaylinesComp":
                element = new GamePaylinesComp(config);
                break;
            case "GameBGCompV2":
                element = new GameBGCompV2(config);
                break;
            case "MessagePopupViewV2":
                element = new MessagePopupViewV2(config);
                break;
            case "SlotWinAmountSequentialSpineCompV3":
                element = new SlotWinAmountSequentialSpineCompV3(config);
                break;
            case "SlotSpinWinAnimAmountCompV2":
                element = new SlotSpinWinAnimAmountCompV2(config);
                break;
            case "JackpotPaytable":
                element = new JackpotPaytable(config);
                break;
            case "MPSlotPanelComp":
                element = new MPSlotPanelComp(config);
                break;
            case "FSPanelComp":
                element = new FSPanelComp(config);
                break;
            case "SpinButtonV2":
                element = new SpinButtonV2(config);
                break;
            case "MessageTextComp":
                element = new MessageTextComp(config);
                break;
            case "SpinCounterV2":
                element = new SpinCounterV2(config);
                break;
            case "WinPanelComp":
                element = new WinPanelComp(config);
                break;
            default:
                break;
        }
        if (!element) {
            element = coreClassUtil.getGameClass(string, config);
        }
        return element;
    }
    getReelView(index) {
        let reelview = slotModel.getReelsView();
        return reelview[index];
    }
}
export const gameUtil = new GameUtil();
