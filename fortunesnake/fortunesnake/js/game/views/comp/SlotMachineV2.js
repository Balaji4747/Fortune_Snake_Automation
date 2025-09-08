import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import { Util } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UtilService";
import { soundFactory } from "../../../../../../../../Microslots-FE-SlotCore/corelib/sound/SoundFactory";
import { ReelSlotSymbolLL } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/slotmachine/ReelSlotSymbolLL";

export class SlotMachineV2 extends LibContainer {
    constructor(config) {
        super(config);
        this.maskRect = this.elementsList["maskRect"];
        this.maskRect2 = this.elementsList["maskRect2"];
        this.maskRect3 = this.elementsList["maskRect3"];
        this.coverRect = this.elementsList["coverRect"];
        this.coverRectbg = this.elementsList["coverRectbg"];
        this.paylinesComp = this.elementsList["paylinesComp"];
        if (this.coverRect) {
            // this.coverRect.width = 100000;
            // this.coverRect.height = 100000;
            // this.coverRect.x = -2000;
            // this.coverRect.y = -2000;
        }

        if (this.coverRectbg) {

            this.coverRectbg.interactive = true;
            CoreLib.UIUtil.addInteraction(this.coverRectbg, this.hidePopup.bind(this));
        }

        if (this.coverRectbg) {
            this.coverRectbg.width = 100000;
            this.coverRectbg.height = 100000;
            this.coverRectbg.x = -2000;
            this.coverRectbg.y = -2000;
        }

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SET_SPIN_CONTROLLER, this.setSpinController.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SET_WIN_CONTROLLER, this.setWinController.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.START_SLOT_SPIN, this.startSlotSpin.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.START_STOPPING_REELS, this.startStoppingReels.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.STOP_SPIN_IMMEDIATELY, this.stopReelsImmediately.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.STOP_SPIN_FOR_ERROR, this.stopSpinForError.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REELSTRIP_SPIN_STARTED, this.onReelStripStarted.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REELSTRIP_SPIN_JERK, this.onReelStripSpinJerk.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REELSTRIP_FREESPIN_JERK, this.onReelStripSpinJerk.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REELSTRIP_SPIN_COMPLETED, this.onReelStripSpinCompleted.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REPLACE_REEL_SYMBOLS, this.replaceReelSymbols.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REPLACE_REEL_SYMBOLS_FOR_REEL, this.replaceReelSymbolsForReel.bind(this));
        //CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.REPLACE_REEL_WITH_SYMBOLS, this.replaceReelSymbols.bind(this));

        CoreLib.EventHandler.addEventListener("DISABLE_COVERRECT_BG", this.onClickStateChange.bind(this));

        CoreLib.EventHandler.addEventListener("SHOW_SYMBOL_POPUP", this.showPaytablePopup.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_BET_VALUE, this.reAddSymbolPopUp.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_PAYLINE, this.showPayline.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.HIDE_PAYLINE, this.hidePayline.bind(this));

        this.createSymbols();
        this.coverRectbg && (this.coverRectbg.visible = false);
        this.scale1 = { x: 0, y: 0 };
        this.pScale1 = { x: 0, y: 0 };
        this.lScale1 = { x: 0, y: 0 };
        this.createAnticipations();
        if (this.maskRect && this.symbolsContainer1) {
            this.addChild(this.maskRect);
            this.addChild(this.maskRect2);
            this.addChild(this.maskRect3);
            this.symbolsContainer1.mask = this.maskRect;
            // this.maskRect2.renderable = false;
            this.symbolsContainer2.mask = this.maskRect2;
            this.symbolsContainer3.mask = this.maskRect3;

            if (this.configData.disableMask) {
                this.disableMask();
            }
        }

        this.fpsText = this.elementsList["fpsText"]
        this.onSlotMachineCreated();

    }
    onSlotMachineCreated() {

    }
    onClickStateChange(flag) {
        if (this.coverRectbg) {
            this.coverRectbg.visible = flag;
        }

    }
    showPayline() {
        if (this.coverRect) {
            this.coverRect.visible = true;
        }
    }
    hidePayline(num) {
        if (this.coverRect) {
            this.coverRect.visible = false;
        }
    }

    createAnticipations() {
        if (this.configData.anticipationConfig) {
            this.anticipationMoviesArray = [];
            this.anticipationContainer = CoreLib.UIUtil.getContainer();
            this.anticipationContainer.name = "AnticipationCont";
            this.addChild(this.anticipationContainer);
            let len = this.configData.anticipationConfig.totalElements;
            for (let k = 0; k < len; k++) {
                let element = CoreLib.UIUtil.getElement(this.configData.anticipationConfig.element);
                element.x = this.configData.anticipationConfig.positions[k].x;
                element.y = this.configData.anticipationConfig.positions[k].y;
                this.anticipationContainer.addChild(element);
                element.stopAnimation();
                element.visible = false;
                this.anticipationMoviesArray.push(element);

                // element.visible = true;
                // element.playAnimation();
                // this.addChild(element);
            }
        }
    }

    onDone() {

    }

    showAllSymbols() {
        const len1 = this.symbolsArray.length;
        for (let k = 0; k < len1; k++) {
            const len2 = this.symbolsArray[k].length;
            for (let i = 0; i < len2; i++) {
                this.symbolsArray[k][i].visible = true;
            }
        }
    }
    showAnticipation(reelno) {
        if (this.dontShowAnticipation) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_ANTICIPATION_SOUND);
            return;
        }
        if (!this.maingameSoundStopped) {
            let obj;
            if (slotModel.getIsFreespinSession()) {
                obj = { name: "freespinBGMusic" };
            } else {
                obj = { name: "maingameBGMusic" };
            }
            if (obj) {
                soundFactory.stopSound(obj);
                this.maingameSoundStopped = true;
            }

        }

        this.anticipationStarted = true;
        this.anticipationMoviesArray[reelno].visible = true;
        if (this.configData.anticipationConfig.element.type == "Spine") {
            this.anticipationMoviesArray[reelno].playAnimation("animation", true);
        } else {
            this.anticipationMoviesArray[reelno].gotoAndPlay(0);
        }
    }
    destroyAnticipation(reelno) {
        if (this.anticipationMoviesArray && this.anticipationMoviesArray[reelno]) {
            CoreLib.AnimationManager.animateTween(this.anticipationMoviesArray[reelno], 0.5, { alpha: 0, onComplete: this.hideAnticipationStrip.bind(this, reelno) });
        }


    }
    hideAnticipationStrip(reelno) {
        if (this.configData.anticipationConfig) {
            //if there is a multiple anticipation objects done in comp, added for comp type for hide
            if (this.configData.anticipationConfig.element.type == "Spine" || this.configData.anticipationConfig.element.type == "Comp") {
                this.anticipationMoviesArray[reelno].stopAnimation();
            } else {
                this.anticipationMoviesArray[reelno].gotoAndStop(0);
            }
            this.anticipationMoviesArray[reelno].visible = false;
            this.anticipationMoviesArray[reelno].alpha = 1;
            if (reelno == this.configData.data.noOfReels - 1) {
                CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_ANTICIPATION_SOUND);
            }
        }

    }

    getReelSymbol(val, rowno, reelno) {
        if (val == undefined) {
            let index = 0;
            let target = CoreLib.Util.getRandomRange(1, 6)
            for (let p in this.configData.data.symbolsData) {
                if (index == target) {
                    val = p;
                }
                index++;
            }
        }
        let symbname = this.getSymbolName(val);
        // if (this.configData.symbolClass != undefined) {
        return new ReelSlotSymbolLL(val, symbname);
        // }

    }
    getSymbolName(val) {
        return this.configData.data.symbolsData[val].name;
    }
    createSymbols() {
        this.symbolsContainer1 = CoreLib.UIUtil.getContainer();
        this.symbolsContainer1.x = this.configData.data.reelContainerPosL.x;
        this.symbolsContainer1.y = this.configData.data.reelContainerPosL.y;
        this.addChild(this.symbolsContainer1);
        this.symbolsContainer1.name = "SymbolsCont";

        this.symbolsContainer2 = CoreLib.UIUtil.getContainer();
        this.symbolsContainer2.x = this.configData.data.reelContainerPosL2.x;
        this.symbolsContainer2.y = this.configData.data.reelContainerPosL2.y;
        this.addChild(this.symbolsContainer2);
        this.symbolsContainer2.name = "SymbolsCont2";

        this.symbolsContainer3 = CoreLib.UIUtil.getContainer();
        this.symbolsContainer3.x = this.configData.data.reelContainerPosL3.x;
        this.symbolsContainer3.y = this.configData.data.reelContainerPosL3.y;
        this.addChild(this.symbolsContainer3);
        this.symbolsContainer3.name = "SymbolsCont3";

        if (this.coverRect) {
            this.addChild(this.coverRect);
            console.log(this.coverRect)
            this.coverRect.visible = false;
        }
        if (this.coverRectbg) {
            this.addChild(this.coverRectbg);
            this.coverRectbg.visible = false;
        }

        if (this.paylinesComp) {
            this.addChild(this.paylinesComp);
        }

        this.winFrameContainer = CoreLib.UIUtil.getContainer();
        this.winFrameContainer.x = this.configData.data.reelContainerPosL.x;
        this.winFrameContainer.y = this.configData.data.reelContainerPosL.y;
        this.addChild(this.winFrameContainer);
        this.winFrameContainer.name = "winFrameCont";

        CoreLib.Model.GameConfig.defaultReels = this.configData.data.reelsView;
        let reellen = this.configData.data.noOfReels;
        let rowlen = this.configData.data.noOfRows;
        let reelsview = slotModel.getReelsView() ? slotModel.getReelsView() : this.configData.data.reelsView;
        let xPos;
        // if (CoreLib.Model.DeviceConfig.isDevice) {
        //     if (CoreLib.Model.DeviceConfig.isPortrait) {
        //         xPos = 0;
        //     } else {
        //         xPos = 0;
        //     }
        // } else {
        xPos = this.configData.data.reelPositionXL;
        // }
        let symbHeight = this.configData.data.symbolHeight;
        let index = 0;
        this.totalSymbols = 0;
        this.symbolsArray = [];
        this.yPosArray = [];
        CoreLib.Model.GameConfig.symbolHeight = this.configData.data.symbolHeight;
        CoreLib.Model.GameConfig.symbolsData = this.configData.data.symbolsData;
        CoreLib.Model.GameConfig.symbolWinFrame = this.configData.data.winFrame;
        // return
        CoreLib.Model.GameConfig.symbolPositions = [];
        CoreLib.Model.GameConfig.symbolPositionsForReel = [];
        let totalSymbols = 0;
        for (let k = 0; k < reellen; k++) {
            let flag = false;
            for (let i = 0; i < rowlen[k] + 2; i++) {
                let symbnum = (i == 0 || i == rowlen + 1) ? undefined : reelsview[k][i - 1];
                var symb = this.getReelSymbol(symbnum, i, k);
                totalSymbols++;
                CoreLib.UIUtil.setPositionX(symb, xPos[k]);
                CoreLib.UIUtil.setPositionY(symb, (i - 1) * symbHeight, false);
                this[`symbolsContainer${k + 1}`].addChild(symb);
                if (CoreLib.Model.GameConfig.isSymbolInWinFrameContainerGame) {
                    symb.on("SYMBOL_TEXTURE_SWAPPED", this.onSymbolChanged.bind(this));
                }
                if (!CoreLib.Model.GameConfig.symbolPositions[k]) {
                    CoreLib.Model.GameConfig.symbolPositions[k] = [];
                }
                if (!CoreLib.Model.GameConfig.symbolPositionsForReel[k]) {
                    CoreLib.Model.GameConfig.symbolPositionsForReel[k] = [];
                }
                CoreLib.Model.GameConfig.symbolPositions[k][i] = { x: this.symbolsContainer1.x + symb.x, y: this[`symbolsContainer${k + 1}`].y + symb.y };
                CoreLib.Model.GameConfig.symbolPositionsForReel[k][i] = { x: symb.x, y: symb.y };
                if (!this.symbolsArray[index]) {
                    this.symbolsArray[index] = [];
                    this.yPosArray[index] = [];
                }
                this.yPosArray[index].push((i - 1) * symbHeight);
                this.symbolsArray[index].push(symb);
                flag = true;
                this.totalSymbols++;
            }
            if (flag) {
                index++
            }

        }
        console.log(this.yPosArray);
        this.resizeViewComponents();

    }
    checkSymbolDepth(reelno) {

    }
    onSymbolChanged(symb, symbolName) {

    }
    replaceReelWithResult() {
        this.winController.cleanUp();
        this.winController.clearTriggeringWin();
        const reelview = slotModel.getReelsView();
        let len1 = reelview.length;
        for (let k = 0; k < len1; k++) {
            const reel = reelview[k];
            const len2 = reel.length;
            for (let i = 0; i < len2; i++) {
                this.symbolsArray[k][i + 1].swapSymbolTexture(reel[i], reel[i]);
            }
        }
    }
    replaceReelSymbolsForReel(obj) {
        let len2 = this.symbolsArray[obj.reelNumber].length;
        for (let i = 0; i < len2; i++) {
            this.symbolsArray[obj.reelNumber][i].visible = true;
            let symb = obj.symbols[i];
            this.symbolsArray[obj.reelNumber][i].swapSymbolTexture(symb, symb);
        }
    }
    replaceReelSymbols(symb) {
        let len = this.symbolsArray.length;
        for (let k = 0; k < len; k++) {
            let len2 = this.symbolsArray[k].length;
            for (let i = 0; i < len2; i++) {
                this.symbolsArray[k][i].visible = true;
                this.symbolsArray[k][i].swapSymbolTexture(symb, symb);
            }
        }
    }



    setSpinController(controller) {
        this.spinController = controller;
        this.spinController.symbolsArray = this.symbolsArray;
        this.spinController.stripsArray = this.stripsArray;
        this.spinController.stripsSymbolsArray = this.stripsSymbolsArray;
        this.spinController.configData = this.configData;
        this.spinController.setSlotInstance(this);
        if (this.spinController) {
            if (this.maskRect) {
                this.spinController.setReelHeight([this.maskRect.height, this.maskRect2.height, this.maskRect3.height]);
            }

        }
    }
    setWinController(controller) {
        this.winController = controller;
        this.winController.symbolsArray = this.symbolsArray;
        this.winController.configData = this.configData;
        this.winController.stage = this;


    }
    enableMask() {
        if (this.maskRect) {
            this.maskRect.visible = true;
            this.symbolsContainer1.mask = this.maskRect;
        }

    }
    disableMask() {
        // if (this.configData.disableMask) {
        //     if (this.maskRect) {
        //         this.maskRect.visible = false;
        //         this.symbolsContainer.mask = null;
        //     }
        //
        // }

    }
    startSlotSpin() {
        this.enableMask();
        this.moveAllSymbolsToSymbolsContainer();
        this.dontShowAnticipation = false;
        this.isSpinning = true;
        slotModel.isReelSpinning = true;
        this.anticipationStarted = false;
        this.maingameSoundStopped = false;
        this.maingameSoundStarted = false;
        this.spinStartIndex = 0;
        this.gameResultReceived = false;
        this.allReelsSpinStarted = false;
        this.reelStopIndex = 0;
        this.spinController.startAllSpin();
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            this.startReelStripSpin(k);
            this.reelStartIndex++;
        }
        if (this.coverRectbg) {
            this.coverRectbg.visible = false;
        }
    }
    moveAllSymbolsToSymbolsContainer() {

    }
    startReelStripSpin(index) {
        this.spinController.startReelStripSpin(index);
    }
    onReelStripStarted() {
        this.spinStartIndex++;
        if (this.spinStartIndex == this.configData.data.noOfReels) {
            this.allReelsSpinStarted = true;
            this.checkToStopSpin();
        }
    }
    onReelStripSpinJerk(reelno) {
        this.hideAnticipationStrip(reelno);
    }
    onReelStripSpinCompleted(reelno) {
        if (this.anticipationStarted) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_ANTICIPATION_SOUND);
            let obj;
            if (!this.maingameSoundStarted) {
                if (slotModel.getIsFreespinSession()) {
                    obj = { name: "freespinBGMusic" };
                } else {
                    obj = { name: "maingameBGMusic" };
                }
                soundFactory.playSound(obj);
                this.maingameSoundStarted = true;
            }
        }
        this.disableMask();
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            this.hideAnticipationStrip(k);
        }
        this.dontShowAnticipation = true;
        this.sendReelCompleteNotification();

        //this.showFinalReelSymbols();
        this.isSpinning = false;
    }
    sendReelCompleteNotification() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REELSPIN_COMPLETED);
        this.doGameSpecificStop();
    }
    doGameSpecificStop() {

    }
    startStoppingReels() {
        if (this.gameResultReceived) {
            // already stopping from immediate
            return;
        }
        this.handleGSParsing();
        if (CoreLib.Model.GameConfig.isTurboOn) {
            setTimeout(this.stopReelsImmediately.bind(this), 0);
            return;
        } else {

        }

        this.gameResultReceived = true;
        this.isQuickStop = false;
        this.createScatterAnticipationArray();
        this.checkToStopSpin();

    }
    handleGSParsing() {

    }
    stopReelsImmediately() {
        this.gameResultReceived = true;
        this.isQuickStop = true;
        if (CoreLib.Model.GameConfig.notNormalQuickStop) {

        } else {
            this.allReelsSpinStarted = true;
        }
        this.checkToStopQuickSpin();
    }
    stopSpinForError() {
        if (this.isSpinning) {
            let reelsview = slotModel.getReelsView() ? slotModel.getReelsView() : this.configData.data.reelsView;
            this.reelStopIndex = 0;
            for (let k = 0; k < this.configData.data.noOfReels; k++) {
                let reel = reelsview[this.reelStopIndex];
                this.stopReelStripQuick(this.reelStopIndex, reel, 0);
                this.reelStopIndex++;
                if (this.stopStripTimerIds && this.stopStripTimerIds[k]) {
                    clearTimeout(this.stopStripTimerIds[k]);
                }
            }
            clearTimeout(this.antiTimerId);
        }

    }
    checkToStopQuickSpin() {
        if (this.allReelsSpinStarted && this.gameResultReceived) {
            this.reelStopIndex = 0;
            for (let k = 0; k < this.configData.data.noOfReels; k++) {
                let reel = CoreLib.gameUtil.getReelView(this.reelStopIndex);
                this.stopReelStripQuickOnPress(this.reelStopIndex, reel, 0);
                this.reelStopIndex++;
                if (this.stopStripTimerIds && this.stopStripTimerIds[k]) {
                    clearTimeout(this.stopStripTimerIds[k]);
                }
            }
            clearTimeout(this.antiTimerId);
        }
    }
    checkToStopSpin() {

        if (this.allReelsSpinStarted && this.gameResultReceived) {
            if (this.isQuickStop && CoreLib.Model.GameConfig.notNormalQuickStop) {
                this.checkToStopQuickSpin();
            } else {
                this.isAnticipationShown = false;
                let delay = 0;
                let anti = false;
                this.stopStripTimerIds = [];
                for (let k = 0; k < this.configData.data.noOfReels; k++) {
                    let reel = CoreLib.gameUtil.getReelView(this.reelStopIndex);
                    this.spinController.stopReelStrip(this.reelStopIndex, reel, false);
                    this.reelStopIndex++;
                }
            }

        }
        /*for (let k = 0; k < this.configData.data.noOfReels; k++) {
            let reel = CoreLib.gameUtil.getReelView(k);
            this.stopReelStrip(k, reel);

        }*/
    }
    stopReelStrip(reelno, reelview) {
        this.spinController.stopReelStrip(reelno, reelview, false, this.stickyReels);
    }
    stopSpinNow() {
        this.isAnticipationShown = false;
        let delay = 0;
        let anti = false;
        this.stopStripTimerIds = [];
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            let reel = CoreLib.gameUtil.getReelView(this.reelStopIndex);
            //this.stopReelStrip(this.reelStopIndex, reel);
            this.spinController.stopReelStrip(this.reelStopIndex, reel, false, this.stickyReels);
            this.reelStopIndex++;
        }
    }

    stopReelStripQuick(reelno, reelview, delay = 0) {
        //this.createScatterAnticipationArray();
        setTimeout(this.callToStopQuickSpin.bind(this, reelno, reelview), delay)
    }
    stopReelStripQuickOnPress(reelno, reelview, delay = 0) {
        if (CoreLib.Model.GameConfig.isTurboOn) {
            this.spinController.stopReelStripQuick(reelno, reelview);
        } else {
            this.spinController.stopReelStripQuickForPress(reelno, reelview);
        }

    }
    callToStopQuickSpin(reelno, reelview) {
        this.spinController.stopReelStripQuick(reelno, reelview);
    }
    checkAnticipation(reelno) {
        if (CoreLib.Model.GameConfig.isTurboOn || this.configData.anticipationConfig == null) {
            return 0;
        }
        if (this.scatterAnticipArray && this.scatterAnticipArray[reelno] != undefined) {
            return this.scatterAnticipArray[reelno];
        } else {
            return 0;
        }


    }
    createScatterAnticipationArray() {
        this.scatterAnticipArray = [];
        let len = slotModel.getReelsView().length;
        let totalScatters = 0;
        this.scatterAnticipArray[0] = [0];
        for (let k = 1; k < len; k++) {
            this.scatterAnticipArray[k] = [];
            let reel = slotModel.getReelsView()[k - 1];
            if (reel) {
                let symbLen = reel.length;
                let scattersLen = this.configData.data.anticipationSymbols.length;
                if (scattersLen) {
                    for (let p = 0; p < scattersLen; p++) {
                        for (let i = 0; i < symbLen; i++) {
                            let landinglen = this.configData.data.anticipationSymbols.length;
                            if (landinglen) {
                                for (let j = 0; j < landinglen; j++) {
                                    if (reel[i] === this.configData.data.anticipationSymbols[j]) {
                                        totalScatters++;
                                    }
                                }
                            }
                        }
                        this.scatterAnticipArray[k].push(totalScatters);

                    }
                }
            }
        }
    }
    doGameSpecificStop(reelno) {

    }


    enterSpinWinState() {
        this.winController.showSpinWin();
    }
    onAllWinSymbolDone() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.EXIT_SPINWIN_SYMBOL);
    }
    changeCustomSymbolDepth() {

    }

    clearSpinAllWin() {
        this.winController.cleanUp();
    }
    clearTriggeringWin() {
        this.winController.clearTriggeringWin();
    }

    showLineWin() {
        this.winController.showLineWin()
        if (CoreLib.Model.GameConfig.gameId == "bigbadbass") {
            let checkSymb = this.checkSymbPopUP();
            if (checkSymb) {
                let symb = this.symbolsArray[checkSymb.reelNo][checkSymb.rowNo]
                this.winFrameContainer.addChild(symb);
            }
            if (this.coverRect) {
                this.coverRect.visible = false;
            }
        }
    }
    onLineWinDone() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.EXIT_LINE_WIN);
    }
    showBonusTriggerAnim() {
        this.winController.showBonusTriggerAnim();
    }

    // this method added only for Sugar bliss & pkanet loots anticipation anim
    showAnticipateBonusTriggerAnim() {
        this.winController.showAnticipateBonusTriggerAnim();
    }

    showBonusReTriggerAnim() {
        this.winController.showBonusReTriggerAnim();
    }

    showCustomBonusTriggerAnim(positions) {
        this.winController.showCustomBonusTriggerAnim(positions);
    }
    showCustomTriggerAnim(positions) {
        //this.winController.showCustomTriggerAnim(positions);
    }

    getNewRandomSymbolNumber(reelno) {
        const reel = this.configData.data.reelSymbols[reelno];
        const rnd = Util.getRandomRange(0, reel.length - 1);
        let symb = this.configData.data.symbolsData[reel[rnd]];
        return symb.name;
    }



    reArrangeReel() {
        let reellen = this.configData.data.noOfReels;
        let rowlen = this.configData.data.noOfRows;
        let symbHeight = this.configData.data.symbolHeight;
        let xPos;
        for (let k = 0; k < reellen; k++) {
            let flag = false;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    xPos = this.configData.data.reelPositionXP[k];
                    symbHeight = this.configData.data.symbolHeightP;
                } else {
                    xPos = this.configData.data.reelPositionXL[k];
                    symbHeight = this.configData.data.symbolHeightL;
                }
            } else {
                xPos = this.configData.data.reelPositionXL[k];
            }
            for (let i = 0; i < rowlen + 2; i++) {
                var symb = this.symbolsArray[k][i];
                symb.setSize(this.configData.data.symbolHeight);
                CoreLib.UIUtil.setPositionX(symb, xPos, false);

                if (CoreLib.Model.GameConfig.spinningReels && !CoreLib.Model.GameConfig.spinningReels[k]) {
                    CoreLib.UIUtil.setPositionY(symb, (i - 1) * symbHeight, false);
                }
                CoreLib.Model.GameConfig.symbolPositions[k][i] = { x: this.symbolsContainer1.x + symb.x, y: this.symbolsContainer1.y + (i - 1) * symbHeight };
                CoreLib.Model.GameConfig.symbolPositionsForReel[k][i] = { x: symb.x, y: (i - 1) * symbHeight };
            }
            this.reArrangeGameElements();

        }
        if (this.spinController) {
            this.spinController.setOrientation();
        }


    }
    reArrangeGameElements() {

    }

    resizeViewComponents(layoutData = null) {
        super.resizeViewComponents(layoutData);
        if (this.maskRect) {
            CoreLib.UIUtil.adjustElement(this.maskRect);
            CoreLib.UIUtil.adjustWidthHeightForMobile(this.maskRect);
            CoreLib.UIUtil.positionObjectForDevice(this.maskRect);
        }
        if (this.maskRect2) {
            CoreLib.UIUtil.adjustElement(this.maskRect2);
            CoreLib.UIUtil.adjustWidthHeightForMobile(this.maskRect2);
            CoreLib.UIUtil.positionObjectForDevice(this.maskRect2);
        }
        if (this.maskRect3) {
            CoreLib.UIUtil.adjustElement(this.maskRect3);
            CoreLib.UIUtil.adjustWidthHeightForMobile(this.maskRect3);
            CoreLib.UIUtil.positionObjectForDevice(this.maskRect3);
        }
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isLandscape) {
                this.configData.data.symbolHeight = this.configData.data.symbolHeightL;
                this.symbolsContainer1.x = this.configData.data.reelContainerPosL.x;
                this.symbolsContainer1.y = this.configData.data.reelContainerPosL.y;

                this.symbolsContainer2.x = this.configData.data.reelContainerPosL2.x;
                this.symbolsContainer2.y = this.configData.data.reelContainerPosL2.y;

                this.symbolsContainer3.x = this.configData.data.reelContainerPosL3.x;
                this.symbolsContainer3.y = this.configData.data.reelContainerPosL3.y;

                this.winFrameContainer.x = this.configData.data.reelContainerPosL.x;
                this.winFrameContainer.y = this.configData.data.reelContainerPosL.y;
            } else {
                this.configData.data.symbolHeight = this.configData.data.symbolHeightP;
                this.symbolsContainer1.x = this.configData.data.reelContainerPosP.x;
                this.symbolsContainer1.y = this.configData.data.reelContainerPosP.y;
                this.winFrameContainer.x = this.configData.data.reelContainerPosP.x;
                this.winFrameContainer.y = this.configData.data.reelContainerPosP.y;
            }
            if (this.spinController) {
                if (this.maskRect) {
                    this.spinController.setReelHeight([this.maskRect.height, this.maskRect2.height, this.maskRect3.height]);
                }
            }
            this.resizeSymbols();
            this.reArrangeReel();
        }
        this.resizeAnticipation();


    }
    resizeAnticipation() {
        if (this.anticipationMoviesArray) {
            const len = this.anticipationMoviesArray.length;
            for (let k = 0; k < len; k++) {
                CoreLib.UIUtil.adjustForMobile(this.anticipationMoviesArray[k]);
            }
            const obj = this.configData.anticipationConfig;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    for (let k = 0; k < len; k++) {
                        let element = this.anticipationMoviesArray[k];
                        if (obj.positions[k].px != undefined) {
                            element.x = obj.positions[k].px;
                        }
                        if (obj.element.py && obj.element.py != undefined) {
                            element.y = obj.element.py;
                        }
                        if (obj.element.pScale && obj.element.pScale.x != undefined) {
                            element.scale.x = obj.element.pScale.x;
                        }
                        if (obj.element.pScale && obj.element.pScale.y != undefined) {
                            element.scale.y = obj.element.pScale.y;
                        }
                    };
                } else {
                    for (let k = 0; k < obj.totalElements; k++) {
                        let element = this.anticipationMoviesArray[k];
                        if (obj.positions[k].lx != undefined) {
                            element.x = obj.positions[k].lx;
                        }
                        if (obj.element.ly && obj.element.ly != undefined) {
                            element.y = obj.element.ly;
                        }
                        if (obj.element.lScale && obj.element.lScale.x != undefined) {
                            element.scale.x = obj.element.lScale.x;
                        }
                        if (obj.element.lScale && obj.element.lScale.y != undefined) {
                            element.scale.y = obj.element.lScale.y;
                        }
                    };
                }
            }
        }

    }
    resizeSymbols() {
        const len1 = this.symbolsArray.length;
        for (let k = 0; k < len1; k++) {
            const len2 = this.symbolsArray[k].length;
            for (let i = 0; i < len2; i++) {
                this.symbolsArray[k][i].resize();
            }
        }
    }

    onResizeEndEvent() {
        super.onResizeEndEvent();
        // if (this.coverRect) {
        //     this.coverRect.width = 100000;
        //     this.coverRect.height = 100000;
        //     this.coverRect.x = -3000;
        //     this.coverRect.y = -3000;
        // }

        if (this.coverRectbg) {
            this.coverRectbg.width = 100000;
            this.coverRectbg.height = 100000;
            this.coverRectbg.x = -3000;
            this.coverRectbg.y = -3000;
        }
    }


    reAddSymbolPopUp() {
        if (CoreLib.Model.GameConfig.spinWithCascadeGame) {
            const checkPopup = this.checkSymbPopUPSpinWithCascade();
            if (checkPopup.ispopup) {
                this.winFrameContainer.addChild(this.symbolsArray[checkPopup.reelNo][checkPopup.rowNo])
            }
            return;
        } else {
            const checkPopup = this.checkSymbPopUP();
            if (checkPopup.ispopup) {
                this.winFrameContainer.addChild(this.symbolsArray[checkPopup.reelNo][checkPopup.rowNo])
            }
        }
    }

    hidePopup() {
        let returnVal
        if (CoreLib.Model.GameConfig.spinWithCascadeGame) {
            returnVal = this.checkSymbPopUPSpinWithCascade();
        } else {
            returnVal = this.checkSymbPopUP();
        }
        if (returnVal && returnVal.ispopup) {
            if (this.coverRectbg && this.coverRectbg.visible) {
                const reel = returnVal.reelNo;
                const row = returnVal.rowNo;
                this.symbolsArray[reel][row].hidePopUp();
                this.winFrameContainer.removeChild(this.symbolsArray[reel][row]);
                this.symbolsContainer1.addChild(this.symbolsArray[reel][row]);
                this.popupSymbol = null;
                this.coverRectbg.visible = false;
            }
        }
    }

    showPaytablePopup(symbObj) {
        if (CoreLib.Model.GameConfig.spinWithCascadeGame) {
            this.showPaytablePopupSpinWithCascade(symbObj);
            return;
        }
        if (this.checkSymbPopUP()) {

            this.hidePopup()
            return
        }

        this.coverRectbg.visible = true;
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            for (let i = 0; i < this.configData.data.noOfRows; i++) {
                const symbRow = this.symbolsArray[k][i].row;
                const symbReel = this.symbolsArray[k][i].reelno;
                if (this.symbolsArray[k][i] === symbObj) {
                    this.popupSymbol = this.symbolsArray[k][i];
                    this.winFrameContainer.addChild(this.symbolsArray[k][i])
                    this.symbolsArray[k][i].x = symbObj.x;
                    this.symbolsArray[k][i].y = symbObj.y;
                    if (k >= this.configData.data.noOfReels / 2) {
                        this.symbolsArray[k][i].positionchanged(false);
                    }
                    if (i == 0) {
                        this.symbolsArray[k][i].yPositionChanged(true, false, i, this.configData.data.noOfRows);
                    } else {
                        this.symbolsArray[k][i].yPositionChanged(false, false, i, this.configData.data.noOfRows - 1);
                    }
                    this.symbolsArray[k][i].showPopUp();
                } else {
                    this.symbolsArray[k][i].hidePopUp();
                }
            }
        }
    }

    showPaytablePopupSpinWithCascade(symbObj) {
        if (this.checkSymbPopUPSpinWithCascade()) {

            this.hidePopup()
            return
        }

        this.coverRectbg.visible = true;
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            for (let i = 1; i <= this.configData.data.noOfRows; i++) {
                // const symbRow = this.symbolsArray[k][i].row;
                // const symbReel = this.symbolsArray[k][i].reelno;
                if (this.symbolsArray[k][i] === symbObj) {

                    this.popupSymbol = this.symbolsArray[k][i];
                    this.winFrameContainer.addChild(this.symbolsArray[k][i])
                    this.symbolsArray[k][i].x = symbObj.x;
                    this.symbolsArray[k][i].y = symbObj.y;
                    if (k >= this.configData.data.noOfReels / 2) {
                        this.symbolsArray[k][i].positionchanged(false, false);
                    }
                    if (k >= this.configData.data.noOfReels / 2) {
                        this.symbolsArray[k][i].positionchanged(false);
                    }
                    if (i == 1) {
                        this.symbolsArray[k][i].yPositionChanged(true, false, i, this.configData.data.noOfRows);
                    } else {
                        this.symbolsArray[k][i].yPositionChanged(false, false, i, this.configData.data.noOfRows);
                    }
                    this.symbolsArray[k][i].showPopUp();
                } else {
                    this.symbolsArray[k][i].hidePopUp();
                }
            }
        }
    }
    checkSymbPopUPSpinWithCascade() {
        let obj = {}
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            for (let i = 1; i <= this.configData.data.noOfRows; i++) {
                if (this.symbolsArray[k][i].isPaytableVisible()) {
                    obj = {
                        reelNo: k,
                        rowNo: i,
                        ispopup: true,
                    }
                    return obj
                }

            }
        }
        return false
    }
    checkSymbPopUP() {
        let obj = {}
        for (let k = 0; k < this.configData.data.noOfReels; k++) {
            for (let i = 0; i < this.configData.data.noOfRows; i++) {
                if (this.symbolsArray[k][i].isPaytableVisible()) {
                    obj = {
                        reelNo: k,
                        rowNo: i,
                        ispopup: true,
                    }
                    return obj
                }

            }
        }
        return false
    }

}
