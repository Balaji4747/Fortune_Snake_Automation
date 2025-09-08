import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";

export class SlotWinAmountSpineCompV3 extends LibContainer {
    constructor(config) {
        super(config);
        this.guideRect = this.elementsList["guideRect"];
        this.guideRect.renderable = false;
        this.bigWinAnim = this.elementsList["bigWinAnim"];
        this.bigwinbg = this.elementsList["bigwinbg"];
        this.winText = this.elementsList["winText"];
        this.bigWins = this.elementsList["bigWins"];

        if (this.bigWins) {
            this.bigWins.visible = false;
            CoreLib.UIUtil.setPosition(this.bigWins, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.yPaddingPerc, 0.25));
            this.bigWins.addEventListener("complete", this.onSpineAnimComplete.bind(this));
        }
        if (this.bigWinAnim) {
            this.bigWinAnim.visible = false;
            CoreLib.UIUtil.setPosition(this.bigWinAnim, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.yAnimPaddingPerc, 0.25));
            this.bigWinAnim.addEventListener("complete", this.onSpineAnimComplete.bind(this));
        }
        if (this.bigwinbg) {
            CoreLib.UIUtil.setPositionX(this.bigwinbg, this.guideRect.width * 0.5 + CoreLib.Util.getDefaultValue(this.bigwinbg.configData.xPadding, 0));
        }

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.COIN_CASH_MODE_CHANGED, this.updateForCoinCash.bind(this));
    }

    updateForCoinCash() {
        if (this.finalWinAmount > 0) {
            this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.finalWinAmount);
        }
    }

    showWin(val, level = 0, callback = null) {
        let obj;
        this.winLevel = level;
        this.callback = callback;
        this.finalWinAmount = val;
        let delay = 2000;
        if (level == 1) {
            obj = this.configData.bigAnimConfig.bigWin;
            this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scale, 1);
            this.bigWins.visible = true;
            // this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnim, 1);
            this.bigWinAnim.visible = true;
            if (this.configData.bigAnimConfig.start != undefined) {
                this.bigWins.playAnimation(this.configData.bigAnimConfig.start, false);
                this.bigWinAnim.playAnimation(this.configData.bigAnimConfig.start, false);
            } else {
                this.bigWins.playAnimation(this.configData.bigAnimConfig.defaultState, this.configData.bigAnimConfig.loop != undefined ? this.configData.bigAnimConfig.loop : true);
                this.bigWinAnim.playAnimation(this.configData.bigAnimConfig.defaultState, this.configData.bigAnimConfig.loop != undefined ? this.configData.bigAnimConfig.loop : true);
            }
            delay = 3000;
        } else if (level == 2) {
            obj = this.configData.megaAnimConfig.megaWin;
            this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.scale, 1);
            this.bigWins.visible = true;
            this.bigWins.playAnimation(this.configData.megaAnimConfig.defaultState, this.configData.megaAnimConfig.loop != undefined ? this.configData.megaAnimConfig.loop : true);
            // this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.scaleAnim, 1);
            this.bigWinAnim.visible = true;
            this.bigWinAnim.playAnimation(this.configData.megaAnimConfig.defaultState, this.configData.megaAnimConfig.loop != undefined ? this.configData.megaAnimConfig.loop : true);
            delay = 4000;
        } else if (level == 3) {
            obj = this.configData.giganticAnimConfig.giganticWin;
            this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.scale, 1);
            this.bigWins.visible = true;
            this.bigWins.playAnimation(this.configData.giganticAnimConfig.defaultState, this.configData.giganticAnimConfig.loop != undefined ? this.configData.giganticAnimConfig.loop : true);
            // this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.scaleAnim, 1);
            this.bigWinAnim.visible = true;
            this.bigWinAnim.playAnimation(this.configData.giganticAnimConfig.defaultState, this.configData.giganticAnimConfig.loop != undefined ? this.configData.giganticAnimConfig.loop : true);
            delay = 5000;
        } else if (level == 4) {
            obj = this.configData.unbelievableWinAnimConfig.unbelievableWin;
            this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.scale, 1);
            this.bigWins.visible = true;
            this.bigWins.playAnimation(this.configData.unbelievableWinAnimConfig.defaultState, this.configData.unbelievableWinAnimConfig.loop != undefined ? this.configData.unbelievableWinAnimConfig.loop : true);
            // this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.scaleAnim, 1);
            this.bigWinAnim.visible = true;
            this.bigWinAnim.playAnimation(this.configData.unbelievableWinAnimConfig.defaultState, this.configData.unbelievableWinAnimConfig.loop != undefined ? this.configData.unbelievableWinAnimConfig.loop : true);
            delay = 6000;
        }
        if (this.bigwinbg) {
            this.bigwinbg.visible = true;
            //this.bigwinbg.playAnimation();
        }
        if (obj.x != undefined) {
            CoreLib.UIUtil.setPositionY(this.winText, obj.x);
        }
        if (obj.y != undefined) {
            CoreLib.UIUtil.setPositionY(this.winText, obj.y);
        }
        if (this.winText.configData.dynamicFont) {
            CoreLib.UIUtil.updateTextSize(this.winText, obj.fontSize);
        } else {
            CoreLib.UIUtil.updateBitmapTextSize(this.winText, obj.fontSize);
        }


        this.totalWin = val;
        this.duration = CoreLib.Util.getAnimationDuration(val);
        if (CoreLib.Model.GameConfig.dontCountUp) {
            this.winText.text = CoreLib.WrapperService.formatWinCurrency(val);
            setTimeout(this.onScoreDone.bind(this), this.duration);
        } else {
            this.startScore = { score: 0 };
            this.scoreTween = CoreLib.AnimationManager.animateTween(this.startScore, this.duration, { score: this.totalWin, ease: Linear.easeNone, onUpdate: this.showValue.bind(this), onComplete: this.onScoreDone.bind(this) });
            setTimeout(this.sendCountUpEarlyNotification.bind(this), this.duration * 900)
        }
        if (!this.configData.dontDoVibration) {
            CoreLib.Util.vibrateForBigWins();
        }

        //this.winText.text = CoreLib.WrapperService.formatWinCurrency(val);
    }

    onSpineAnimComplete(data) {
        if (data.name == "idle") {
            return;
        }
        if (this.configData.loopAfterEnd) {
            if (this.winLevel == 1) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scale, 1);
                CoreLib.AnimationManager.animateTween(this.bigWins, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.bigAnimConfig.scale.x * 1.1, scaleY: this.configData.bigAnimConfig.scale.x * 1.1 })
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnim, 1);
                CoreLib.AnimationManager.animateTween(this.bigWinAnim, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.bigAnimConfig.scale.x * 1.1, scaleY: this.configData.bigAnimConfig.scale.x * 1.1 })
            } else if (this.winLevel == 2) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.scale, 1);
                CoreLib.AnimationManager.animateTween(this.bigWins, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.megaAnimConfig.scale.x * 1.1, scaleY: this.configData.megaAnimConfig.scale.x * 1.1 })
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.scaleAnim, 1);
                CoreLib.AnimationManager.animateTween(this.bigWinAnim, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.megaAnimConfig.scale.x * 1.1, scaleY: this.configData.megaAnimConfig.scale.x * 1.1 })
            } else if (this.winLevel == 3) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.scale, 1);
                CoreLib.AnimationManager.animateTween(this.bigWins, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.giganticAnimConfig.scale.x * 1.1, scaleY: this.configData.giganticAnimConfig.scale.x * 1.1 })
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.scaleAnim, 1);
                CoreLib.AnimationManager.animateTween(this.bigWinAnim, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.giganticAnimConfig.scale.x * 1.1, scaleY: this.configData.giganticAnimConfig.scale.x * 1.1 })
            } else if (this.winLevel == 4) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.scale, 1);
                CoreLib.AnimationManager.animateTween(this.bigWins, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.unbelievableWinAnimConfig.scale.x * 1.1, scaleY: this.configData.unbelievableWinAnimConfig.scale.x * 1.1 })
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.scaleAnim, 1);
                CoreLib.AnimationManager.animateTween(this.bigWinAnim, 0.5, { repeat: -1, yoyo: true, scaleX: this.configData.unbelievableWinAnimConfig.scale.x * 1.1, scaleY: this.configData.unbelievableWinAnimConfig.scale.x * 1.1 })
            }
        } else {
            if (this.winLevel == 1) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scale, 1);
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnim, 1);
                if (this.configData.bigAnimConfig.idleState) {
                    this.bigWins.playAnimation(this.configData.bigAnimConfig.idleState, true);
                    this.bigWinAnim.playAnimation(this.configData.bigAnimConfig.idleState, true);
                }
            } else if (this.winLevel == 2) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.scale, 1);
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.scaleAnim, 1);
                if (this.configData.megaAnimConfig.idleState) {
                    this.bigWins.playAnimation(this.configData.megaAnimConfig.idleState, true);
                    this.bigWinAnim.playAnimation(this.configData.megaAnimConfig.idleState, true);
                }
            } else if (this.winLevel == 3) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.scale, 1);
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.scaleAnim, 1);
                if (this.configData.giganticAnimConfig.idleState) {
                    this.bigWins.playAnimation(this.configData.giganticAnimConfig.idleState, true);
                    this.bigWinAnim.playAnimation(this.configData.giganticAnimConfig.idleState, true);
                }
            } else if (this.winLevel == 4) {
                this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.scale, 1);
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.scaleAnim, 1);
                if (this.configData.unbelievableWinAnimConfig.idleState) {
                    this.bigWins.playAnimation(this.configData.unbelievableWinAnimConfig.idleState, true);
                    this.bigWinAnim.playAnimation(this.configData.unbelievableWinAnimConfig.idleState, true);
                }
            }
        }
    }


    showValue() {
        this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.startScore.score);

    }
    sendCountUpEarlyNotification() {
        this.emit("SCORE_COUNT_UP_DONE");
    }
    onScoreDone() {
        this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.totalWin);
        CoreLib.AnimationManager.animateTween(this.winText, 0.5, { scaleX: CoreLib.Util.getDefaultValue(this.winText.configData.zoomScale, 1.32), scaleY: CoreLib.Util.getDefaultValue(this.winText.configData.zoomScale, 1.32), repeat: 2, yoyo: true, onComplete: this.winZoomInOutComplete.bind(this) });
    }
    winZoomInOutComplete() {
        this.winText.scale.x = this.winText.scale.y = 1;
        this.timerId = setTimeout(this.sendDoneNotification.bind(this, this.callback), 250);
    }
    sendDoneNotification(callback) {
        this.clickCount = 0;
        if (callback) {
            callback();
        } else {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.EXIT_SPINWIN_AMOUNT);
            CoreLib.EventHandler.dispatchEvent("PLAY_CAISHEN_ANIM", { animationState: "cishen_dance_wins_end_coins_", loop: false });
            CoreLib.EventHandler.dispatchEvent("STOP_BIGWIN_COUNT_UP_SOUND");
        }
        if (!this.configData.dontDoVibration) {
            CoreLib.Util.stopVibration();
        }

    }

    clearWin() {

        clearTimeout(this.timerId);
        this.winText.text = "";
        if (this.winLevel > 0) {
            this.cleanUpAllBigWins();
        }
        if (this.bigwinbg) {
            this.bigwinbg.visible = false;
        }
        CoreLib.EventHandler.dispatchEvent("STOP_BIG_WIN_COUNTUP");
    }
    cleanUpAllBigWins() {
        clearTimeout(this.timerId);

        if (this.bigWins) {
            this.bigWins.visible = false;
            this.bigWins.stopAnimation(0);
            this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scale, 1);
            CoreLib.AnimationManager.killTweensOf(this.bigWins);
        }

        if (this.bigWinAnim) {
            this.bigWinAnim.visible = false;
            this.bigWinAnim.stopAnimation(0);
            this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnim, 1);
            CoreLib.AnimationManager.killTweensOf(this.bigWinAnim);
        }
    }
    resizeViewComponents() {
        super.resizeViewComponents();
        this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnim, 1);
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnimP, 1);
            }
        }
    }
}
