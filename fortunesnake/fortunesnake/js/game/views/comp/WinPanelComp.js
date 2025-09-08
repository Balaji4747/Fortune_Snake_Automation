import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import { LibView } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibView";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

export class WinPanelComp extends LibView {
    constructor(config) {
        super(config);
        this.sweep10 = this.elementsList["sweep10"];
        this.guideRect = this.elementsList["guideRect"];
        this.play = false;
        this.sweep10.visible = false;
        // CoreLib.EventHandler.addEventListener("PLAY_10_MOVE_ANIM", this.playSweepTenAnim.bind(this));
    }
    getWidth() {
        return this.guideRect.width * this.scale.x;
    }
    getHeight() {
        return this.guideRect.height * this.scale.y;
    }

    resizeViewComponents() {
        super.resizeViewComponents();
    }
    onResizeStartEvent() {
        super.onResizeStartEvent();
        UIUtil.adjustWidthHeightForMobile(this.guideRect);
    }
}
