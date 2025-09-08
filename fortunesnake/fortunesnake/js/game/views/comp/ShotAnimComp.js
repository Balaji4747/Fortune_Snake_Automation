import { easeInElastic } from "penner";
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import { LibView } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibView";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";
import { csCollectAnim, csCollectAnimP, shotAnim, shotAnimP, caishenShotAnim, caishenShotAnimP, csBlessingShotAnimEndPos, csBlessingShotAnimEndPosP, shotAnimEndPos, shotAnimEndPosL, shotAnimEndPosP } from "../../config/views/Constant";


const multCOnfig = { name: "winText", type: "Text", type: "Comp", class: "LibAmountText", anchor: { x: 0.5, y: 0.5 }, scale: 0.7 };

export class ShotAnimComp extends LibContainer {
    constructor(config) {
        super(config);
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.COIN_CASH_MODE_CHANGED, this.updateForCoinCash.bind(this));
        this.ticker = new PIXI.Ticker();
        this.shotAnim = CoreLib.UIUtil.getSpineAnim("caishen_shots_variants3", { defaultState: "", anchor: { x: 0.5, y: 0.5 }, loop: true, timeScale: 1 });
        this.shotAnim.addEventListener("complete", this.onAnimationDone.bind(this));
        this.multiplierText = CoreLib.UIUtil.getElement(multCOnfig);
        this.type = 1;
        this.multiplierText.text = [
            { type: 'integer', value: `0` }
        ];
        this.multiplierText.visible = false;
        this.multiplierValue = 0;
        this.playAnim = false;
        this.trackIndex = 0;
        this.reelIndex = null;
        this.caishenReelIndex = null;

        this.headBone = null;
        this.tickerCallback = (delta) => {

            if (this.headBone) {
                // const x = this.headBone.worldX;
                // const y = this.headBone.worldY;

                const x = this.headBone.worldX * this.shotAnim.scale.x;
                const y = this.headBone.worldY * this.shotAnim.scale.y;

                const cos = Math.cos(this.shotAnim.rotation);
                const sin = Math.sin(this.shotAnim.rotation);

                // Apply rotation to the offset
                const rotatedX = x * cos - y * sin;
                const rotatedY = x * sin + y * cos;

                // Add to the shotAnim's position
                this.multiplierText.x = this.shotAnim.x + rotatedX;
                this.multiplierText.y = this.shotAnim.y + rotatedY;
            }

        };
        this.totalValue = 0
        this.ticker.add(this.tickerCallback);
        this.addChild(this.shotAnim);
        this.addChild(this.multiplierText);

        this.visible = false;

        // this.ticker.start();

    }
    updateForCoinCash() {
        this.multiplierText.text = CoreLib.WrapperService.formatWinCurrency(this.totalValue);
    }

    startAnimation(config) {
        if (config.type === "COLLECT") {
            this.totalValue = config.currentSymbol.multiplier;
            this.multiplierText.text = CoreLib.WrapperService.formatWinCurrency(config.currentSymbol.multiplier);
            this.playAnim = true;
            this.trackIndex = 0;
            this.caishenReelIndex = config.currentCSCollectSymb;
            this.reelIndex = config.reelIndex;

            this.multiplierText.x = config.multiplierPos.x;
            this.multiplierText.y = config.multiplierPos.y;
            this.type = config.type;
            this.multiplierValue = config.currentSymbol.multiplier;
            let shotAnimationInfo = csCollectAnim[this.caishenReelIndex][this.reelIndex];
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    shotAnimationInfo = csCollectAnimP[this.caishenReelIndex][this.reelIndex];
                }
            }
            this.shotAnim.angle = shotAnimationInfo.rotation;
            this.shotAnim.playAnimation(shotAnimationInfo.animation, false, 0, 0, 0.8);
            this.shotAnim.name = shotAnimationInfo.animation;
            this.multiplierText.visible = true;
            this.headBone = this.shotAnim.skeleton.findBone('reel_land_Layer 103');
            this.shotAnim.scale.set(shotAnimationInfo.scale.x, shotAnimationInfo.scale.y);
            CoreLib.AnimationManager.animateTween(this.multiplierText, 0.2, { scaleY: 0.8, scaleX: 0.8, repeat: 1, yoyo: true });
            this.shotAnim.x = shotAnimationInfo.x;
            this.shotAnim.y = shotAnimationInfo.y;
            this.visible = true;

            this.ticker.start();

        } else {
            this.playAnim = true;
            this.trackIndex = 0;
            this.totalValue = config.currentSymbol.multiplier;
            this.multiplierText.text = CoreLib.WrapperService.formatWinCurrency(config.currentSymbol.multiplier);
            this.multiplierText.x = config.multiplierPos.x;
            this.multiplierText.y = config.multiplierPos.y;
            this.reelIndex = config.reelIndex;
            this.multiplierText.visible = true;
            this.multiplierValue = config.currentSymbol.multiplier;
            this.type = config.type;
            let shotAnimationInfo = shotAnim[config.reelIndex];
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    shotAnimationInfo = shotAnimP[config.reelIndex];
                }
            }
            this.headBone = this.shotAnim.skeleton.findBone('reel_land_Layer 103');
            this.shotAnim.scale.set(shotAnimationInfo.scale.x, shotAnimationInfo.scale.y);
            this.shotAnim.name = shotAnimationInfo.animation;
            this.shotAnim.playAnimation(shotAnimationInfo.animation, false, 0, 0, 0.8);
            this.shotAnim.angle = shotAnimationInfo.rotation;
            this.shotAnim.x = shotAnimationInfo.x;
            this.shotAnim.y = shotAnimationInfo.y;
            this.visible = true;
            this.ticker.start();
        }
    }
    onAnimationDone() {
        this.ticker.stop();
        this.headBone = null;

        this.playAnim = false;
        this.trackIndex = 0;
        this.reelIndex = null;
        this.caishenReelIndex = null;
        this.totalValue = 0;

        if (this.type === "COLLECT") {
            CoreLib.EventHandler.dispatchEvent("ON_CS_COLLECT_SHOT_ANIM_COMPLETE", { multiplierValue: this.multiplierValue });
        } else {
            CoreLib.EventHandler.dispatchEvent("SHOW_TOTAL_WIN", { multiplier: this.multiplierValue, reelIndex: this.reelIndex });
        }
        this.multiplierText.visible = false;
    }
    resizeViewComponents() {
        if (this.playAnim) {
            const currentEntry = this.shotAnim.state.getCurrent(0); // 0 is the track index
            const currentTime = currentEntry.trackTime;

            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    if (this.type === "COLLECT") {
                        let shotAnimationInfo = csCollectAnimP[this.caishenReelIndex][this.reelIndex];
                        const entry = this.shotAnim.state.setAnimation(0, shotAnimationInfo.animation, false);
                        entry.trackTime = currentTime;
                        this.shotAnim.scale.set(shotAnimationInfo.scale.x, shotAnimationInfo.scale.y);

                        // this.shotAnim.state.setAnimation(currentTime, shotAnimationInfo.animation, false);
                        this.shotAnim.angle = shotAnimationInfo.rotation;
                        this.shotAnim.x = shotAnimationInfo.x;
                        this.shotAnim.y = shotAnimationInfo.y;


                    } else {
                        let shotAnimationInfo = shotAnimP[this.reelIndex];

                        const entry = this.shotAnim.state.setAnimation(0, shotAnimationInfo.animation, false);
                        entry.trackTime = currentTime;
                        this.shotAnim.scale.set(shotAnimationInfo.scale.x, shotAnimationInfo.scale.y);

                        // this.shotAnim.state.setAnimation(currentTime, shotAnimationInfo.animation, false);
                        this.shotAnim.angle = shotAnimationInfo.rotation;
                        this.shotAnim.x = shotAnimationInfo.x;
                        this.shotAnim.y = shotAnimationInfo.y;
                    }
                } else {
                    if (this.type === "COLLECT") {
                        let shotAnimationInfo = csCollectAnim[this.caishenReelIndex][this.reelIndex];

                        const entry = this.shotAnim.state.setAnimation(0, shotAnimationInfo.animation, false);
                        entry.trackTime = currentTime;

                        this.shotAnim.scale.set(shotAnimationInfo.scale.x, shotAnimationInfo.scale.y);
                        this.shotAnim.angle = shotAnimationInfo.rotation;
                        this.shotAnim.x = shotAnimationInfo.x;
                        this.shotAnim.y = shotAnimationInfo.y;
                    } else if (this.type === "caishen_throw") {

                    } else {
                        let shotAnimationInfo = shotAnim[this.reelIndex];
                        console.log("shotAnimationInfo", shotAnimationInfo);
                        const entry = this.shotAnim.state.setAnimation(0, shotAnimationInfo.animation, false);
                        entry.trackTime = currentTime;
                        this.shotAnim.scale.set(shotAnimationInfo.scale.x, shotAnimationInfo.scale.y);
                        this.shotAnim.angle = shotAnimationInfo.rotation;
                        this.shotAnim.x = shotAnimationInfo.x;
                        this.shotAnim.y = shotAnimationInfo.y;
                    }
                }
            }
        }
    }

};