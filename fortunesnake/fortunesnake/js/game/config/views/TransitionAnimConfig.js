export const TRANSITION_ANIM_CONFIG = {
    name: "frameTransition", type: "Comp", class: "TransitionAnimComp",
    Elements: [
        {
            name: "frameTransitionAnimHor", type: "SpineV2", spineName: "transition_land",  boundingBox: { width: 3000, height: 1440 }, defaultSkin: "default", defaultState: "transition_land", loop: false,
            layoutData: {
                "Desktop": { hAlign: "center", vAlign: "middle", fitToScreen:true,fitToScreenExtra: 1.1},
                "Portrait": { visible: false },
                "Landscape": { hAlign: "center", vAlign: "middle", fitToScreen:true,fitToScreenExtra: 1.1}
            }
        },
        {
            name: "frameTransitionAnimVer", type: "SpineV2", spineName: "transition_vert", boundingBox: { width: 500, height: 3000 },  defaultSkin: "default", defaultState: "transition_land", loop: false,
            layoutData: {
                "Desktop": { visible: false },
                "Portrait": { hAlign: "center", vAlign: "middle", fitToScreen: true, fitToScreenExtra: 1},
                "Landscape": { visible: false },
            }
        }
    ]
}
