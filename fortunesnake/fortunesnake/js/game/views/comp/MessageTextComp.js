import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";

const messageSeq = ["messageText1", "wildMultText1", "messageText2", "messageText3"]

export class MessageTextComp extends LibContainer {
  constructor(config) {
    super(config);
    this.maskRect = this.elementsList["maskRect"];
    this.message_bg = this.elementsList["message_bg"];
    this.messageText = this.elementsList["messageText"];
    this.winAmountComp = this.elementsList["winAmountComp"];
    this.showTextCount = 0;
    this.multTextContainer = this.elementsList["multTextContainer"];
    this.preText = this.multTextContainer.elementsList["preText"];
    this.fsWinsymbol = this.multTextContainer.elementsList["fsWinsymbol"];
    this.orText = this.multTextContainer.elementsList["orText"];
    this.WDimg = this.multTextContainer.elementsList["WDimg"];
    this.postText = this.multTextContainer.elementsList["postText"];

    this.messageText.mask = this.maskRect;
    this.timerId = null;
    this.initialView();

    CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.GAME_START_CLICKED, this.showTexts.bind(this));
    CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.ENTER_SPINWIN_STATE, this.showWinText.bind(this));
  }
  showWinText() {
    clearTimeout(this.timerId);
    CoreLib.AnimationManager.killTweensOf(this.messageText);
    this.winAmountComp.updateText(false);

    const bounds1 = this.winAmountComp.getLocalBounds(); // Force recalculation of bounds
    this.winAmountComp.pivot.set(bounds1.x, 0);
    this.winAmountComp.x = -this.winAmountComp.width * 0.5;

    this.messageText.visible = false;
    this.multTextContainer.visible = false;
    this.winAmountComp.visible = true;

    const win = slotModel.getTotalWin();
    const totalBet = slotModel.getTotalBet();
    let multi = Math.round(win / totalBet);
    if (multi >= 5) {
      this.winAmountComp.showWin(win);
    } else {
      this.winAmountComp.showText(win);
    }

  }
  initialView() {
    this.orText.visible = false;
    this.fsWinsymbol.visible = false;
    this.winAmountComp.visible = false;
  }
  showTexts() {
    clearTimeout(this.timerId);
    if (this.showTextCount > 3) {
      this.showTextCount = 0;
    }
    this.winAmountComp.visible = false;
    if (this.showTextCount == 1) {
      this.messageText.visible = false;
      this.messageText.anchor.x = 0.5;
      this.messageText.anchor.y = 0.5;
      this.messageText.x = 0;
      this.multTextContainer.visible = true;

      this.preText.text = CoreLib.Util.getContent("wildMultText1");
      this.postText.text = CoreLib.Util.getContent("wildMultText2");
      this.WDimg.x = this.preText.width * 0.5 + this.WDimg.width * 0.5;
      this.postText.x = this.WDimg.x + this.WDimg.width * 0.5 + this.postText.width * 0.5;

      const bounds1 = this.multTextContainer.getLocalBounds(); // Force recalculation of bounds
      this.multTextContainer.pivot.set(bounds1.x, 0);
      this.multTextContainer.x = -this.multTextContainer.width * 0.5

      this.timerId = setTimeout(() => {
        this.showTextCount++
        this.showTexts();
      }, 3500);
    } else if (this.showTextCount === 2) {
      clearTimeout(this.timerId);
      this.messageText.visible = true;
      this.multTextContainer.visible = false;
      this.messageText.anchor.x = 0;
      this.messageText.anchor.y = 0.5;
      this.messageText.x = this.maskRect.x;
      this.messageText.text = CoreLib.Util.getContent(messageSeq[this.showTextCount]);

      CoreLib.AnimationManager.animateTween(this.messageText, 8, {
        delay: 0,
        x: this.maskRect.x - this.messageText.width,
        ease: Linear.easeNone,
        onComplete: () => {
          this.showTexts();
        }
      });
      this.showTextCount++;
    } else {
      this.messageText.visible = true;
      this.multTextContainer.visible = false;
      clearTimeout(this.timerId);
      this.messageText.anchor.x = 0.5;
      this.messageText.anchor.y = 0.5;
      this.messageText.x = 0;
      this.messageText.text = CoreLib.Util.getContent(messageSeq[this.showTextCount]);
      this.timerId = setTimeout(() => {
        this.showTextCount++
        this.showTexts();
      }, 3500);
    }
  }

  createTextWithSymbol() {
    let config = { name: `anticipText`, type: "Text", style: "PopupTitleStyle4" };
    let temptext1 = CoreLib.UIUtil.getElement(config);
    let temptext2 = CoreLib.UIUtil.getElement(config);
    let temptextContent1 = CoreLib.Util.getContent("messageText6");
    let symbol = CoreLib.UIUtil.getSprite("SC");
    let temptextContent2 = CoreLib.Util.getContent("messageText7");
    this.anticipationContainer = CoreLib.UIUtil.getContainer();
    temptext1.text = temptextContent1;
    temptext1.x = 0;
    symbol.anchor.y = 0.5
    temptext1.anchor.y = 0.5;
    temptext2.anchor.y = 0.5;

    if (CoreLib.Model.DeviceConfig.isDevice) {
      symbol.scale.x = symbol.scale.y = 0.35;
      symbol.y = 0;
      symbol.position.x = temptext1.x + temptext1.width - symbol.width * 0.25;
      temptext2.text = temptextContent2;
      temptext2.x = symbol.position.x + symbol.width * 0.75;

    } else {
      symbol.scale.x = symbol.scale.y = 0.3;
      symbol.y = 0;
      symbol.position.x = temptext1.x + temptext1.width - symbol.width * 0.2;
      temptext2.text = temptextContent2;
      temptext2.x = symbol.position.x + symbol.width * 0.8;

    }


    this.anticipationContainer.name = "anticipationContainer";


    this.anticipationContainer.addChild(temptext1, symbol, temptext2);
    this.addChild(this.anticipationContainer);
    this.anticipationContainer.visible = false;
  }



  resizeViewComponents() {
    super.resizeViewComponents();
    //   CoreLib.UIUtil.adjustElement(this.maskRect);
    //   CoreLib.UIUtil.adjustWidthHeightForMobile(this.maskRect);
    //   CoreLib.UIUtil.positionObjectForDevice(this.maskRect);
    //   if (this.glowBarAnim) {
    //     CoreLib.UIUtil.setPositionBasedOnDevice(this.glowBarAnim);
    //     this.glowBarAnim.stopAnimation();
    //     this.glowBarAnim.visible = false;
    //   }
    //   if (this.glowBarAnimFG) {
    //     CoreLib.UIUtil.setPositionBasedOnDevice(this.glowBarAnimFG);
    //     this.glowBarAnimFG.stopAnimation();
    //     this.glowBarAnimFG.visible = false;
    //   }
    //   // if (this.winText) {
    //   //   CoreLib.UIUtil.adjustElement(this.winText);
    //   //   CoreLib.UIUtil.positionObjectForDevice(this.winText);
    //   // }
    //   this.setTextPosition();
      // if (this.message_bg) {
      //   this.messageBGOnResizeText();
      // }
    //   if (this.message_fg) {
    //     this.messageFGOnResizeText()
    //   }
  }
}
