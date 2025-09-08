export const SLOT_BG_CONFIG = {
    name: "bgComp", type: "Comp", class: "GameBGCompV2", resizeChildren: true,
    Elements: [
        {
            name: "maingamebg", type: "DualImage", image: "mainbg", anchor: { x: 0, y: 0 },
            layoutData: {
                "Desktop": { hAlign: "center", vAlign: "middle", fitToScreen: true, },
                Portrait: { visible: false, vAlign: "middle", fitToScreen: true, fitToScreenExtra: 1.04 },
                Landscape: { visible: true, vAlign: "middle", fitToScreen: true },
            }
        },
        {
            name: "freespinbg", type: "DualImage", image: "mainbg",
            layoutData: {
                "Desktop": { hAlign: "center", vAlign: "middle", fitToScreen: true, fitToScreenExtra: 1.1 },
                Portrait: { visible: false },
                Landscape: { visible: true },
            }
        },
        {
            name: "maingamebgHor", type: "SpineV2", spineName: "reel_cloud_vert_landscape", defaultSkin: "default", defaultState: "land_cloud_intro", boundingBox: { width: 3000, height: 1440 }, loop: false, 
            layoutData: {
                Desktop: { hAlign: "center", vAlign: "middle", fitToScreen: true, fitToScreenExtra: 0.88 },
                Portrait: { visible: false },
                Landscape: { hAlign: "center", vAlign: "middle", fitToScreen: true, fitToScreenExtra: 0.88 },
            }
        },
        {
            name: "maingamebgVer", type: "SpineV2", spineName: "reel_cloud_vert_landscape", defaultSkin: "default", defaultState: "port_cloud_intro", boundingBox: { width: 1440, height: 3000 }, loop: false,
            layoutData: {
                Desktop: { visible: false },
                Portrait: { hAlign: "center", vAlign: "middle", fitToScreen: true },
                Landscape: { visible: false },
            }
        }
    ]

}
