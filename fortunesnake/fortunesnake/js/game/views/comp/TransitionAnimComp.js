import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { LibView } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibView";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

export class TransitionAnimComp extends LibView {
    constructor(config) {
        super(config);
        this.frameTransitionAnimHor = this.elementsList["frameTransitionAnimHor"];
        this.frameTransitionAnimHor.addEventListener("complete", this.onTransitionDone.bind(this));
        this.frameTransitionAnimVer = this.elementsList["frameTransitionAnimVer"];
        this.frameTransitionAnimVer.addEventListener("complete", this.onTransitionDone.bind(this));

        CoreLib.EventHandler.addEventListener("SHOW_TRANSITION_ANIM", this.showTransitionAnim.bind(this));

        // this.resizeViewComponents();
        this.started = false;
        this.playTransitionAnim();
        this.hideTransitionAnim();

        this.rect = CoreLib.UIUtil.getRectangle(4000, 4000, 0x00B140);
        this.rect.x = -500;
        this.rect.y = -500;
        this.addChild(this.rect);
        this.rect.alpha = 0;
        this.rect.visible = false;
    }
    hideTransitionAnim() {
        this.trasAnim = false;
        this.frameTransitionAnimHor.renderable = false;
        this.frameTransitionAnimHor.stopAnimation();
        this.frameTransitionAnimVer.renderable = false;
        this.frameTransitionAnimVer.stopAnimation();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.TRANSITION_ANIM_END);
    }

    showOutroTransitionAnim() {
        this.showTransitionAnim(0);
    }

    showTransitionAnim() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.TRANSITION_ANIM_START);
        this.rect.visible = true;
        CoreLib.UIUtil.setClickable(this.rect, true);
        UIUtil.setModalState(this.rect);
        this.started = true;
        this.trasAnim = true;
        this.playTransitionAnim();
        this.resizeViewComponents();
    }
    
    playTransitionAnim() {
        CoreLib.EventHandler.dispatchEvent("PLAY_TRANSITION_ANIM_SOUND");
        this.frameTransitionAnimVer.playAnimation("transition_land", false, 0, 0.7, 0.80);
        this.frameTransitionAnimHor.playAnimation("transition_land", false, 0, 0.7, 0.80);
        this.frameTransitionAnimHor.renderable = true;
        this.frameTransitionAnimVer.renderable = true;
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.frameTransitionAnimVer.renderable = true;
                this.frameTransitionAnimHor.renderable = false;
            } else {
                this.frameTransitionAnimHor.renderable = true;
                this.frameTransitionAnimVer.renderable = false;
            }
        } else {
            this.frameTransitionAnimHor.renderable = true;
            this.frameTransitionAnimVer.renderable = false;
        }
    }

    onTransitionDone() {
        if (this.started) {
            this.started = false;
            CoreLib.EventHandler.dispatchEvent("ON_TRANSITION_ANIM_DONE");
            CoreLib.EventHandler.dispatchEvent("UPDATE_REEL_BG");
            this.rect.visible = false;
            CoreLib.UIUtil.setClickable(this.rect, false);
            this.hideTransitionAnim();
            this.started = false;
        }
    }

    resizeViewComponents() {
        super.resizeViewComponents();
        if (this.started) {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this.frameTransitionAnimVer.renderable = true;
                    this.frameTransitionAnimHor.renderable = false;
                } else {
                    this.frameTransitionAnimHor.renderable = true;
                    this.frameTransitionAnimVer.renderable = false;
                }
            } else {
                this.frameTransitionAnimHor.renderable = true;
                this.frameTransitionAnimVer.renderable = false;
            }
            CoreLib.UIUtil.adjustElement(this.frameTransitionAnimHor);
            CoreLib.UIUtil.adjustElement(this.frameTransitionAnimVer);
        } 
        // else {
        //     this.frameTransitionAnimVer && this.frameTransitionAnimVer.stopAnimation();
        //     this.frameTransitionAnimHor && this.frameTransitionAnimHor.stopAnimation();
        // }
    }

}
