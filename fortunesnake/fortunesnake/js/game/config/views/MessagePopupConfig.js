export const MESSAGE_POPUP_CONFIG = {
    name: "popupComp", type: "Comp", class: "MessagePopupViewV2",
    Elements: [
        { name: "bg", type: "Graphics", width: 2560, height: 1440, color: 0x000000, alpha: 0.5 },
        {
            name: "popup", type: "Comp", class: "PopupCompV2",
            Elements: [
                { name: "guideRect", type: "Graphics", width: 1491, height: 1800, color: 0xffffff, alpha: 0 },
                { name: "popupbg", type: "Spine", spineName: "popups", defaultState: "pop2_idle", loop: true},
                { name: "titleText", type: "Text", contentText: "", style: "PopupTitleStyle", anchor: { x: 0.5, y: 0.5 }, x: 0, y:-132 },
                { name: "message1", type: "Text", contentText: "", style: "PopupMessage1Style", anchor: { x: 0.5, y: 0.5 }, x: 0, y: -52 },
                { name: "message3", type: "Text", contentText: "", style: "PopupTitleStyle", anchor: { x: 0.5, y: 0.5 }, x: 0, y: 21 },
                { name: "message2", type: "Text", contentText: "", style: "PopupMessage1Style", anchor: { x: 0.5, y: 0.5 }, x: 0, y: 100 },
                {
                    name: "okBtn", type: "Button", images: ["okbtn", "okbtn", "okbtn"], x: 0, y: 214, scale: 0.7,
                    textConfig: { name: "btnText", type: "okText", content: "okText", style: "gameFont2Style" },
                },
            ]
        }
    ],
    layoutData: {
        "Desktop": { hAlign: "left", vAlign: "top", widthPerc: 2.9, heightPerc: 2.9 },
        "Portrait": { hAlign: "left", vAlign: "top", widthPerc: 4, heightPerc: 4 },
        "Landscape": { hAlign: "left", vAlign: "top", widthPerc: 4, heightPerc: 4 },
    }

}
