import { SlotSplashComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/containers/SlotSplashComp";
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";

export class GameSplashComp extends SlotSplashComp {
    constructor(config) {
        super(config);
        this.titleTxt = this.volatilityComp.titleTxt;
        this.bg = this.volatilityComp.bg;
        this.titleTxt1 = this.volatilityCompDesk.titleTxt;
    }

    resizeViewComponents() {
        super.resizeViewComponents();
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (this.titleTxt) {
                this.titleTxt.y = this.bg.height / 2 - this.titleTxt.height * 0.5
                if (CoreLib.Model.GameInfo.language == "zh") {
                    this.titleTxt.y = 6;
                } else if (CoreLib.Model.GameInfo.language == "zh_hant") {
                    this.titleTxt.y--;
                }
            }
        } else {
            if (this.titleTxt1) {
                this.titleTxt1.y = this.bg.height / 2 - this.titleTxt.height * 0.5;
                if (CoreLib.Model.GameInfo.language == "zh") {
                    this.titleTxt1.y = 6;
                } else if (CoreLib.Model.GameInfo.language == "id") {
                    this.titleTxt1.y = 25;
                }
            }
        }
    }
};
