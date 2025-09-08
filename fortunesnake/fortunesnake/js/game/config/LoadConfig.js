const LANGUAGES_SUPPORTED = ["en", "zh", "zh_hant", "th", "ms", "id", "hi", "bn", "vi", "ko", "ja", "fil"];
const COMMON_CONTENT = { type: "commonContent", name: "commonContent.json" };
const GAME_CONTENT = { type: "gameContent", name: "gameContent.json" };
const COMMON_TEXT_CONFIG = { type: "commonConfig", name: "commonTextConfig.json" };
const TEXT_CONFIG = { type: "gameConfig", name: "TextConfig.json", languages: [] };
const PRELOADER = { COMMON: [{ TYPE: "common", ASSETTYPE: "spine", NAME: "loading.json" }, { TYPE: "common", ASSETTYPE: "sprite", NAME: "common_preloader.json" }, { TYPE: "common", ASSETTYPE: "sprite", NAME: "common_preloaderbg.json" }] };

const GAME_BITMAPFONTS = ["bitmapFont.fnt"];
const COMMON_BITMAPFONTS = [];

const SPLASH_ASSETS = [
    { TYPE: "common", NAME: "certifiedAssets.json", ASSETTYPE: "sprite" },
    { TYPE: "game", NAME: "splashAssets.json", ASSETTYPE: "sprite" },
    // spin button
    { TYPE: "game", NAME: "spin_button.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "stop_cut.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "small_sphere.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere_particles.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere_noise.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere_1_glow.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere_1.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere2_glow.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere2.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "sphere1_glow.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "particle explosion.json", ASSETTYPE: "spine" },
    // { TYPE: "common", NAME: "bg_blue.json", ASSETTYPE: "spine" },
    // end of spin button
    { TYPE: "game", NAME: "gameElements_0.json", ASSETTYPE: "Sprite"},
    { TYPE: "game", NAME: "symbols.json", ASSETTYPE: "sprite" },
    { TYPE: "game", NAME: "digits.json", ASSETTYPE: "sprite" },
]

const PRIMARY_ASSETS = [
    //GFS ASSETS:---------------
    { TYPE: "common", PROMOFS: true, NAME: "box2.json", ASSETTYPE: "spine" },
    { TYPE: "common", PROMOFS: true, NAME: "box3.json", ASSETTYPE: "spine" },
    { TYPE: "common", PROMOFS: true, NAME: "giftFSAssets.json", ASSETTYPE: "sprite" },

    { TYPE: "common", PROMOFS: true, NAME: "center_red.json", ASSETTYPE: "spine" },
    { TYPE: "common", PROMOFS: true, NAME: "character.json", ASSETTYPE: "spine" },
    { TYPE: "common", PROMOFS: true, NAME: "circle.json", ASSETTYPE: "spine" },
    { TYPE: "common", PROMOFS: true, NAME: "gift_free_spin_text.json", ASSETTYPE: "spine" },

    { TYPE: "common", PROMOFS: true, NAME: "coins_fountan.json", ASSETTYPE: "spine" },
    { TYPE: "common", PROMOFS: true, NAME: "gift_box_2.json", ASSETTYPE: "spine" },
    // ---------------------------
    //loader
    { TYPE: "common", NAME: "turtleLoader", ASSETTYPE: "sequence", SPRITESHEETS: [3, 2, 1] },
    // side panel ============= 
    { TYPE: "common", SIDEPANEL: true, NAME: "sidePanelAssets.json", ASSETTYPE: "sprite" },
    { TYPE: "common", SIDEPANEL: true, NAME: "sidePanel_arrow.json", ASSETTYPE: "spine" },
    { TYPE: "common", SIDEPANEL: true, NAME: "news.json", ASSETTYPE: "spine" },
    { TYPE: "common", SIDEPANEL: true, NAME: "free-gift.json", ASSETTYPE: "spine" },
    { TYPE: "common", SIDEPANEL: true, NAME: "rewards.json", ASSETTYPE: "spine" },
    { TYPE: "common", SIDEPANEL: true, NAME: "lobby_no_txt.json", ASSETTYPE: "spine" },
    { TYPE: "common", SIDEPANEL: true, NAME: "tournament.json", ASSETTYPE: "spine" },
    { TYPE: "common", SIDEPANEL: true, NAME: "ranking.json", ASSETTYPE: "spine" },
    // =========================
    //SNAKE symbol animations
    { TYPE: "game", NAME: "snake main2.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "panels_bot.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "paylines.json", ASSETTYPE: "Sprite" },

    //bigwins 
    { TYPE: "common", NAME: "bigwinCoins.json", ASSETTYPE: "sprite" },
        
    //symbols animations
    { TYPE: "game", NAME: "angbao.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "coins.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "gold.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "ingot.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "microphone.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "firecracker.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "Wild.json", ASSETTYPE: "spine" },

    //frame animations
    { TYPE: "game", NAME: "frame_1.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "frame_bottom wild_multi.json", ASSETTYPE: "spine" },
    
    { TYPE: "game", NAME: "coins2.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "wins_txt.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "wins_body.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "10_sweep_anim.json", ASSETTYPE: "Sprite" },
    { TYPE: "game", NAME: "reel_cloud_vert_landscape.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "snake main_top.json", ASSETTYPE: "spine" },
    { TYPE: "game", NAME: "fortune_snake.json", ASSETTYPE: "spine" },
];

const ANIMATION_ASSETS = [
    // { TYPE: "game", NAME: "coins2.json", ASSETTYPE: "spine" },
]

const GAME_DESKTOP = [{ TYPE: "common", NAME: "ControlsUIV2.json", ASSETTYPE: "sprite" }, { TYPE: "game", NAME: "gamebg", ASSETTYPE: "sequence", SPRITESHEETS: [2, 1, 2] }];

const GAME_MOBILE = [{ TYPE: "common", NAME: "ControlsUIV2Mobile.json", ASSETTYPE: "sprite" }, { TYPE: "game", NAME: "gamebg", ASSETTYPE: "sequence", SPRITESHEETS: [2, 1, 2] }, { TYPE: "common", NAME: "tutorialAssets.json", ASSETTYPE: "sprite" }];
const GAME_TABLET = [{ TYPE: "common", NAME: "ControlsUIV2.json", ASSETTYPE: "sprite" }, { TYPE: "game", NAME: "gamebg", ASSETTYPE: "sequence", SPRITESHEETS: [2, 1, 1] }, { TYPE: "common", NAME: "tutorialAssets.json", ASSETTYPE: "sprite" }];

const SECONDARY_COMMON = [

];
const SECONDARY_DESKTOP = [];
const SECONDARY_MOBILE = [];
const SECONDARY_TABLET = [];
const FONTS = [];

export const GAME_LOAD_CONFIG = {
    LANGUAGES_SUPPORTED: LANGUAGES_SUPPORTED,
    COMMON_CONTENT: COMMON_CONTENT,
    GAME_CONTENT: GAME_CONTENT,
    COMMON_TEXT_CONFIG: COMMON_TEXT_CONFIG,
    TEXT_CONFIG: TEXT_CONFIG,
    PRELOADER: PRELOADER,
    SPLASH: {
        COMMONBMPFONT: COMMON_BITMAPFONTS,
        BMPFONT: GAME_BITMAPFONTS,
        COMMON: SPLASH_ASSETS,
        DESKTOP: GAME_DESKTOP,
        MOBILE: GAME_MOBILE,
        TABLET: GAME_TABLET,
        MAXLOADPERC: 80,
    },
    PRIMARY: {
        COMMON: PRIMARY_ASSETS,
        MAXLOADPERC: 80,
    },
    ANIMATION: {
        COMMON: ANIMATION_ASSETS,
        MAXLOADPERC: 80,
    },
    SECONDARY: {
        COMMON: SECONDARY_COMMON,
        DESKTOP: SECONDARY_DESKTOP,
        MOBILE: SECONDARY_MOBILE,
        TABLET: SECONDARY_TABLET,
        MAXLOADPERC: 100,
    }
}
