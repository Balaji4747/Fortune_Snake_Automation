export const WIN_PANEL_CONFIG = {
    name: "winPanelComp", type: "Comp", class: "WinPanelComp", resizeChildren: true,
    Elements: [
        { name: "guideRect", type: "Graphics", color: 0xffff00, width: 2465, height: 1545, pWidth: 1442, pHeight: 1872, lWidth: 2465, lHeight: 1545, alpha: 0 },
        { name: "sweep10", type: "Sprite", image: "10-sweep", anchor: { x: 0.5, y: 0.5 }, scale: 0.6 },
        {
            name: "messageTextComp", type: "Comp", class: "MessageTextComp", x: 1224, y: 1645, px: 720, py: 1874, lx: 1224, ly: 1650,
            Elements: [
                { name: "maskRect", type: "Graphics", color: 0xffff00, width: 1215, height: 145, pWidth: 0, pHeight: 0, lWidth: 0, lHeight: 0, x: -610, y: -72, px: 0, py: 0, lx: 0, ly: 0 },
                { name: "message_bg", type: "Spine", spineName: "panels_bot", defaultState: "green_static", x: 0, y: 0, scale: {x: 0.96, y: 1.14} },
                // { name: "message_bg", type: "Spine", spineName: "panels_bot", defaultState: "green_static", x: 0, y: 0, scale: 1, lScale: { x: 1, y: 1.2 } },
                // { name: "message_fg", type: "DualImage", image: "win_panel_fs", x: 0, y: 0 },
                // { name: "glowBarAnim", type: "Spine", spineName: "panel_land", defaultState: "panel_gold_land_win", loop: false, x: 945, y: 65, px: 705, py: 108, lx: 800, ly: 76, scale: { x: 1.25, y: 1.1 }, pScale: 1, lScale: { x: 1.05, y: 1.2 } },
                // { name: "glowBarAnimFG", type: "Spine", spineName: "panel_vert", defaultState: "panel_gold_v_win", loop: false, x: 945, y: 65, px: 705, py: 108, lx: 800, ly: 76, scale: { x: 1.25, y: 1.1 }, pScale: 1, lScale: { x: 1.05, y: 1.2 } },
                // { name: "winText", type: "Text", content: "", style: "PopupTitleStyle3", x: 945, y: 62, anchor: { x: 0.5, y: 0.5 }, px: 715, py: 110, lx: 805, ly: 67 },
                {
                    name: "winAmountComp", type: "Comp", class: "SlotSpinWinAnimAmountCompV2", x: 0, y: 0, durationFactor: 0.15,
                    Elements: [

                        { name: "winText2", type: "Text", content: "", style: "winTextStyle", fontSize: 74, anchor: { x: 0.5, y: 0.5 }, x: -167 },
                        { name: "winText", type: "Text", content: "", style: "winTextStyle", fontSize: 74, anchor: { x: 0.5, y: 0.5 } },
                    ]
                },
                { name: "messageText", type: "Text", content: "messageText1", style: "msgTextStyle", x: 0, y: 0, anchor: { x: 0.5, y: 0.5 }, px: 0, py: 0, lx: 0, ly: 0 },
                {
                    name: "multTextContainer", type: "Container",
                    Elements: [
                        { name: "preText", type: "Text", content: "preMessageText", style: "msgTextStyle", x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                        { name: "fsWinsymbol", type: "Sprite", image: "L1", anchor: { x: 0.5, y: 0.5 }, x: 0, y: 0, scale: 0.4 },
                        { name: "orText", type: "Text", content: "orText", style: "msgTextStyle", x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                        { name: "WDimg", type: "Sprite", image: "WD", anchor: { x: 0.5, y: 0.5 }, x: 0, y: 0, scale: 0.45 },
                        { name: "postText", type: "Text", content: "postMessageText", style: "msgTextStyle", x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                    ]
                }
            ]
        }
    ],
    layoutData: {
        "Desktop": { hAlign: "center", vAlign: "middle", widthPerc: 0.8, heightPerc: 0.8, hPaddingPerc: -0, vPaddingPerc: -0.014 },
        "Portrait": { hAlign: "center", vAlign: "middle", widthPerc: 1, heightPerc: 0.95, vPaddingPerc: 0 },
        "Landscape": { hAlign: "center", vAlign: "middle", widthPerc: 0.8, heightPerc: 0.8, hPaddingPerc: 0, vPaddingPerc: -0.014 },
    }
}
