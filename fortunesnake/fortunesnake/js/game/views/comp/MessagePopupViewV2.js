import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";

export class MessagePopupViewV2 extends LibContainer {
    constructor(config, layoutconfig) {
        super(config, layoutconfig);

        this.bg = this.elementsList["bg"];
        this.popup = this.elementsList["popup"];
        this.titleText = this.popup.elementsList["titleText"];
        this.message1 = this.popup.elementsList["message1"];
        this.message2 = this.popup.elementsList["message2"];
        this.message3 = this.popup.elementsList["message3"];
        this.okBtn = this.popup.elementsList["okBtn"];
        setTimeout(this.hideMessagePopup.bind(this), 50);
        this.visible = false;
        CoreLib.UIUtil.setModalState(this.bg, true);

        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_MESSAGE_POPUP, this.showMessagePopup.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.HIDE_MESSAGE_POPUP, this.hideMessagePopup.bind(this));
        if (CoreLib.Model.GameInfo.language == "hi") {
            CoreLib.UIUtil.setPositionY(this.titleText, -160);
            CoreLib.UIUtil.setPositionY(this.message1, -63);
            CoreLib.UIUtil.setPositionY(this.message2, 120);
            CoreLib.UIUtil.setPositionX(this.okBtn.tText, -62);
            CoreLib.UIUtil.setPositionY(this.okBtn.tText, -30);
            CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 42);
        } else if (CoreLib.Model.GameInfo.language == "id") {
            CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 60);
            CoreLib.UIUtil.setPositionY(this.message3, 20);
            CoreLib.UIUtil.setPositionY(this.okBtn.tText, -30);
        } else if (CoreLib.Model.GameInfo.language == "ja") {
            CoreLib.UIUtil.setPositionY(this.message3, 31);
            CoreLib.UIUtil.updateTextSize(this.titleText, 58);
        } else if (CoreLib.Model.GameInfo.language == "ko") {
            CoreLib.UIUtil.setPositionY(this.titleText, -160);
            CoreLib.UIUtil.setPositionY(this.message3, 12);
            CoreLib.UIUtil.setPositionY(this.message1, -68);
            CoreLib.UIUtil.setPositionY(this.okBtn.tText, -28);
        } else if (CoreLib.Model.GameInfo.language == "ms") {
            CoreLib.UIUtil.setPositionY(this.titleText, -160);
            CoreLib.UIUtil.setPositionY(this.message1, -65);
            CoreLib.UIUtil.setPositionY(this.message3, 12);
        } else if (CoreLib.Model.GameInfo.language == "th") {
            CoreLib.UIUtil.setPositionY(this.message1, -60);
            CoreLib.UIUtil.setPositionY(this.message3, 22);
            CoreLib.UIUtil.setPositionY(this.okBtn.tText, -22);
        } else if (CoreLib.Model.GameInfo.language == "bn") {
            CoreLib.UIUtil.setPositionX(this.okBtn.tText, -93);
            CoreLib.UIUtil.setPositionY(this.titleText, -160);
            CoreLib.UIUtil.setPositionY(this.message1, -63);
            CoreLib.UIUtil.setPositionY(this.message2, 120);
            CoreLib.UIUtil.setPositionY(this.message3, 27);
            CoreLib.UIUtil.setPositionX(this.okBtn.tText, -44);
            CoreLib.UIUtil.setPositionY(this.okBtn.tText, -21);
            CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 46);
        } else if (CoreLib.Model.GameInfo.language == "vi") {
            CoreLib.UIUtil.setPositionY(this.message1, -44);
            CoreLib.UIUtil.setPositionY(this.message3, 26);
        } else if (CoreLib.Model.GameInfo.language == "zh") {
            CoreLib.UIUtil.setPositionY(this.message3, 26);
        } else if (CoreLib.Model.GameInfo.language == "zh_hant") {
            CoreLib.UIUtil.setPositionY(this.message3, 28);
        }
    }

    showMessagePopup(obj) {
        this.popup.updatePopup(obj);
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.ADD_VIEW, this);
        this.visible = true;
        this.bg.alpha = 0;
        this.popup.alpha = 0;
        if (obj.showBG == false) {

        } else {
            CoreLib.AnimationManager.animateTween(this.bg, 0.5, { alpha: 0.6 });
        }

        CoreLib.AnimationManager.animateTween(this.popup, 1, { alpha: 1 });
    }

    hideMessagePopup() {
        this.popup.reset();
        this.visible = false;
        CoreLib.EventHandler.dispatchEvent(CoreLib.SlotEvents.REMOVE_VIEW, this);
    }

    onResizeEndEvent() {
        super.onResizeEndEvent();

        this.bg.width = CoreLib.UIUtil.getGameWidth();
        this.bg.height = CoreLib.UIUtil.getGameHeight();

        this.popup.scale.set(1);
        let obj = CoreLib.UIUtil.getDeviceSpecificUIObj(this.configData.layoutData)
        CoreLib.UIUtil.scaleObjectWithRef(this.popup, this.bg, obj.widthPerc, obj.heightPerc);
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.popup.width = this.bg.width * 2.5;
                this.popup.scale.set(this.popup.scale.x)
                CoreLib.UIUtil.setPositionX(this.popup, (this.bg.width / 2));
                CoreLib.UIUtil.setPositionY(this.popup, (this.bg.height / 2));
            } else {
                this.popup.height = this.bg.height * 4;
                this.popup.scale.set(this.popup.scale.y)
                CoreLib.UIUtil.setPositionX(this.popup, (this.bg.width / 2));
                CoreLib.UIUtil.setPositionY(this.popup, (this.bg.height / 2));
            }
        } else {
            CoreLib.UIUtil.setPositionX(this.popup, (this.bg.width / 2));
            CoreLib.UIUtil.setPositionY(this.popup, (this.bg.height / 2));
        }
    }

}

