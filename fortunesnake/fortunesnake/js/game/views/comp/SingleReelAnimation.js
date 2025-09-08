import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { Util } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UtilService";

let JMYSREEL = [[], ["Mini", "Minor", "Major", "Major", "Mini", "Minor", "Major", "Mini", "Mini", "Minor"]];
export class SingleReelSpin {
    constructor({ symbolHeight, reelHeight, mask, symbolCont, symbolArray, configData, reelno, symbolName, multiplier, winContainer, type, slotmachine }) {
        this.ticker = new PIXI.Ticker();
        var that = this;
        this._reelSpinCallback = function (delta) {
            that.doReelSpin(delta);
        };
        this.reeRandomReel = JMYSREEL;
        this.slotmachine = slotmachine;
        this.ticker.add(this._reelSpinCallback);
        this.acceleration = 2;
        this.endJerkDistance = 0;
        this._speed = 80;
        this.count = 0;
        this.reelsStopped = 0;
        this.symbolHeight = symbolHeight;
        this.reelHeight = reelHeight;
        this.symbContainer = symbolCont;
        this.symbolsArray = symbolArray;
        this.configData = configData;
        this.mask = mask;
        this.resultSymbol = symbolName;
        this.resultMultiplier = multiplier;
        this.reelno = reelno;
        this.stopIndex = 0;
        this.winContainer = winContainer;
        this.type = type;
        this.totalCount = 50;
        this.checkToStop = false;
        this.turboMode = false;
        this.timerIdArray = [];
        this.hitAnim = CoreLib.UIUtil.getSpineAnim("hit", { spineName: "Yuanbao", defaultState: "hit2", anchor: { x: 0.5, y: 0.5 }, loop: false, scale: 0.8 });
        this.slotmachine.addChild(this.hitAnim);
    }
    getNewRandomSymbolNumber(reelno) {
        reelno = reelno % 3;
        const reel = this.reeRandomReel[reelno];
        const rnd = Util.getRandomRange(0, reel.length - 1);
        let symb = this.configData.data.symbolsData[reel[rnd]];
        return symb.name;
    }
    startReelSpin() {
        this.showAllSymbolsFaded(false);

        let symbolName = this.getNewRandomSymbolNumber(1);
        this.symbolsArray[1].swapSymbolTexture(symbolName, symbolName);
        this.symbolsArray[1].visible = true;
        this.reelsStopped = 1;
        this.ticker.start();

        if (this.type === "NORMAL") {
            this.totalCount = 100;
            if (CoreLib.Model.GameConfig.isTurboOn) {
                this.totalCount = 50;
                this.turboMode = true;
                let timerId = setTimeout(() => {
                    this.updateCheckToStop(true);
                }, 2000);
                this.timerIdArray.push(timerId);
            } else {
                let timerId = setTimeout(() => {
                    this.updateCheckToStop(true);
                }, 4000);
                this.timerIdArray.push(timerId);
            }
        } else {
            if (this.type == "JMYSTERY_OPEN") {
                this.reeRandomReel = JMYSREEL;
            }
            let timerId = setTimeout(() => {
                this.updateCheckToStop(true);
            }, 2800);
            this.timerIdArray.push(timerId);
            this.totalCount = 85;
        }
    }
    doReelSpin(delta) {
        if (this.reelsStopped == 1) {
            this.doSpinning();
        } else if (this.reelsStopped == 2) {
            this.stopReel();
        }
    }
    doSpinning() {
        const len2 = this.symbolsArray.length;
        for (let i = 0; i < len2; i++) {
            this.symbolsArray[i].y += this._speed; // * factor;
        }
        const symb = this.symbolsArray[len2 - 1];
        let reelHt = this.reelHeight * (Math.floor(this.reelno / 3) + 1);
        if (symb.y > reelHt) {
            let symbnumb = this.getNewRandomSymbolNumber(1);
            symb.swapSymbolTexture(symbnumb, symbnumb);
            symb.y = this.symbolsArray[0].y - this.symbolHeight;
            this.symbolsArray.splice(len2 - 1, 1);
            this.symbolsArray.unshift(symb);
            this.count++;
            if (this.checkToStop && this.resultSymbol) {
                this.reelsStopped = 2;
            }
        }
    }
    stopReel() {
        let symbols = this.symbolsArray;
        let len2 = symbols.length;
        for (var i = 0; i < len2; i++) {
            symbols[i].y += this._speed;
        }
        let symb = symbols[len2 - 1];
        let reelHt = this.reelHeight * (Math.floor(this.reelno / 3) + 1);
        let cursymb = null;
        if (symb.y > reelHt) {

            cursymb = this.resultSymbol;
            symb.swapSymbolTexture(cursymb, cursymb, this.resultMultiplier);
            symb.y = symbols[0].y - this.symbolHeight;
            symbols.splice(len2 - 1, 1);
            symbols.unshift(symb);
            this.stopIndex--;
        }
        if (this.stopIndex) {
            if (symb.y > 0) {
                let lastsymb = symbols[len2 - 1];
                lastsymb.y = symbols[0].y - this.configData.data.symbolHeight;
                symbols.splice(len2 - 1, 1);
                symbols.unshift(lastsymb);
                this.showEndJerk(this.reelno);
            }
        }

    }
    showEndJerk(reelno) {
        this.ticker.stop();
        let duration = 0.2;
        let customEase = Linear.easeNone;
        for (var k = 0; k < this.symbolsArray.length; k++) {
            if ([0, 1, 2].includes(reelno)) {
                if (k === 2) {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[k], duration, { y: (k - 1) * (this.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
                } else {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[k], duration, { y: (k - 1) * (this.symbolHeight), ease: customEase, onComplete: this.showLandingAnim.bind(this, k) });
                }
            } else if ([3, 4, 5].includes(reelno)) {
                if (k === 2) {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[k], duration, { y: (k) * (this.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
                } else {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[k], duration, { y: (k) * (this.symbolHeight), ease: customEase, onComplete: this.showLandingAnim.bind(this, k) });
                }
            } else if ([6, 7, 8].includes(reelno)) {
                if (k === 2) {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[k], duration, { y: (k + 1) * (this.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
                } else {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[k], duration, { y: (k + 1) * (this.symbolHeight), ease: customEase, onComplete: this.showLandingAnim.bind(this, k) });
                }
            }
        }
    }
    updateCheckToStop(flag) {
        this.checkToStop = flag;
    }
    storeReelResult(symbolName, multiplier) {
        this.resultSymbol = symbolName;
        this.resultMultiplier = multiplier;
    }
    showLandingAnim(k) {
        if (k === 1 && this.type !== "NORMAL") {
            this.symbolsArray[1].alpha = 0
            if (
                this.resultSymbol === "SS"
                || this.resultSymbol === "GS"
                || this.resultSymbol === "BS"
            ) {
                this.symbolsArray[1].showCustomAnim(true, "transFormAnimation", 1);
            } else {
                this.symbolsArray[1].showCustomAnim(false, "transFormAnimation", 1);
            }
            CoreLib.UIUtil.fadeInElement(this.symbolsArray[1], null, 0, 1, 1)
            this.winContainer.addChild(this.symbolsArray[1])
            this.hitAnim.playAnimation("intro", false);
            this.hitAnim.x = this.symbContainer.x + this.symbolsArray[1].x;
            this.hitAnim.y = this.symbContainer.y + this.symbolsArray[1].y;
            this.hitAnim.scale.set(0.8);
            this.hitAnim.visible = true;
            this.slotmachine.addChild(this.hitAnim);
            CoreLib.EventHandler.dispatchEvent("STOP_REEL_ANTICIPATION");
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.LANDING_SYMBOL_ANIMATION, { reelno: this.reelno, mystery: true, playMysEndAnim: true });

            if (this.symbolsArray[1].symbolName === "Mini" || this.symbolsArray[1].symbolName === "BS") {
                CoreLib.EventHandler.dispatchEvent("JACKPOT_WIN_SOUND", 1);
            } else if (this.symbolsArray[1].symbolName === "Minor" || this.symbolsArray[1].symbolName === "SS") {
                CoreLib.EventHandler.dispatchEvent("JACKPOT_WIN_SOUND", 2);
            } else if (this.symbolsArray[1].symbolName === "Major" || this.symbolsArray[1].symbolName === "GS") {
                CoreLib.EventHandler.dispatchEvent("JACKPOT_WIN_SOUND", 3);
            }
        } else if (k === 1) {
            CoreLib.EventHandler.dispatchEvent("STOP_REEL_ANTICIPATION");
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.LANDING_SYMBOL_ANIMATION, { reelno: this.reelno, mystery: true })
        }
    }

    showAllSymbolsFaded(flag) {
        let len = this.symbolsArray.length;
        for (let k = 0; k < len; k++) {
            this.symbolsArray[k].showFaded(flag);
        }
    }

    doFinalStop() {
        this.ticker.stop();
        // this.hitAnim.visible = false;
        if (this.type === "NORMAL") CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REELSTRIP_SPIN_COMPLETED);
        else CoreLib.EventHandler.dispatchEvent("MYSTERY_SYMBOL_ANIM_COMPLETE", this.resultSymbol);
        this.updateCheckToStop(false);
        this.turboMode = false;
        this.timerIdArray.forEach(timerId => {
            clearTimeout(timerId);
            timerId = null;
        });
        this.timerIdArray = [];
    }
    removeTicker() {
        this.ticker.remove(this._reelSpinCallback);
        this.ticker.destroy();
    }
    setOrientation() {
        if (this.type === "NORMAL") {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                this.totalCount = 75;
                if (this.turboMode) {
                    this.totalCount = 38;
                }
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this._speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMax * 1.2;
                } else {
                    this._speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMax * 1.2;
                }
            } else {
                this._speed = 52;
            }
        } else {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this._speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMax;
                } else {
                    this._speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMax;
                }
            } else {
                this._speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMax;
            }
        }
    }
    updateData({ symbolHeight, reelHeight, mask, symbolCont, symbolArray, configData, reelno, symbolName, multiplier, winContainer, type }) {
        this.symbolHeight = symbolHeight;
        this.reelHeight = reelHeight;
        this.symbContainer = symbolCont;
        this.symbolsArray = symbolArray;
        this.configData = configData;
        this.mask = mask;
        this.resultSymbol = symbolName;
        this.resultMultiplier = multiplier;
        this.reelno = reelno;
        this.stopIndex = 0;
        this.winContainer = winContainer;
        this.type = type;
        this.count = 0;
        this.reeRandomReel = this.configData.data.reelSymbols;
    }
}
