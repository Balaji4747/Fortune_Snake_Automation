import { SlotPanelComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/containers/SlotPanelComp"
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";

export class SlotPanelCompV2 extends SlotPanelComp {
    constructor(config, layoutconfig) {
        super(config, layoutconfig);
        this.spinBtn = this.elementsList["spinBtn"];
        CoreLib.EventHandler.addEventListener("STOP_SHOWING_SPIN_BUTTON_IN_FS", this.hideSpinBtn.bind(this));
    }

    hideSpinBtn(){
        this.spinBtn.visible = false;
    }

}
