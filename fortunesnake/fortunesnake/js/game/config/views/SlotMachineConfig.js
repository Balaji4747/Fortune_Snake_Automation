export const SLOT_MACHINE_CONFIG = {
    name: "slotMachineComp", type: "Comp", class: "GameSlotMachineComp", resizeChildren: true,
    Elements: [
        { name: "guideRect", type: "Graphics", color: 0xffff00, width: 2465, height: 1545, pWidth: 1442, pHeight: 1872, lWidth: 2465, lHeight: 1545, alpha: 1 },
        { name: "reelFrame", type: "Sprite", image: "reelFrame", alpha: 0, scale: 1, pScale: 1, lScale: 1, x: 0, y: 0, px: 0, py: 0, lx: 0, ly: 0 },
        // {
        //     name: "backGroundAnim", type: "Container", 
        //     Elements: [
        //        { name:"topLeft", type: "Sprite", image: ""}
        //     ]
        // },
        {
            name: "winAmountComp", type: "Comp", class: "SlotSpinWinAnimAmountComp", x: 1154, y: 1174, px: 750, py: 1698, lx: 1138, ly: 1171, durationFactor: 0.15,
            Elements: [
                { name: "winPanelBg", type: "Sprite", image: "win_panelV2", scale: 1, anchor: { x: 0.5, y: 0.5 } },
                { name: "winText", type: "Comp", class: "LibAmountText", style: "winAmountStyle", fontSize: 500, anchor: { x: 0.5, y: 0.5 }, scale: 0.65 },
                { name: "winText2", type: "Comp", class: "LibAmountText", style: "winAmountStyle", fontSize: 500, anchor: { x: 0.5, y: 0.5 }, scale: 0.65 }
            ]
        },
        {
            name: "slotMachine", type: "Comp", class: "GameSlotMachine", x: 504, y: 0, px: 0, py: 230, ly: 0, lx: 504, disableMask: true, resizeChildren: true,
            Elements: [
                { name: "snakemain", type: "Spine", spineName: "snake main2", defaultState: "land_green_idle", loop: true, scale: 0.97, x: 644, y: 950 },
                { name: "snakemainP", type: "Spine", spineName: "snake main2", defaultState: "port_green_idle", loop: true, scale: 1, x: 686, y: 1060 },
                { name: "jukeBox", type: "Sprite", image: "jukeBox", alpha: 1, scale: 0.5, pScale: 0.7, lScale: 0.5, x: -721, y: 1114, px: 0, py: 0, lx: 0, ly: 0 },
                { name: "sweep10", type: "Sprite", image: "10-sweep", x: 716, y: 170, anchor: { x: 0.5, y: 0.5 }, scale: 0.4 },
                { name: "reelFrame", type: "Sprite", image: "reelFrame", alpha: 1, scale: 1, pScale: 1, lScale: 1, x: 0, y: 0, px: 0, py: 0, lx: 0, ly: 0 },
                { name: "maskRect", type: "Graphics", color: 0xff0000, alpha: 1, width: 555, height: 1119, pWidth: 555, pHeight: 1119, lWidth: 555, lHeight: 1119, x: 106, y: 210, px: 106, py: 210, lx: 106, ly: 210 },
                // { name: "maskRect2", type: "Graphics", color: 0xff0000, alpha: 1, width: 536, height: 1485, pWidth: 555, pHeight: 1485, lWidth: 536, lHeight: 1485, x: 460, y: 24, px: 460, py: 24, lx: 460, ly: 24 },
                { name: "maskRect2", type: "Sprite", image: "maskReelFrame", alpha: 1, scale: 1, pScale: 1, lScale: 1, x: 100, y: 28, px: 100, py: 28, lx: 100, ly: 28 },
                { name: "maskRect3", type: "Graphics", color: 0xff0000, alpha: 1, width: 555, height: 1119, pWidth: 555, pHeight: 1119, lWidth: 555, lHeight: 1119, x: 778, y: 210, px: 778, py: 210, lx: 778, ly: 210 },
                
                { name: "freeSpinSnakeAnimCont", type: "Container", y: 1050, py: 1050, ly: 1050,
                    Elements: [
                        { name: "snakeManinTop", type: "Spine", spineName: "snake main_top", defaultState: "port_green_rise_up", loop: true, x: 607, y: 0},
                        { name: "snakeManinTopP", type: "Spine", spineName: "snake main_top", defaultState: "port_green_rise_up", loop: false, x: 700, y: 0},
                        { name: "circleFortuneAnim", type: "Spine", spineName: "fortune_snake", defaultState: "idle", loop: false, x: 722, y: 0},
                    ]
                },

                {
                    name: "leftLineNumCont", type: "Container", x: 8, y: 0, px: 0, py: 0, lx: 0, ly: 0,
                    Elements: [
                        { name: "line1", type: "Sprite", image: "line_1", scale: 1, pScale: 1, x: 0, y: 422, px: 0, py: 809, lx: 318, ly: 296 },
                        { name: "line2", type: "Sprite", image: "line_2", scale: 1, pScale: 1, x: 0, y: 246, px: 0, py: 1178, lx: 318, ly: 648 },
                        { name: "line3", type: "Sprite", image: "line_3", scale: 1, pScale: 1, x: 0, y: 334, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line4", type: "Sprite", image: "line_4", scale: 1, pScale: 1, x: 0, y: 782, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line5", type: "Sprite", image: "line_5", scale: 1, pScale: 1, x: 0, y: 870, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line6", type: "Sprite", image: "line_6", scale: 1, pScale: 1, x: 0, y: 606, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line7", type: "Sprite", image: "line_7", scale: 1, pScale: 1, x: 0, y: 694, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line8", type: "Sprite", image: "line_8", scale: 1, pScale: 1, x: 0, y: 1146, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line9", type: "Sprite", image: "line_9", scale: 1, pScale: 1, x: 0, y: 1234, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line10", type: "Sprite", image: "line_10", scale: 1, pScale: 1, x: 0, y: 1058, px: 0, py: 1542, lx: 318, ly: 1016 },
                    ]
                },
                {
                    name: "rightLineNumCont", type: "Container", x: 1354, y: 0, px: 0, py: 0, lx: 0, ly: 0,
                    Elements: [
                        { name: "line1", type: "Sprite", image: "line_1", scale: 1, pScale: 1, x: 0, y: 422, px: 0, py: 809, lx: 318, ly: 296 },
                        { name: "line2", type: "Sprite", image: "line_2", scale: 1, pScale: 1, x: 0, y: 246, px: 0, py: 1178, lx: 318, ly: 648 },
                        { name: "line3", type: "Sprite", image: "line_3", scale: 1, pScale: 1, x: 0, y: 782, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line4", type: "Sprite", image: "line_4", scale: 1, pScale: 1, x: 0, y: 334, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line5", type: "Sprite", image: "line_5", scale: 1, pScale: 1, x: 0, y: 870, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line6", type: "Sprite", image: "line_6", scale: 1, pScale: 1, x: 0, y: 606, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line7", type: "Sprite", image: "line_7", scale: 1, pScale: 1, x: 0, y: 1146, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line8", type: "Sprite", image: "line_8", scale: 1, pScale: 1, x: 0, y: 694, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line9", type: "Sprite", image: "line_9", scale: 1, pScale: 1, x: 0, y: 1234, px: 0, py: 1542, lx: 318, ly: 1016 },
                        { name: "line10", type: "Sprite", image: "line_10", scale: 1, pScale: 1, x: 0, y: 1058, px: 0, py: 1542, lx: 318, ly: 1016 },
                    ]
                },
                {
                    name: "frameAnimContainer", type: "Container", x: 0, y: 0, px: 58, py: 132, lx: 58, ly: 0, scale: 1, scale: 1, pScale: 1, lScale: 1,
                    Elements: [
                        { name: "frame1", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 304, y: 394, scale: 1.1 },
                        { name: "frame2", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 718, y: 208, scale: 1.1 },
                        { name: "frame3", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 1135, y: 394, scale: 1.1 },
                        { name: "frame4", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 304, y: 768, scale: 1.1 },
                        { name: "frame5", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 718, y: 580, scale: 1.1 },
                        { name: "frame6", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 1134, y: 768, scale: 1.1 },
                        { name: "frame7", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 304, y: 1142, scale: 1.1 },
                        { name: "frame8", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 718, y: 953, scale: 1.1 },
                        { name: "frame9", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 1134, y: 1142, scale: 1.1 },
                        { name: "frame10", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", loop: false, x: 718, y: 1325, scale: 1.1 },
                        // { name: "frame11", type: "Spine", spineName: "frame_bottom wild_multi", defaultState: "cyrcle_shine", loop: true, x: 719, y: 772, scale: {x: 1.32, y: 1.33 } },
                        // { name: "frame11", type: "Spine", spineName: "frame_1", defaultState: "frame_win1_start", x: 0, y: 220, scale: 1.1 }
                    ]
                },
                {
                    name: "paylinesComp", type: "Comp", class: "GamePaylinesComp", x: 58, y: 0, px: 58, py: 132, lx: 58, ly: 0, scale: 1, scale: 1, pScale: 1, lScale: 1, alpha: 0.5,
                    Elements: [
                        { name: "payline2", type: "Sprite", image: "paylines_2", x: 0, y: 220, scale: 1, px: 0, py: 1056, pScale: 1, lx: 0, ly: 656 },
                        { name: "payline3", type: "Sprite", image: "paylines_3", x: 0, y: 342, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline1", type: "Sprite", image: "paylines_1", x: 0, y: 86, scale: 1, px: 0, py: 685, pScale: 1, lx: 0, ly: 310 },
                        { name: "payline6", type: "Sprite", image: "paylines_6", x: 0, y: 589, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline7", type: "Sprite", image: "paylines_7", x: 0, y: 707, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline4", type: "Sprite", image: "paylines_4", x: 0, y: 340, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline5", type: "Sprite", image: "paylines_5", x: 0, y: 450, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline10", type: "Sprite", image: "paylines_10", x: 0, y: 962, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline8", type: "Sprite", image: "paylines_8", x: 0, y: 701, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                        { name: "payline9", type: "Sprite", image: "paylines_9", x: 0, y: 813, scale: 1, px: 0, py: 1426, pScale: 1, lx: 0, ly: 1025 },
                    ]
                },
                { name: "coverRect", type: "Sprite", image: "reelFrameCover", alpha: 1, scale: 1, pScale: 1, lScale: 1, x: 100, y: 28, px: 100, py: 28, lx: 100, ly: 28, alpha: 0.5 },
                { name: "coverRectbg", type: "Graphics", color: 0x000000, width: 10000, height: 10000, x: -1000, y: -2000, alpha: 0.6 },
            ],
            data: {
                noOfReels: 3,
                noOfRows: [3, 4, 3],
                reelHeight: 1000,
                reelsView: [["H1", "H1", "H1"], ["Big_WD", "WD", "WD", "WD"], ["H2", "H2", "H2"]],
                // reelsView: [["CS", "CS", "CS"], ["CS", "CS", "CS"], ["CS", "CS", "CS"]],
                reelPositionX: [0, 420, 836],
                reelPositionXL: [0, 420, 836],
                reelPositionXP: [0, 420, 836],
                reelContainerPos: { x: 304, y: 392 },
                reelContainerPosL: { x: 304, y: 392 },
                reelContainerPosP: { x: 304, y: 392 },

                reelContainerPos2: { x: 304, y: 212 },
                reelContainerPosL2: { x: 304, y: 212 },
                reelContainerPosP2: { x: 304, y: 212 },

                reelContainerPos3: { x: 304, y: 392 },
                reelContainerPosL3: { x: 304, y: 392 },
                reelContainerPosP3: { x: 304, y: 392 },

                symbolHeight: 374,
                symbolHeightL: 374,
                symbolHeightP: 374,
                symbolGap: 0,
                anticipationSymbols: ["SC"],
                landingSymbols: ["SS", "GS", "BS", "Minor", "Mini", "Major"],
                anticipationDelay: 2500,
                reelSymbols: [
                    ["H1", "L3", "H2", "WD", "L1", "L2", "H1", "WD"],
                    ["H2", "L2", "H1", "L4", "L3", "WD", "L1", "L2"],
                    ["L1", "H1", "L3", "L2", "WD", "L4", "H2", "L2", "WD"],
                    ["L1", "H1", "L3", "L2", "WD", "L4", "H2", "L2", "L2"],
                    ["H1", "L3", "H2", "WD", "L1", "L2", "H1", "WD"],
                    ["H2", "L2", "H1", "L4", "L3", "WD", "L1", "L2"],
                    ["L1", "H1", "L3", "L2", "WD", "L4", "H2", "L2", "WD"]
                    ["L1", "H1", "L3", "L2", "WD", "L4", "H2", "L2", "L2"]
                ],
                topAndBottomSymbol: ["L1", "L2", "L3", "L4"],
                symbolsData: {
                    "H1": {
                        name: "H1",
                        type: "Spine", spineName: "ingot", winAnimation: "win", defaultState: "win", loop: true, scale: 1,
                    },
                    "H2": {
                        name: "H2",
                        type: "Spine", spineName: "gold", winAnimation: "win", defaultState: "win", loop: true, scale: 1,
                    },
                    "L1": {
                        name: "L1",
                        type: "Spine", spineName: "angbao", winAnimation: "win", defaultState: "win", loop: true, scale: 1,
                    },
                    "L2": {
                        name: "L2",
                        type: "Spine", spineName: "microphone", winAnimation: "win", defaultState: "win", loop: true, scale: 1,
                    },
                    "L3": {
                        name: "L3",
                        type: "Spine", spineName: "coins", winAnimation: "win", defaultState: "win", loop: true, scale: 1,
                    },
                    "L4": {
                        name: "L4",
                        type: "Spine", spineName: "firecracker", winAnimation: "win", defaultState: "win", loop: true, scale: 1,
                    },
                    "WD": {
                        name: "WD",
                        type: "Spine", spineName: "Wild", winAnimation: "frame1_cycle", defaultState: "frame1_cycle", loop: true, scale: 1,
                        winAnimationNoGlow: { type: "Spine", spineName: "Wild", defaultState: "frame1_cycle_no_glow", loop: true, scale: 1.12, x: 0, y: 0, pScale: 1, lScale: 1 },
                    },
                    "Big_WD": {
                        name: "Big_WD", y: 560,
                        type: "Spine", spineName: "Wild", winAnimation: "frame3_cycle_eye", defaultState: "frame3_cycle_eye", loop: true, scale: 1, winAnimY: 1102, winScale: 1.12,
                        idleAnimation: { type: "Spine", spineName: "Wild", defaultState: "frame3_cycle_eye_no_glow", loop: true, scale: 1.12, x: 0, y: 1102 },
                        introAnimation: { type: "Spine", spineName: "Wild", defaultState: "frame3_win_intro_cycle_no_glow", loop: true, scale: 1.12, x: 0, y: 1102 },
                    },
                    "snakeBg": { name: "snakeBg", type: "Spine", spineName: "frame_bottom wild_multi", defaultState: "", loop: true, x: -4, y: 558, scale: { x: 1.32, y: 1.33 } },
                },
                winningSoundIndex: [["H1"], ["H2"], ["L1"], ["L2"], ["L3"], ["L4"], ["WD"]],
            },
        },
        // { name: "overlayBg", type: "Graphics", color: 0x00000, width: 5000, height: 5000, pWidth: 1635, pHeight: 1120, alpha: 0.5 },
    ],
    layoutData: {
        "Desktop": { hAlign: "center", vAlign: "middle", widthPerc: 0.8, heightPerc: 0.8, hPaddingPerc: -0, vPaddingPerc: -0.014 },
        "Portrait": { hAlign: "center", vAlign: "middle", widthPerc: 1, heightPerc: 0.95, vPaddingPerc: 0 },
        "Landscape": { hAlign: "center", vAlign: "middle", widthPerc: 0.8, heightPerc: 0.8, hPaddingPerc: 0, vPaddingPerc: -0.014 },
    }

}
