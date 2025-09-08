export const SLOT_PANEL_CONFIG = {
    name: "slotPanelComp", type: "Comp", class: "MPSlotPanelComp",
    Elements: [
        { name: "panelBG", type: "Sprite", image: "winpanelbg" },
        {
            name: "winComp", type: "Comp", class: "PanelWinComp",
            Elements: [
                { name: "lineWinText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 22, mFontSize: 32, anchor: { x: 0.5, y: 0 }, y: 0 },
                { name: "valueText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 30, mFontSize: 50, anchor: { x: 0.5, y: 0 }, y: 50 }
            ]
        },
        {
            name: "fsWinComp", type: "Comp", class: "FSPanelWinComp",
            Elements: [
                { name: "totalWinText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 40, mFontSize: 40, anchor: { x: 0.5, y: 0 }, y: 0 },
                { name: "valueText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 32, mFontSize: 32, anchor: { x: 0.5, y: 0 }, y: 50 }
            ]
        },
        {
            name: "spinBtn", type: "Comp", class: "SpinButtonV2",
            Elements: [
                { name: "spinBg", type: "Sprite", image: "ui_bottom_P", anchor: { x: 0.5, y: 0.5 }, scale: 1.08, y: 165 },
                {
                    name: "buttonAnim", type: "Spine", spineName: "spin_button", defaultState: "", loop: false, scale: 1.15,
                    animations: { idle: "staitc", press: "sweep" }
                }
            ]
        },

        {
            name: "balanceComp", type: "Comp", class: "BalanceComp",
            Elements: [
                { name: "clickBG", type: "Sprite", image: "balancebg_currency" },
                { name: "valueText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 40, mFontSize: 55, anchor: { x: 0.5, y: 0.5 } }
            ]
        },
        {
            name: "stakeComp", type: "Comp", class: "StakeComp",
            Elements: [
                { name: "clickBG", type: "Button", images: ["betbg_up", "betbg_over", "betbg_down"] },
                {
                    name: "cont", type: "Container",
                    Elements: [
                        {
                            name: "titleText",
                            type: "Text",
                            content: "totalBetsCaps",
                            style: "commonFontStyle",
                            fontSize: 30,
                            mFontSize: 55,
                            anchor: { x: 0, y: 0 }
                        },
                        {
                            name: "valueText",
                            type: "Text",
                            contentText: "1.00",
                            style: "commonFontStyle",
                            fontSize: 30,
                            mFontSize: 55,
                            anchor: { x: 0, y: 0 }
                        },
                    ]
                }
            ]
        },
        { name: "autospinBtn", type: "Button", images: ["autospinBtn_up", "autospinBtn_over", "autospinBtn_down"] },
        { name: "autoStopBtn", type: "Button", images: ["stopAutoSpinBtn_up", "stopAutoSpinBtn_over", "stopAutoSpinBtn_down"], },
        { name: "turboBtn", type: "Button", images: ["turboOnBtn_up", "turboOnBtn_over", "turboOnBtn_down"] },
        { name: "turboSelectedBtn", type: "Button", images: ["turboOffBtn_up", "turboOffBtn_over", "turboOffBtn_down"], x: 2002, y: 80 },

        { name: "menuBtn", type: "Button", images: ["menuBtn_up", "menuBtn_over", "menuBtn_down"] },
        { name: "soundOnBtn", type: "Button", images: ["soundOnBtn_up", "soundOnBtn_over", "soundOnBtn_down"] },
        { name: "soundOffBtn", type: "Button", images: ["soundOffBtn_up", "soundOffBtn_over", "soundOffBtn_down"] },
        { name: "fullScreenBtn", type: "Button", images: ["fullscreenBtn_up", "fullscreenBtn_over", "fullscreenBtn_down"] },
        { name: "smallScreenBtn", type: "Button", images: ["smallscreenBtn_up", "smallscreenBtn_over", "smallscreenBtn_down"] },
        {
            name: "buyBonusBtn", type: "Button", images: ["buybonusBtn_up", "buybonusBtn_over", "buybonusBtn_down"],
            //textConfig: { name: "tText", type: "Text", content: "buyBonusTitle", style: "buyBonusFontStyle", fontSize: 20, inactiveTextColor: 0xffffff, activeTextColor: 0x000000 }
        },
        { name: "exitBtn", type: "Button", images: ["exitBtn_up", "exitBtn_over", "exitBtn_down"] },
        { name: "settingsBtn", type: "Button", images: ["devSettingsBtn_up", "devSettingsBtn_over", "devSettingsBtn_down"] },
        { name: "cheatBtn", type: "Button", images: ["bonuscheatBtn_up", "bonuscheatBtn_over", "bonuscheatBtn_down"] },

        {
            name: "menuComponents", type: "Comp", class: "MenuButtonComp",
            Elements: [
                { name: "historyBtn", type: "Button", images: ["historyBtn_up", "historyBtn_over", "historyBtn_down"] },
                { name: "helpBtn", type: "Button", images: ["helpBtn_up", "helpBtn_over", "helpBtn_down"] },
                { name: "fxOnBtn", type: "Button", images: ["sfxOnBtn_up", "sfxOnBtn_over", "sfxOnBtn_down"], x: 200 },
                { name: "fxOffBtn", type: "Button", images: ["sfxOffBtn_up", "sfxOffBtn_over", "sfxOffBtn_down"], x: 200 },
                { name: "musicOnBtn", type: "Button", images: ["musicOnBtn_up", "musicOnBtn_over", "musicOnBtn_down"], x: 300 },
                { name: "musicOffBtn", type: "Button", images: ["musicOffBtn_up", "musicOffBtn_over", "musicOffBtn_down"], x: 300 },
            ]
        },
        {
            name: "autoCounterBG", type: "Comp", class: "SpinCounterV2",
            Elements: [
                {
                    name: "buttonAnim", type: "Spine", spineName: "stop_cut", defaultState: "", loop: false,
                    animations: { idle: "static" }
                },
            ]
        },
        { name: "autoCounterText", type: "Text", contentText: "", style: "commonFontStyle", fontSize: 95, mFontSize: 85, anchor: { x: 0.5, y: 0.5 }, x: 12 },
    ],
    layoutData: {
        "Desktop": {},
        "Portrait": {},
        "Landscape": {},
    }
}
