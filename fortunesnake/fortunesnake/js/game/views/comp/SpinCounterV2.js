import { SpinCounter } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/comps/SpinCounter";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

export class SpinCounterV2 extends SpinCounter {
    constructor(config) {
        super(config);
        this.createView();
        this.buttonAnim = this.elementsList["buttonAnim"];
    }

    getWidth() {
        return this.btn.width;
    }

    getHeight() {
        return this.btn.height;
    }

    createView() {
        this.btn = UIUtil.getRectangle(386, 386, 0xff0000);
        this.addChild(this.btn);
        this.btn.x = -this.btn.width / 2;
        this.btn.y = -this.btn.height / 2;
        this.btn.alpha = 0;
        this.stopAllAnimation();
    }

    stopAllAnimation() { }

    showFSCounter() {
        this.buttonAnim.playAnimation(this.buttonAnim.configData.animations.idle, true);
        this.buttonAnim.visible = true;
    }

    showAutoCounter() {
        this.buttonAnim.playAnimation(this.buttonAnim.configData.animations.idle, true);
    }

}
