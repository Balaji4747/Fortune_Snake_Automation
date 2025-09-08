// import { LibView } from "../../pixiwrapper/LibView";
// import { CoreLib } from "../../core/CoreLib";
// import { slotModel } from "../../models/SlotModel";
// import { soundFactory } from '../../sound/SoundFactory'
// import { UIUtil } from "../../pixiwrapper/UIUtilService";

import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { LibView } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibView";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";
import { soundFactory } from "../../../../../../../../Microslots-FE-SlotCore/corelib/sound/SoundFactory";


const STATE_SPIN = "SPIN";
const STATE_STOPSPIN = "STOPSPIN";
const STATE_DISABLE = "DISABLE";
let textConfig = { name: "tText", type: "Text", style: "buyBonusFontStyle", fontSize: 20, inactiveTextColor: 0xffffff, activeTextColor: 0x000000 }

export class MPSlotPanelComp extends LibView {
    constructor(config, layoutconfig) {
        super(config, layoutconfig);
        this.winDelayTimeout = 1000;
        this.panelBG = this.elementsList["panelBG"];
        this.panelBG = this.elementsList["panelBG"];
        this.panelBG.visible = false;

        // this.messageTextComp = this.elementsList["messageTextComp"]
        this.balanceComp = this.elementsList["balanceComp"];
        // CoreLib.Model.GameConfig.messageTextComp = this.messageTextComp;
        this.stakeComp = this.elementsList["stakeComp"];

        this.menuBtn = this.elementsList["menuBtn"];
        this.menuBtn.addInteraction(this.onMenuClicked.bind(this));
        this.menuComponents = this.elementsList["menuComponents"];
        this.menuComponents.on("SOUND_STATE_CHANGED", this.onSoundStateChanged.bind(this));
        this.spinState = STATE_DISABLE;
        this.spinBtn = this.elementsList["spinBtn"];
        this.spinBtn.addInteraction(this.onSpinClicked.bind(this));
        this.autospinBtn = this.elementsList["autospinBtn"];
        this.autospinBtn.addInteraction(this.onAutoSpinClicked.bind(this));
        this.autoStopBtn = this.elementsList["autoStopBtn"];
        this.autoStopBtn.addInteraction(this.onAutoStopClicked.bind(this));
        this.turboBtn = this.elementsList["turboBtn"];
        this.turboBtn.addInteraction(this.onTurboOnClicked.bind(this));
        this.turboSelectedBtn = this.elementsList["turboSelectedBtn"];
        this.turboSelectedBtn.addInteraction(this.onTurboOffClicked.bind(this));

        this.soundOnBtn = this.elementsList["soundOnBtn"];
        this.soundOffBtn = this.elementsList["soundOffBtn"];
        this.soundOnBtn.setEnabled(true);
        this.soundOnBtn.addInteraction(this.onSoundOnClicked.bind(this));
        this.soundOffBtn.visible = false;
        this.soundOffBtn.setEnabled(true);
        this.soundOffBtn.addInteraction(this.onSoundOffClicked.bind(this));

        this.fullScreenBtn = this.elementsList["fullScreenBtn"];
        this.fullScreenBtn.addInteraction(this.onFullScreenClicked.bind(this));
        this.fullScreenBtn.setEnabled(true);
        this.fullScreenBtn.visible = true;
        this.smallScreenBtn = this.elementsList["smallScreenBtn"];
        this.smallScreenBtn.addInteraction(this.onSmallScreenClicked.bind(this));
        this.smallScreenBtn.setEnabled(true);
        this.smallScreenBtn.visible = false;
        if (CoreLib.Model.DeviceConfig.isDevice) {
            this.removeChild(this.fullScreenBtn);
            this.removeChild(this.smallScreenBtn);
        }

        this.exitBtn = this.elementsList["exitBtn"];
        this.exitBtn.addInteraction(this.onExitClicked.bind(this));
        this.exitBtn.setEnabled(true);

        this.settingsBtn = this.elementsList["settingsBtn"];
        this.settingsBtn.addInteraction(this.onSettingBtnClicked.bind(this));
        this.settingsBtn.setEnabled(true);

        this.cheatBtn = this.elementsList["cheatBtn"];
        this.cheatBtn.addInteraction(this.onCheatBtnClicked.bind(this));
        this.cheatBtn.setEnabled(true);
        if (!slotModel.getIsDevMode()) {
            this.removeChild(this.cheatBtn);
            this.removeChild(this.settingsBtn);
        }


        this.buyBonusBtn = this.elementsList["buyBonusBtn"];

        this.autoCounterBG = this.elementsList["autoCounterBG"];
        this.autoCounterText = this.elementsList["autoCounterText"];
        this.autoCounterBG.addChild(this.autoCounterText);
        // CoreLib.UIUtil.setPosition(this.autoCounterText, this.autoCounterBG.width / 2, this.autoCounterBG.height / 2);
        this.autoCounterBG.visible = false;
        this.autoCounterBG.stopAllAnimation();
        this.autoCounterText.text = "";
        this.isFreeSpinSession = false;

        // promo fs --------------------------
        if (slotModel.isPromoFSAvailable()) {
            let config1 = {
                name: "promoFSSpinBtn", type: "Comp", class: "PromoFSSpinButton",
                Elements: [
                    { name: "centerRed", type: "Spine", spineName: "center_red", defaultState: "wild_idle", loop: true },
                    { name: "character", type: "Spine", spineName: "character", defaultState: "wild_idle", loop: true },
                    { name: "circle", type: "Spine", spineName: "circle", defaultState: "wild_idle", loop: true },
                    { name: "giftFSText", type: "Spine", spineName: "gift_free_spin_text", defaultState: "wild_idle", loop: true },
                ]
            }

            this.promoFSSpinBtn = CoreLib.UIUtil.getElement(config1);
            this.addChild(this.promoFSSpinBtn);
            this.promoFSSpinBtn.visible = false;

            let config2 = {
                name: "promoFSCountComp", type: "Comp", class: "PromoFSCountComp",
                Elements: [
                    { name: "promoFSCountBg", type: "Sprite", image: "promoFScountBg" },
                    { name: "giftBoxAnim", type: "Spine", spineName: "gift_box_2", defaultState: "gift_Idle", loop: true, x: 137, y: 53, scale: 0.3 },
                    {
                        name: "promoFSCount",
                        type: "Text",
                        content: "",
                        style: "commonFontStyle",
                        anchor: { x: 0.5, y: 0.5 },
                        fontSize: 40,
                        x: 193, y: 53
                    },
                ]
            }
            this.promoFSCountComp = CoreLib.UIUtil.getElement(config2);
            this.addChild(this.promoFSCountComp);
            this.promoFSCountComp.visible = false;

            let config3 = {
                name: "promoFSTotalWinComp", type: "Comp", class: "PromoFSTotalWinComp",
                Elements: [
                    { name: "clickBG", type: "Sprite", image: "winbg_promofs" },
                    { name: "valueText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 40, mFontSize: 55, anchor: { x: 0.5, y: 0.5 } }
                ]
            }
            this.promoFSTotalWinComp = CoreLib.UIUtil.getElement(config3);
            this.addChild(this.promoFSTotalWinComp);
            this.promoFSTotalWinComp.visible = false;

            let config4 = {
                name: "promoFSSpinWinComp", type: "Comp", class: "PromoFSSpinWinComp",
                Elements: [
                    { name: "coinShower1", type: "Spine", spineName: "coins_fountan", defaultState: "animation", loop: false },
                    { name: "clickBG", type: "Graphics", width: 200, height: 50, color: 0x00ff00, alpha: 0 },
                    { name: "valueText", type: "Text", contentText: "", style: "promoFSSpinWinStyle", fontSize: 50, anchor: { x: 0.5, y: 0.5 } },
                    { name: "coinShower2", type: "Spine", spineName: "coins_fountan", defaultState: "animation", loop: false },
                ]
            }
            this.promoFSSpinWinComp = CoreLib.UIUtil.getElement(config4);
            this.addChild(this.promoFSSpinWinComp);
            this.promoFSSpinWinComp.visible = false;
        }
        //------------------------------------

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.ACTIVATE_GAME, this.activateButtons.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_SLOTPANEL, this.showPanel.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_SLOTMACHINE_AND_PANEL, this.showPanel.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SET_INITIAL_VALUES, this.setInitialValues.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_BET_BALANCE, this.updateBetBalance.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_BALANCE, this.updateBalance.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_BETDEDUCTED_BALANCE, this.updateBalanceForBetDeduction.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_BET_VALUE, this.updateBet.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.DISABLE_ALL_BUTTONS, this.disableButtons.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.ENTER_SPINWIN_STATE, this.enterSpinWinState.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_LINE_WIN, this.showLineWin.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.CLEAR_GAME_FOR_SPIN, this.clearGameForSpin.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_AUTOSPIN_START, this.updateUIForAutospinStart.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_AUTOSPIN_END, this.updateUIForAutospinEnd.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_AUTOSPIN_END_FORCE, this.updateUIForAutospinEndForce.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_AUTOSPIN_COUNT, this.updateUIForAutospinCount.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.START_STOPPING_REELS, this.onSpinResponseReceived.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.HIDE_SPINSTOP_BUTTON, this.hideStopSpin.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_START, this.updateUIForFSStart.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_END, this.updateUIForFSEnd.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_ROUNDS, this.updateUIForFSRounds.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.LOCALDATA_STATE_CHANGE, this.onSoundStateChanged.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_PROMO_FS_START, this.updateUIForPromoFSStart.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_PROMO_FS_ROUNDS, this.updateUIForPromoFSRounds.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_PROMO_FS_END, this.updateUIForPromoFSEnd.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_WIN_PANEL_BG, this.showWinPanelBg.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.HIDE_WIN_PANEL_BG, this.HideWinPanelBg.bind(this));
        //CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.TO_CHECK_FULL_SCREEN, this.swapZoomBtns.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_PAYTABLE, this.onMenuClicked.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_HISTORY, this.onMenuClicked.bind(this));
        CoreLib.EventHandler.addEventListener("SLOTPANEL_CLICK_STATE", this.onClickStateChange.bind(this));
        CoreLib.EventHandler.addEventListener("UPDATE_WIN_MULTIPLIER_VALUE", this.updateAfterMultiplierBlust.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.TRANSITION_ANIM_START, this.onTransitionAnimStart.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.TRANSITION_ANIM_END, this.onTransitionAnimEnd.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_BUY_BONUS_DIALOGUE, this.onBuyBonusDialogueOpened.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.HIDE_BUY_BONUS_DIALOGUE, this.onBuyBonusDialogueClosed.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_BET_SELECTION_DIALOGUE, this.onBetDialogueOpened.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.HIDE_BET_SELECTION_DIALOGUE, this.onBetDialogueClosed.bind(this));

        CoreLib.EventHandler.addEventListener("SHOW_WIN_PANEL_IN_FS", this.showWinPanelInFS.bind(this));

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.ENTER_SPINWIN_STATE, this.disableStakeButton.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.EXIT_SPINWIN_STATE, this.disableStakeButton.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_LINE_WIN, this.disableStakeButton.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.CLEAR_GAME_FOR_SPIN, this.disableStakeButton.bind(this));
        CoreLib.EventHandler.addEventListener("REMOVE_LAST_SPIN_WIN", this.clearLastSpinWin.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.ENTER_SPINWIN_STATE, this.updateCascadeTotalbet.bind(this));
        CoreLib.EventHandler.addEventListener("ON_TRANSITION_ANIM_DONE", this.updateUIForFSStart.bind(this));
        // this.winComp.updateWin(0);
        this.onTurboOffClicked();
        this.updateUIForFSEnd();
        this.updateUIForAutospinEnd();
        this.setSoundInitialStates();
        this.menuComponents.visible = false;


        this.addKeyEvent();
        this.onTransitionAnimEnd();

        this.reelPositionMap = [
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

        this.addStageClickEvent();
        this.setStageClickState(true);
        this.updateButtonStates(false);
        setTimeout(this.checkBuyBonus.bind(this), 0);
    }

    onTransitionAnimStart() {
        this.transitionAnimPlay = true;
    }

    onTransitionAnimEnd() {
        this.transitionAnimPlay = false;
    }

    onBuyBonusDialogueOpened() {
        this.buyBonusDialogueOpened = true;
    }

    onBuyBonusDialogueClosed() {
        this.buyBonusDialogueOpened = false;
    }

    onBetDialogueOpened() {
        this.betDialogueOpened = true;
    }

    onBetDialogueClosed() {
        this.betDialogueOpened = false;
    }

    checkBuyBonus() {
        if (!slotModel.getIsBuyBonusAvailable()) {
            this.removeChild(this.buyBonusBtn);
        } else {
            this.addChild(this.buyBonusBtn);
            let buyBonusText = CoreLib.UIUtil.getElement(textConfig);
            buyBonusText.text = CoreLib.Util.getContent("buyBonusTitle");
            buyBonusText.anchor.set(0.5, 0.5)
            if (CoreLib.Model.GameInfo.language == "en") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 23);
                CoreLib.UIUtil.updateWordWrapWidth(buyBonusText, 110);
            } else if (CoreLib.Model.GameInfo.language == "zh" || CoreLib.Model.GameInfo.language == "zh_hant") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 34);
            } else if (CoreLib.Model.GameInfo.language == "ms") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 23);
                CoreLib.UIUtil.updateWordWrapWidth(buyBonusText, 110);
            } else if (CoreLib.Model.GameInfo.language == "id") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 23);
                CoreLib.UIUtil.updateWordWrapWidth(buyBonusText, 110);
            } else if (CoreLib.Model.GameInfo.language == "th") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 34);
                CoreLib.UIUtil.updateTextLineHeight(buyBonusText, 40);
                CoreLib.UIUtil.updateWordWrapWidth(buyBonusText, 90);
            } else if (CoreLib.Model.GameInfo.language == "fil") {
                CoreLib.UIUtil.updateTextLineHeight(buyBonusText, 22);
            } else if (CoreLib.Model.GameInfo.language == "hi" || CoreLib.Model.GameInfo.language == "bn") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 28);
            } else if (CoreLib.Model.GameInfo.language == "vi") {
                CoreLib.UIUtil.updateTextSize(buyBonusText, 18);
                CoreLib.UIUtil.updateWordWrapWidth(buyBonusText, 95);
            }
            // CoreLib.UIUtil.updateWordWrapWidth(buyBonusText, 110);
            // removed buy bonus text x and y instead of made text anchor 0.5 
            this.buyBonusBtn.addChild(buyBonusText);
            this.buyBonusBtn.setEnabled(true);
            this.buyBonusBtn.addInteraction(this.onBuyBonusBtnClicked.bind(this));
        }
    }
    onClickStateChange(flag) {
        this.setStageClickState(flag);
    }
    addStageClickEvent() {
        this.backdrop = UIUtil.getRectangle(UIUtil.getGameWidth(), UIUtil.getGameHeight(), 0xffff00);
        this.addChildAt(this.backdrop, 0);
        UIUtil.addInteraction(this.backdrop, this.onStageClick.bind(this));
        this.backdrop.alpha = 0;
        this.setStageClickState(false);
    }
    setStageClickState(flag) {
        if (slotModel.getIsFreespinSession() || slotModel.getPromoFSSession() || slotModel.getIsAutoSession() || slotModel.isFeatureTriggered()) {
            flag = true;
        }
        this.backdropActiveState = flag;
        UIUtil.setClickable(this.backdrop, flag);
        this.backdrop.visible = flag;
        this.backdrop.buttonMode = false;
    }
    onStageClick() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STAGE_CLICKED);
        if (slotModel.isFreeSpinSession && slotModel.isReelSpinning && this.spinState == STATE_STOPSPIN) {
            this.spinState = STATE_DISABLE;
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_SPIN_CLICKED);
        }
        if (this.menuComponents.visible) {
            this.onMenuClicked();
        }
    }

    showWinPanelBg() {
        this.panelBG.visible = true;
    }

    adjustAutoCounterText() {
        //this.autoCounterText.scale.set(1);
        /*const btnWidth = 200 * 0.9;
        if (this.autoCounterText.width > btnWidth) {
            const sc = (btnWidth) / this.autoCounterText.width;
            this.autoCounterText.scale.set(sc);
        }*/
    }

    HideWinPanelBg() {
        if (slotModel.getIsFreespinSession()) {
            this.panelBG.visible = true;
        } else {
            this.panelBG.visible = false;
        }
    }

    swapZoomBtns(val) {
        if (val == false) {
            this.smallScreenBtn.visible = false;
            this.fullScreenBtn.visible = true;
        } else {
            this.smallScreenBtn.visible = true;
            this.fullScreenBtn.visible = false;
        }
    }

    setSoundInitialStates() {
        soundFactory.setAmbientState(CoreLib.Model.GameConfig.ambientSoundState);
        soundFactory.setFXState(CoreLib.Model.GameConfig.fxSoundState);
        if (this.introSetting) {
            this.introSetting.setStaticState(CoreLib.Model.GameConfig.splashState);
        }
        this.onSoundStateChanged();

    }
    onFullScreenClicked() {
        this.smallScreenBtn.visible = true;
        this.fullScreenBtn.visible = false;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.DO_FULLSCREEN);
    }
    onSmallScreenClicked() {
        this.smallScreenBtn.visible = false;
        this.fullScreenBtn.visible = true;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.EXIT_FULLSCREEN);
    }
    onExitClicked() {
        CoreLib.WrapperService.navigateToHome();
    }

    onCheatBtnClicked() {
        window.cheatBtnClicked(CoreLib.Model.DeviceConfig.isDesktop);
    }

    onSettingBtnClicked() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.DESKTOP_SETTINGS_CLICKED);
        this.hideMobileButtons();
    }

    addKeyEvent() {
        let that = this;
        $(document).on("keypress", function (e) {
            e = e || window.event;
            that.onKeyPress(e.keyCode);
        });
        $(document).on("keydown", function (e) {
            e = e || window.event;
            that.onKeyDown(e.keyCode);
        });
    }
    onKeyDown(code) {
        if (code == 122) {
            CoreLib.EventHandler.dispatchEvent("F11_PRESSED")
        }
    }

    onKeyPress(code) {
        if (this.betDialogueOpened) {
            return;
        }
        if (this.isPromoFreeSpinSession) {
            return;
        }
        if (this.transitionAnimPlay) {
            return;
        }
        if (this.buyBonusDialogueOpened) {
            return;
        }
        if (this.isFreeSpinSession) {
            return;
        }
        if (CoreLib.Model.GameConfig.isAlertVisible) {
            return;
        }
        if (code == 32 || code == 13) {
            if (this.spinState == STATE_SPIN) {
                this.onSpinClicked();
            } else if (this.spinState == STATE_STOPSPIN) {
                this.onStopSpinClicked();
            }
        }
    }
    updateUIForAutospinStart() {
        this.autoStopBtn.setEnabled(true);
        this.autospinBtn.visible = false;
        this.autoStopBtn.visible = true;
        this.spinBtn.visible = false;
        this.autoCounterBG.showAutoCounter();
        this.autoCounterBG.visible = true;
        this.autoCounterText.visible = true;
        this.stakeComp.disable();
    }
    updateUIForAutospinEnd() {
        this.autospinBtn.visible = true;
        this.autoStopBtn.visible = false;
        this.autoStopBtn.setEnabled(false);
        this.spinBtn.visible = true;
        if (!this.isFreeSpinSession) {
            this.autoCounterBG.visible = false;
            this.autoCounterText.visible = false;
            this.autoCounterBG.stopAllAnimation();
        }
        this.stakeComp.enable();
    }
    updateUIForAutospinEndForce() {
        this.autospinBtn.visible = true;
        this.autoStopBtn.visible = false;
        this.autoStopBtn.setEnabled(false);
        this.spinBtn.visible = true;
        if (!this.isFreeSpinSession) {
            this.autoCounterBG.visible = false;
            this.autoCounterText.visible = false;
            this.autoCounterBG.stopAllAnimation();
        }

    }
    updateUIForAutospinCount(num) {
        this.updateUIForAutospinStart();
        this.autoCounterText.text = num;
        this.adjustAutoCounterText();
    }

    showWinPanelInFS() {
        this.balanceComp.visible = false;
        this.promoFSSpinBtn.visible = false;
        this.promoFSCountComp.visible = false;
        this.promoFSTotalWinComp.visible = true;
        this.promoFSSpinWinComp.visible = false;
        CoreLib.EventHandler.dispatchEvent("UPDATE_PROMO_FS_WIN");
        CoreLib.EventHandler.dispatchEvent("UPDATE_CASCADE_FS_WIN");
    }

    updateUIForFSStart() {
        this.spinBtn.visible = true;
        this.isFreeSpinSession = true;
        if (slotModel.getPromoFSSession()) {
            this.balanceComp.visible = false;
            this.promoFSSpinBtn.visible = false;
            this.promoFSCountComp.visible = false;
            this.promoFSTotalWinComp.visible = true;
            this.promoFSSpinWinComp.visible = false;
        } else {
            this.balanceComp.visible = true;
            if (slotModel.getPromoFSSession()) {
                this.promoFSSpinBtn.visible = false;
                this.promoFSCountComp.visible = false;
                this.promoFSTotalWinComp.visible = false;
                this.promoFSSpinWinComp.visible = false;
            }
        }
        this.autospinBtn.visible = true;


        this.spinBtn.visible = true;
        this.autoCounterBG.visible = false;
        this.autoCounterText.visible = false;
        this.stakeComp.disable();

    }
    updateUIForFSEnd() {
        this.isFreeSpinSession = false;

        if (slotModel.isPromoFSAvailable()) {
            this.spinBtn.visible = false;
            this.promoFSSpinBtn.visible = true;
            this.promoFsCountCompResizePos();
            this.promoSpinBtnPosOnResize();
            this.promoFSCountComp.visible = true;
            this.promoFSTotalWinComp.visible = true;
            this.promoFSSpinWinComp.visible = true;
            this.autospinBtn.visible = false;
            this.balanceComp.visible = false;
            // this.winComp.visible = true;
            // this.fsWinComp.visible = false;
            // this.autoCounterBG.showFSCounter();
            // this.autoCounterBG.visible = true;
            this.autoCounterText.visible = false;
            this.stakeComp.disable();
            this.showPromoFsWinAnimAfterBonusGame();
        } else {
            this.spinBtn.visible = true;
            // this.winComp.visible = true;
            this.autospinBtn.visible = true;
            this.balanceComp.visible = true;
            if (CoreLib.Model.GameConfig.cascadeGame & !CoreLib.Model.GameConfig.megaWaysGame) {
                this.balanceComp.updateBalance(slotModel.getBalance());
            }

            if (slotModel.isPromoFSAvailable()) {
                this.promoFSSpinBtn.visible = false;
                this.promoFSCountComp.visible = false;
                this.promoFSTotalWinComp.visible = false;
                this.promoFSSpinWinComp.visible = false;
            }
            // this.fsWinComp.visible = false;
            this.autoCounterBG.visible = false;
            this.autoCounterText.visible = false;
            this.autoCounterBG.stopAllAnimation();
            this.stakeComp.enable();
            // this.fsWinComp.updateWin(0);

        }
    }
    updateUIForFSRounds() {
        this.isFreeSpinSession = true;
        if (slotModel.getPromoFSSession()) {
            this.balanceComp.visible = false;
            this.promoFSSpinBtn.visible = false;
            this.promoFSCountComp.visible = false;
            this.promoFSTotalWinComp.visible = true;
            this.promoFSSpinWinComp.visible = false;
        } else {
            this.balanceComp.visible = true;
            if (slotModel.isPromoFSAvailable()) {
                this.promoFSSpinBtn.visible = false;
                this.promoFSCountComp.visible = false;
                this.promoFSTotalWinComp.visible = false;
                this.promoFSSpinWinComp.visible = false;
            }
        }
        // let data = slotModel.getFeatureData();
        // if (CoreLib.Model.GameConfig.megaWaysGame) {
        //     this.autoCounterText.text = (data.currentRound + 1) + "/" + data.totalRounds;
        // } else {
        //     this.autoCounterText.text = (data.currentCount + 1) + "/" + data.totalCount;
        // }
        this.adjustAutoCounterText();
        this.stakeComp.disable();
    }

    //promofs counter on Spin Btn ------ 
    updateUIForPromoFSStart() {
        this.isPromoFreeSpinSession = true;
        this.disableButtons();
        this.promoFSSpinBtn.visible = true;
        this.spinBtn.visible = false;
        this.autospinBtn.visible = false;
        this.balanceComp.visible = false;
        this.autoCounterBG.visible = false;
        this.autoCounterText.visible = false;
        this.stakeComp.disable();
        this.promoFSCountComp.visible = true;
        this.promoFSTotalWinComp.visible = true;
        this.promoFSSpinWinComp.visible = true;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_PROMO_FS_PANEL);
        CoreLib.EventHandler.dispatchEvent("UPDATE_PROMO_FS_WIN");
        CoreLib.EventHandler.dispatchEvent("UPDATE_CASCADE_FS_WIN");
    }

    updateUIForPromoFSEnd() {

        this.balanceComp.updateBalance(slotModel.getBalance());
        this.isPromoFreeSpinSession = false;
        this.activateButtons();
        this.promoFSSpinBtn.visible = false;
        this.spinBtn.visible = true;
        this.autospinBtn.visible = true;
        this.balanceComp.visible = true;
        // this.winComp.visible = true;
        // this.fsWinComp.visible = false;
        this.autoCounterBG.visible = false;
        this.autoCounterText.visible = false;
        this.autoCounterBG.stopAllAnimation();
        this.stakeComp.enable();
        // this.fsWinComp.updateWin(0);
        this.promoFSCountComp.visible = false;
        this.promoFSTotalWinComp.visible = false;
        this.promoFSSpinWinComp.visible = false;

    }

    updateUIForPromoFSRounds() {
        this.isPromoFreeSpinSession = true;
        this.disableButtons();
        this.promoFSSpinBtn.visible = true;
        this.spinBtn.visible = false;
        this.autospinBtn.visible = false;
        this.balanceComp.visible = false;
        this.autoCounterBG.stopAllAnimation();
        this.autoCounterBG.visible = false;
        this.autoCounterText.visible = false;
        this.stakeComp.disable();
        this.promoFSCountComp.visible = true;
        this.promoFSTotalWinComp.visible = true;
        this.promoFSSpinWinComp.visible = true;
        CoreLib.EventHandler.dispatchEvent("UPDATE_PROMO_FS_WIN");
    }
    // ------------------- 

    onTurboOnClicked() {
        this.onStageClick();
        this.turboBtn.visible = false;
        this.turboSelectedBtn.visible = true;
        CoreLib.Model.GameConfig.isTurboOn = true;
        this.hideMobileButtons();
    }
    onTurboOffClicked() {
        this.onStageClick();
        this.turboBtn.visible = true;
        this.turboSelectedBtn.visible = false;
        CoreLib.Model.GameConfig.isTurboOn = false;
        this.hideMobileButtons();
    }
    showPanel(flag) {
        this.visible = flag;
        setTimeout(this.resizeViewComponents.bind(this), 200);
    }

    disableButtons() {
        this.updateButtonStates(false);

    }

    disableStakeButton() {
        if (slotModel.isPromoFSAvailable()) {
            this.stakeComp.disable();
        }
    }

    activateButtons() {
        this.updateButtonStates(true);
        this.doOtherButtonsAnimation(false);
        this.setStageClickState(false);
    }
    updateButtonStates(flag) {
        this.spinBtn.setEnabled(flag);
        if (flag) {
            this.spinBtn.setEnabled(true);
            this.spinState = STATE_SPIN;
        } else {
            this.spinState = STATE_DISABLE;
            this.spinBtn.setEnabled(false);
        }
        this.autospinBtn.setEnabled(flag);
        if (this.buyBonusBtn) {
            this.buyBonusBtn.setEnabled(flag);
        }

        this.turboBtn.setEnabled(true);
        this.turboSelectedBtn.setEnabled(true);
        this.menuBtn.setEnabled(true);
        if (flag) {
            this.stakeComp.enable();
        } else {
            this.stakeComp.disable();
        }
        if (!slotModel.getIsAutoSession()) {
            //this.spinState = STATE_SPIN;
        }
    }
    onSpinClicked() {
        this.onStageClick();
        if (this.spinState == STATE_SPIN) {
            this.spinState = STATE_DISABLE;
            this.updateButtonStates(false);
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SPIN_CLICKED);
        } else if (this.spinState == STATE_STOPSPIN) {
            this.spinState = STATE_DISABLE;
            CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_SPIN_CLICKED);
        } else {

        }


    }
    onStopSpinClicked() {
        this.onStageClick();
        this.spinState = STATE_DISABLE;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_SPIN_CLICKED);
    }
    hideStopSpin() {
        if (this.spinState == STATE_STOPSPIN) {
            this.spinState = STATE_DISABLE;
        }
    }
    onSpinResponseReceived() {
        if (CoreLib.Model.GameConfig.isTurboOn || (slotModel.getIsAutoSession() && !slotModel.isFreeSpinSession) || slotModel.isSpinTimeFeatureTriggered()) {
            return;
        }
        this.spinState = STATE_STOPSPIN;
        this.spinBtn.setEnabled(true);

    }
    doOtherButtonsAnimation(flag) {
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isLandscape) {
                if (flag) {
                    this.buttonsHiddenForLS = true;
                    let xx = this.spinBtn.x + this.spinBtn.width / 2 - this.betBtn.width / 2;
                    let yy = this.spinBtn.y + this.spinBtn.height / 2 - this.betBtn.height / 2;
                    CoreLib.AnimationManager.animateTween(this.betBtn, 0.4, { x: xx, y: yy, alpha: 0, ease: Power2.easeIn });
                    CoreLib.AnimationManager.animateTween(this.menuBtn, 0.4, { x: xx, y: yy, alpha: 0, ease: Power2.easeIn });
                    this.menuBtn.setEnabled(false);
                    CoreLib.AnimationManager.animateTween(this.autospinBtn, 0.4, { x: xx, y: yy, alpha: 0, ease: Power2.easeIn });
                    CoreLib.AnimationManager.animateTween(this.autoStopBtn, 0.4, { x: xx, y: yy, alpha: 0, ease: Power2.easeIn });
                    CoreLib.AnimationManager.animateTween(this.turboBtn, 0.4, { x: xx, y: yy, alpha: 0, ease: Power2.easeIn });
                    CoreLib.AnimationManager.animateTween(this.turboSelectedBtn, 0.4, { x: xx, y: yy, alpha: 0, ease: Power2.easeIn, onComplete: this.spinTimeButtonAnimationDone.bind(this, true) });
                    this.buttonsHiddenForLS = true;
                } else {
                    if (this.buttonsHiddenForLS) {
                        this.betBtn.renderable = this.menuBtn.renderable = this.autospinBtn.renderable = this.autoStopBtn.renderable = this.turboBtn.renderable = this.turboSelectedBtn.renderable = true;
                        CoreLib.AnimationManager.animateTween(this.betBtn, 0.4, { x: this.betBtnPos.x, y: this.betBtnPos.y, alpha: 1, ease: Power2.easeIn });
                        CoreLib.AnimationManager.animateTween(this.menuBtn, 0.4, { x: this.menuBtnPos.x, y: this.menuBtnPos.y, alpha: 1, ease: Power2.easeIn });
                        CoreLib.AnimationManager.animateTween(this.autospinBtn, 0.4, { x: this.autospinBtnPos.x, y: this.autospinBtnPos.y, alpha: 1, ease: Power2.easeIn });
                        CoreLib.AnimationManager.animateTween(this.autoStopBtn, 0.4, { x: this.autospinBtnPos.x, y: this.autospinBtnPos.y, alpha: 1, ease: Power2.easeIn });
                        CoreLib.AnimationManager.animateTween(this.turboBtn, 0.4, { x: this.turboBtnPos.x, y: this.turboBtnPos.y, alpha: 1, ease: Power2.easeIn });
                        CoreLib.AnimationManager.animateTween(this.turboSelectedBtn, 0.4, { x: this.turboBtnPos.x, y: this.turboBtnPos.y, alpha: 1, ease: Power2.easeIn, onComplete: this.spinTimeButtonAnimationDone.bind(this, false) });
                        this.buttonsHiddenForLS = false;
                    }

                }
            }
        }

    }
    spinTimeButtonAnimationDone(flag) {
        if (flag) {
            this.betBtn.alpha = this.menuBtn.alpha = this.autospinBtn.alpha = this.autoStopBtn.alpha = this.turboBtn.alpha = this.turboSelectedBtn.alpha = 1;
            this.betBtn.renderable = this.menuBtn.renderable = this.autospinBtn.renderable = this.autoStopBtn.renderable = this.turboBtn.renderable = this.turboSelectedBtn.renderable = false;
        } else {

        }
    }
    onBuyBonusBtnClicked() {
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.BUY_BONUS_CLICKED);
        this.hideMobileButtons();
    }
    onAutoSpinClicked() {
        this.onStageClick();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.AUTOSPIN_CLICKED);
        this.hideMobileButtons();
    }
    onAutoStopClicked() {
        this.onStageClick();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.STOP_AUTOSPIN);
        this.hideMobileButtons();
    }
    onBetClicked() {
        this.onStageClick();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.BET_CLICKED);
        this.hideMobileButtons();
    }
    onMenuClicked() {
        this.menuComponents.visible = !this.menuComponents.visible;
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                if (this.menuComponents.visible == true) {
                    this.soundOnBtn.visible = false;
                    this.soundOffBtn.visible = false;
                } else {
                    if (!soundFactory.getAmbientState() && !soundFactory.getSFXState()) {
                        this.soundOffBtn.visible = true;
                        this.soundOnBtn.visible = false;
                    } else {
                        this.soundOffBtn.visible = false;
                        this.soundOnBtn.visible = true;
                    }
                }
            } else {
                if (this.menuComponents.visible == true) {

                } else {
                    if (!soundFactory.getAmbientState() && !soundFactory.getSFXState()) {
                        this.soundOffBtn.visible = true;
                        this.soundOnBtn.visible = false;
                    } else {
                        this.soundOffBtn.visible = false;
                        this.soundOnBtn.visible = true;
                    }
                }
            }
        } else {
            if (this.menuComponents.visible == true) {

            } else {
                if (!soundFactory.getAmbientState() && !soundFactory.getSFXState()) {
                    this.soundOffBtn.visible = true;
                    this.soundOnBtn.visible = false;
                } else {
                    this.soundOffBtn.visible = false;
                    this.soundOnBtn.visible = true;
                }
            }
        }

    }
    onSettingsClicked() {
        this.onStageClick();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.DESKTOP_SETTINGS_CLICKED);
    }
    onMSettingsClicked() {
        this.onStageClick();
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.SHOW_MOBILE_SETTINGS_DIALOGUE, true);
    }
    onSoundStateChanged() {
        this.onStageClick();
        if (!soundFactory.getAmbientState() && !soundFactory.getSFXState()) {
            this.soundOffBtn.visible = true;
            this.soundOnBtn.visible = false;
        } else {
            this.soundOffBtn.visible = false;
            this.soundOnBtn.visible = true;
        }
        this.menuComponents.setSoundButtonState();
    }
    onSoundOnClicked() {
        this.onStageClick();
        soundFactory.setAmbientState(false);
        soundFactory.setFXState(false);
        this.soundOffBtn.visible = true;
        this.soundOnBtn.visible = false;
        CoreLib.WrapperService.setAmbientState(soundFactory.getAmbientState());
        CoreLib.WrapperService.setFXState(soundFactory.getSFXState());
        this.menuComponents.setSoundButtonState();
    }
    onSoundOffClicked() {
        this.onStageClick();
        soundFactory.setAmbientState(true);
        soundFactory.setFXState(true);
        CoreLib.WrapperService.setAmbientState(soundFactory.getAmbientState());
        CoreLib.WrapperService.setFXState(soundFactory.getSFXState());
        this.soundOffBtn.visible = false;
        this.soundOnBtn.visible = true;
        this.menuComponents.setSoundButtonState();
    }
    showMobileMenu() {
        if (!this.ptVisible) {
            this.mobileMenus.visible = true;
            this.mobileMenus.alpha = 0;
            this.mobileMenus.y = this.ptYPos + 60;
            CoreLib.AnimationManager.animateTween(this.mobileMenus, 0.5, { alpha: 0.6, y: this.ptYPos, ease: Power2.easeOut });
            this.ptVisible = true;
        } else {
            this.ptVisible = false;
            CoreLib.AnimationManager.animateTween(this.mobileMenus, 0.5, { alpha: 0, y: this.ptYPos + 60, ease: Power2.easeOut, onComplete: this.onMobileButtonsHidden.bind(this) });
        }
    }
    hideMobileButtons() {
        if (this.ptVisible) {
            CoreLib.AnimationManager.animateTween(this.mobileMenus, 0.5, { alpha: 0, y: this.ptYPos + 60, ease: Power2.easeOut, onComplete: this.onMobileButtonsHidden.bind(this) });
        }
    }
    onMobileButtonsHidden() {
        this.ptVisible = false;
    }
    setInitialValues() {
        this.stakeComp.setBetsArray(slotModel.getBetLevels());
        this.stakeComp.enable();
    }
    updateBet() {
        this.stakeComp.updateBet(slotModel.getTotalBet(), slotModel.getBetPosition());
    }
    updateBetBalance() {
        this.stakeComp.updateBet(slotModel.getTotalBet(), slotModel.getBetPosition());
        this.balanceComp.updateBalance(slotModel.getBalance());
    }
    updateBalance() {
        if (CoreLib.Model.GameConfig.cascadeGame & !CoreLib.Model.GameConfig.megaWaysGame) {

        } else {
            this.balanceComp.updateBalance(slotModel.getBalance());
        }
    }
    updateCascadeTotalbet() {
        if (CoreLib.Model.GameConfig.cascadeGame & !CoreLib.Model.GameConfig.megaWaysGame) {
            if (!slotModel.isFeatureTriggered() && !slotModel.getIsFreespinSession()) {
                this.balanceComp.updateCascadeBalance(slotModel.getTotalCascadeWin());
            }
        }
    }

    updateBalanceForBetDeduction() {
        let newbalance = slotModel.getBetDeductedBalance();
        this.balanceComp.updateBalance(newbalance);
    }
    setSpinWinFalse() {
        this.isSpinWinShowing = false;
        clearTimeout(this.winDelayTimer);
        //this.clearLastSpinWin();
    }
    clearLastSpinWin() {
        // this.clearWinNow();
        // clearTimeout(this.winDelayTimer);
    }
    enterSpinWinState() {
        this.clearWinNow();
        this.isSpinWinShowing = true;
        clearTimeout(this.winDelayTimer);
        this.winDelayTimer = setTimeout(this.setSpinWinFalse.bind(this), this.winDelayTimeout);
        if (slotModel.cascadeData) {
            let win = slotModel.getTotalCascadeWin();
            // this.winComp.updateCascadeWin(win);

            if (slotModel.getPromoFSSession() && slotModel.getPromoFSSession() && !slotModel.isFreeSpinSession && !slotModel.isFeatureTriggered()) {
                if (CoreLib.Model.GameConfig.cascadeGame && !CoreLib.Model.GameConfig.megaWaysGame) {
                    if (!slotModel.isFeatureTriggered() && !slotModel.getIsFreespinSession()) {
                        this.promoFSSpinWinComp.updateWin(slotModel.getTotalCascadeWin());
                    }
                }
            }
        } else {
            let win = slotModel.getTotalWin();
            // this.winComp.updateWin(win);
            if (slotModel.getPromoFSSession() && !slotModel.isFreeSpinSession && !slotModel.isFeatureTriggered()) {
                this.promoFSSpinWinComp.updateWin(win);
            }
        }
        if (this.isFreeSpinSession) {
            if (CoreLib.Model.GameConfig.cascadeGame && !CoreLib.Model.GameConfig.megaWaysGame) {
                // this.fsWinComp.updateWin(slotModel.getCascadeFreeSpinWin(), slotModel.getFSMultiplier());
                // this.fsWinComp.updateCascadeTotalWin(slotModel.getCascadeTotalSpinWin());
            } else if (CoreLib.Model.GameConfig.megaWaysGame) {
                // this.fsWinComp.updateWin(slotModel.getCascadeFreeSpinWin(), slotModel.getFSMultiplier());
                // this.fsWinComp.updateTotalWin(slotModel.getCascadeTotalFreeSpinWin());
            } else {
                // this.fsWinComp.updateWin(slotModel.getFSSpinWin(), slotModel.getFSMultiplier());
                // this.fsWinComp.updateTotalWin(slotModel.getTotalFreespinWin());
                if (slotModel.getPromoFSSession()) {
                    this.promoFSSpinWinComp.updateWin(slotModel.getFSSpinWin());
                }
            }
        }
    }
    updateAfterMultiplierBlust() {
        if (this.isFreeSpinSession) {
            // this.fsWinComp.updateCascadeMultiplierTotalWin(slotModel.getCascadeEveryFreeSpinTotalWin());
        }
    }
    showLineWin() {
        let obj = slotModel.getCurrentWinLine();
        if (obj) {
            let wildWinCount = 0;
            let wildWin = false;
            if (CoreLib.Model.GameConfig.wildMultiplierWin) {
                let lineWin = this.convertPosition(obj.winningPosition);
                this.symbolsWinArr = this.getWinningSymbols(lineWin);
                for (let i = 0; i < this.symbolsWinArr.length; i++) {
                    if (this.symbolsWinArr[i] == "WD") {
                        wildWinCount++;
                        wildWin = true;
                    }
                }
            }
            let symbolLen = 0;
            if (this.symbolsWinArr) {
                symbolLen = this.symbolsWinArr.length;
            }
            let obj2 = slotModel.getCurrentWinMulitplierData();
            if (CoreLib.Model.GameConfig.wildWinPositionsGame) {
                if (obj2) {
                    // this.winComp.updateLineWin(wildWin, wildWinCount, symbolLen, obj, obj2);
                }
            } else {
                // this.winComp.updateLineWin(wildWin, wildWinCount, symbolLen, obj);
            }
        }

    }
    convertPosition(arr) {
        let result = [];
        let len = arr.length;
        for (let k = 0; k < len; k++) {
            result.push(this.reelPositionMap[arr[k]]);
        }
        return result;
    }
    getWinningSymbols(positions) {
        let symbs = [];
        let reelview = slotModel.getReelsView();
        let len = positions.length;
        for (let k = 0; k < len; k++) {
            symbs.push(reelview[positions[k].reel][positions[k].row]);
        }
        return symbs;
    }
    clearGameForSpin() {
        // Every manual spin/stop need to show the win amount for few sec replacing with the next win
        clearTimeout(this.winTimeoutId);
        if (this.isSpinWinShowing) {
            this.winTimeoutId = setTimeout(this.clearWinNow.bind(this), 500);
        } else {
            this.clearWinNow();
        }
        clearTimeout(this.winDelayTimer);
    }
    clearWinNow() {
        clearTimeout(this.winTimeoutId);
    }

    getHeight() {
        return 0;
    }

    visibilitySoundOnMenuBtn() {
        const isMenuVisible = this.menuComponents.visible;
        const isSoundOff = !soundFactory.getAmbientState() && !soundFactory.getSFXState();

        if (isMenuVisible) {
            if (CoreLib.Model.DeviceConfig.isDesktop || CoreLib.Model.DeviceConfig.isLandscape) {
                this.soundOnBtn.visible = !isSoundOff;
                this.soundOffBtn.visible = isSoundOff;
            } else {
                this.soundOnBtn.visible = false;
                this.soundOffBtn.visible = false;
            }
        } else {
            this.soundOnBtn.visible = !isSoundOff;
            this.soundOffBtn.visible = isSoundOff;
        }
    }

    resizeViewComponents() {
        super.resizeViewComponents();
        this.visibilitySoundOnMenuBtn()
        this.backdrop.width = UIUtil.getGameWidth();
        this.backdrop.height = UIUtil.getGameHeight();
        // this.messageTextComp.visible = false;
        this.spinBtn.showSpinBg(false)
        if (CoreLib.Model.DeviceConfig.isDesktop) {
            this.alignForDesktopLandscape();
        } else {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.spinBtn.showSpinBg(true)
                // this.messageTextComp.visible = true;
                this.alignForMobilePortrait();
            } else {
                this.alignForMobileLandscape();
            }
        }

    }
    alignForDesktopPortrait() {

    }
    alignForDesktopLandscape() {
        this.panelBG.scale.set(1);
        this.panelBG.width = UIUtil.getGameWidth();
        this.panelBG.x = 0;
        this.panelBG.y = UIUtil.getGameHeight() - this.panelBG.height;
        UIUtil.setPercentageScaleCustom(this.spinBtn, 0.12, 0.22, 1);
        this.spinBtn.x = this.spinBtn.btn.width * this.spinBtn.scale.x * 0.5 + UIUtil.getGameWidth() - this.spinBtn.btn.width * this.spinBtn.scale.x - UIUtil.getPercentageWidth(0.02);
        this.spinBtn.y = this.spinBtn.btn.height * this.spinBtn.scale.y * 0.5 + (UIUtil.getGameHeight() - this.spinBtn.btn.height * this.spinBtn.scale.y) / 2;
        UIUtil.setPercentageScaleCustom(this.autoCounterBG, 0.12, 0.22, 1);
        this.autoCounterBG.x = this.spinBtn.x;
        this.autoCounterBG.y = this.spinBtn.y;

        UIUtil.setPercentageScale(this.autospinBtn, 0.05, 0.09, 1);
        this.autospinBtn.x = this.spinBtn.x;
        this.autospinBtn.y = this.spinBtn.y + this.spinBtn.btn.height * this.spinBtn.scale.y * 0.5 + this.autospinBtn.btn.height * this.autospinBtn.scale.y * 0.5 + UIUtil.getPercentageHeight(0.03);
        UIUtil.setSameProps(this.autoStopBtn, this.autospinBtn);
        UIUtil.setPercentageScale(this.turboBtn, 0.05, 0.09, 1);
        this.turboBtn.x = this.spinBtn.x;
        this.turboBtn.y = this.spinBtn.y - (this.spinBtn.btn.height * this.spinBtn.scale.y * 0.5 + this.autospinBtn.btn.height * this.autospinBtn.scale.y * 0.5) - UIUtil.getPercentageHeight(0.03);
        UIUtil.setSameProps(this.turboSelectedBtn, this.turboBtn);

        UIUtil.setPercentageScale(this.menuBtn, 0.05, 0.09, 1);
        this.menuBtn.x = UIUtil.getGameWidth() - this.menuBtn.btn.width * this.menuBtn.scale.x * 0.5 - UIUtil.getPercentageWidth(0.01);
        this.menuBtn.y = UIUtil.getPercentageHeight(0.02) + this.menuBtn.btn.height * this.menuBtn.scale.y * 0.5;
        this.menuComponents.resetButtonPositions();
        this.menuComponents.scale.set(this.menuBtn.scale.x);
        this.menuComponents.x = this.menuBtn.x + this.menuBtn.btn.width * this.menuBtn.scale.x - this.menuComponents.width;
        this.menuComponents.y = this.menuBtn.y + this.menuBtn.btn.height * this.menuBtn.scale.y + UIUtil.getGameHeight() * 0.01;

        UIUtil.setPercentageScale(this.soundOnBtn, 0.05, 0.09, 1);
        this.soundOnBtn.x = this.menuBtn.x - this.soundOnBtn.btn.width * this.soundOnBtn.scale.x - UIUtil.getPercentageWidth(0.01);
        this.soundOnBtn.y = UIUtil.getPercentageHeight(0.02) + this.soundOnBtn.btn.height * this.menuBtn.scale.y * 0.5;
        UIUtil.setSameProps(this.soundOffBtn, this.soundOnBtn);

        UIUtil.setPercentageScale(this.fullScreenBtn, 0.05, 0.09, 1);
        this.fullScreenBtn.x = this.soundOnBtn.x - this.fullScreenBtn.btn.width * this.fullScreenBtn.scale.x - UIUtil.getPercentageWidth(0.01);
        this.fullScreenBtn.y = UIUtil.getPercentageHeight(0.02) + this.fullScreenBtn.btn.height * this.fullScreenBtn.scale.y * 0.5;

        UIUtil.setPercentageScale(this.smallScreenBtn, 0.05, 0.09, 1);
        this.smallScreenBtn.x = this.fullScreenBtn.x;
        this.smallScreenBtn.y = this.fullScreenBtn.y;

        UIUtil.setPercentageScale(this.exitBtn, 0.05, 0.09, 1);
        this.exitBtn.x = this.exitBtn.width * 0.5 + UIUtil.getPercentageWidth(0.01);
        this.exitBtn.y = this.exitBtn.height * 0.5 + UIUtil.getPercentageHeight(0.02);

        UIUtil.setPercentageScale(this.cheatBtn, 0.05, 0.09, 1);
        this.cheatBtn.x = this.exitBtn.x + this.cheatBtn.width + UIUtil.getPercentageWidth(0.01);
        this.cheatBtn.y = this.exitBtn.y;


        UIUtil.setPercentageScale(this.stakeComp, 0.14, 0.09, 1);
        this.stakeComp.x = UIUtil.getGameWidth() - this.stakeComp.width * 0.5 - UIUtil.getPercentageWidth(0.01);
        this.stakeComp.y = UIUtil.getGameHeight() - this.stakeComp.height * 0.5 - UIUtil.getPercentageHeight(0.02);

        UIUtil.setPercentageScale(this.balanceComp, 0.3, 0.14, 1);
        this.balanceComp.scale.set(this.exitBtn.scale.x)
        this.balanceComp.x = this.exitBtn.x - this.exitBtn.width / 2;
        this.balanceComp.y = UIUtil.getGameHeight() - this.stakeComp.height - UIUtil.getPercentageHeight(0.01);

        UIUtil.setPercentageScale(this.buyBonusBtn, 0.05, 0.09, 1);
        this.buyBonusBtn.x = UIUtil.getPercentageWidth(0.01) + this.buyBonusBtn.btn.width * this.buyBonusBtn.scale.x * 0.5;
        this.buyBonusBtn.y = this.balanceComp.y - this.buyBonusBtn.btn.height * this.buyBonusBtn.scale.y * 0.5 - UIUtil.getPercentageHeight(0.02);

        UIUtil.setPercentageScale(this.settingsBtn, 0.05, 0.09, 1);
        this.settingsBtn.x = this.buyBonusBtn.x;
        if (slotModel.getIsBuyBonusAvailable()) {
            this.settingsBtn.y = this.buyBonusBtn.y - this.settingsBtn.height - UIUtil.getPercentageHeight(0.02);
        } else {
            this.settingsBtn.y = this.buyBonusBtn.y;
        }

        // promo fs ui ---------------
        if (slotModel.isPromoFSAvailable()) {
            this.promoSpinBtnPosOnResize();

            UIUtil.setPercentageScale(this.promoFSCountComp, 0.15, 0.15, 1);
            this.promoFSCountComp.x = UIUtil.getGameWidth() - this.promoFSCountComp.width - UIUtil.getPercentageWidth(0.01);
            this.promoFSCountComp.y = this.stakeComp.y - this.stakeComp.height * 2;

            UIUtil.setPercentageScale(this.promoFSTotalWinComp, 0.3, 0.14, 1);
            this.promoFSTotalWinComp.scale.set(this.exitBtn.scale.x)
            this.promoFSTotalWinComp.x = this.exitBtn.x - this.exitBtn.width / 2;
            this.promoFSTotalWinComp.y = UIUtil.getGameHeight() - this.stakeComp.height - UIUtil.getPercentageHeight(0.01);

            UIUtil.setPercentageScale(this.promoFSSpinWinComp, 0.3, 0.14, 1);
            this.promoFSSpinWinComp.scale.set(this.exitBtn.scale.x)
            this.promoFSSpinWinComp.x = (this.promoFSTotalWinComp.width - this.promoFSSpinWinComp.width * 0.5) / 2;
            this.promoFSSpinWinComp.y = this.promoFSTotalWinComp.y - this.promoFSTotalWinComp.height * 0.5 - UIUtil.getPercentageHeight(0.01);
        }
    }

    alignForMobileLandscape() {
        this.panelBG.scale.set(1);
        this.panelBG.width = UIUtil.getGameWidth();
        this.panelBG.x = 0;
        this.panelBG.y = UIUtil.getGameHeight() - this.panelBG.height;
        UIUtil.setPercentageScaleCustom(this.spinBtn, 0.12, 0.26, 1);
        this.spinBtn.x = this.spinBtn.btn.width * this.spinBtn.scale.x * 0.5 + UIUtil.getGameWidth() - this.spinBtn.btn.width * this.spinBtn.scale.x - UIUtil.getPercentageWidth(0.02);
        this.spinBtn.y = this.spinBtn.btn.height * this.spinBtn.scale.y * 0.5 + (UIUtil.getGameHeight() - this.spinBtn.btn.height * this.spinBtn.scale.y) / 2;

        UIUtil.setPercentageScaleCustom(this.autoCounterBG, 0.12, 0.26, 1);
        this.autoCounterBG.x = this.spinBtn.x;
        this.autoCounterBG.y = this.spinBtn.y;
        UIUtil.setPercentageScale(this.autospinBtn, 0.06, 0.13, 1.5);
        this.autospinBtn.x = this.spinBtn.x;
        this.autospinBtn.y = this.spinBtn.y + this.spinBtn.btn.height * this.spinBtn.scale.y * 0.5 + this.autospinBtn.btn.height * this.autospinBtn.scale.y * 0.5 + UIUtil.getPercentageHeight(0.03);
        UIUtil.setSameProps(this.autoStopBtn, this.autospinBtn);
        UIUtil.setPercentageScale(this.turboBtn, 0.06, 0.13, 1.5);
        this.turboBtn.x = this.spinBtn.x;
        this.turboBtn.y = this.spinBtn.y - (this.spinBtn.btn.height * this.spinBtn.scale.y * 0.5 + this.autospinBtn.btn.height * this.autospinBtn.scale.y * 0.5) - UIUtil.getPercentageHeight(0.03);
        UIUtil.setSameProps(this.turboSelectedBtn, this.turboBtn);

        UIUtil.setPercentageScale(this.menuBtn, 0.06, 0.13, 1.5);
        this.menuBtn.x = UIUtil.getGameWidth() - this.menuBtn.btn.width * this.menuBtn.scale.x * 0.5 - UIUtil.getPercentageWidth(0.01);
        this.menuBtn.y = UIUtil.getPercentageHeight(0.02) + this.menuBtn.btn.height * this.menuBtn.scale.y * 0.5;

        this.menuComponents.resetButtonPositions();
        this.menuComponents.scale.set(this.menuBtn.scale.x);
        this.menuComponents.x = this.menuBtn.x + this.menuBtn.btn.width * this.menuBtn.scale.x - this.menuComponents.width;
        this.menuComponents.y = this.menuBtn.y + this.menuBtn.btn.height * this.menuBtn.scale.y + UIUtil.getGameHeight() * 0.01;

        UIUtil.setPercentageScale(this.soundOnBtn, 0.06, 0.13, 1.5);
        this.soundOnBtn.x = this.menuBtn.x - this.soundOnBtn.btn.width * this.soundOnBtn.scale.x - UIUtil.getPercentageWidth(0.01);
        this.soundOnBtn.y = UIUtil.getPercentageHeight(0.02) + this.soundOnBtn.btn.height * this.menuBtn.scale.y * 0.5;
        UIUtil.setSameProps(this.soundOffBtn, this.soundOnBtn);

        this.fullScreenBtn.visible = false;
        this.smallScreenBtn.visible = false;

        UIUtil.setPercentageScale(this.exitBtn, 0.06, 0.13, 1.5);
        this.exitBtn.x = this.exitBtn.width * 0.5 + UIUtil.getPercentageWidth(0.01);
        this.exitBtn.y = this.exitBtn.height * 0.5 + UIUtil.getPercentageHeight(0.02);

        UIUtil.setPercentageScale(this.cheatBtn, 0.06, 0.13, 1.5);
        this.cheatBtn.x = this.exitBtn.x + this.cheatBtn.width + UIUtil.getPercentageWidth(0.01);
        this.cheatBtn.y = this.exitBtn.y;

        this.balanceComp.scale.set(1);
        let hsc = this.exitBtn.btn.height * this.exitBtn.scale.y / this.balanceComp.height;
        this.balanceComp.scale.set(hsc);
        this.balanceComp.x = this.exitBtn.x - this.exitBtn.width / 2;
        this.balanceComp.y = UIUtil.getGameHeight() - this.balanceComp.height - UIUtil.getPercentageHeight(0.02);

        this.stakeComp.scale.set(this.balanceComp.scale.x);
        this.stakeComp.x = UIUtil.getGameWidth() - this.stakeComp.width * 0.5 - UIUtil.getPercentageWidth(0.01);
        this.stakeComp.y = UIUtil.getGameHeight() - this.stakeComp.height * 0.5 - UIUtil.getPercentageHeight(0.02);

        UIUtil.setPercentageScale(this.buyBonusBtn, 0.06, 0.13, 1.5);
        this.buyBonusBtn.x = UIUtil.getPercentageWidth(0.01) + this.buyBonusBtn.btn.width * this.buyBonusBtn.scale.x * 0.5;
        this.buyBonusBtn.y = this.balanceComp.y - this.buyBonusBtn.btn.height * this.buyBonusBtn.scale.y * 0.5 - UIUtil.getPercentageHeight(0.02);

        UIUtil.setPercentageScale(this.settingsBtn, 0.06, 0.13, 1.5);
        this.settingsBtn.x = this.buyBonusBtn.x;
        if (slotModel.getIsBuyBonusAvailable()) {
            this.settingsBtn.y = this.buyBonusBtn.y - this.settingsBtn.height - UIUtil.getPercentageHeight(0.02);
        } else {
            this.settingsBtn.y = this.buyBonusBtn.y;
        }

        // promo fs ui -------------------
        if (slotModel.isPromoFSAvailable()) {
            this.promoSpinBtnPosOnResize();

            this.promoFsCountCompResizePos();

            this.promoFSTotalWinComp.scale.set(1);
            let hsc1 = this.exitBtn.btn.height * this.exitBtn.scale.y / this.promoFSTotalWinComp.height;
            this.promoFSTotalWinComp.scale.set(hsc1);
            this.promoFSTotalWinComp.x = this.exitBtn.x - this.exitBtn.width / 2;
            this.promoFSTotalWinComp.y = UIUtil.getGameHeight() - this.promoFSTotalWinComp.height - UIUtil.getPercentageHeight(0.02);

            this.promoFSSpinWinComp.scale.set(hsc1);
            this.promoFSSpinWinComp.x = (this.promoFSTotalWinComp.width - this.promoFSSpinWinComp.width * 0.5) / 2;
            this.promoFSSpinWinComp.y = this.promoFSTotalWinComp.y - this.promoFSTotalWinComp.height * 0.5 - UIUtil.getPercentageHeight(0.01);
        }
    }
    alignForMobilePortrait() {

        UIUtil.setPercentageScaleCustom(this.spinBtn, 0.29, 0.14, 1.5);
        this.spinBtn.x = UIUtil.getGameWidth() / 2;
        this.spinBtn.y = UIUtil.getGameHeight() * 0.85;
        UIUtil.setPercentageScaleCustom(this.autoCounterBG, 0.29, 0.14, 1.5);
        this.autoCounterBG.x = this.spinBtn.x;
        this.autoCounterBG.y = this.spinBtn.y;

        // UIUtil.setPercentageScaleCustom(this.messageTextComp, 1, 1, 1);
        // this.messageTextComp.x = UIUtil.getGameWidth() / 2;
        // this.messageTextComp.y = this.spinBtn.y - this.spinBtn.height * 0.5 + this.messageTextComp.height * 0.55;

        UIUtil.setPercentageScale(this.turboBtn, 0.13, 0.06, 1.5);
        this.turboBtn.x = UIUtil.getGameWidth() * 0.03 + this.turboBtn.btn.width * this.turboBtn.scale.x * 0.5;
        if (slotModel.getIsBuyBonusAvailable() && !CoreLib.Model.GameConfig.cascadeGame) {
            this.turboBtn.y = this.spinBtn.y + this.turboBtn.btn.height * this.turboBtn.scale.y * 0.5 + UIUtil.getPercentageHeight(0.01);
        } else if (slotModel.getIsBuyBonusAvailable() && CoreLib.Model.GameConfig.cascadeGame && !CoreLib.Model.GameConfig.megaWaysGame) {
            this.turboBtn.y = this.spinBtn.y + this.turboBtn.btn.height * this.turboBtn.scale.y * 0.5 + UIUtil.getPercentageHeight(0.04);
        } else {
            this.turboBtn.y = this.spinBtn.y - this.turboBtn.height * 0;
        }

        UIUtil.setSameProps(this.turboSelectedBtn, this.turboBtn);

        UIUtil.setPercentageScale(this.autospinBtn, 0.13, 0.06, 1.5);
        this.autospinBtn.x = UIUtil.getGameWidth() - this.autospinBtn.btn.width * this.autospinBtn.scale.x * 0.5 - UIUtil.getPercentageWidth(0.03);
        this.autospinBtn.y = this.spinBtn.y - this.turboBtn.height * 0;
        UIUtil.setSameProps(this.autoStopBtn, this.autospinBtn);


        UIUtil.setPercentageScale(this.buyBonusBtn, 0.13, 0.06, 1.5);
        this.buyBonusBtn.x = this.turboBtn.x;
        this.buyBonusBtn.y = this.spinBtn.y - this.buyBonusBtn.btn.height * this.buyBonusBtn.scale.y * 0.5 - UIUtil.getPercentageHeight(0.01);

        this.panelBG.scale.set(1);
        this.panelBG.width = UIUtil.getGameWidth();
        this.panelBG.height = 1;
        this.panelBG.x = 0;
        const bounds1 = this.spinBtn.getLocalBounds();

        this.panelBG.x = this.spinBtn.x;
        this.panelBG.y = this.spinBtn.y + bounds1.y * this.spinBtn.scale.y;


        UIUtil.setPercentageScale(this.exitBtn, 0.13, 0.06, 1.5);
        this.exitBtn.x = UIUtil.getPercentageWidth(0.03) + this.exitBtn.btn.width * this.exitBtn.scale.x * 0.5;
        this.exitBtn.y = UIUtil.getPercentageHeight(0.01) + this.exitBtn.btn.height * this.exitBtn.scale.y * 0.5;

        UIUtil.setPercentageScale(this.settingsBtn, 0.13, 0.06, 1.5);
        this.settingsBtn.x = this.exitBtn.x;
        this.settingsBtn.y = this.exitBtn.y + this.exitBtn.btn.height * this.exitBtn.scale.y + UIUtil.getGameHeight() * 0.01;

        UIUtil.setPercentageScale(this.cheatBtn, 0.13, 0.06, 1.5);
        this.cheatBtn.x = this.settingsBtn.x;
        this.cheatBtn.y = this.settingsBtn.y + this.cheatBtn.height + UIUtil.getGameHeight() * 0.01;


        UIUtil.setPercentageScale(this.menuBtn, 0.13, 0.06, 1.5);
        this.menuBtn.x = UIUtil.getGameWidth() - this.menuBtn.btn.width * this.menuBtn.scale.x * 0.5 - UIUtil.getPercentageWidth(0.03);
        this.menuBtn.y = UIUtil.getPercentageHeight(0.01) + this.menuBtn.btn.height * this.menuBtn.scale.y * 0.5;
        this.menuComponents.resetButtonPositions();
        this.menuComponents.scale.set(this.menuBtn.scale.x);
        this.menuComponents.x = this.menuBtn.x + this.menuBtn.btn.width * this.menuBtn.scale.x - this.menuComponents.width;
        this.menuComponents.y = this.menuBtn.y + this.menuBtn.btn.height * this.menuBtn.scale.y + UIUtil.getGameHeight() * 0.01;

        if (CoreLib.Model.GameConfig.gameId == "sugarbliss" || CoreLib.Model.GameConfig.gameId == "planetloots") {
            UIUtil.setPercentageScale(this.soundOnBtn, 0.13, 0.06, 1.5);
            this.soundOnBtn.x = this.menuBtn.x - this.soundOnBtn.btn.width * this.soundOnBtn.scale.x - UIUtil.getPercentageWidth(0.02);
            this.soundOnBtn.y = this.menuBtn.y;
            UIUtil.setSameProps(this.soundOffBtn, this.soundOnBtn);
        } else {
            UIUtil.setPercentageScale(this.soundOnBtn, 0.13, 0.06, 1.5);
            this.soundOnBtn.x = this.menuBtn.x;
            this.soundOnBtn.y = this.menuBtn.y + this.menuBtn.btn.height * this.menuBtn.scale.y + UIUtil.getGameHeight() * 0.01;
            UIUtil.setSameProps(this.soundOffBtn, this.soundOnBtn);
        }

        this.fullScreenBtn.visible = false;
        this.smallScreenBtn.visible = false;


        UIUtil.setPercentageScale(this.balanceComp, 0.44, 0.06, 1.5);
        //this.balanceComp.x = (UIUtil.getGameWidth() * 0.5 - this.balanceComp.width) / 2;
        this.balanceComp.x = UIUtil.getGameWidth() * 0.03;// + this.turboBtn.btn.width * this.turboBtn.scale.x * 0.5;
        if (CoreLib.Model.DeviceConfig.isIOSDevice) {
            this.balanceComp.y = UIUtil.getGameHeight() - this.balanceComp.height - UIUtil.getPercentageHeight(0.02);
        } else {
            this.balanceComp.y = UIUtil.getGameHeight() - this.balanceComp.height - UIUtil.getPercentageHeight(0.02);
        }


        this.stakeComp.scale.set(this.balanceComp.scale.x);
        //this.stakeComp.x = UIUtil.getGameWidth() - this.stakeComp.width / 2 - UIUtil.getPercentageWidth(0.03);
        this.stakeComp.x = UIUtil.getGameWidth() - this.stakeComp.clickBG.width * this.stakeComp.scale.x * 0.5 - UIUtil.getPercentageWidth(0.03);
        this.stakeComp.y = this.balanceComp.y + this.stakeComp.height * 0.5;


        // promo fs ui -----------------------
        if (slotModel.isPromoFSAvailable()) {
            this.promoSpinBtnPosOnResize();

            this.promoFsCountCompResizePos();

            UIUtil.setPercentageScale(this.promoFSTotalWinComp, 0.44, 0.06, 1.5);
            this.promoFSTotalWinComp.x = UIUtil.getGameWidth() * 0.03;
            if (CoreLib.Model.DeviceConfig.isIOSDevice) {
                this.promoFSTotalWinComp.y = UIUtil.getGameHeight() - this.promoFSTotalWinComp.height - UIUtil.getPercentageHeight(0.02);
            } else {
                this.promoFSTotalWinComp.y = UIUtil.getGameHeight() - this.promoFSTotalWinComp.height - UIUtil.getPercentageHeight(0.02);
            }

            UIUtil.setPercentageScale(this.promoFSSpinWinComp, 0.44, 0.06, 1.5);
            this.promoFSSpinWinComp.x = (this.promoFSTotalWinComp.width - this.promoFSSpinWinComp.width * 0.5) / 2;
            this.promoFSSpinWinComp.y = this.promoFSTotalWinComp.y - this.promoFSTotalWinComp.height * 0.5 - UIUtil.getPercentageHeight(0.01);
        }

    }

    promoFsCountCompResizePos() {
        if (slotModel.isPromoFSAvailable()) {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                this.promoFSCountComp.scale.set(this.balanceComp.scale.x * 1.3);
                this.promoFSCountComp.x = this.stakeComp.x - this.promoFSCountComp.width * 0.54;
                this.promoFSCountComp.y = this.stakeComp.y - this.stakeComp.height * 1.8;
            } else {
                UIUtil.setPercentageScale(this.promoFSCountComp, 0.15, 0.15, 1);
                this.promoFSCountComp.x = UIUtil.getGameWidth() - this.promoFSCountComp.width - UIUtil.getPercentageWidth(0.01);
                this.promoFSCountComp.y = this.stakeComp.y - this.stakeComp.height * 2;
            }

        }
    }
    showPromoFsWinAnimAfterBonusGame() {
        if (slotModel.getPromoFSSession()) {
            if (CoreLib.Model.GameConfig.cascadeGame && !CoreLib.Model.GameConfig.megaWaysGame) {
                this.promoFSSpinWinComp.updateWin(slotModel.getCascadeTotalFreeSpinWin());
            } else {
                this.promoFSSpinWinComp.updateWin(slotModel.getTotalFreespinWin(), true);
            }
        }
    }

    promoSpinBtnPosOnResize() {
        this.promoFSSpinBtn.scale.set(this.spinBtn.scale.x * 0.32, this.spinBtn.scale.y * 0.32);
        this.promoFSSpinBtn.x = this.spinBtn.x + this.promoFSSpinBtn.width * 0.0315;
        this.promoFSSpinBtn.y = this.spinBtn.y + this.promoFSSpinBtn.height * 0.0515;
    }
}
