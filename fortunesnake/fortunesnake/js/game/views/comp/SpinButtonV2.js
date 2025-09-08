import { SpinButton } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/comps/SpinButton";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

const UP_STATE = "bg_blue";
const HOVER_STATE = "button_active_idle_REF";
const DOWN_STATE = "button_active_idle_and_ex_REF";

export class SpinButtonV2 extends SpinButton {
    constructor(config) {
        super(config);
        this.createView();
        this.buttonAnim = this.elementsList["buttonAnim"];
    }

    createView() {
        this.btn = UIUtil.getRectangle(386, 386, 0xff0000);
        this.addChild(this.btn);
        this.btn.x = -this.btn.width / 2;
        this.btn.y = -this.btn.height / 2;
        this.btn.alpha = 0;
        this.spinBg = this.elementsList["spinBg"];
        this.spinBg.visible = false;
        this.initListeners();

    }
    showUpState() {
        if (!this.isDownStatePlaying) {
            this.buttonAnim.playAnimation(this.buttonAnim.configData.animations.idle, true);
        } else {
            this.downStateCompleteCallback = () => {
                this.buttonAnim.playAnimation(this.buttonAnim.configData.animations.idle, true);
            };
        }
    }
    showOverState() { }

    showDownState() {
        this.isDownStatePlaying = true;
        this.buttonAnim.playAnimation(
            this.buttonAnim.configData.animations.press,
            false,
        );
        this.buttonAnim.addEventListener("complete", () => {
            this.isDownStatePlaying = false;
            if (this.downStateCompleteCallback) {
                this.downStateCompleteCallback();
                this.downStateCompleteCallback = null;
            }
        });
    }

    initListeners() {
        super.initListeners();
    }

    onButtonClick() {
        super.onButtonClick()
    }
    showSpinBg(flag) {
        this.spinBg.visible = flag;

    }

}
