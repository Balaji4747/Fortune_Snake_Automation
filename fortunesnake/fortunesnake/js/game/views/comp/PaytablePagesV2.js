import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

export class PaytablePagesV2 extends LibContainer {
    constructor(config) {
        super(config);

        this.guideRect = this.elementsList["guideRect"];
        this.splashlogo = this.elementsList["splashlogo"];
        this.pageContainer = this.elementsList["pageContainer"];
        this.clickToContinue = this.elementsList["clickToContinue"];
        CoreLib.AnimationManager.animateTween(this.clickToContinue, 1, { scaleX: this.clickToContinue.scale.x * 1.1, scaleY: this.clickToContinue.scale.x * 1.1, repeat: -1, yoyo: true });
        let len = this.pageContainer.elementsArray.length;
        this.pagesArray = [];
        this.pageIndicatorContainer = CoreLib.UIUtil.getContainer();
        this.addChild(this.pageIndicatorContainer);
        this.indicatorArray = [];
        for (let k = 1; k < len; k++) {
            if (this.pageContainer.elementsArray[k].name.indexOf("page") > -1) {
                this.pagesArray.push(this.pageContainer.elementsArray[k]);
            }
            const indicator = UIUtil.getSprite("pageIndicator_off");
            this.pageIndicatorContainer.addChild(indicator);
            indicator.x = (k - 1) * indicator.width * 1.5;
            this.indicatorArray.push(indicator);

        }
        if (CoreLib.Model.GameInfo.language == "en") {
            this.clickToContinue.tText.x = -this.clickToContinue.tText.width / 2;
            this.clickToContinue.tText.y = -this.clickToContinue.tText.height / 2;
        } else {
            this.clickToContinue.tText.x = -this.clickToContinue.tText.width / 2;
            this.clickToContinue.tText.y = -this.clickToContinue.tText.height / 2 - 13;
        }
        this.currentIndex = 0;
    }

    resizeCustom() {
        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                this.adjustForPortrait();
            } else {
                this.adjustForLandscape();
            }
        } else {
            this.adjustForLandscape();
            this.pageIndicatorContainer.visible = false;
        }


        this.pageContainer.x = (this.guideRect.width - this.pageContainer.width) / 2;
        if (this.pageContainer && this.pageContainer.x < 0) {
            this.pageContainer.x = this.pageContainer.x * -1;
        }
    }
    adjustForPortrait() {
        let len = this.pagesArray.length;
        for (let k = 0; k < len; k++) {
            if (k == 0) {
                this.pagesArray[k].visible = true;
                this.pagesArray[k].x = 0;
            } else {
                this.pagesArray[k].visible = false;
            }
        }
        this.pageContainer.x = (this.guideRect.width - this.pageContainer.width) / 2;
        if (this.pageContainer && this.pageContainer.x < 0) {
            this.pageContainer.x = this.pageContainer.x * -1;
        }
        UIUtil.scaleObjectWithRef(this.pageContainer, this.guideRect, 1.2);
        UIUtil.scaleObjectWithRef(this.clickToContinue, this.guideRect, 1);
        this.clickToContinue.x = (this.guideRect.width - this.clickToContinue.width) / 2 + this.clickToContinue.width / 2;
        CoreLib.AnimationManager.killTweensOf(this.clickToContinue);
        CoreLib.AnimationManager.animateTween(this.clickToContinue, 1, { scaleX: this.clickToContinue.scale.x * 1.1, scaleY: this.clickToContinue.scale.x * 1.1, repeat: -1, yoyo: true });
        this.currentIndex = 0;
        this.pageIndicatorContainer.x = (this.guideRect.width - this.pageIndicatorContainer.width) / 2;
        this.pageIndicatorContainer.y = this.clickToContinue.y - this.clickToContinue.height * 1.1;
        this.pageIndicatorContainer.visible = true;
        this.startAutoScroll();

    }
    updatePageIndicator() {
        let len = this.indicatorArray.length;
        for (let k = 0; k < len; k++) {
            if (k == this.currentIndex) {
                this.indicatorArray[k].texture = CoreLib.UIUtil.getTexture("pageIndicator_on");
            } else {
                this.indicatorArray[k].texture = CoreLib.UIUtil.getTexture("pageIndicator_off");
            }
        }
    }
    startAutoScroll() {
        this.updatePageIndicator();
        let len = this.pageContainer.elementsArray.length;
        if (len > 2) {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(this.navigateNext.bind(this), CoreLib.Util.getDefaultValue(this.configData.scrollGap, 3000));
        }


    }
    adjustForLandscape() {
        let len = this.pagesArray.length;
        for (let k = 0; k < len; k++) {
            CoreLib.AnimationManager.killTweensOf(this.pagesArray[k]);
            this.pagesArray[k].visible = true;
            UIUtil.setPositionBasedOnDevice(this.pagesArray[k]);
        }
        UIUtil.scaleObjectWithRef(this.pageContainer, this.guideRect, null, 0.9);
        //this.pageContainer.y = this.splashlogo + this.splashlogo.height / 4;
        UIUtil.scaleObjectWithRef(this.clickToContinue, this.guideRect, 0.4);
        this.clickToContinue.x = (this.guideRect.width - this.clickToContinue.width) / 2 + this.clickToContinue.width / 2;
        CoreLib.AnimationManager.killTweensOf(this.clickToContinue);
        CoreLib.AnimationManager.animateTween(this.clickToContinue, 1, { scaleX: this.clickToContinue.scale.x * 1.1, scaleY: this.clickToContinue.scale.x * 1.1, repeat: -1, yoyo: true });
        clearTimeout(this.timerId);
        this.pageIndicatorContainer.visible = false;
    }

    cleanUp() {
        clearTimeout(this.timerId);
    }

    navigateNext() {
        if (this.currentIndex == this.pagesArray.length - 1) {
            this.nextIndex = 0;
        } else {
            this.nextIndex = this.currentIndex + 1;
        }
        const curPage = this.pagesArray[this.currentIndex];
        const nextPage = this.pagesArray[this.nextIndex];
        nextPage.visible = true;
        nextPage.x = CoreLib.UIUtil.getGameWidth() * 1.2;
        const duration = 0.75;
        CoreLib.AnimationManager.animateTween(curPage, duration, { x: -CoreLib.UIUtil.getGameWidth() * 1.2, onComplete: this.onPageHidden.bind(this, curPage) });
        CoreLib.AnimationManager.animateTween(nextPage, duration, { x: 0 });
        this.emit("PT_PAGE_CHANGED", this.currentIndex);
        this.currentIndex = this.nextIndex;
        this.startAutoScroll();
    }
    onPageHidden(element) {
        element.visible = false;
    }


}
