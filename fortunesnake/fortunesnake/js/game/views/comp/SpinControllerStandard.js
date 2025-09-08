import { CoreLib } from "../../core/CoreLib";
import { slotModel } from "../../models/SlotModel";
import { Bounce } from "../../../games/microslot/jslibs/1.00/gsap/gsap.min";

class SpinControllerStandard {
    constructor() {
        this.symbolsArray = [];
        this.stripsArray = [];
        this.stripsSymbolsArray = [];

        this.ticker = new PIXI.Ticker();
        this.ticker.maxFPS = 60;
        var that = this;
        this.ticker.add(function (delta) {
            that.doReelSpin(delta)
        });
        this.symbolPassedCounterArray = [0, 0, 0, 0, 0];
        CoreLib.Model.GameConfig.spinningReels = [false, false, false, false, false, false];
        this.coinSoundCheck = {
            landReel: 0,
            played:false
        };
    }
    setReelHeight(ht) {
        this.reelHeight = ht;
        if (this.stripCompletelyStopped) {
            const len = this.stripCompletelyStopped.length;
            for (let k = 0; k < len; k++) {
                if (this.reelsStopped[k] == 0) {
                    let symbols = this.symbolsArray[k];
                    const len2 = symbols.length;
                    for (let i = 0; i < len2; i++) {
                        CoreLib.AnimationManager.killTweensOf(symbols[i])
                        symbols[i].y = (i - 1) * this.slotMachine.configData.data.symbolHeight;
                    }
                    if (!this.stripCompletelyStopped[k]) {
                        this.doFinalStop(k);
                    }
                }
            }
        }

    }
    setOrientation() {
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMaxP;
            } else {
                this.speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMaxL;
            }
        } else {
            this.speed = CoreLib.Model.GameConfig.reelSpinSettings.reelSpinSpeedMax;
        }

    }
    setSlotInstance(instance) {
        this.slotMachine = instance;
        this.reelHeight = this.slotMachine.configData.data.reelHeight;
        console.log(this.reelHeight, "reelHeight");
        this.reelWidth = this.slotMachine.configData.data.reelWidth;
        this.stopIndexes = [0, 0, 0, 0, 0, 0, 0, 0]
    }

    startAllSpin(sticky) {
        this.stickyReels = sticky;
        this.spinningReels = [];
        let symbslen = this.slotMachine.configData.data.noOfRows - 1;
        this.stopIndexes = [];
        this.resultReceived = -1;
        this.setOrientation();
        this.reelsStopped = [];
        this.stripCompletelyStopped = [];
        this.reelsCompleted = []; // new for stop spin
        this.stopStarted = [];
        this.finalSymbols = [];
        this.countReel = 0;
        this.anticipationRunning = [];
        this.anticipationSymbolCounts = [];
        this.startAnticipationSymbolCount = [];
        CoreLib.Model.GameConfig.spinningReels = [];
        this.resetCoinSoundCheck();
        for (let k = 0; k < this.slotMachine.configData.data.noOfReels; k++) {
            this.stopIndexes.push(symbslen);
            this.reelsStopped.push(-1);
            this.stripCompletelyStopped.push(false);
            this.stopStarted[k] = false;
            this.reelsCompleted[k] = false;
            CoreLib.Model.GameConfig.spinningReels[k] = true;
            this.symbolPassedCounterArray[k] = 0;
            this.anticipationSymbolCounts[k] = 0;
            this.startAnticipationSymbolCount[k] = false;
            this.finalSymbols.push(null);
            this.anticipationRunning[k] = false;
        }

        this.totalSymbols = this.slotMachine.configData.data.noOfRows + 1;
        this.lastFrameTime = new Date().getTime();
        this.spinState = "spinning";
        this.resultSymbols = [];
        this.spinStopIndex = 0;
        this.quickStopStarted = false;
        this.ticker.start();

    }

    startReelStripSpin(index) {
        let totallen = this.symbolsArray[index].length;
        let delay;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REELSTRIP_SPIN_STARTED);
        CoreLib.Model.GameConfig.spinningReels[index] = true;
        if (CoreLib.Model.GameConfig.isTurboOn) {
            delay = 0;
        } else {
            delay = CoreLib.Util.getDefaultValue(this.slotMachine.configData.data.reelStartGap, 0.1);
        }
        for (let k = 0; k < totallen; k++) {
            this.symbolsArray[index][k].setSymbolVisible();
            if (k == totallen - 1) {
                CoreLib.AnimationManager.animateTween(this.symbolsArray[index][k], 0.2, { y: this.symbolsArray[index][k].y - 40, onComplete: this.notifyStart.bind(this, index), delay: delay * index });
            } else {
                CoreLib.AnimationManager.animateTween(this.symbolsArray[index][k], 0.2, { y: this.symbolsArray[index][k].y - 40, delay: delay * index })
            }
        }
    }
    notifyStart(index) {
        if (this.quickStopStarted) {
            return;
        }

        if (this.reelsStopped[index] == -1) {
            this.addBlurToAllSymbols(true, index);
            this.reelsStopped[index] = 1;
        }

    }

    doReelSpin(delta) {
        let len = this.slotMachine.configData.data.noOfReels;
        for (let k = 0; k < len; k++) {
            if (this.reelsStopped[k] == 1) {
                this.doSpinning(k, delta);
            } else if (this.reelsStopped[k] == 2) {
                // this.stopReel(k, delta);
            } else if (this.reelsStopped[k] == 3) {
                //this.stopReel(k, delta)
            }
        }
    }
    doSpinning(reelno, delta) {
        let symbols = this.symbolsArray[reelno];
        let len2 = symbols.length;
        for (var i = 0; i < len2; i++) {
            symbols[i].y += this.speed;
        }
        let symb = symbols[len2 - 1];
        if (symb.y > this.reelHeight) {
            let symbnumb = this.slotMachine.getNewRandomSymbolNumber(reelno);
            symb.swapSymbolTexture(symbnumb, symbnumb);
            symb.y = symbols[0].y - this.slotMachine.configData.data.symbolHeight;
            symbols.splice(len2 - 1, 1);
            symbols.unshift(symb);
            if (this.startAnticipationSymbolCount[reelno]) {
                this.anticipationSymbolCounts[reelno] += 1;
                this.checkToStopAnticipation(reelno);
            } else {
                if (this.countReel == reelno) {
                    this.symbolPassedCounterArray[reelno] += 1;
                    this.checkToStopReelStrip(reelno);
                }
            }
        }
    }


    stopReel(reelno) {
        let symbols = this.symbolsArray[reelno];
        let len2 = symbols.length;
        for (var i = 0; i < len2; i++) {
            symbols[i].y += this.speed;
        }
        let symb = symbols[len2 - 1];
        if (symb.y > this.reelHeight) {
            if (this.stopIndexes[reelno] >= 0) {
                let amountValue = null;
                if (slotModel.getSlotGameResult().moneyPositionsMap) {
                    let position = this.getReelPosition(reelno, this.stopIndexes[reelno]);
                    if (slotModel.getSlotGameResult().moneyPositionsMap[position] != undefined) {
                        amountValue = slotModel.getSlotGameResult().moneyPositionsMap[position];
                    }
                }
                let cursymb = this.getResultSymbolNumber(reelno);
                symb.swapSymbolTexture(cursymb, this.slotMachine.getSymbolName(cursymb), amountValue);
                symb.y = symbols[0].y - this.slotMachine.configData.data.symbolHeight;
                symbols.splice(len2 - 1, 1);
                symbols.unshift(symb);
                if (this.countReel == reelno) {
                    this.symbolPassedCounterArray[reelno] += 1;
                }
                this.stopIndexes[reelno]--;
            } else {
                // symb.y = symbols[0].y - this.slotMachine.configData.data.symbolHeight;
                // symbols.splice(len2 - 1, 1);
                // symbols.unshift(symb);
                // if (this.countReel == reelno) {
                //     this.symbolPassedCounterArray[reelno] += 1;
                // }
            }
        }
        if (this.stopIndexes[reelno] < 0) {

            let symb = this.symbolsArray[reelno][0];
            if (symb.y > CoreLib.Model.GameConfig.reelSpinSettings.endJerkDistance) {
                let lastsymb = symbols[len2 - 1];
                lastsymb.y = symbols[0].y - this.slotMachine.configData.data.symbolHeight;
                symbols.splice(len2 - 1, 1);
                symbols.unshift(lastsymb);
                this.reelsStopped[reelno] = 0;
                this.countReel = reelno + 1;
                this.checkToStopReelStrip(this.countReel);
                this.showEndJerk(reelno);

            }
        }
    }
    startStoppingReels(reelno) {
        if (this.reelsStopped[reelno] == 1) {
            this.reelsStopped[reelno] = 2;
            this.stopStarted[reelno] = true;
            this.addBlurToAllSymbols(false, reelno);
        }

    }
    checkToStopAnticipation(reelno) {
        let totalcount;
        if (CoreLib.Model.GameConfig.gameId == "royalchess" || CoreLib.Model.GameConfig.gameId == "farmfortune") {
            if (slotModel.getIsFreespinSession()) {
                totalcount = this.totalSymbols;
            } else {
                totalcount = CoreLib.Model.GameConfig.reelSpinSettings.anticipationSymbolPassCount - this.totalSymbols;
            }
        } else {
            totalcount = CoreLib.Model.GameConfig.reelSpinSettings.anticipationSymbolPassCount - this.totalSymbols;
        }
        if (this.anticipationSymbolCounts[reelno] >= totalcount) {
            if (!this.stopStarted[reelno]) {
                this.startStoppingReels(reelno);
                this.anticipationSymbolCounts[reelno + 1] = true;
                this.stopStarted[reelno] = true;
            }
        }

    }
    checkToStopReelStrip(reelno) {
        if (this.resultReceived < reelno) {
            return;
        }
        if (reelno == 0) {

            if (this.symbolPassedCounterArray[reelno] >= CoreLib.Model.GameConfig.reelSpinSettings.firstReelSymbolPassCount - this.totalSymbols && this.resultReceived >= reelno) {
                if (!this.stopStarted[reelno]) {
                    this.stopStarted[reelno] = true;
                    this.reelsStopped[reelno] = 2;
                    this.addBlurToAllSymbols(false, reelno);
                }
            }
        } else {
            let totalcount = CoreLib.Model.GameConfig.reelSpinSettings.otherReelsSymbolPassCount - this.totalSymbols;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    totalcount = CoreLib.Model.GameConfig.reelSpinSettings.otherReelsSymbolPassCount - this.totalSymbols - 1;
                } else {
                    totalcount = CoreLib.Model.GameConfig.reelSpinSettings.otherReelsSymbolPassCount - this.totalSymbols;
                }
            }
            if (this.symbolPassedCounterArray[reelno] >= totalcount && this.countReel == reelno && this.resultReceived >= reelno) {
                if (this.slotMachine.checkAnticipation(reelno) > 1) {
                    if (!this.anticipationRunning[reelno]) {
                        this.startAnticipation(reelno);
                        this.anticipationRunning[reelno] = true;
                    }
                    return;
                }
                if (!this.stopStarted[reelno]) {
                    this.startStoppingReels(reelno);
                    this.stopStarted[reelno] = true;
                }
            }
        }

    }


    stopReelStripQuickForPress(reelno, reelview, isTurbo = false) {
        if (this.reelsCompleted[reelno]) {
            if (this.stripCompletelyStopped[reelno]) {
                return;
            }
            this.showEndJerkQuick(reelno);
            return;
        }
        this.ticker.stop();
        let symbslen = this.slotMachine.configData.data.noOfRows - 1;
        this.quickStopStarted = true;
        this.stopIndexes[reelno] = symbslen;
        this.resultSymbols[reelno] = [];
        let len = reelview.length;
        for (let k = 0; k < len; k++) {
            this.resultSymbols[reelno].push(reelview[k]);
        }
        // this.resultSymbols[reelno].unshift(reelview[reelview.length - 1]);
        // this.resultSymbols[reelno].push(reelview[0]);

        this.addBlurToAllSymbols(false, reelno)

        let reellen = this.symbolsArray[reelno].length;
        let symbols = this.symbolsArray[reelno];
        for (let k = reellen - 1; k >= 0; k--) {
            let symb = this.symbolsArray[reelno][k];
            let amountValue = null;
            CoreLib.AnimationManager.killTweensOf(symb);
            let cursymb;

            if (k == reellen - 1 || k == 0) {
                cursymb = this.slotMachine.getNewRandomSymbolNumber(reelno);
            } else {
                if (slotModel.getSlotGameResult().moneyPositionsMap) {
                    let position = this.getReelPosition(reelno, k - 1);
                    if (slotModel.getSlotGameResult().moneyPositionsMap[position] != undefined) {
                        amountValue = slotModel.getSlotGameResult().moneyPositionsMap[position];
                    }
                }
                cursymb = this.getResultSymbolNumber(reelno);
                this.stopIndexes[reelno]--;
            }
            symb.swapSymbolTexture(cursymb, this.slotMachine.getSymbolName(cursymb), amountValue);
            symb.y = (k - 1.75) * (this.slotMachine.configData.data.symbolHeight);

        }
        //this.forceStopReel(reelno);
        this.showEndJerk(reelno, true);
    }
    stopReelStripQuick(reelno, reelview, isTurbo = false) {
        if (this.reelsCompleted[reelno]) {
            return;
        }
        this.quickStopStarted = true;
        this.reelsStopped[reelno] = 2;

        this.ticker.stop();
        this.resultSymbols[reelno] = [];
        let len = reelview.length;
        for (let k = 0; k < len; k++) {
            this.resultSymbols[reelno].push(reelview[k]);
        }
        this.stopIndexes[reelno] = this.slotMachine.configData.data.noOfRows + 1;

        this.resultSymbols[reelno].unshift(reelview[reelview.length - 1]);
        this.resultSymbols[reelno].push(reelview[0]);
        this.addBlurToAllSymbols(false, reelno)
        let reellen = this.resultSymbols[reelno].length;
        let symbols = this.symbolsArray[reelno];
        for (let k = reellen - 1; k >= 0; k--) {
            let symb = this.symbolsArray[reelno][k];
            CoreLib.AnimationManager.killTweensOf(symb);
            let amountValue = null;
            if (slotModel.getSlotGameResult() && slotModel.getSlotGameResult().moneyPositionsMap) {
                let position = this.getReelPosition(reelno, k - 1);
                if (slotModel.getSlotGameResult().moneyPositionsMap[position] != undefined) {
                    amountValue = slotModel.getSlotGameResult().moneyPositionsMap[position];
                }
            }
            let cursymb = this.getResultSymbolNumber(reelno);
            symb.swapSymbolTexture(cursymb, this.slotMachine.getSymbolName(cursymb), amountValue);
            symb.y = (k - 1.75) * (this.slotMachine.configData.data.symbolHeight);
            this.stopIndexes[reelno]--;
        }
        this.showEndJerk(reelno, true);
    }
    stopReelStrip(reelno, reelview, isTurbo = false) {
        if (this.stopStarted[reelno]) {
            return;
        }
        this.resultSymbols[reelno] = [];
        let len = reelview.length;
        for (let k = 0; k < len; k++) {
            this.resultSymbols[reelno].push(reelview[k]);
        }
        // this.resultSymbols[reelno].unshift(reelview[reelview.length - 1]);
        // this.resultSymbols[reelno].push(reelview[0]);
        this.resultReceived++;
        this.checkToStopReelStrip(reelno);
    }




    startAnticipation(reelno) {
        this.startAnticipationSymbolCount[reelno] = true;
        for (let k = reelno; k < this.slotMachine.configData.data.noOfReels; k++) {
            this.slotMachine.showAnticipation(k)
        }
        if (CoreLib.Model.GameConfig.gameId == "royalchess" || CoreLib.Model.GameConfig.gameId == "farmfortune") {
            if (slotModel.getIsFreespinSession()) {
                return;
            }
        }
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_ANTICIPATION_SOUND);
        //setTimeout(this.handleAnticiptionStop.bind(this, reelno), CoreLib.Util.getDefaultValue(this.slotMachine.configData.data.anticipationDelay, 3000));


    }
    handleAnticiptionStop(reelno) {
        this.slotMachine.destroyAnticipation(reelno);
        if (reelno == this.slotMachine.configData.data.noOfReels - 1) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_ANTICIPATION_SOUND);
        }
        this.callToStopStrip(reelno);
        if (reelno < this.slotMachine.configData.data.noOfReels - 1) {
            setTimeout(this.handleAnticiptionStop.bind(this, reelno + 1), CoreLib.Util.getDefaultValue(this.slotMachine.configData.data.anticipationDelay));
        }
    }
    callToStopStrip(index) {
        this.slotMachine.doGameSpecificStop(index);
        this.reelsStopped[index] = 2;
    }

    addBlurToAllSymbols(flag, reelno) {
        let len = this.symbolsArray[reelno].length;
        for (let k = 0; k < len; k++) {
            this.symbolsArray[reelno][k].addBlur(flag);
        }
    }




    forceStopReel(reelno) {
        let customEase = Elastic.easeOut.config(0.88, 0.4);
        let duration = 0.25;
        let len = this.symbolsArray[reelno].length;
        for (var k = 0; k < len; k++) {
            if (k === 0) {
                CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
            } else {
                CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase });
            }
        }
    }

    showEndJerk(reelno, isTurbo) {
        if (!slotModel.isFreeSpinSession) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REELSTRIP_SPIN_JERK, reelno);
        } else {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REELSTRIP_FREESPIN_JERK, reelno);
        }

        this.reelsCompleted[reelno] = true;
        this.checkForLanding(reelno);
        if (CoreLib.Model.GameConfig.isSymbolInWinFrameContainerGame) {
            this.slotMachine.checkSymbolDepth(reelno);
        }

        let customEase = Elastic.easeOut.config(1.8, 0.4);
        if (this.slotMachine.configData.data.customReelStopEase) {
            customEase = this.slotMachine.configData.data.customReelStopEase;
        }
        let duration = 1;

        if (this.slotMachine.configData.data.customReelStopDuration) {
            duration = this.slotMachine.configData.data.customReelStopDuration;
        }
        let len = this.symbolsArray[reelno].length;
        if (isTurbo) {
            //let customEase = Elastic.easeOut.config(0.88,0.4);
            let customEase = Elastic.easeOut.config(CoreLib.Model.GameConfig.reelSpinSettings.jerkEaseParam1 * 0.5, CoreLib.Model.GameConfig.reelSpinSettings.jerkEaseParam2);
            duration = 0.25;
            for (var k = 0; k < len; k++) {
                if (k === 0) {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
                } else {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase });
                }
            }
        } else {
            duration = CoreLib.Model.GameConfig.reelSpinSettings.jerkDuration;
            //let customEase = Elastic.easeOut.config(0.88,0.4);
            let customEase = Elastic.easeOut.config(CoreLib.Model.GameConfig.reelSpinSettings.jerkEaseParam1, CoreLib.Model.GameConfig.reelSpinSettings.jerkEaseParam2);
            //let customEase = Elastic.easeOut.config(12, CoreLib.Model.GameConfig.reelSpinSettings.jerkEaseParam2);
            for (var k = 0; k < len; k++) {
                if (k === 0) {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
                } else {
                    CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase });
                }
            }
        }

        setTimeout(this.playReelStopSound.bind(this), 200);


    }
    showEndJerkQuick(reelno) {
        let customEase = Linear.easeNone;
        const duration = 0.1;
        let len = this.symbolsArray[reelno].length;
        for (var k = 0; k < len; k++) {
            CoreLib.AnimationManager.killTweensOf(this.symbolsArray[reelno][k]);
            if (k === 0) {
                CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase, onComplete: this.doFinalStop.bind(this, reelno) });
            } else {
                CoreLib.AnimationManager.animateTween(this.symbolsArray[reelno][k], duration, { y: (k - 1) * (this.slotMachine.configData.data.symbolHeight), ease: customEase });
            }
        }
    }

    playReelStopSound() {
        if (!slotModel.isFreeSpinSession) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_REELSTOP_SOUND);
        } else {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_FREESPIN_REELSTOP_SOUND);
        }
    }
    doFinalStop(reelno) {
        if (reelno > this.slotMachine.configData.data.noOfReels - 2) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.HIDE_SPINSTOP_BUTTON, reelno);
        }
        this.stripCompletelyStopped[reelno] = true;
        //this.destroyAnticipation();
        this.slotMachine.destroyAnticipation(reelno);
        this.spinStopIndex++;
        CoreLib.Model.GameConfig.spinningReels[reelno] = false;
        this.reRenderStrip(reelno);
        this.reelsStopped[reelno] = -1;
        if (this.spinStopIndex >= this.slotMachine.configData.data.noOfReels) {
            this.ticker.stop();
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REELSTRIP_SPIN_COMPLETED, reelno);
        }
        this.stopImmediate = false;

    }
    reRenderStrip(reelno) {
    }

    checkForLanding(reelno) {
        let landingSymbols = this.slotMachine.configData.data.landingSymbols;
        if (landingSymbols && landingSymbols.length > 0) {
            let len = landingSymbols.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    for (let k = 1; k < this.symbolsArray[reelno].length - 1; k++) {
                        if (landingSymbols[i] === this.symbolsArray[reelno][k].getSymbolNumber()) {
                            this.showLandingAnimation(this.symbolsArray[reelno][k], (reelno + 1));
                        }
                    }
                }
            }
        }
    }
    showLandingAnimation(symb, reelno) {
        // just added this for new games, as it is event won't affect older games
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.LANDING_SYMBOL_ANIMATION, { reelno: reelno, symbol: symb });
        if (CoreLib.Model.GameConfig.gameId !== "kingofzeus") {
            symb.showLandingAnimation();
        }
        if (CoreLib.Model.GameConfig.gameId === "caribbeantreasures") {
            let coinLen = Object.keys(slotModel.getSlotGameResult().moneyPositionsMap).length;
            let wildlen = slotModel.getSlotGameResult().wildPositions.length;

            if ((symb.symbolName == "MN" || (CoreLib.Model.GameConfig.isTurboOn || CoreLib.Model.GameConfig.isTurboOff)) && coinLen > 0 && wildlen > 0) {
                if(this.coinSoundCheck["landReel"] === reelno){
                        if(!this.coinSoundCheck["played"]){
                            if (coinLen > 0 && slotModel.getIsFreespinSession()) {
                                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
                            } else if (wildlen > 0) {
                                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
                            }
                        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_SCATTER_LANDING_SOUND, reelno);
                        this.coinSoundCheck["played"] = true;
                    }
                }else{
                    this.coinSoundCheck["landReel"] = reelno;
                    this.coinSoundCheck["played"] = true;
                    CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_SCATTER_LANDING_SOUND, reelno);
                    if (coinLen > 0 && slotModel.getIsFreespinSession()) {
                        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
                    } else if (wildlen > 0) {
                        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
                    }
                }
            }
            if ((symb.symbolName == "WD" || (CoreLib.Model.GameConfig.isTurboOn || CoreLib.Model.GameConfig.isTurboOff)) && coinLen > 0) {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
            }
        } else if (CoreLib.Model.GameConfig.gameId === "farmfortune") {
            if (symb.symbolName == "WW") {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
            }
        } else {
            if (symb.symbolName == "SC" || (CoreLib.Model.GameConfig.isTurboOn || CoreLib.Model.GameConfig.isTurboOff)) {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_SCATTER_LANDING_SOUND, reelno);
            }
            if (symb.symbolName == "WD" || (CoreLib.Model.GameConfig.isTurboOn || CoreLib.Model.GameConfig.isTurboOff)) {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND, reelno);
            }
            if ((symb.symbolName == "WD" || symb.symbolName == "WW") && !slotModel.isFreeSpinSession && (slotModel.getFeatureType() == CoreLib.Model.GameConfig.featureTypes.freespins)) {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_WINNING_LANDING_SOUND, reelno);
            }
            if (symb.symbolName == "WW" && CoreLib.Model.GameConfig.landingScatterWildSymb) {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_SCATTER_LANDING_SOUND, reelno);
            }
            if (symb.symbolName == "BN") {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_BONUS_LANDING_SOUND, reelno);
            }
            if (symb.symbolName == "WD") {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.PLAY_WILD_LANDING_SOUND_SPECIFIC, reelno);
            }

        }
    }
    resetCoinSoundCheck() {
        this.coinSoundCheck = {
            landReel: 0,
            played:false
        };
    }

    getResultSymbolNumber(reelno) {
        let symb = this.resultSymbols[reelno][this.stopIndexes[reelno]];
        return symb;
    }

    getReelPosition(reelno, rowno) {
        let map = slotModel.reelPositionMap;
        const len = map.length;
        let pos = -1;
        for (let k = 0; k < len; k++) {
            if (reelno == map[k].reel && rowno == map[k].row) {
                pos = k;
                break;
            }
        }
        return pos;
    }




}

export const spinController = new SpinControllerStandard();
