import { SlotMachineComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/containers/SlotMachineComp";
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

export class GameSlotMachineComp extends SlotMachineComp {
    constructor(config) {
        super(config);
        this.reelFrame = this.slotMachine.elementsList["reelFrame"];
        this.playAnimation = false;
    }
    clearSpinAllWin() {
        super.clearSpinAllWin();
        this.winAmountComp.visible = false;
    }
    resizeChildren() {
        for (let p in this.elementsList) {
            if(this.elementsList[p] !== this.slotMachine){
                CoreLib.UIUtil.positionObjectForDevice(this.elementsList[p])
                CoreLib.UIUtil.adjustElement(this.elementsList[p]);
            }
        }
    }
    resizeViewComponents() {
        super.resizeViewComponents();
        if (this.reelFrame) {
            CoreLib.UIUtil.adjustElement(this.reelFrame);
            CoreLib.UIUtil.setPositionBasedOnDevice(this.reelFrame);
            CoreLib.UIUtil.adjustScale(this.reelFrame)
        }
        if (this.slotMachine) {
            // CoreLib.UIUtil.adjustElement(this.slotMachine);
            // const bounds1 = this.slotMachine.getLocalBounds(); // Local bounds of A (includes bg + spine);
            if (this.playAnimation) {

            }
            let pivotX = this.reelFrame.width * 0.5;
            let pivotY = this.reelFrame.height * 0.5;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this.slotMachine.pivot.set(pivotX, pivotY);
                    this.slotMachine.x = pivotX + this.slotMachine.configData.px;
                    this.slotMachine.y = pivotY + this.slotMachine.configData.py;
                } else {
                    this.slotMachine.pivot.set(pivotX, pivotY);
                    this.slotMachine.x = pivotX + this.slotMachine.configData.lx;
                    this.slotMachine.y = pivotY;
                }
            } else {
                this.slotMachine.pivot.set(pivotX, pivotY);
                this.slotMachine.x = pivotX + this.slotMachine.configData.x;
                this.slotMachine.y = pivotY;
            }
            // console.log(bounds1.y)
            // CoreLib.UIUtil.setPositionBasedOnDevice(this.slotMachine);
        }
    }
    setSlotMachinePos() {

    }
};
