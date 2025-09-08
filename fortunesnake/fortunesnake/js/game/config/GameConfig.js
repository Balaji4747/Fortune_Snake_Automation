export const GAME_CONFIG = {
    gameFHDWidth: 2560,
    gameFHDHeight: 1440,
    gameHDWidth: 1920,
    gameHDHeight: 1080,
    desktopWidth: 1920,
    desktopHeight: 1080,
    gameBGColor: 0x000000,
    globalAnimSpeed: 0.50,
    debugMode: false,
    gameName: "Money Pot",
    configPath: "gameassets/",
    commonPath: "../common/",
    gamePath: "gameassets/",
    mobileHalfAsset: true,

    gameId: "fortunesnake",
    gameVersion: "0.30",
    gameAssetVersion: "1.04",
    gameLangId: "64cc960b0ac6884646918d1e",

    noOfLines: 10,
    creditValue: 1,
    isFiveOfAKindWin: false,
    initURL: "init",
    spinURL: "spin",
    bonusURL: "feature",
    bigWinMultipliers: [0, 2500, 50, 100, 200],
    messageTimeoutDelay: 16000,
    winDestroyDelay: 0.5,
    playerId: "123441",
    playLineWinSound: true,
    showPaylinAnim: true,
    isStandAlone: true,
    rtpValue: "97.00",
    scatterMultiplierGame: true,
    featureTypes: {
        freespins: "respin"
    },
    spinButtonBG: { name: "btnBG", type: "Spine", spineName: "bg_blue", defaultState: "bg_blue", loop: true },
    reelSpinSettings: {
        firstReelSymbolPassCount: 10,
        otherReelsSymbolPassCount: 40,
        reelSpinSpeedMax: 60,
        reelSpinSpeedMin: 60,
        reelSpinAcceleration: 3,
        anticipationSymbolPassCount: 10,
        endJerkDistance: 200,
        jerkEaseParam1: 12,
        jerkEaseParam2: 2,
        bigWinDuration: 5,
        expandingWildDuration: 2,
        bigWinSkipDelay: 4,
    },
    currencyUI: {
        digitXPadding: 0.96,
        dotXPadding: 0.8,
        commaXPadding: 0.65,
        alphabetXPadding: 0.96,
    },
    // buyBonusData: {
    //     features: [
    //         { title: "freespinTextCaps", description: "buyBonusDescription", buyMultiplier: 100, image: "buyBonusIcon", featureId: "FG1" }
    //     ]
    // }

}
