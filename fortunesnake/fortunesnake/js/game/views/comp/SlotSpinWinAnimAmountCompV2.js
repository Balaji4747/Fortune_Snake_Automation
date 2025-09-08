import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";
import { WinAmountComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/comps/WinAmountComp";

export class SlotSpinWinAnimAmountCompV2 extends WinAmountComp {
    constructor(config) {
        super(config);
        this.winText = this.elementsList["winText"];
        this.winText2 = this.elementsList["winText2"];
        this.lastScore = 0;

        // CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.COIN_CASH_MODE_CHANGED, this.updateForCoinCash.bind(this));

        // this.showWin(100);
    }
    updateText(showTotalText){
        if(showTotalText){
            this.winText2.text = CoreLib.Util.getContent("totalWin");
        }else{
            this.winText2.text = CoreLib.Util.getContent("win");
        }
    }
    showWin(win, showAnim = true, prevScore = 0) {
        this.startScore = { score: prevScore };
        this.lastScore = win;
        this.totalWin = win;
        this.duration = CoreLib.Util.getAnimationDuration(win);
        const currency = CoreLib.Model.GameInfo.currency;

        if (CoreLib.Model.GameConfig.currencyConfig[currency] !== undefined) {
            const maxCharacters = CoreLib.Model.GameConfig.currencyConfig[currency].value;
            if (win >= maxCharacters) {
                this.duration = CoreLib.Util.getAnimationDuration(win) * 0.15;
            }
        }
        if (showAnim) {
            this.scoreTween = CoreLib.AnimationManager.animateTween(this.startScore, this.duration, { delay: 0.5, score: this.totalWin, ease: Linear.easeNone, onUpdate: this.showValue.bind(this), onComplete: this.onScoreDone.bind(this) });
        } else {
            this.onScoreDone();
        }

    }
    onScreenClicked() {
        this.disableSkip();
        CoreLib.AnimationManager.killTweensOf(this.startScore);
        this.onScoreDone();
    }
    showText(win) {
        this.winText.text = CoreLib.WrapperService.formatCurrency(win);
        this.resizeText();
        this.adjustText();
    }
    showValue() {
        if (this.startScore.score <= this.totalWin) {
            this.winText.text = CoreLib.WrapperService.formatCurrency(this.startScore.score);
            this.resizeText();
        }
        this.adjustText();
    }
    onScoreDone() {
        this.winText.text = CoreLib.WrapperService.formatCurrency(this.totalWin);
        this.resizeText();
        this.emit("WinAmountFinalValueShown");
       CoreLib.AnimationManager.animateTween(this.winText, 0.6, { scaleX: this.winText.scale.x * 1.1, scaleY: this.winText.scale.y * 1.1, repeat: 1, yoyo: true, onComplete: this.notifyEnd.bind(this) });
        this.adjustText();
    }

    adjustText() {
        if (this.winTitle) {
            if (CoreLib.Model.GameInfo.language == "ms") {
                CoreLib.UIUtil.updateTextSize(this.winTitle, 63);
            } else if (CoreLib.Model.GameInfo.language == "zh" || CoreLib.Model.GameInfo.language == "zh_hant") {
                CoreLib.UIUtil.updateTextSize(this.winTitle, 160);
            } else if (CoreLib.Model.GameInfo.language == "id") {
                CoreLib.UIUtil.updateTextSize(this.winTitle, 72);
            } else if (CoreLib.Model.GameInfo.language == "vi" || CoreLib.Model.GameInfo.language == "fil") {
                CoreLib.UIUtil.updateTextSize(this.winTitle, 80);
            }
        }

        this.winText.scale.set(1); // Reset the scale to 1 in case it was previously scaled

        this.winText.scale.set(1);
    }

}