import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import bigDecimal from "js-big-decimal";

export class FSPanelComp extends LibContainer {
    constructor(config) {
        super(config);
        this.guideRect = this.elementsList["guideRect"];
        this.fsPanel = this.elementsList["fsPanel"];
        this.fsTexts = this.elementsList["fsTexts"];

        this.textContainer = this.elementsList["textContainer"];
        this.fsCountBG = this.textContainer.elementsList["fsCountBG"];
        this.fsCount = this.textContainer.elementsList["fsCount"];
        this.fsBoomAnim = this.elementsList["fsBoomAnim"];
        this.count = 0;
        this.visible = false;
        this.totalWin = 0;
        this.fsStart = true;

        CoreLib.EventHandler.addEventListener("ON_TRANSITION_ANIM_DONE", this.updateUiFSStart.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.START_SLOT_SPIN, this.updateFSCountText.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_UI_FOR_FS_END, this.hideFSCountText.bind(this));
        // CoreLib.EventHandler.addEventListener("SHOW_TOTAL_WIN", this.showTotalWin.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.COIN_CASH_MODE_CHANGED, this.updateForCoinCash.bind(this));
    }
    updateForCoinCash() {
        if (this.totalWin > 0) {
            this.fsCountBG.text = CoreLib.WrapperService.formatCurrency(this.totalWin);
            this.fsCount.text = CoreLib.WrapperService.formatCurrency(this.totalWin);
        }
        this.setFsCountTextPos();
    }
    updateUiFSStart() {
        this.updateTitleText(1);
        if (CoreLib.Model.GameInfo.language == "fil") {
            CoreLib.UIUtil.updateTextSize(this.fsTexts, 40);
        } else if (CoreLib.Model.GameInfo.language == "id" || CoreLib.Model.GameInfo.language == "ms") {
            CoreLib.UIUtil.updateTextSize(this.fsTexts, 30);
        } else if (CoreLib.Model.GameInfo.language == "vi") {
            CoreLib.UIUtil.updateTextSize(this.fsTexts, 26);
        }
        this.visible = true;
        let data = slotModel.getFeatureData();
        if (data.retryCount >= 3 || this.fsStart) {
            if (!this.fsStart) {
                CoreLib.EventHandler.dispatchEvent("PLAY_SCORE_ADD_SOUND");
            }
            this.fsStart = false;
            this.fsCountBG.text = data.retryCount;
            this.fsCount.text = data.retryCount;
            this.fsBoomAnim.playAnimation("animation", false);
        }
        this.setFsCountTextPos();
        this.totalWin = 0;
    }
    updateFSCountText() {
        let data = slotModel.getFeatureData();
        if (data) {
            this.fsCountBG.text = data.retryCount - 1;
            this.fsCount.text = data.retryCount - 1;
        }
        this.setFsCountTextPos();
    }
    hideFSCountText() {
        this.visible = false;
        this.fsStart = true;
        this.fsCountBG.text = "";
        this.fsCount.text = "";
        this.setFsCountTextPos();
    }
    showTotalWin(value) {
        this.updateTitleText(0);
        if (CoreLib.Model.GameInfo.language == "vi") {
            CoreLib.UIUtil.updateTextSize(this.fsTexts, 30);
        } else if (CoreLib.Model.GameInfo.language == "id" || CoreLib.Model.GameInfo.language == "ms") {
            CoreLib.UIUtil.updateTextSize(this.fsTexts, 28);
        } else if (CoreLib.Model.GameInfo.language == "fil") {
            CoreLib.UIUtil.updateTextSize(this.fsTexts, 25);
        }
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isLandscape) {
                if (CoreLib.Model.GameInfo.language == "id") {
                    this.fsTexts.y = 62
                } else if (CoreLib.Model.GameInfo.language == "fil") {
                    this.fsTexts.y = 48
                } else if (CoreLib.Model.GameInfo.language == "ms") {
                    this.fsTexts.y = 48
                } else if (CoreLib.Model.GameInfo.language == "vi") {
                    this.fsTexts.y = 55
                }
            }
        } else {
            if (CoreLib.Model.GameInfo.language == "vi") {
                this.fsTexts.y = 55
            }
        }
        if (value <= 0) {
            CoreLib.EventHandler.dispatchEvent("PLAY_START_TOTAL_WIN_SOUND");
        }
        this.fsBoomAnim.playAnimation("animation", false);
        // this.fsTexts.text = "Total Win";

        this.fsCountBG.text = "" + this.totalWin;
        this.fsCount.text = "" + this.totalWin;

        this.totalWin = +(bigDecimal.add(this.totalWin, value));
        this.fsCountBG.text = CoreLib.WrapperService.formatCurrency(this.totalWin);
        this.fsCount.text = CoreLib.WrapperService.formatCurrency(this.totalWin);
        this.setFsCountTextPos();

    }
    setFsCountTextPos() {
        this.fsTexts.x = this.fsPanel.width * 0.5 - this.fsTexts.width * 0.5;
        if (this.guideRect.width < this.textContainer.width) {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (!CoreLib.Model.DeviceConfig.isPortrait) {
                    this.textContainer.width = this.guideRect.width * 0.98;
                }
            } else {
                this.textContainer.width = this.guideRect.width * 0.98;
            }

            this.textContainer.scale.set(this.textContainer.scale.x);
        }
        this.textContainer.x = this.fsPanel.width * 0.5 - this.textContainer.width * 0.5;
        // this.fsCount.x = this.fsPanel.width * 0.5 - this.fsCount.width * 0.5;
    }

    updateTitleText(type = 1) {
        if (type) {
            this.fsTexts.text = CoreLib.Util.getContent("freespinTextCaps");
            return
        }
        this.fsTexts.text = CoreLib.Util.getContent("totalWin");
    }

    resizeViewComponents() {
        super.resizeViewComponents();
        this.fsBoomAnim.x = this.fsBoomAnim.configData.x;
        this.fsBoomAnim.y = this.fsBoomAnim.configData.y;
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.fsPanel.scale.set(this.fsPanel.configData.pScale);
                this.x = this.configData.px;
                this.y = this.configData.py;

                this.textContainer.y = this.textContainer.configData.py;
                this.fsTexts.y = this.fsTexts.configData.py;
                this.fsBoomAnim.x = this.fsBoomAnim.configData.px;
                this.fsBoomAnim.y = this.fsBoomAnim.configData.py;
            } else {
                this.fsPanel.scale.set(this.fsPanel.configData.lScale);
                this.x = this.configData.lx;
                this.y = this.configData.ly;

                this.textContainer.y = this.textContainer.configData.ly;
                this.fsTexts.y = this.fsTexts.configData.ly;
            }
        } else {
            this.x = this.configData.x;
            this.y = this.configData.y;

            this.textContainer.y = this.textContainer.configData.y;
            this.fsTexts.y = this.fsTexts.configData.y;
        }
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isLandscape) {
                if (CoreLib.Model.GameInfo.language == "id") {
                    this.fsTexts.y = 62
                } else if (CoreLib.Model.GameInfo.language == "fil") {
                    this.fsTexts.y = 56
                } else if (CoreLib.Model.GameInfo.language == "ms") {
                    this.fsTexts.y = 55
                } else if (CoreLib.Model.GameInfo.language == "vi") {
                    this.fsTexts.y = 55
                }
            }
        } else {
            if (CoreLib.Model.GameInfo.language == "vi") {
                this.fsTexts.y = 55
            }
        }
        this.setFsCountTextPos();
    }
};
