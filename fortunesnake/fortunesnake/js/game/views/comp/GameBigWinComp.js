import { SlotBigWinComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/containers/SlotBigWinComp";
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { LibParticleComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/comps/LibParticleComp";
import { PARTICLE_CONFIG } from "../../config/views/ParticleConfig";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";

let playCount = 0;
const symbName = ["SS", "BS", "GS", "CS", "MYS", "JMYS", "Mini", "Minor", "Major"]
export class GameBigWinComp extends SlotBigWinComp {
    constructor(config) {
        super(config);

        this.bigWins = this.winAmountComp.elementsList["bigWins"];
        this.bigwinbg = this.winAmountComp.elementsList["bigwinbg"];
        this.winText = this.winAmountComp.elementsList["winText"];

        CoreLib.EventHandler.addEventListener("PLAY_BLAST_ANIMATION", this.playBlastAnim.bind(this))
    }


    adjustElementDepth() {
    }

    onCoinAnimCompleted() {
        playCount++;
        if (playCount < this.maxPlays) {
            this.anim.playAnimation(this.animationName, false);
        } else {
            this.anim.stopAnimation();
        }
    }

    playCoinAnimation(anim, animationName, maxPlays) {
        this.anim = anim;
        this.animationName = animationName;
        this.maxPlays = maxPlays;
        anim.playAnimation(animationName, false);
    }

    playBlastAnim(level) {
    }

    onCountUpDone() {
        super.onCountUpDone();
    }

    showBigWinNowOnScreen(level) {
    }
    showWin(win, level) {
        CoreLib.AnimationManager.animateTween(this.modalRect, 0.25, { alpha: 0.66 })
        this.winAmountComp.showWin(win, level);
    }

    showBigWin(level) {
        super.showBigWin(level);
        CoreLib.EventHandler.dispatchEvent("PLAY_CAISHEN_ANIM", {animationState: "cishen_dance_wins_start_coins_", loop: false });
        this.resizeViewComponents();
    }

    clearBigWin() {
        super.clearBigWin();
    }

    resizeViewComponents(layoutData = null) {
        super.resizeViewComponents(layoutData);
        this.modalRect.width = CoreLib.UIUtil.getGameWidth();
        this.modalRect.height = CoreLib.UIUtil.getGameHeight();

        this.winAmountComp.scale.set(1);

        if (CoreLib.Model.GameConfig.featureTypes.freespins) {
            this.winAmountComp.scale.set(1);
            let sc;
            let slotview = CoreLib.View.getSlotGameView().getSlotMachinComp();
            sc = (slotview.reelFrame.width * slotview.scale.x) / this.winAmountComp.getWidth();
            this.winAmountComp.scale.set(sc);
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    CoreLib.UIUtil.setPositionX(this.winAmountComp, (this.modalRect.width - this.winAmountComp.getWidth()) / 2);
                    CoreLib.UIUtil.setPositionY(this.winAmountComp, (this.modalRect.height - this.winAmountComp.getHeight()) / 2.5);
                } else {
                    CoreLib.UIUtil.setPositionX(this.winAmountComp, (this.modalRect.width - this.winAmountComp.getWidth()) / 2);
                    CoreLib.UIUtil.setPositionY(this.winAmountComp, (this.modalRect.height - this.winAmountComp.getHeight()) / 2);
                }
            } else {
                CoreLib.UIUtil.setPositionX(this.winAmountComp, (this.modalRect.width - this.winAmountComp.getWidth()) / 2);
                CoreLib.UIUtil.setPositionY(this.winAmountComp, (this.modalRect.height - this.winAmountComp.getHeight()) / 2);
            }
        } else {
            this.winAmountComp.scale.set(1);
            let sc;
            let slotview = CoreLib.View.getSlotGameView().getSlotMachinComp();
            sc = (slotview.reelFrame.width * slotview.scale.x) / this.winAmountComp.getWidth();
            this.winAmountComp.scale.set(sc);
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    CoreLib.UIUtil.setPositionX(this.winAmountComp, slotview.x + slotview.reelFrame.x * slotview.scale.x + (slotview.reelFrame.width * slotview.scale.x - this.winAmountComp.getWidth()) / 2);
                    CoreLib.UIUtil.setPositionY(this.winAmountComp, slotview.y + slotview.reelFrame.y * slotview.scale.y + (slotview.reelFrame.height * slotview.scale.y - this.winAmountComp.getHeight()) / 2 - 50);
                } else {
                    CoreLib.UIUtil.setPositionX(this.winAmountComp, slotview.x + slotview.reelFrame.x * slotview.scale.x + (slotview.reelFrame.width * slotview.scale.x - this.winAmountComp.getWidth()) / 2);
                    CoreLib.UIUtil.setPositionY(this.winAmountComp, slotview.y + slotview.reelFrame.y * slotview.scale.y + (slotview.reelFrame.height * slotview.scale.y - this.winAmountComp.getHeight()) / 2 + CoreLib.Util.getDefaultValue(this.winAmountComp.configData.yPadding, 0));
                }
            } else {
                CoreLib.UIUtil.setPositionX(this.winAmountComp, slotview.x + slotview.reelFrame.x * slotview.scale.x + (slotview.reelFrame.width * slotview.scale.x - this.winAmountComp.getWidth()) / 2);
                CoreLib.UIUtil.setPositionY(this.winAmountComp, slotview.y + slotview.reelFrame.y * slotview.scale.y + (slotview.reelFrame.height * slotview.scale.y - this.winAmountComp.getHeight()) / 2 + CoreLib.Util.getDefaultValue(this.winAmountComp.configData.yPadding, 0));
            }
        }
    }

    onResizeEndEvent() {
    }
};
