import { CoreLib } from "../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { SlotGameView } from "../../../../../../../Microslots-FE-SlotCore/corelib/views/layoutcomps/SlotGameView";

export class GameView extends SlotGameView {
    constructor(config) {
        super(config);
        this.winPanelComp = this.elementsList["winPanelComp"]
    }
    onResizeEndEvent() {
        super.onResizeEndEvent();
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                let yGap = 0;
                let obj = CoreLib.UIUtil.getDeviceSpecificUIObj(this.winPanelComp.configData.layoutData);
                if (obj.slotMachinePadding != undefined) {
                    yGap = this.winPanelComp.getHeight() * obj.slotMachinePadding;
                }
                this.winPanelComp.y = this.slotPanelComp.panelBG.y - this.winPanelComp.guideRect.height * this.winPanelComp.scale.y + yGap;
            }
        }
    }

}
