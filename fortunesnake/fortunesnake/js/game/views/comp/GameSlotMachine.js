import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { SlotMachineV2 } from "./SlotMachineV2";

const sweep10AnimConfig = { prefix: "10-sweep_", postfix: "", start: 0, end: 30, toAddZero: true, x: 0, y: 0, scale: 0.7, anchor: { x: 0.5, y: 0.5 }, loop: false };

export class GameSlotMachine extends SlotMachineV2 {
    constructor(config) {
        super(config);
        this.snakemain = this.elementsList["snakemain"];
        this.snakemainP = this.elementsList["snakemainP"];
        this.jukeBox = this.elementsList["jukeBox"];
        this.sweep10 = this.elementsList["sweep10"];
        this.frameAnimContainer = this.elementsList["frameAnimContainer"];

        this.freeSpinSnakeAnimCont = this.elementsList["freeSpinSnakeAnimCont"];
        this.circleFortuneAnim = this.freeSpinSnakeAnimCont.elementsList["circleFortuneAnim"];
        this.snakeManinTop = this.freeSpinSnakeAnimCont.elementsList["snakeManinTop"];
        this.snakeManinTopP = this.freeSpinSnakeAnimCont.elementsList["snakeManinTopP"];

        this.leftLineNumCont = this.elementsList["leftLineNumCont"];
        this.rightLineNumCont = this.elementsList["rightLineNumCont"];
        this.reelFrame = this.elementsList["reelFrame"];
        this.messageTextComp = this.elementsList["messageTextComp"];
        this.frameAnimArr = this.frameAnimContainer.children;
        this.rightLineNumArr = this.rightLineNumCont.children;
        this.leftLineNumArr = this.leftLineNumCont.children;
        this.sweep10Anim = null;
        this.shrinkAnim = false;
        this.bigSnake = false;
        this.checkBigSnake();
        this.hideFrameAnim(false);
        this.hideOtherSymbols(this.bigSnake);
        this.addChild(this.frameAnimContainer);
        this.addChild(this.winFrameContainer);
        this.winStart = false;
        this.typeofPlayAnim = {
            playTopSnakeAnim: false,
        }

        this.sweep10Anim = CoreLib.UIUtil.getAnimatedSprite(sweep10AnimConfig);
        this.addChild(this.sweep10Anim);
        this.sweep10Anim.visible = false;
        this.snakemain.addEventListener("complete", this.onimComplete.bind(this));
        this.circleFortuneAnim.addEventListener("complete", this.onimComplete.bind(this));
        this.snakemainP.addEventListener("complete", this.onimComplete.bind(this));
        this.snakeManinTopP.addEventListener("complete", this.onimComplete.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.START_SLOT_SPIN, this.resetView.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_LINE_WIN, this.showLineWinFrame.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.ENTER_SPINWIN_STATE, this.showSpinWinFrame.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.GAME_START_CLICKED, this.startSnakeAnimation.bind(this));
        this.initiateView();

        this.snakemain.renderable = false;
        this.snakemainP.renderable = false;
        this.addChild(this.freeSpinSnakeAnimCont);
        // this.winAmountComp.on("WinAmountFinalValueShown", this.onWinAmountFinalValueShown.bind(this));
    }
    onimComplete(e) {
        if (e.name === "land_green_rise_out") {
            // this.playSnakeAnimtion({animation: "land_green_rise_out", loop: false})
        }
        // if (e.name === "port_green_rise_out_green") {
        //     this.playSnakeAnimtion({ animationP: "port_green_rise_up", loop: false });
        // }
        if (e.name === "port_green_rise_up") {

        }
        if (e.name === "intro") {
            this.circleFortuneAnim.playAnimation("idle", true)
        }
    }
    showShrinkAnim() {
        CoreLib.AnimationManager.animateTween(this, 1.4, {
            scaleX: this.scale.x * 0.9, scaleY: this.scale.y * 0.9, onComplete: () => {
                this.spinController.setOrientation(1.3);
            }
        })
        this.playSnakeAnimtion({ animation: "land_green_rise_up", animationP: "port_green_rise_up", loop: false });
        this.typeofPlayAnim.playTopSnakeAnim = true;
        this.playSnakeAnimtion({ fsAnim: "land_green_rise_up", fsAnimP: "port_green_rise_up", loop: false });
        this.showTopSnakeAnimBasedOnDevice();
        setTimeout(()=>{
            this.circleFortuneAnim.playAnimation("intro", false);
            this.circleFortuneAnim.visible = true;
        }, 2500)
    }
    playSnakeAnimtion({ animation = null, animationP = null, fsAnim = null, fsAnimP = null, loop = false }) {
        if (animation) {
            this.snakemain.playAnimation(animation, loop);
        }
        if (animationP) {
            this.snakemainP.playAnimation(animationP, loop);
        }
        if (fsAnimP) {
            this.snakeManinTopP.playAnimation(fsAnimP, loop)
        }
        if (fsAnim) {
            this.snakeManinTop.playAnimation(fsAnim, loop);
        }
    }
    startSnakeAnimation() {
        // 
    }
    sendReelCompleteNotification() {
        this.bigSnake = slotModel.getSlotGameResult().fullSnake;
        if (this.bigSnake) {
            let symbols = this.symbolsArray[1];
            this.sweep10.alpha = 1;
            this.sweep10.visible = true;
            let reachY = this.sweep10.height * 0.5
            symbols.forEach((symbol, index) => {
                if (index !== 0 && index !== symbols.length - 1) {
                    this.winFrameContainer.addChild(symbol);
                    symbol.y = this.yPosArray[1][index] - (this.winFrameContainer.y - this.symbolsContainer2.y);
                    symbol.showCustomAnimByName({ animationName: "winAnimationNoGlow", loop: false, showSnakeBg: false })
                }
            })
            CoreLib.AnimationManager.animateTween(this.sweep10, 0.5, {
                y: -reachY, onComplete: () => {
                    this.addChild(this.sweep10)
                    CoreLib.AnimationManager.animateTween(this.sweep10, 0.15, {
                        delay: 0.58, y: this.reelFrame.height * 0.5, scaleX: 0.6, scaleY: 0.6, onComplete: () => {
                            this.addChild(this.sweep10Anim);
                            this.sweep10Anim.x = this.sweep10.x;
                            this.sweep10Anim.y = this.sweep10.y;
                            this.sweep10Anim.scale.set(0.6);
                            this.sweep10Anim.gotoAndPlay(0);
                            this.sweep10Anim.visible = true;
                            this.sweep10Anim.play();
                            this.sweep10Anim.onComplete = this.onSweep10AnimComplete.bind(this);
                        }
                    })
                }
            })
            setTimeout(() => {
                let bigSymbol = symbols[1];
                symbols.forEach((symbol, index) => {
                    if (index !== 0 && index !== symbols.length - 1) {
                        this.winFrameContainer.removeChild(symbol);
                        this.symbolsContainer2.addChild(symbol);
                        symbol.y = this.yPosArray[1][index];
                        symbol.clearSymbolSpinWin();
                        symbol.hideSymbol();
                        // symbol.showCustomAnimByName({ animationName: "winAnimationNoGlow", loop: true, showSnakeBg: false })
                    }
                    if (index === 1) {
                        bigSymbol.updateSymbolName("Big_WD");
                        bigSymbol.y = this.yPosArray[1][1] - (this.winFrameContainer.y - this.symbolsContainer2.y);
                        bigSymbol.showCustomAnimByName({ animationName: "introAnimation", loop: false, showSnakeBg: true });
                        this.winFrameContainer.addChild(bigSymbol);
                    }
                })
            }, 800);
            return
        }
        super.sendReelCompleteNotification();
    }
    onSweep10AnimComplete() {
        this.sweep10.alpha = 0.6;
        CoreLib.Model.GameConfig.sweep10Anim = this.sweep10Anim;
        CoreLib.EventHandler.dispatchEvent("PLAY_10_MOVE_ANIM");
        CoreLib.AnimationManager.animateTween(this.sweep10Anim, 0.2, {
            y: this.messageTextComp.y, delay: 0.3, onComplete: () => {
                CoreLib.AnimationManager.animateTween(this.sweep10Anim, 0.3, {
                    scaleX: this.sweep10Anim.scale.x * 1.3, scaleY: this.sweep10Anim.scale.y * 1.3, alpha: 0, onComplete: () => {
                        this.sweep10Anim.visible = false;
                        this.sweep10Anim.alpha = 1;
                    }
                })
            }
        })
        super.sendReelCompleteNotification();
    }
    initiateView() {
        this.circleFortuneAnim.visible = false;

        this.snakeManinTop.stopAnimation();
        this.snakeManinTopP.stopAnimation();

        this.snakeManinTopP.renderable = false;
        this.snakeManinTop.renderable = false;

        this.frameAnimArr.forEach((frameAnim, index) => {
            frameAnim.visible = false;
            frameAnim.addEventListener("complete", (e) => {
                this.onFrameAnimComplete(e, frameAnim)
            });
        });
    }
    onFrameAnimComplete(e, frameAnim) {
        if (e.name === "frame_win1_start") {
            frameAnim.playAnimation("frame_win1_cycle", true);
        } else if (e.name === "frame_win1_cycle_end") {
            frameAnim.visible = false;
            frameAnim.stopAnimation();
        }
    }
    showSpinWinFrame() {
        this.winStart = true;
        this.hideFrameAnim(false);
        let winlines = slotModel.getWinLines();
        let fulSnakeCol = slotModel.getSlotGameResult().fullSnake;
        winlines.forEach((obj, index) => {
            if (obj.winningPosition && obj.winningPosition.length > 0) {
                let winningPosition = obj.winningPosition;
                let lineNumber = obj.lineNumber;
                winningPosition.forEach(element => {
                    if (element === 10) {
                        element = 9;
                    }
                    if (fulSnakeCol && (element == 1 || element == 4 || element == 7 || element == 9)) {
                    } else {
                        this.frameAnimArr[element].visible = true;
                        this.frameAnimArr[element].playAnimation("frame_win1_start", true);
                    }
                });
                this.rightLineNumArr[lineNumber - 1].texture = CoreLib.UIUtil.getTexture(`line_${lineNumber}_G`);
                this.leftLineNumArr[lineNumber - 1].texture = CoreLib.UIUtil.getTexture(`line_${lineNumber}_G`);
            }
        });
    }
    showLineWinFrame() {
        this.hideFrameAnim(false);
        let winlines = slotModel.getWinLines();
        let fulSnakeCol = slotModel.getSlotGameResult().fullSnake;
        if (CoreLib.Model.GameConfig.lineWinIndex >= 0 && winlines && winlines.length > 0) {
            let obj = winlines[CoreLib.Model.GameConfig.lineWinIndex];
            let winningPosition = obj.winningPosition;
            let lineNumber = obj.lineNumber;
            winningPosition.forEach(element => {
                if (element === 10) {
                    element = 9;
                }
                if (fulSnakeCol && (element == 1 || element == 4 || element == 7 || element == 9)) {
                } else {
                    this.frameAnimArr[element].visible = true;
                    this.frameAnimArr[element].playAnimation("frame_win1_start", true);
                }
            });
            this.rightLineNumArr[lineNumber - 1].texture = CoreLib.UIUtil.getTexture(`line_${lineNumber}_G`);
            this.leftLineNumArr[lineNumber - 1].texture = CoreLib.UIUtil.getTexture(`line_${lineNumber}_G`);
        } else {
            this.showSpinWinFrame();
        }
    }
    resetView() {
        this.bigSnake = false;
        this.symbolsArray[1][1].clearSnakeAssets();
        this.hideFrameAnim(true);
        this.sweep10.visible = false;
        this.addChildAt(this.sweep10, 0);
        this.sweep10.scale.set(0.4);

        if (this.winStart) {
            this.winStart = false;
            this.messageTextComp.showTexts();
        }
    }
    startSlotSpin() {
        super.startSlotSpin();
        let symbol = this.symbolsArray[1][1];
        symbol.playSnakeBgAnim({ animationState: "end", loop: false });
    }
    checkBigSnake() {
        if (!slotModel.getIsFreespinSession()) {
            this.bigSnake = true;
        }
    }
    hideFrameAnim(withAnimation = false) {
        this.frameAnimArr.forEach((frameAnim, index) => {
            if (withAnimation) {
                frameAnim.playAnimation("frame_win1_cycle_end", true);
            } else {
                frameAnim.visible = false;
                frameAnim.stopAnimation();
            }
            this.rightLineNumArr[index].texture = CoreLib.UIUtil.getTexture(`line_${index + 1}`);
            this.leftLineNumArr[index].texture = CoreLib.UIUtil.getTexture(`line_${index + 1}`);
        });
    }
    hideOtherSymbols(flag) {
        if (flag) {
            let symbols = this.symbolsArray[1];
            symbols.forEach((symbol, index) => {
                if (index !== 1 && index !== 0 && index !== 5) {
                    symbol.hideSymbol();
                }
                if (symbol.symbolName === "Big_WD") {
                    symbol.y = this.yPosArray[1][index] - (this.winFrameContainer.y - this.symbolsContainer2.y);
                    symbol.showCustomAnimByName({ animationName: "idleAnimation", loop: true });
                    this.winFrameContainer.addChild(symbol);
                }
            });
        }
    }

    showMainSnakeBasedOnDevice() {
        if (this.snakemain) {
            this.jukeBox.visible = true;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this.jukeBox.visible = false;
                    this.snakemain.renderable = false;
                    this.snakemainP.renderable = true;

                } else {
                    this.snakemainP.renderable = false;
                    this.snakemain.renderable = true;
                }
            } else {
                this.snakemainP.renderable = false;
                this.snakemain.renderable = true;
            }
        }
    }
    showTopSnakeAnimBasedOnDevice() {
        if (this.typeofPlayAnim && this.typeofPlayAnim.playTopSnakeAnim) {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this.snakeManinTop.renderable = false;
                    this.snakeManinTopP.renderable = true;
                } else {
                    this.snakeManinTopP.renderable = false;
                    this.snakeManinTop.renderable = true;
                }
            } else {
                this.snakeManinTopP.renderable = false;
                this.snakeManinTop.renderable = true;
            }
        }

    }
    setMessageTextpos() {
        if (this.messageTextComp) {
            this.messageTextComp.visible = true;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this.messageTextComp.visible = false;
                } {
                    this.messageTextComp.x = this.messageTextComp.configData.x;
                    this.messageTextComp.y = this.messageTextComp.configData.y;
                }
            }
        }
    }
    startStoppingReels() {
        if (this.gameResultReceived) {
            // already stopping from immediate
            return;
        }
        this.handleGSParsing();
        if (!slotModel.getIsFreespinSession() && slotModel.isFeatureTriggered()) {
            CoreLib.EventHandler.dispatchEvent("SHOW_SHRINK_ANIMATION");
            this.showShrinkAnim();
            return;
        }
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
    stopReelsImmediately() {
        if (!slotModel.getIsFreespinSession() && slotModel.isFeatureTriggered()) {
            // CoreLib.EventHandler.dispatchEvent("SHOW_SHRINK_ANIMATION");
            return;
        }
        this.gameResultReceived = true;
        this.isQuickStop = true;
        if (CoreLib.Model.GameConfig.notNormalQuickStop) {

        } else {
            this.allReelsSpinStarted = true;
        }
        this.checkToStopQuickSpin();
    }
    resizeViewComponents() {
        super.resizeViewComponents();
        this.showMainSnakeBasedOnDevice();
        this.showTopSnakeAnimBasedOnDevice();
        this.setMessageTextpos();
    }
}
