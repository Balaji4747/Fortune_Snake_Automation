import { ApplicationLL } from "../../../../../../Microslots-FE-SlotCore/corelib/core/ApplicationLL";
import { CoreLib } from "../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { WrapperService } from "../../../../../../Microslots-FE-SlotCore/platform/WrapperService";
import { UIUtil } from "../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";
import { gameUtil } from "./GameUtil";
import { GAME_CONFIG } from "./config/GameConfig";
import { GAME_LOAD_CONFIG } from "./config/LoadConfig";
import { GAME_SOUND_CONFIG } from "./config/SoundLoadConfig";
import { PRELOADER_CONFIG } from "../../../../../../Microslots-FE-SlotCore/corelib/config/PreloaderConfig";
import { GameSoundManager } from "./sound/GameSoundManager";
import { PreloaderView } from "../../../../../../Microslots-FE-SlotCore/corelib/views/layoutcomps/PreloaderView";
import { SLOT_GAMEVIEW_CONFIG } from "./config/views/SlotGameViewConfig";
import { spinController } from "../../../../../../Microslots-FE-SlotCore/corelib/views/slotmachine/SpinControllerStandard3x4x3";
import { spinWinController } from "../../../../../../Microslots-FE-SlotCore/corelib/views/slotmachine/SpinWinControllerStandard3x4x3";
import { GameView } from "./views/GameView";
import { slotModel } from "../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { GAME_SPLASH_CONFIG } from "./config/views/GameSplashConfig";
import { GameSplashComp } from "./views/comp/GameSplashComp";
import { BIG_WIN_CONFIG } from "./config/views/BigWinConfig";
import { GameBigWinComp } from "./views/comp/GameBigWinComp";

const reelPositionMap = [
    { "reel": 0, "row": 0 },
    { "reel": 1, "row": 0 },
    { "reel": 2, "row": 0 },
    { "reel": 3, "row": 0 },
    { "reel": 4, "row": 0 },
    { "reel": 0, "row": 1 },
    { "reel": 1, "row": 1 },
    { "reel": 2, "row": 1 },
    { "reel": 3, "row": 1 },
    { "reel": 4, "row": 1 },
    { "reel": 0, "row": 2 },
    { "reel": 1, "row": 2 },
    { "reel": 2, "row": 2 },
    { "reel": 3, "row": 2 },
    { "reel": 4, "row": 2 },
]

export class GameApp extends ApplicationLL {
    constructor() {
        CoreLib.WrapperService = WrapperService;
        UIUtil.setGameUtil(gameUtil);
        CoreLib.gameUtil = gameUtil;
        super(GAME_CONFIG, GAME_LOAD_CONFIG, GAME_SOUND_CONFIG);
    }

    showPreloader() {
        let preloader = new PreloaderView(PRELOADER_CONFIG);
        super.createViewComponent(preloader, "preloader");
    }

    createBasicGameView() {
        let depthIndex = 0;
        this.baseGameViewCreated = true;
        this.onBaseGameViewCreated();
    }

    // ------NEWLY ADDED FOR LAZY LOADING

    createSplash() {
        this.splashView = super.createViewComponent(new GameSplashComp(GAME_SPLASH_CONFIG), "splashview", true);
        let gsManager = new GameSoundManager(GAME_SOUND_CONFIG);
        this.onGameSplashViewCreated();
        this.onResize();
    }

    createBigWinView() {
        this.bigWinView = super.createViewComponent(new GameBigWinComp(BIG_WIN_CONFIG), "bigwinComp", true);
        this.gameView.addChildAt(this.bigWinView, 3);
        this.gameView.bigwinComp = this.bigWinView;
        this.onResize();

    }

    createGameViewV2() {
        let gameView = super.createViewComponent(new GameView(SLOT_GAMEVIEW_CONFIG), "gameview", true);
        this.gameView = gameView;
        gameView.addChild(this.splashView);
        gameView.splashComp = this.splashView;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SET_SPIN_CONTROLLER, spinController);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SET_WIN_CONTROLLER, spinWinController);
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.LANDING_SYMBOL_ANIMATION, this.onSymbolLanding.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.CLEAR_GAME_FOR_SPIN, this.resetSpinVariables.bind(this));
        this.onGameViewCreated();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.DISABLE_ALL_BUTTONS);
    }

    createBonusGameView() {
        this.onResize();
    }
    startBGSoundLate() {
        super.startBGSoundLate()
        CoreLib.EventHandler.dispatchEvent("PLAY_WELCOME_SOUND");
    }
    startFS() {
        this.transitionAnim = false;
        if (this.enteredIntoFS) {
            setTimeout(() => {
                this.startFreespins();
                this.enteredIntoFS = false;
            }, 300)
        }
    }

    onGameStartClicked() {
        if (!this.isUserInteracted) {
            this.loadSoundForIOSNow();
        } else {
            if (slotModel.getPromoFSData()) {

            } else {
                this.startBGMusic();
                // CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.START_MAINGAME_BG_MUSIC);
            }
            CoreLib.EventHandler.dispatchEvent("PLAY_WELCOME_SOUND");
        }
        this.createVideoElement();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.VALIDATE_TOURNEY_ICON);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_MAINGAME_BG, true);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_SLOTMACHINE, true);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_SLOTPANEL, true);
        this.checkGameState();// remove on build
        if (CoreLib.Model.DeviceConfig.isDevice) {
            setTimeout(this.doFullScreen.bind(this), 10);
        }
    }

    resetSpinVariables() {
        this.landingArray = [];
    }
    onSymbolLanding(reelno) {
        CoreLib.EventHandler.dispatchEvent("CHECK_FOR_LANDING");
    }
    onPreWinFeatureCompleted() {
        if (slotModel.getSpinWin() > 0) {
            slotModel.setAutoPlayWin(slotModel.getTotalWin());
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.ENTER_SPINWIN_STATE);
            // this.checkToActivateGame();
        } else {
            this.exitSpinWinState();
        }
    }

    convertPosition(arr) {
        let result = [];
        let len = arr.length;
        for (let k = 0; k < len; k++) {
            result.push(reelPositionMap[arr[k]]);
        }
        return result;
    }
    // ------------ new
    triggerFeatureGame() {
        if (!CoreLib.Model.GameConfig.secondaryUILoaded) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_ASSETS_LOADER_ANIM);
            CoreLib.Model.GameConfig.bonusGameInWaiting = true
            return;
        }
        this.userEntered = true;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.HIDE_ASSETS_LOADER_ANIM);
        CoreLib.EventHandler.dispatchEvent("PLAY_FREESPIN_TRIGGERED_SOUND");
        this.triggerFeatureGameCore();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_DESKTOP_SETTINGS, false);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_BONUS_TRIGGERING_ANIM);
        // setTimeout(this.stopTriggeringWin.bind(this), 2100);
    }

    checkGameState() {
        if (slotModel.isFeatureTriggered() && !slotModel.promoFSData) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.DISABLE_ALL_BUTTONS);
            setTimeout(this.triggerFeatureGame.bind(this), 500);
        } else if (slotModel.promoFSData && !slotModel.isFeatureTriggered()) {
            setTimeout(this.showPromoFSTrigger.bind(this), 250);
        } else if (slotModel.promoFSData && slotModel.isFeatureTriggered()) {
            CoreLib.EventHandler.dispatchEvent("SHOW_WIN_PANEL_IN_FS");
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.DISABLE_ALL_BUTTONS);
            setTimeout(this.triggerFeatureGame.bind(this), 2000);
        } else {
            this.activateControls();
        }
    }

    initiateBonusGame() {
        if (this.userEntered) {
            this.triggerFeatureGame();
        }
    }

    playNextFreespin() {
        setTimeout(() => {
            super.playNextFreespin();
        }, 300)
    }

    playNextFreespinNow() {
        if (!slotModel.isMaxWinCrossed()) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_ROUNDS);
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.START_SLOT_SPIN);
            slotModel.onSpinStart();
            CoreLib.WrapperService.requestBonusData(slotModel.getCurrentBonusName());
        } else {
            this.endFreeSpinSession();
        }
    }

    showBonusTriggerEnterPopup() {
        if (!CoreLib.Model.GameConfig.secondaryUILoaded) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_ASSETS_LOADER_ANIM);
            CoreLib.Model.GameConfig.bonusGameInWaiting = true
            return;
        }
        this.enteredIntoFS = true
        CoreLib.EventHandler.dispatchEvent("SHOW_TRANSITION_ANIM", "ENTRY");
        setTimeout(() => {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_ROUNDS);
        }, 1200)
        return;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.HIDE_ASSETS_LOADER_ANIM);
        CoreLib.EventHandler.dispatchEvent("PLAY_FS_ENTRY_BANNER_SOUND");
        if (slotModel.getFeatureType() == CoreLib.Model.GameConfig.featureTypes.freespins) {
            let msgObj = {};
            let data = slotModel.getFeatureData();
            CoreLib.EventHandler.dispatchEvent("PLAY_ON_INTRO_TRIGGER");
            msgObj.title = CoreLib.Util.getContent("congratText");
            msgObj.message1 = CoreLib.Util.getContent("youwonText");
            msgObj.message3 = data.totalCount;
            msgObj.message2 = CoreLib.Util.getContent("numberOfFS");
            msgObj.callbankFunc = this.onBonusEnterDoneClicked.bind(this);
            msgObj.bgType = 1;
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_MAINGAME_BG_MUSIC);
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_MESSAGE_POPUP, msgObj);
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.INITIATE_BONUS_ROUND);
        }
    }
    onBonusEnterDoneClicked() {
        if (slotModel.getFeatureType() == CoreLib.Model.GameConfig.featureTypes.select) {
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_SELECT_BONUS);
        }
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_ROUNDS);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.HIDE_MESSAGE_POPUP);
    }

    endFreespinRoundFromPopup() {
        this.transitionAnim = true;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.HIDE_MESSAGE_POPUP);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.UPDATE_BALANCE);

        CoreLib.EventHandler.dispatchEvent("START_MG_BG_MUSIC");
        CoreLib.EventHandler.dispatchEvent("PLAY_FS_OUTRO_POPUP_CLICK_SOUND");
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_END);
        CoreLib.EventHandler.dispatchEvent("PLAY_CAISHEN_ANIM", { animationState: "cishen_INTRO_coins_1", loop: false })
        CoreLib.EventHandler.dispatchEvent("SLOTPANEL_CLICK_STATE", false);

        let flag = this.checkFSExitGameLevel();
        if (flag) {
            // PROMO_FS: AFTER FREE SPIN END
            if (slotModel.isPromoFSAvailable()) {
                if (slotModel.getPromoFSSession()) {
                    let data = slotModel.getPromoFSData();
                    if (data.remainingPlayCount == 0) {
                        this.endPromoFS();
                    } else {
                        setTimeout(() => {
                            this.playNextPromoFreeSpin();
                        }, 2500);
                        // CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_MAINGAME_BG);
                    }
                }
            } else {
                setTimeout(() => {
                    this.continueToMGAfterFS();
                }, 1000);
            }
        }
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_FREESPIN_BG_MUSIC);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.START_MAINGAME_BG_MUSIC);
        setTimeout(() => {
            CoreLib.EventHandler.dispatchEvent("UPDATE_REEL_UI_FOR_FS_END");
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_MAINGAME_BG);
        }, 800);
    }
    endFreeSpinSession() {
        slotModel.setFreespinSession(false);
        let totalfswin = CoreLib.WrapperService.formatCurrency(slotModel.getTotalFreespinWin());
        let msgObj = {};
        msgObj.title = CoreLib.Util.getContent("congratText");
        msgObj.message1 = CoreLib.Util.getContent("youwonText");
        msgObj.message3 = totalfswin;
        let str = CoreLib.Util.getContent("fromFSWinTxt");
        msgObj.message2 = str;
        msgObj.popupType = "outro";
        msgObj.bgType = 2;
        msgObj.callbankFunc = this.endFreespinRoundFromPopup.bind(this);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_MESSAGE_POPUP, msgObj);
        //this.checkForFeatureGame();
    }

    exitSpinWinAmount() {
        let winLines = slotModel.getWinLines() || [];
        if (!winLines.length) {
            this.spinWinSymbolDone = true;
        }
        super.exitSpinWinAmount();
    }
    onStakeChange(betPos) {
        super.onStakeChange(betPos);
        CoreLib.EventHandler.dispatchEvent("SLOTPANEL_CLICK_STATE", false);
    }
    exitLineWin() {
        CoreLib.Model.GameConfig.lineWinIndex++;
        if (CoreLib.Model.GameConfig.lineWinIndex > slotModel.getWinLines().length - 1) {
            CoreLib.Model.GameConfig.lineWinIndex = -1;
        } else {

        }
        this.enterLineWin();

    }
}
