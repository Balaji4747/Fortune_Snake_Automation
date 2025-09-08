import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { LibView } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibView";


export class GameBGCompV2 extends LibView {
    constructor(config, layoutconfig) {
        super(config, layoutconfig);
        this.maingamebg = this.elementsList["maingamebg"];
        this.freespinbg = this.elementsList["freespinbg"];
        this.maingamebgHor = this.elementsList["maingamebgHor"];
        this.maingamebgVer = this.elementsList["maingamebgVer"];
        this.splashBG = this.elementsList["splashbg"];
        if (this.freespinbg) {
            this.freespinbg.visible = false;
        }
        this.maingamebgHor.renderable = false;
        this.maingamebgVer.renderable = false;
        this.currentBG = "main";
        this.maingamebgHor.addEventListener("complete", this.onAnimComplete.bind(this))
        this.maingamebgVer.addEventListener("complete", this.onAnimComplete.bind(this))
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_MAINGAME_BG, this.showMaingameBG.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_FREEGAME_BG, this.showFreegameBG.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_BONUSGAME_BG, this.showBonusgameBG.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.SHOW_SPLASH_BG, this.showSplashBG.bind(this));
        CoreLib.EventHandler.addEventListener("SHOW_SHRINK_ANIMATION", this.showShrinkAnimation.bind(this));
    }
    showShrinkAnimation() {
        this.playAnim = true;
        this.maingamebgHor.playAnimation("land_cloud_intro", false);
        this.maingamebgVer.playAnimation("port_cloud_intro", false);
        this.maingamebgHor.renderable = true;
        this.maingamebgVer.renderable = true;
        
        this.resizeViewComponents()
    }
    onAnimComplete(e) {
        if (e.name === "port_cloud_end") {
            this.maingamebgVer.renderable = false;
        }
        if (e.name === "land_cloud_end") {
            this.maingamebgHor.renderable = false;
        }
    }
    showMaingameBG(fadein = true) {
        this.addChild(this.maingamebg);
        this.addChild(this.maingamebgHor);
        this.addChild(this.maingamebgVer);
        this.maingamebg.visible = true;
        if (this.currentBG != "main") {
            if (fadein) {
                this.maingamebg.alpha = 0;
                CoreLib.AnimationManager.animateTween(this.maingamebg, 1, { alpha: 1 });
            }
        }
        this.currentBG = "main";
    }
    showFreegameBG(fadein = true) {
        this.addChild(this.freespinbg);
        this.addChild(this.maingamebgHor);
        this.addChild(this.maingamebgVer);
        this.freespinbg.visible = true;
        if (this.currentBG != "freespin") {
            if (fadein) {
                this.freespinbg.alpha = 0;
                CoreLib.AnimationManager.animateTween(this.freespinbg, 1, { alpha: 1 });
            }
        }
        this.currentBG = "freespin";
    }
    showBonusgameBG(fadein = true) {
        // this.addChild(this.bonusgamebg);
        // if (fadein) {
        //     this.bonusgamebg.visible = true;
        //     this.bonusgamebg.alpha = 0;
        //     CoreLib.AnimationManager.animateTween(this.bonusgamebg, 1, {alpha : 1});
        // }
    }
    showSplashBG(fadein = true) {
        if (this.splashBG) {
            this.addChild(this.splashBG);
            this.splashBG.visible = true;
            this.currentBG = "splash";
        }
    }
    resizeViewComponents() {
        super.resizeViewComponents();
        // CoreLib.UIUtil.adjustElement(this.maingamebgHor);
        // CoreLib.UIUtil.adjustElement(this.maingamebgVer);
        this.maingamebg.x = (CoreLib.UIUtil.getGameWidth() - this.maingamebg.width) * 0.5;
        if (this.playAnim) {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    this.maingamebgHor.renderable = false;
                    this.maingamebgVer.renderable = true;
                } else {
                    this.maingamebgHor.renderable = true;
                    this.maingamebgVer.renderable = false;
                }
            } else {
                this.maingamebgHor.renderable = true;
                this.maingamebgVer.renderable = false;
            }
        }
    }


}
