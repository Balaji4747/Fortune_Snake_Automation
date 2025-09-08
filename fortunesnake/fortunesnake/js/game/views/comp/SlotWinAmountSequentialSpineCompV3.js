import { CoreLib } from "../../../../../../../../Microslots-FE-SlotCore/corelib/core/CoreLib";
import { SlotWinAmountSpineCompV3 } from "./SlotWinAmountSpineCompV3"
import { UIUtil } from "../../../../../../../../Microslots-FE-SlotCore/corelib/pixiwrapper/UIUtilService";

export class SlotWinAmountSequentialSpineCompV3 extends SlotWinAmountSpineCompV3 {
    constructor(config) {
        super(config);
        this.rect = CoreLib.UIUtil.getRectangle(3500, 3500, 0x00B140);
        this.rect.x = -500;
        this.rect.y = -500;
        this.addChild(this.rect);
        this.rect.alpha = 0;
        CoreLib.UIUtil.setClickable(this.rect, true);
        CoreLib.UIUtil.addInteraction(this.rect, this.onScreenClicked.bind(this));
        UIUtil.setModalState(this.rect);
        this.rect.visible = false;

        this.clickCount = 1;
        this.maxClicks = 4;

        CoreLib.EventHandler.addEventListener("PLAY_BIG_WIN_COUNTUP_END_SOUND", this.bigWinEndDone.bind(this));
    }

    updateForCoinCash() {
        if (this.totalWin > 0) {
            this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.totalWin);
        }
        if (this.bigwinbg && this.bigwinbg.visible == false) {
            this.winText.text = "";
        }
    }

    showWin(val, level = 0, callback = null) {
        CoreLib.Model.GameConfig.bigWinMultipliersSequence = [];
        CoreLib.Model.GameConfig.bigWinMultipliersSequence.push(0);
        let index = Math.round((val * 0.80) / level);
        for (let k = 1; k < level; k++) {
            CoreLib.Model.GameConfig.bigWinMultipliersSequence.push(k * index);
        }
        clearTimeout(this.skipTimer);
        this.skipTimer = setTimeout(this.enableSkip.bind(this), CoreLib.Model.GameConfig.reelSpinSettings.bigWinSkipDelay * 1000);
        this.winLevel = level;
        this.callback = callback;
        let delay = 2000;
        const obj = this.configData.bigAnimConfig.bigWin;
        this.bigWins.scale.x = this.bigWins.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scale, 1);
        this.bigWins.visible = false;
        this.bigWinAnim.scale.x = this.bigWinAnim.scale.y = CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.scaleAnim, 1);
        this.bigWinAnim.visible = false;
        delay = 3000;
        if (this.bigwinbg) {
            this.bigwinbg.visible = true;
        }
        if (obj.x != undefined) {
            CoreLib.UIUtil.setPositionY(this.winText, obj.x);
        }
        if (obj.y != undefined) {
            CoreLib.UIUtil.setPositionY(this.winText, obj.y);
        }
        if (this.winText.configData.dynamicFont) {
            CoreLib.UIUtil.updateTextSize(this.winText, obj.fontSize);
        } else {
            CoreLib.UIUtil.updateBitmapTextSize(this.winText, obj.fontSize);
        }
        this.winText.scale.set(1);
        if (obj.textScale) {
            this.PlayWinTextAnimation(obj.textScale);
        }
        this.lastLevel = 0;
        this.totalWin = val;
        this.duration = CoreLib.Util.getAnimationDuration(val) * 2;
        this.bigWinDuration = CoreLib.Model.GameConfig.reelSpinSettings.bigWinDuration;
        if (CoreLib.Model.GameConfig.dontCountUp) {
            this.winText.text = CoreLib.WrapperService.formatWinCurrency(val);
            setTimeout(this.onScoreDone.bind(this), this.duration);
        } else {
            this.startScore = { score: 0 };
            this.scoreTween = CoreLib.AnimationManager.animateTween(this.startScore, this.bigWinDuration * level, { score: this.totalWin, ease: Linear.easeNone, onUpdate: this.showValue.bind(this, val) });
            setTimeout(this.sendCountUpEarlyNotification.bind(this), this.bigWinDuration * level * 900);
        }
        this.showLevel1();
        if (!this.configData.dontDoVibration) {
            CoreLib.Util.vibrateForBigWins();
        }
        this.lastAnimMovie = this.bigWins;
        this.lastAnimMovie2 = this.bigWinAnim;

    }

    PlayWinTextAnimation(textScale) {
        CoreLib.AnimationManager.animateTween(this.winText, 1, { scaleX: textScale, scaleY: textScale, repeat: -1, yoyo: true, ease: Linear.easeNone })
    }

    enableSkip() {
        CoreLib.EventHandler.dispatchEvent("SLOTPANEL_CLICK_STATE", false);
        this.rect.visible = true;
    }

    disableSkip() {
        this.rect.visible = false;
        CoreLib.EventHandler.dispatchEvent("SLOTPANEL_CLICK_STATE", true);
    }

    getIdleNameCheck() {
        if (this.currentLevel == 1) {
            return this.configData.bigAnimConfig.idleState;
        } else if (this.currentLevel == 2) {
            return this.configData.megaAnimConfig.idleState;
        } else if (this.currentLevel == 3) {
            return this.configData.giganticAnimConfig.idleState;
        } else if (this.currentLevel == 4) {
            return this.configData.unbelievableWinAnimConfig.idleState;
        }
    }

    onSpineAnimComplete(data) {
        if (data.name === this.getIdleNameCheck()) {
            if (this.currentLevel < this.winLevel) {
                if (this.currentLevel == 1) {
                    this.levelTimerId = setTimeout(this.startLevel2.bind(this), this.bigWinDuration);
                } else if (this.currentLevel == 2) {
                    this.levelTimerId = setTimeout(this.startLevel3.bind(this), this.bigWinDuration);
                } else if (this.currentLevel == 3) {
                    this.levelTimerId = setTimeout(this.startLevel4.bind(this), this.bigWinDuration);
                } else if (this.currentLevel == 4) {

                }
            }
        }
    }

    showLevel1() {
        this.currentLevel = 1;
        this.bigWins.visible = true;
        this.bigWinAnim.visible = true;
        this.lastAnimMovie = this.bigWins;
        this.lastAnimMovie2 = this.bigWinAnim;
        this.playNewWinsAnim();
        CoreLib.EventHandler.dispatchEvent("PLAY_BIGWINS_SPECIAL_SOUND", this.winLevel);
    }

    startLevel2() {
        this.currentLevel = 2;
        this.bigWins.visible = true;
        this.bigWinAnim.visible = true;
        this.lastAnimMovie = this.bigWins;
        this.lastAnimMovie2 = this.bigWinAnim;
        this.playNewWinsAnim();
    }

    startLevel3() {
        this.currentLevel = 3;
        this.bigWins.visible = true;
        this.bigWinAnim.visible = true;
        this.lastAnimMovie = this.bigWins;
        this.lastAnimMovie2 = this.bigWinAnim;
        this.playNewWinsAnim();
    }

    startLevel4() {
        this.currentLevel = 4;
        this.bigWins.visible = true;
        this.bigWinAnim.visible = true;
        this.lastAnimMovie = this.bigWins;
        this.lastAnimMovie2 = this.bigWinAnim;
        this.playNewWinsAnim();
    }


    // ---------------------------- 
    playNewWinsAnim() {
        clearTimeout(this.levelTimerId);
        this.setBiWinsPos(this.currentLevel);
        if (this.currentLevel == 1) {
            if (this.currentLevel == this.winLevel) {
                this.clickCount = 5;
            } else {
                this.clickCount = 1;
            }
            CoreLib.EventHandler.dispatchEvent("PLAY_BLAST_ANIMATION", this.currentLevel);
            if (this.configData.bigAnimConfig.start != undefined) {
                CoreLib.EventHandler.dispatchEvent("PLAY_BIGWIN_SPECIAL_SOUND", this.winLevel);
                this.bigWins.playAnimation(this.configData.bigAnimConfig.defaultState, this.configData.bigAnimConfig.loop != undefined ? this.configData.bigAnimConfig.loop : true);
                this.bigWinAnim.playAnimation(this.configData.bigAnimConfig.defaultState, this.configData.bigAnimConfig.loop != undefined ? this.configData.bigAnimConfig.loop : true);
            }
        } else if (this.currentLevel == 2) {
            if (this.currentLevel == this.winLevel) {
                this.clickCount = 5;
            } else {
                this.clickCount = 2;
            }
            CoreLib.EventHandler.dispatchEvent("PLAY_BLAST_ANIMATION", this.currentLevel);
            if (this.configData.megaAnimConfig.start != undefined) {
                CoreLib.EventHandler.dispatchEvent("STOP_BIGWIN_SOUND");
                CoreLib.EventHandler.dispatchEvent("PLAY_MEGAWIN_SPECIAL_SOUND");
                CoreLib.UIUtil.setPosition(this.bigWins, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData.megaAnimConfig.yPaddingPerc, 0.25));
                this.bigWins.playAnimation(this.configData.megaAnimConfig.defaultState, this.configData.megaAnimConfig.loop != undefined ? this.configData.megaAnimConfig.loop : true);
                this.bigWinAnim.playAnimation(this.configData.megaAnimConfig.defaultState, this.configData.megaAnimConfig.loop != undefined ? this.configData.megaAnimConfig.loop : true);
            }
        } else if (this.currentLevel == 3) {
            if (this.currentLevel == this.winLevel) {
                this.clickCount = 5;
            } else {
                this.clickCount = 3;
            }
            CoreLib.EventHandler.dispatchEvent("PLAY_BLAST_ANIMATION", this.currentLevel);
            if (this.configData.giganticAnimConfig.start != undefined) {
                CoreLib.EventHandler.dispatchEvent("STOP_MEGAWIN_SOUND");
                CoreLib.EventHandler.dispatchEvent("PLAY_GIGANTICWIN_SPECIAL_SOUND");
                CoreLib.UIUtil.setPosition(this.bigWins, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData.giganticAnimConfig.yPaddingPerc, 0.25));
                this.bigWins.playAnimation(this.configData.giganticAnimConfig.defaultState, this.configData.giganticAnimConfig.loop != undefined ? this.configData.giganticAnimConfig.loop : true);
                this.bigWinAnim.playAnimation(this.configData.giganticAnimConfig.defaultState, this.configData.giganticAnimConfig.loop != undefined ? this.configData.giganticAnimConfig.loop : true);
            }
        } else if (this.currentLevel == 4) {
            if (this.currentLevel == this.winLevel) {
                this.clickCount = 5;
            } else {
                this.clickCount = 4;
            }
            CoreLib.EventHandler.dispatchEvent("PLAY_BLAST_ANIMATION", this.currentLevel);
            if (this.configData.unbelievableWinAnimConfig.start != undefined) {
                CoreLib.EventHandler.dispatchEvent("STOP_GIGANTICWIN_SOUND");
                CoreLib.EventHandler.dispatchEvent("PLAY_UNBELIEVABLEWIN_SPECIAL_SOUND");
                CoreLib.UIUtil.setPosition(this.bigWins, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData.bigAnimConfig.xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData.unbelievableWinAnimConfig.yPaddingPerc, 0.25));
                this.bigWins.playAnimation(this.configData.unbelievableWinAnimConfig.defaultState, this.configData.unbelievableWinAnimConfig.loop != undefined ? this.configData.unbelievableWinAnimConfig.loop : true);
                this.bigWinAnim.playAnimation(this.configData.unbelievableWinAnimConfig.defaultState, this.configData.unbelievableWinAnimConfig.loop != undefined ? this.configData.unbelievableWinAnimConfig.loop : true);
            }
        }


        let scaleX, scaleY;
        if (this.currentLevel == 1) {
            scaleX = this.configData.bigAnimConfig.scaleX;
            scaleY = this.configData.bigAnimConfig.scaleY;
        } else if (this.currentLevel == 2) {
            scaleX = this.configData.megaAnimConfig.scaleX;
            scaleY = this.configData.megaAnimConfig.scaleY;
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    scaleX = this.configData.unbelievableWinAnimConfig.scaleX * 0.9;
                    scaleY = this.configData.unbelievableWinAnimConfig.scaleY * 0.9;
                }
            }
        } else if (this.currentLevel == 3) {
            scaleX = this.configData.giganticAnimConfig.scaleX;
            scaleY = this.configData.giganticAnimConfig.scaleY;

            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    scaleX = this.configData.unbelievableWinAnimConfig.scaleX * 0.9;
                    scaleY = this.configData.unbelievableWinAnimConfig.scaleY * 0.9;
                }
            }
        } else if (this.currentLevel == 4) {
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    scaleX = this.configData.unbelievableWinAnimConfig.scaleX * 0.8;
                    scaleY = this.configData.unbelievableWinAnimConfig.scaleY * 0.8;
                } else {
                    scaleX = this.configData.unbelievableWinAnimConfig.scaleX;
                    scaleY = this.configData.unbelievableWinAnimConfig.scaleY;
                }
            } else {
                scaleX = this.configData.unbelievableWinAnimConfig.scaleX *  1.1;
                scaleY = this.configData.unbelievableWinAnimConfig.scaleY * 1.1;
            }

        }


        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                const animateWins = (target) => {
                    CoreLib.AnimationManager.animateTween(target, 0.4, {
                        scaleX: scaleX * 1.3,
                        scaleY: scaleY * 1.3,
                        alpha: 1,
                        onComplete: this.onNewWinsZoomInComplete.bind(this)
                    });
                };

                animateWins(this.bigWins);
            } else {
                const animateWins = (target) => {
                    CoreLib.AnimationManager.animateTween(target, 0.4, {
                        scaleX: scaleX * 1.25,
                        scaleY: scaleY * 1.25,
                        alpha: 1,
                        onComplete: this.onNewWinsZoomInComplete.bind(this)
                    });
                };

                animateWins(this.bigWins);
            }
        } else {
            const animateWins = (target) => {
                CoreLib.AnimationManager.animateTween(target, 0.4, {
                    scaleX: scaleX * 1.2,
                    scaleY: scaleY * 1.2,
                    alpha: 1,
                    onComplete: this.onNewWinsZoomInComplete.bind(this)
                });
            };

            animateWins(this.bigWins);
        }

    }

    onNewWinsZoomInComplete() {
        // -- oscillation
        let rotationAmount = 10;
        let radians = rotationAmount * (Math.PI / 180);
        const animateOscillation = (target) => {
            gsap.to(target, {
                rotation: radians,
                duration: 0.1,
                yoyo: true,
                repeat: 4,
                ease: "power1.inOut",
                onComplete: () => {
                    target.rotation = 0;
                    this.onCompleteOscillation();
                }
            });
        };

        animateOscillation(this.bigWins);
    }

    onCompleteOscillation() {
        let scaleX, scaleY;
        if (this.currentLevel == 1) {
            scaleX = this.configData.bigAnimConfig.scaleX;
            scaleY = this.configData.bigAnimConfig.scaleY;
        } else if (this.currentLevel == 2) {
            scaleX = this.configData.megaAnimConfig.scaleX;
            scaleY = this.configData.megaAnimConfig.scaleY;
        } else if (this.currentLevel == 3) {
            scaleX = this.configData.giganticAnimConfig.scaleX;
            scaleY = this.configData.giganticAnimConfig.scaleY;
        } else if (this.currentLevel == 4) {
            scaleX = this.configData.unbelievableWinAnimConfig.scaleX;
            scaleY = this.configData.unbelievableWinAnimConfig.scaleY;
        }

        if (CoreLib.Model.DeviceConfig.isDevice) {
            if (CoreLib.Model.DeviceConfig.isPortrait) {
                const animateWins = (target) => {
                    CoreLib.AnimationManager.animateTween(target, 0.1, {
                        scaleX: scaleX,
                        scaleY: scaleY,
                        alpha: 1,
                        onComplete: this.onNewWinsZoomOutComplete1.bind(this)
                    });
                };

                animateWins(this.bigWins);
            } else {
                const animateWins = (target) => {
                    CoreLib.AnimationManager.animateTween(target, 0.1, {
                        scaleX: scaleX,
                        scaleY: scaleY,
                        alpha: 1,
                        onComplete: this.onNewWinsZoomOut2Complete.bind(this)
                    });
                };

                animateWins(this.bigWins);
            }
        } else {
            const animateWins = (target) => {
                CoreLib.AnimationManager.animateTween(target, 0.1, {
                    scaleX: scaleX,
                    scaleY: scaleY,
                    alpha: 1,
                    onComplete: this.onNewWinsZoomOut2Complete.bind(this)
                });
            };

            animateWins(this.bigWins);
        }
    }

    onNewWinsZoomOutComplete1() {
        setTimeout(() => {
            this.onNewWinsZoomOutComplete();
        }, 500);
    }

    onNewWinsZoomOut2Complete() {
        if (this.currentLevel < this.winLevel) {
            if (this.currentLevel == 1) {
                if (this.configData.bigAnimConfig.start != undefined) {
                    this.bigWins.playAnimation(this.configData.bigAnimConfig.defaultState, this.configData.bigAnimConfig.loop != undefined ? this.configData.bigAnimConfig.loop : true);
                }
            } else if (this.currentLevel == 2) {
                if (this.configData.megaAnimConfig.start != undefined) {
                    this.bigWins.playAnimation(this.configData.megaAnimConfig.defaultState, this.configData.megaAnimConfig.loop != undefined ? this.configData.megaAnimConfig.loop : true);
                }
            } else if (this.currentLevel == 3) {
                if (this.configData.giganticAnimConfig.start != undefined) {
                    this.bigWins.playAnimation(this.configData.giganticAnimConfig.defaultState, this.configData.giganticAnimConfig.loop != undefined ? this.configData.giganticAnimConfig.loop : true);
                }
            } else if (this.currentLevel == 4) {
                if (this.configData.unbelievableWinAnimConfig.start != undefined) {
                    this.bigWins.playAnimation(this.configData.unbelievableWinAnimConfig.defaultState, this.configData.unbelievableWinAnimConfig.loop != undefined ? this.configData.unbelievableWinAnimConfig.loop : true);
                }
            }
        }
    }

    onNewWinsZoomOutComplete() {
        if (this.currentLevel <= this.winLevel) {
            if (this.currentLevel == 1) {
                if (this.configData.bigAnimConfig.start != undefined) {
                    const animateWins = (target) => {
                        CoreLib.AnimationManager.animateTween(target, 0.1, {
                            scaleX: this.configData.bigAnimConfig.scaleX,
                            scaleY: this.configData.bigAnimConfig.scaleY,
                            alpha: 1,
                            onComplete: this.startShakeAtLastPhase.bind(this)
                        });
                    };

                    animateWins(this.bigWins);
                }
            } else if (this.currentLevel == 2) {
                if (this.configData.megaAnimConfig.start != undefined) {
                    const animateWins = (target) => {
                        CoreLib.AnimationManager.animateTween(target, 0.1, {
                            scaleX: this.configData.megaAnimConfig.scaleX,
                            scaleY: this.configData.megaAnimConfig.scaleY,
                            alpha: 1,
                            onComplete: this.startShakeAtLastPhase.bind(this)
                        });
                    };

                    animateWins(this.bigWins);
                }
            } else if (this.currentLevel == 3) {
                if (this.configData.giganticAnimConfig.start != undefined) {
                    const animateWins = (target) => {
                        CoreLib.AnimationManager.animateTween(target, 0.1, {
                            scaleX: this.configData.giganticAnimConfig.scaleX,
                            scaleY: this.configData.giganticAnimConfig.scaleY,
                            alpha: 1,
                            onComplete: this.startShakeAtLastPhase.bind(this)
                        });
                    };

                    animateWins(this.bigWins);
                }
            } else if (this.currentLevel == 4) {
                if (this.configData.unbelievableWinAnimConfig.start != undefined) {
                    const animateWins = (target) => {
                        CoreLib.AnimationManager.animateTween(target, 0.1, {
                            scaleX: this.configData.unbelievableWinAnimConfig.scaleX,
                            scaleY: this.configData.unbelievableWinAnimConfig.scaleY,
                            alpha: 1,
                            onComplete: this.startShakeAtLastPhase.bind(this)
                        });
                    };

                    animateWins(this.bigWins);
                }
            }
        }
    }

    startShakeAtLastPhase() {
        let rotationAmount = 10;
        let radians = rotationAmount * (Math.PI / 180);
        const animateOscillation = (target) => {
            gsap.to(target, {
                rotation: radians,
                duration: 0.1,
                yoyo: true,
                repeat: 4,
                ease: "power1.inOut",
                onComplete: () => {
                    target.rotation = 0;
                }
            });
        };

        animateOscillation(this.bigWins);
    }

    //------------------------
    showValue(val) {
        CoreLib.EventHandler.dispatchEvent("BIG_WIN_LEVEL_NOTIFICATION", this.currentLevel);
        this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.startScore.score);
        this.winValue = this.startScore.score;
        if (this.winValue == val) {
            if (this.winLevel) {
            }
            CoreLib.EventHandler.dispatchEvent("PLAY_BIG_WIN_COUNTUP_END_SOUND");
            clearTimeout(this.levelTimerId);
            CoreLib.EventHandler.dispatchEvent("PLAY_TERM_SOUND", this.winLevel);
            this.levelTimerId = setTimeout(this.onScoreDone.bind(this), this.bigWinDuration * 200);
        }
    }

    bigWinEndDone() {
        this.bigWinDone = true;
    }

    onScreenClicked() {
        if (this.bigWinDone) {
            return;
        }

        this.clickCount++;
        if (this.clickCount === 1) {
            //this.currentLevel = 2;
        } else if (this.clickCount === 2 && this.currentLevel == 1) {
            this.currentLevel = 2;
        } else if (this.clickCount === 3 && this.currentLevel == 2) {
            this.currentLevel = 3;
        } else if (this.clickCount === 4 && this.currentLevel == 3) {
            this.currentLevel = 4;
        } else if (this.clickCount > this.maxClicks) {
            this.showMaxWin();
            this.disableSkip();
            return;
        }
        this.playNewWinsAnim();

    }

    goToNextWinLevel() {
        if (this.currentLevel <= this.winLevel) {
            CoreLib.AnimationManager.killTweensOf(this.startScore);
            this.calculateWinAmount(this.currentLevel);
            this.playNewWinsAnim();
        }
    }

    calculateWinAmount(level) {
        let val;
        if (level == 1) {
            val = 6;
        } else if (level == 2) {
            val = 3;
        } else if (level == 3) {
            val = 1.5;
        } else if (level == 4) {
            val = 0.75;
        }

        this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.totalWin / val);
        this.counterEffect = setTimeout(() => {
            this.startScore = { score: this.totalWin / val };
            this.scoreTween = CoreLib.AnimationManager.animateTween(this.startScore, this.bigWinDuration * level, { score: this.totalWin, ease: Linear.easeNone, onUpdate: this.showValue.bind(this) });
        }, 1000);
    }

    showMaxWin() {
        CoreLib.AnimationManager.killTweensOf(this.startScore);
        this.winText.text = CoreLib.WrapperService.formatWinCurrency(this.totalWin);
        CoreLib.EventHandler.dispatchEvent("PLAY_BIG_WIN_COUNTUP_END_SOUND");
        CoreLib.EventHandler.dispatchEvent("PLAY_TERM_SOUND", this.winLevel);
        clearTimeout(this.levelTimerId);
        this.levelTimerId = setTimeout(this.onScoreDone.bind(this), this.bigWinDuration * 200);
    }

    clearWin() {
        this.clickCount = 1;
        this.maxClicks = 4;
        this.disableSkip();
        super.clearWin();
        clearTimeout(this.skipTimer);
        clearTimeout(this.levelTimerId);
        clearTimeout(this.counterEffect);
        this.rect.visible = false;
        this.bigWinDone = false;
    }
    // resizeViewComponents() {
    //     super.resizeViewComponents();

    // }

    setBiWinsPos(level) {
        let bigWinAnim = null;
        switch (level) {
            case 1:
                bigWinAnim = "bigAnimConfig"
                break;
            case 2:
                bigWinAnim = "megaAnimConfig"
                break;
            case 3:
                bigWinAnim = "giganticAnimConfig"
                break;
            case 4:
                bigWinAnim = "unbelievableWinAnimConfig"
                break;
            default:
                bigWinAnim = "bigAnimConfig"
                break;
        }
        if (this.bigWins) {
            CoreLib.UIUtil.setPosition(this.bigWins, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData[bigWinAnim].xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData[bigWinAnim].yPaddingPerc, 0.25));
            if (CoreLib.Model.DeviceConfig.isDevice) {
                if (CoreLib.Model.DeviceConfig.isPortrait) {
                    CoreLib.UIUtil.setPosition(this.bigWins, this.guideRect.width * 0.5 + this.guideRect.width * CoreLib.Util.getDefaultValue(this.configData[bigWinAnim].xPaddingPerc, 0), this.guideRect.height * CoreLib.Util.getDefaultValue(this.configData[bigWinAnim].yPaddingPercP, 0.25));
                }
            }
        }
    }


}