import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { slotModel } from "../../../../../../../../Microslots-FE-SlotCore/corelib/models/SlotModel";
import { LibContainer } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/LibContainer";
import bigDecimal from "js-big-decimal";

const jackPotMultipliers = [3000, 50, 25, 15];
export class JackpotPaytable extends LibContainer {
    constructor(config) {
        super(config);
        this.grandCont = this.elementsList["grandCont"];
        this.grandbg = this.grandCont.elementsList["grandbg"];
        this.grandText = this.grandCont.elementsList["grandText"];
        
        this.majorCont = this.elementsList["majorCont"];
        this.majorbg = this.majorCont.elementsList["majorbg"];
        this.majorText = this.majorCont.elementsList["majorText"];
        
        this.minorCont = this.elementsList["minorCont"];
        this.minorbg = this.minorCont.elementsList["minorbg"];
        this.minorText = this.minorCont.elementsList["minorText"];
        
        this.miniCont = this.elementsList["miniCont"];
        this.minibg = this.miniCont.elementsList["minibg"];
        this.miniText = this.miniCont.elementsList["miniText"];
        
        this.updateJackPotText();
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.UPDATE_BET_VALUE, this.updateJackPotText.bind(this));
        CoreLib.EventHandler.addEventListener(CoreLib.SlotEvents.COIN_CASH_MODE_CHANGED, this.updateJackPotText.bind(this));
    }
    updateJackPotText(){
        let totalbet = slotModel.getTotalBet();
        let multipliersVal = jackPotMultipliers.map(el=>  CoreLib.WrapperService.formatCurrency(+(bigDecimal.multiply(el, totalbet))));

        this.grandText.text = [{ type: 'integer', value: `${multipliersVal[0]}`}];
        this.majorText.text = [{ type: 'integer', value: `${multipliersVal[1]}`}];
        this.minorText.text = [{ type: 'integer', value: `${multipliersVal[2]}`}];
        this.miniText.text = [{ type: 'integer', value: `${multipliersVal[3]}`}];

        this.grandText.x = this.grandbg.width * 0.5;
        this.majorText.x = this.grandbg.width * 0.5;
        this.minorText.x = this.grandbg.width * 0.5;
        this.miniText.x = this.grandbg.width * 0.5;
    }
    resizeViewComponents() {
        super.resizeViewComponents();
        if (this.caishen_intro) {
            CoreLib.UIUtil.adjustElement(this.caishen_intro);
        }
        CoreLib.UIUtil.adjustElement(this.congrats_intro);

        if(CoreLib.Model.DeviceConfig.isDevice){
            if(CoreLib.Model.DeviceConfig.isPortrait){
                this.scale.set(this.configData.pScale);
                this.x = this.configData.px;
                this.y = this.configData.py;
            }else{
                this.scale.set(this.configData.scale);
                this.x = this.configData.x;
                this.y = this.configData.y;
            }
        }else{
            this.scale.set(this.configData.scale);
            this.x = this.configData.x;
            this.y = this.configData.y;
        }
    }
};
