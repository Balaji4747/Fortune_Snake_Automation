export const GAME_SPLASH_CONFIG = {
    name: "splashComp", type: "Comp", class: "GameSplashComp",
    Elements: [
        {
            name: "splashbg", type: "DualImage", image: "splashbg",
            layoutData: {
                "Desktop": { hAlign: "center", vAlign: "top", fitToScreen: true },
                "Portrait": { hAlign: "center", vAlign: "top", fitToScreen: true },
                "Landscape": { hAlign: "center", vAlign: "top", fitToScreen: true },
            }
        },
        {
            name: "bg", type: "Graphics", color: 0x000000, width: 3500, height: 3500, alpha: 0.8,
            layoutData: {
                Desktop: { fitToScreen: true },
                Landscape: { fitToScreen: true },
                Portrait: { fitToScreen: true }
            }
        },
        {
            name: "volatilityCompDesk", type: "Comp", class: "VolatilityComp", value: 3, textStyle: "gameFont1Style",
            fontMLProps: {
                id: { fontSize: 33 },
                ja: { fontSize: 35 }
            }
        },
        {
            name: "pagesComp", type: "Comp", class: "PaytablePagesV2", x: 0, y: 0, maxWidth: 0.98, maxHeight: 0.98, pMaxWidth: 0.92, pMaxHeight: 1, lMaxWidth: 0.98, lMaxHeight: 0.9, scrollGap: 3000,
            Elements: [
                { name: "guideRect", type: "Graphics", color: 0xffff00, width: 2415, height: 1533, pWidth: 826, pHeight: 1971, lWidth: 2415, lHeight: 1533, alpha: 0 },
                { name: "splashlogo", type: "Sprite", image: "gamelogo_splash", anchor: { x: 0.5, y: 0.5 }, x: 1240, y: 140, px: 440, py: 144, lx: 1240, ly: 140, scale: 0.7 },
                {
                    name: "volatilityComp", type: "Comp", class: "VolatilityComp", value: 3, textStyle: "gameFont1Style", x: 0, y: 1390, px: 100, py: 1663, lx: 0, ly: 1350,
                    fontMLProps: {
                        id: { fontSize: 48 }
                    }
                },
                {
                    name: "pageContainer", type: "Container", x: 0, y: -10,
                    Elements: [
                        { name: "guideRect", type: "Graphics", width: 820, height: 400, color: 0xff0000, alpha: 0 },
                        {
                            name: "page1", type: "Comp", class: "PixiContainer", x: 0, y: 300, px: -363, py: 300, lx: 0, ly: 300,
                            Elements: [
                                { name: "screen", type: "Sprite", image: "screen1", x: 0 },
                                { name: "scatterItem", type: "Text", content: "splashText1", style: "paytableDescSplashStyle", align: "left", x: 45, y: 789 },
                            ]
                        },
                        {
                            name: "page2", type: "Comp", class: "PixiContainer", x: 800, y: 300, px: -363, py: 300, lx: 800, ly: 300,
                            Elements: [
                                { name: "screen", type: "Sprite", image: "screen2", x: 0 },
                                { name: "scatterItem", type: "Text", content: "splashText2", style: "paytableDescSplashStyle", align: "left", x: 45, y: 789 },
                            ]
                        },
                        {
                            name: "page3", type: "Comp", class: "PixiContainer", x: 1600, y: 300, px: -363, py: 300, lx: 1600, ly: 300,
                            Elements: [
                                { name: "screen", type: "Sprite", image: "screen3", x: 0 },
                                { name: "scatterItem", type: "Text", content: "splashText3", style: "paytableDescSplashStyle", align: "left", x: 45, y: 789 },
                            ]
                        },
                    ]
                },
                {
                    name: "clickToContinue", type: "Button", images: ["startButton", "startButton", "startButton"], anchor: { x: 0.5, y: 0.5 }, x: 1200, y: 1434, px: 820, py: 1560, lx: 1200, ly: 1434, scale: 1.4,
                    textConfig: { name: "btnText", type: "Text", content: "startNowText", style: "SplashStartNowStyle", x: -25, y: -135 }
                },
            ]
        },
        //certification
        { name: "companyLogo", type: "Sprite", image: "company_logo", anchor: { x: 0.5, y: 0.5 } },
        { name: "certification", type: "Sprite", image: "certified", anchor: { x: 0.5, y: 0.5 } },
        { name: "rightReserved", type: "Sprite", image: "rightReserved", anchor: { x: 0.5, y: 0.5 } },
        { name: "companyWebLink", type: "Sprite", image: "company_weblink", anchor: { x: 0.5, y: 0.5 }, },
    ],
    layoutData: {
        "Desktop": { x: 0, y: 0 }
    }

}
