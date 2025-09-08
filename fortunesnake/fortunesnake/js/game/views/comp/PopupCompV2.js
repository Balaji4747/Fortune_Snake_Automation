import { PopupComp } from "../../../../../../../../Microslots-FE-SlotCore/corelib/views/comps/PopupComp"
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";

export class PopupCompV2 extends PopupComp {
    constructor(config) {
        super(config);
        this.popupbg = this.elementsList["popupbg"];
        this.titleText = this.elementsList["titleText"];
        this.message1 = this.elementsList["message1"];
        this.message2 = this.elementsList["message2"];
        this.okBtn = this.elementsList["okBtn"];


        this.okBtn.tText.x = -this.okBtn.tText.width / 2;
        this.okBtn.tText.y = -this.okBtn.tText.height / 2;
        this.adjustText();
    }

    adjustText() {
        if (CoreLib.Model.GameInfo.language == "id") {
            CoreLib.UIUtil.updateWordWrapWidth(this.message1, 1500);
            CoreLib.UIUtil.updateWordWrapWidth(this.message2, 1500);
            CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 48);
            this.okBtn.tText.y = -36;
        } else if (CoreLib.Model.GameInfo.language == "zh" || CoreLib.Model.GameInfo.language == "zh_hant") {
            this.okBtn.tText.y = -34;
        }
        let lang = CoreLib.Model.GameInfo.language
        switch (lang) {
            case "id":
                CoreLib.UIUtil.updateWordWrapWidth(this.message1, 1500);
                CoreLib.UIUtil.updateWordWrapWidth(this.message2, 1500);
                CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 85);
                this.okBtn.tText.x = -45;
                this.okBtn.tText.y = -30;
                break;
            case "hi":
                CoreLib.UIUtil.setPositionY(this.titleText, -290);
                CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 55);
                CoreLib.UIUtil.setPositionX(this.okBtn.tText, -85);
                CoreLib.UIUtil.setPositionY(this.okBtn.tText, -28);
                break;
            case "bn":
                CoreLib.UIUtil.setPositionY(this.titleText, -290);
                CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 55);
                CoreLib.UIUtil.setPositionX(this.okBtn.tText, -85);
                CoreLib.UIUtil.setPositionY(this.okBtn.tText, -28);
                break;
            case "ko":
                CoreLib.UIUtil.setPositionY(this.titleText, -290);
                CoreLib.UIUtil.updateTextSize(this.okBtn.tText, 60);
                CoreLib.UIUtil.setPositionX(this.okBtn.tText, -65);
                CoreLib.UIUtil.setPositionY(this.okBtn.tText, -20);
            case "zh":
                break;
            case "zh_hant":
                break;
            case "th":
                this.okBtn.tText.y = -10;
                break;
            case "ja":
                CoreLib.UIUtil.updateTextSize(this.titleText, 100);
                break;
            default:
                break;
        }
    }

    onOKClicked() {
        super.onOKClicked();
    }
    resizeViewComponents(layoutData = null) {
        CoreLib.UIUtil.adjustElement(this);
    }
}
