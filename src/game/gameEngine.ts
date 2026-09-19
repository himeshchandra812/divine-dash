import * as THREE from 'three';
import { GAME_CONSTANTS, FESTIVAL_COLORS, FESTIVAL_STAGES, IDOL_PIECES, MILESTONE_MESSAGES } from './constants';
import { Player } from './player';
import { WorldManager } from './worldManager';
import { ParticleSystem } from './particles';
import { soundEngine } from '../audio/soundEngine';
import { createGrandAssemblyPandalMesh } from './models';
import { GameStats, GameSettings, GameStatus, PowerUpType, IdolPieceId } from '../types';

export class GameEngine {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  
  public player: Player;
  public worldManager: WorldManager;
  public particles: ParticleSystem;

  private dirLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private hemiLight!: THREE.HemisphereLight;

  // Game Loop
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  public status: GameStatus = 'idle';

  // Assembly Cutscene & Final Reveal
  private assemblyGroup?: THREE.Group;
  private assemblyTime: number = 0;
  private idolPiecesRevealed: number = 0;
  private finalSceneSpotLight?: THREE.SpotLight;
  private finalScenePointLight?: THREE.PointLight;

  // Stats & Progress
  public stats: GameStats = {
    score: 0,
    distance: 0,
    modaks: 0,
    blessingTokens: 0,
    stage: 1,
    stageName: 'Mandir Marg (Golden Hour Aarti)',
    highScore: 0,
    speed: GAME_CONSTANTS.INITIAL_SPEED,
    multiplier: 1,
    activePowerUps: [],
    collectedPieces: [],
    totalPieces: 6,
    recentMilestoneMessage: null,
    milestoneMessageTimer: 0,
  };

  public settings: GameSettings = {
    quality: 'high',
    musicVolume: 0.5,
    sfxVolume: 0.7,
    bloom: true,
    shadows: true,
  };

  // Camera Shake
  private shakeIntensity: number = 0;
  private targetCameraFov: number = 60;

  // Callbacks
  public onStatsUpdate?: (stats: GameStats) => void;
  public onGameOver?: (finalStats: GameStats) => void;
  public onVictory?: (finalStats: GameStats) => void;
  public onNewHighScore?: (score: number) => void;

  private comboCount: number = 0;
  private comboTimer: number = 0;


  constructor(container: HTMLElement) {
    this.container = container;

    // Load High Score
    const saved = localStorage.getItem('divine_dash_high_score');
    if (saved) {
      this.stats.highScore = parseInt(saved, 10) || 0;
    }

    // 1. Scene & Atmospheric Sunset Fog
    this.scene = new THREE.Scene();
    const initialSky = new THREE.Color(FESTIVAL_STAGES[0].skyColor);
    this.scene.background = initialSky;
    this.scene.fog = new THREE.Fog(FESTIVAL_STAGES[0].fogColor, GAME_CONSTANTS.FOG_NEAR, GAME_CONSTANTS.FOG_FAR);

    // 2. Camera with fallback dimensions
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 500);
    this.camera.position.copy(GAME_CONSTANTS.CAMERA_OFFSET);
    this.camera.lookAt(GAME_CONSTANTS.CAMERA_LOOKAT_OFFSET);

    // 3. Renderer (1080p target capability with high dynamic range tone mapping)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.setSize(width, height);
    this.applyQualitySettings(this.settings.quality);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Entities (Instantiate player FIRST so lighting can safely target it)
    this.player = new Player();
    this.scene.add(this.player.group);

    // 5. Lighting
    this.setupLighting();

    this.worldManager = new WorldManager(this.scene);
    this.particles = new ParticleSystem(this.scene);

    // 6. Resize listener & ResizeObserver
    window.addEventListener('resize', this.handleResize);

    // 7. Start continuous rendering loop immediately for idle preview
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private setupLighting() {
    const s1 = FESTIVAL_STAGES[0];

    // Ambient Light (warm festival golden-hour ambient bounce)
    this.ambientLight = new THREE.AmbientLight(s1.ambientColor, s1.ambientIntensity);
    this.scene.add(this.ambientLight);

    // Hemisphere Light (sky amber to ground terracotta bounce)
    this.hemiLight = new THREE.HemisphereLight(s1.hemiSky, s1.hemiGround, s1.hemiIntensity);
    this.hemiLight.position.set(0, 30, 0);
    this.scene.add(this.hemiLight);

    // Main Festival Golden-Hour Sunlight (Dynamic directional light)
    this.dirLight = new THREE.DirectionalLight(s1.dirColor, s1.dirIntensity);
    this.dirLight.position.set(s1.dirAngle.x, s1.dirAngle.y, s1.dirAngle.z);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 80;
    this.dirLight.shadow.camera.left = -20;
    this.dirLight.shadow.camera.right = 20;
    this.dirLight.shadow.camera.top = 28;
    this.dirLight.shadow.camera.bottom = -18;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Light follows player Z smoothly
    if (this.player && this.player.group) {
      this.dirLight.target = this.player.group;
    }
  }

  public applyQualitySettings(quality: 'low' | 'medium' | 'high') {
    this.settings.quality = quality;
    const isRetina = window.devicePixelRatio > 1;

    if (quality === 'high') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
    } else {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
    }
  }

  public handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // ================= Game Controls =================

  public switchLaneLeft() {
    if (this.status !== 'playing') return;
    if (this.player.switchLane(-1)) {
      soundEngine.playLaneSwitch();
    }
  }

  public switchLaneRight() {
    if (this.status !== 'playing') return;
    if (this.player.switchLane(1)) {
      soundEngine.playLaneSwitch();
    }
  }

  public jump() {
    if (this.status !== 'playing') return;
    if (this.player.jump()) {
      soundEngine.playJump();
    }
  }

  public slide() {
    if (this.status !== 'playing') return;
    if (this.player.slide()) {
      soundEngine.playSlide();
      this.particles.emitRunSparks(this.player.group.position);
    }
  }

  // ================= Game State Lifecycle =================

  public start() {
    this.status = 'playing';
    if (this.assemblyGroup) {
      this.scene.remove(this.assemblyGroup);
      this.assemblyGroup = undefined;
    }
    this.resetStats();
    this.player.reset();
    this.worldManager.reset();
    this.particles.clear();
    soundEngine.setSpeedMultiplier(1.0);
    soundEngine.startMusic();
    this.lastTime = performance.now();
  }

  public pause() {
    if (this.status === 'playing') {
      this.status = 'paused';
      soundEngine.stopMusic();
    }
  }

  public resume() {
    if (this.status === 'paused') {
      this.status = 'playing';
      soundEngine.startMusic();
      this.lastTime = performance.now();
    }
  }

  public restart() {
    this.start();
  }

  private resetStats() {
    this.stats.score = 0;
    this.stats.distance = 0;
    this.stats.modaks = 0;
    this.stats.blessingTokens = 0;
    this.stats.stage = 1;
    this.stats.stageName = FESTIVAL_STAGES[0].name;
    this.stats.speed = GAME_CONSTANTS.INITIAL_SPEED;
    this.stats.multiplier = 1;
    this.stats.activePowerUps = [];
    this.stats.collectedPieces = [];
    this.stats.totalPieces = 6;
    this.stats.recentMilestoneMessage = null;
    this.stats.milestoneMessageTimer = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.assemblyTime = 0;
    this.idolPiecesRevealed = 0;

    if (this.player) {
      this.player.isNamaskar = false;
      this.player.group.rotation.set(0, 0, 0);
      this.player.isAlive = true;
      this.player.y = 0;
      this.player.group.position.set(0, 0, 0);
    }

    if (this.finalSceneSpotLight) {
      this.scene.remove(this.finalSceneSpotLight);
      this.scene.remove(this.finalSceneSpotLight.target);
      this.finalSceneSpotLight = undefined;
    }
    if (this.finalScenePointLight) {
      this.scene.remove(this.finalScenePointLight);
      this.finalScenePointLight = undefined;
    }
    if (this.assemblyGroup) {
      this.scene.remove(this.assemblyGroup);
      this.assemblyGroup = undefined;
    }

    this.updateLighting(0, true);
  }

  // ================= Master Game Loop =================

  private loop = (time: number) => {
    const delta = Math.min((time - this.lastTime) * 0.001, 0.1);
    this.lastTime = time;

    if (this.status === 'playing') {
      this.update(delta);
    } else if (this.status === 'assembling') {
      this.updateAssemblyCutscene(delta);
    } else if (this.status === 'victory') {
      this.updateVictoryState(delta);
    } else if (this.status === 'idle') {
      // Idle world preview
      this.worldManager.update(0, delta * 0.5);
      this.player.update(delta * 0.8, 12);
      this.updateCamera(delta, false);
      this.updateLighting(delta);
    }

    this.render();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(delta: number) {
    // 1. Calculate Active Speed (Boost multiplier applied if active)
    let currentSpeed = this.stats.speed;
    const isBoostActive = this.stats.activePowerUps.some(p => p.type === 'boost');
    if (isBoostActive) {
      currentSpeed *= GAME_CONSTANTS.BOOST_SPEED_MULTIPLIER;
    }

    // Gradually ramp base running speed
    this.stats.speed = Math.min(
      GAME_CONSTANTS.MAX_SPEED,
      this.stats.speed + GAME_CONSTANTS.SPEED_ACCELERATION * delta
    );

    // Sync sound tempo with speed
    const speedRatio = this.stats.speed / GAME_CONSTANTS.INITIAL_SPEED;
    soundEngine.setSpeedMultiplier(speedRatio);

    // 2. Advance Forward Distance & Player Position
    const distanceDelta = currentSpeed * delta;
    this.stats.distance += distanceDelta;
    this.player.group.position.z -= distanceDelta;

    // Score accumulation from distance
    const baseScoreInc = distanceDelta * 1.2 * this.stats.multiplier;
    this.stats.score += Math.floor(baseScoreInc);

    // 3. Update Power-up Timers & States
    this.updatePowerUps(delta);

    // 4. Update Player Entity
    this.player.isBoosting = isBoostActive;
    this.player.hasShield = this.stats.activePowerUps.some(p => p.type === 'shield');
    this.player.hasMagnet = this.stats.activePowerUps.some(p => p.type === 'magnet');
    this.player.update(delta, currentSpeed);

    // Sliding spark trail or running golden trail
    if (this.player.isSliding) {
      this.particles.emitRunSparks(this.player.group.position);
    } else if (this.status === 'playing' && this.player.isGrounded) {
      // Subtle golden running trail behind the runner's feet
      if (Math.random() < 0.4) {
        this.particles.emitRunTrail(this.player.group.position);
      }
    }

    // Occasional gentle festival flower petal breeze floating in the air
    if (this.status === 'playing' && Math.random() < 0.08) {
      this.particles.emitFlowerPetalBreeze(this.player.group.position);
    }

    // 5. Update World Chunks & Objects
    this.worldManager.update(this.player.group.position.z, delta);

    // Stage progression check
    const currentStage = this.worldManager.getStageForDistance(this.stats.distance);
    if (currentStage !== this.stats.stage) {
      this.stats.stage = currentStage;
      const stageConfig = FESTIVAL_STAGES.find(s => s.stage === currentStage);
      this.stats.stageName = stageConfig ? stageConfig.name : 'Festival Run';
      this.applyStageAtmosphere(currentStage);
      soundEngine.setStage(currentStage);
      soundEngine.playStageFanfare();
    }

    // 6. Check Ramp / Platform Elevation
    this.checkRampElevation();

    // 7. Check Collisions with Collectibles & Obstacles
    this.checkCollisions(delta);

    // 8. Update Particles
    this.particles.update(delta);

    // 9. Update Camera & Dynamic FOV
    this.updateCamera(delta, isBoostActive);

    // 10. Dynamic Scene Lighting Transition (Golden Hour -> Sunset Dusk -> Vibrant Evening Purple & Orange)
    this.updateLighting(delta);

    // 11. Combo timer decay
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // 12. Milestone message decay
    if (this.stats.milestoneMessageTimer > 0) {
      this.stats.milestoneMessageTimer -= delta;
      if (this.stats.milestoneMessageTimer <= 0) {
        this.stats.recentMilestoneMessage = null;
      }
    }

    // 13. Check Grand Assembly Quest Completion Trigger
    if (this.stats.collectedPieces.length >= 6 && this.stats.distance >= 1250) {
      this.triggerGrandAssembly();
      return;
    }

    // 14. Check High Score
    if (this.stats.score > this.stats.highScore) {
      const wasOld = this.stats.highScore;
      this.stats.highScore = this.stats.score;
      localStorage.setItem('divine_dash_high_score', this.stats.highScore.toString());
      if (wasOld > 0 && this.onNewHighScore) {
        this.onNewHighScore(this.stats.highScore);
      }
    }

    // 15. Notify React HUD
    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }
  }


  private updatePowerUps(delta: number) {
    let hasMultiplier = false;

    for (let i = this.stats.activePowerUps.length - 1; i >= 0; i--) {
      const p = this.stats.activePowerUps[i];
      p.remainingTime -= delta;
      if (p.type === 'multiplier') {
        hasMultiplier = true;
      }

      if (p.remainingTime <= 0) {
        this.stats.activePowerUps.splice(i, 1);
      }
    }

    this.stats.multiplier = hasMultiplier ? 2 : 1;
  }

  private checkRampElevation() {
    const playerZ = this.player.group.position.z;
    const playerLane = this.player.lane;
    let onRamp = false;
    let elevation = 0;

    for (const chunk of this.worldManager.chunks) {
      for (const obs of chunk.obstacles) {
        if (obs.isRamp && obs.active && obs.lane === playerLane) {
          const rStart = obs.rampStart!;
          const rEnd = obs.rampEnd!;
          const pEnd = obs.platformEnd!;

          // On sloped ramp wedge
          if (playerZ <= rStart && playerZ >= rEnd) {
            const progress = (rStart - playerZ) / (rStart - rEnd);
            elevation = progress * (obs.rampHeight || 1.8);
            onRamp = true;
            break;
          }
          // On elevated flat bridge platform
          else if (playerZ < rEnd && playerZ >= pEnd) {
            elevation = obs.rampHeight || 1.8;
            onRamp = true;
            break;
          }
        }
      }
      if (onRamp) break;
    }

    this.player.onRampPlatform = onRamp;
    this.player.platformHeight = elevation;
  }

  private checkCollisions(delta: number) {
    const playerPos = this.player.group.position;
    const playerBox = this.player.collider;
    const hasMagnet = this.player.hasMagnet;
    const isBoosting = this.player.isBoosting;

    for (const chunk of this.worldManager.chunks) {
      // --- 1. Collectibles ---
      for (const item of chunk.collectibles) {
        if (!item.active || item.collected) continue;

        const itemPos = item.mesh.position;
        const distZ = Math.abs(itemPos.z - playerPos.z);

        // Magnet attraction effect
        if (hasMagnet && item.isModak && distZ < GAME_CONSTANTS.MAGNET_RADIUS) {
          // Smoothly pull modak towards player
          itemPos.x = THREE.MathUtils.lerp(itemPos.x, playerPos.x, delta * 12.0);
          itemPos.y = THREE.MathUtils.lerp(itemPos.y, playerPos.y + 1.0, delta * 12.0);
          itemPos.z = THREE.MathUtils.lerp(itemPos.z, playerPos.z, delta * 14.0);
        }

        // Distance check for collection
        const dist = itemPos.distanceTo(playerPos.clone().add(new THREE.Vector3(0, 0.8, 0)));
        if (dist < 1.4) {
          item.collected = true;
          item.mesh.visible = false;

          if (item.isIdolPiece && item.idolPieceId) {
            // Sacred Idol Piece Collected!
            const pieceId = item.idolPieceId;
            if (!this.stats.collectedPieces.includes(pieceId)) {
              this.stats.collectedPieces.push(pieceId);
              this.worldManager.setCollectedPieces(this.stats.collectedPieces);
              const pieceIdx = IDOL_PIECES.findIndex(p => p.id === pieceId);
              const pieceMeta = IDOL_PIECES[pieceIdx];
              const earned = 2000 * this.stats.multiplier;
              this.stats.score += earned;
              this.stats.recentMilestoneMessage = pieceMeta
                ? `✨ ${pieceMeta.name} Secured! (${this.stats.collectedPieces.length}/6 Pieces)`
                : 'Sacred Piece Collected!';
              this.stats.milestoneMessageTimer = 4.0;
              soundEngine.playIdolPieceCollect();
              const pColor = pieceMeta ? parseInt(pieceMeta.color.replace('#', '0x'), 16) : 0xffd700;
              this.particles.emitIdolPieceCollect(itemPos, pColor);
              this.player.triggerCollectCelebration();

              if (this.stats.collectedPieces.length === 6) {
                this.stats.recentMilestoneMessage = '🌟 ALL 6 SACRED PIECES GATHERED! Entering Grand Pandal for Idol Sthapana!';
                this.stats.milestoneMessageTimer = 5.0;
              }
            }
          } else if (item.isModak) {
            // Modak collected!
            this.comboCount++;
            this.comboTimer = 2.0;
            this.stats.modaks++;
            const earned = 50 * this.stats.multiplier;
            this.stats.score += earned;
            soundEngine.playModakCollect(this.comboCount);
            this.particles.emitModakCollect(itemPos);
            this.player.triggerCollectCelebration();
          } else if (item.isBlessingToken) {
            // Blessing Token collected! (250 pts)
            this.comboCount++;
            this.comboTimer = 2.5;
            this.stats.blessingTokens = (this.stats.blessingTokens || 0) + 1;
            const earned = 250 * this.stats.multiplier;
            this.stats.score += earned;
            soundEngine.playBlessingTokenCollect();
            this.particles.emitPowerUpBurst(itemPos, 0xffd700);
            this.player.triggerCollectCelebration();
          } else if (item.powerUpType) {
            // Power-up collected!
            this.activatePowerUp(item.powerUpType);
            this.particles.emitPowerUpBurst(itemPos, 0xffd700);
          }
        }
      }

      // --- 2. Obstacles ---
      for (const obs of chunk.obstacles) {
        if (!obs.active || obs.isRamp) continue;

        const obsZ = obs.mesh.position.z;
        const distZ = Math.abs(obsZ - playerPos.z);

        // Only check obstacles in close proximity along Z
        if (distZ < 2.0 && obs.lane === this.player.lane) {
          // Detailed bounding box check
          const obsBox = new THREE.Box3().setFromObject(obs.mesh);

          if (playerBox.intersectsBox(obsBox)) {
            // Collision Occurred!
            if (isBoosting) {
              // Smashes through obstacle unharmed!
              obs.active = false;
              obs.mesh.visible = false;
              this.particles.emitPowerUpBurst(obs.mesh.position, 0xff9900);
              this.shakeIntensity = 0.3;
              soundEngine.playShieldBreak();
            } else if (this.player.hasShield) {
              // Shield absorbs impact!
              obs.active = false;
              obs.mesh.visible = false;
              this.removePowerUp('shield');
              this.player.hasShield = false;
              this.shakeIntensity = 0.4;
              soundEngine.playShieldBreak();
              this.particles.emitPowerUpBurst(playerPos, 0x4cc9f0);
            } else {
              // Fatal crash
              this.triggerGameOver();
              return;
            }
          }
        }
      }
    }
  }

  private activatePowerUp(type: PowerUpType) {
    soundEngine.playPowerUp();

    let dur = GAME_CONSTANTS.MAGNET_DURATION;
    if (type === 'shield') dur = GAME_CONSTANTS.SHIELD_DURATION;
    else if (type === 'multiplier') dur = GAME_CONSTANTS.MULTIPLIER_DURATION;
    else if (type === 'boost') dur = GAME_CONSTANTS.BOOST_DURATION;

    // Check if already active to refresh duration
    const existing = this.stats.activePowerUps.find(p => p.type === type);
    if (existing) {
      existing.remainingTime = dur;
      existing.duration = dur;
    } else {
      this.stats.activePowerUps.push({
        type,
        remainingTime: dur,
        duration: dur,
      });
    }
  }

  private removePowerUp(type: PowerUpType) {
    this.stats.activePowerUps = this.stats.activePowerUps.filter(p => p.type !== type);
  }

  /**
   * Dynamically transitions scene lighting, background, fog, and celestial illumination
   * based on the runner's progress and current stage:
   * - Stage 1 (0m - 400m): Radiant warm golden-hour hue, afternoon amber sunlight, honey ambient
   * - Stage 2 (400m - 900m): Transition through rich sunset dusk, coral-crimson sky, deep orange sunlight
   * - Stage 3 (900m+): Vibrant royal evening purple sky & fog with electric festive orange spotlights & lanterns
   */
  private updateLighting(delta: number, immediate: boolean = false) {
    const s1 = FESTIVAL_STAGES[0];
    const s2 = FESTIVAL_STAGES[1];
    const s3 = FESTIVAL_STAGES[2];
    const d = this.stats.distance;

    let source = s1;
    let target = s2;
    let blend = 0;

    if (d < s2.threshold) {
      // Stage 1 -> Stage 2 (0m to 400m)
      source = s1;
      target = s2;
      blend = Math.max(0, Math.min(1, d / s2.threshold));
    } else if (d < s3.threshold) {
      // Stage 2 -> Stage 3 (400m to 900m)
      source = s2;
      target = s3;
      blend = Math.max(0, Math.min(1, (d - s2.threshold) / (s3.threshold - s2.threshold)));
    } else {
      // Stage 3 (900m+): Vibrant evening purple and orange!
      source = s3;
      target = s3;
      blend = 1.0;
    }

    // Smoothstep interpolation for soft cinematic transitions
    const smoothBlend = blend * blend * (3 - 2 * blend);

    const targetSky = new THREE.Color(source.skyColor).lerp(new THREE.Color(target.skyColor), smoothBlend);
    const targetFog = new THREE.Color(source.fogColor).lerp(new THREE.Color(target.fogColor), smoothBlend);
    const targetAmbient = new THREE.Color(source.ambientColor).lerp(new THREE.Color(target.ambientColor), smoothBlend);
    const targetDir = new THREE.Color(source.dirColor).lerp(new THREE.Color(target.dirColor), smoothBlend);
    const targetHemiSky = new THREE.Color(source.hemiSky).lerp(new THREE.Color(target.hemiSky), smoothBlend);
    const targetHemiGround = new THREE.Color(source.hemiGround).lerp(new THREE.Color(target.hemiGround), smoothBlend);
    const targetSkyTint = new THREE.Color(source.skyTint).lerp(new THREE.Color(target.skyTint), smoothBlend);

    const targetAmbientInt = THREE.MathUtils.lerp(source.ambientIntensity, target.ambientIntensity, smoothBlend);
    const targetDirInt = THREE.MathUtils.lerp(source.dirIntensity, target.dirIntensity, smoothBlend);
    const targetHemiInt = THREE.MathUtils.lerp(source.hemiIntensity, target.hemiIntensity, smoothBlend);
    const targetExposure = THREE.MathUtils.lerp(source.exposure, target.exposure, smoothBlend);

    const lerpFactor = immediate ? 1.0 : Math.min(1.0, delta * 3.5);

    // 1. Scene Background & Atmospheric Fog
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.lerp(targetSky, lerpFactor);
    } else {
      this.scene.background = targetSky.clone();
    }
    if (this.scene.fog) {
      this.scene.fog.color.lerp(targetFog, lerpFactor);
    }

    // 2. Ambient Light
    if (this.ambientLight) {
      this.ambientLight.color.lerp(targetAmbient, lerpFactor);
      this.ambientLight.intensity = THREE.MathUtils.lerp(this.ambientLight.intensity, targetAmbientInt, lerpFactor);
    }

    // 3. Directional Sunlight / Evening Spotlight
    if (this.dirLight) {
      this.dirLight.color.lerp(targetDir, lerpFactor);
      this.dirLight.intensity = THREE.MathUtils.lerp(this.dirLight.intensity, targetDirInt, lerpFactor);

      // Follow player and smoothly adjust lighting angle
      const targetDirX = THREE.MathUtils.lerp(source.dirAngle.x, target.dirAngle.x, smoothBlend);
      const targetDirY = THREE.MathUtils.lerp(source.dirAngle.y, target.dirAngle.y, smoothBlend);
      const targetDirZ = THREE.MathUtils.lerp(source.dirAngle.z, target.dirAngle.z, smoothBlend);
      const playerZ = this.player ? this.player.group.position.z : 0;
      this.dirLight.position.set(targetDirX, targetDirY, playerZ + targetDirZ);
    }

    // 4. Hemisphere Light (Vibrant orange sky vs deep royal purple ground in Stage 3)
    if (this.hemiLight) {
      this.hemiLight.color.lerp(targetHemiSky, lerpFactor);
      this.hemiLight.groundColor.lerp(targetHemiGround, lerpFactor);
      this.hemiLight.intensity = THREE.MathUtils.lerp(this.hemiLight.intensity, targetHemiInt, lerpFactor);
    }

    // 5. Renderer Tone Mapping Exposure
    if (this.renderer) {
      this.renderer.toneMappingExposure = THREE.MathUtils.lerp(this.renderer.toneMappingExposure, targetExposure, lerpFactor);
    }

    // 6. Distant Sky backdrop mesh tinting
    if (this.worldManager) {
      this.worldManager.updateSkyTint(targetSkyTint, lerpFactor);
    }
  }

  private applyStageAtmosphere(stage: 1 | 2 | 3, immediate: boolean = false) {
    const stageConfig = FESTIVAL_STAGES.find(s => s.stage === stage) || FESTIVAL_STAGES[0];
    this.stats.stage = stage;
    this.stats.stageName = stageConfig.name;
    this.updateLighting(0, immediate);
  }

  public triggerGrandAssembly() {
    if (this.status === 'assembling' || this.status === 'victory') return;
    this.status = 'assembling';
    this.assemblyTime = 0;
    this.idolPiecesRevealed = 0;
    this.stats.speed = 0; // Stop endless runner forward speed
    soundEngine.transitionToDevotionalMusic();

    // Position player cleanly facing Lord Ganesha with folded hands (Namaskar)
    this.player.lane = 0;
    this.player.targetX = 0;
    this.player.isBoosting = false;
    this.player.hasShield = false;
    this.player.hasMagnet = false;
    this.player.isNamaskar = true;
    this.stats.activePowerUps = [];

    // The dedicated pandal anchor position ahead
    const pandalZ = this.player.group.position.z - 15;
    this.player.group.position.set(0, 0, pandalZ + 4.2);
    this.player.group.rotation.set(0, Math.PI, 0); // Face the idol altar

    // Remove existing assembly pandal if any
    if (this.assemblyGroup) {
      this.scene.remove(this.assemblyGroup);
    }

    // Spawn Grand Assembly Pandal
    this.assemblyGroup = createGrandAssemblyPandalMesh();
    this.assemblyGroup.position.set(0, 0, pandalZ);
    this.scene.add(this.assemblyGroup);

    // Initial state: hide modular idol pieces so they assemble sequentially
    for (const piece of IDOL_PIECES) {
      const pieceObj = this.assemblyGroup.getObjectByName(`idol_${piece.id}`);
      if (pieceObj) {
        pieceObj.visible = false;
      }
    }

    // Clear any obstacles nearby so the pandal sanctuary is completely clear
    this.worldManager.clearObstaclesNear(pandalZ - 30, pandalZ + 30);

    // ----------------------------------------------------
    // DEDICATED FINAL SCENE LIGHTING SETUP
    // ----------------------------------------------------
    if (this.finalSceneSpotLight) {
      this.scene.remove(this.finalSceneSpotLight);
      this.scene.remove(this.finalSceneSpotLight.target);
    }
    if (this.finalScenePointLight) {
      this.scene.remove(this.finalScenePointLight);
    }

    // Focused Divine Golden Spotlight directly aimed at Lord Ganesha
    this.finalSceneSpotLight = new THREE.SpotLight(0xfff5cc, 5.5, 35, Math.PI / 4, 0.45, 1.0);
    this.finalSceneSpotLight.position.set(0, 7.5, pandalZ + 5.5);
    this.finalSceneSpotLight.castShadow = true;
    this.finalSceneSpotLight.target.position.set(0, 2.3, pandalZ);
    this.scene.add(this.finalSceneSpotLight);
    this.scene.add(this.finalSceneSpotLight.target);

    // Warm front-facing ambient & point light for rich golden glow
    this.finalScenePointLight = new THREE.PointLight(0xffb703, 3.8, 18);
    this.finalScenePointLight.position.set(0, 2.5, pandalZ + 2.8);
    this.scene.add(this.finalScenePointLight);

    // Set clear ambient lighting and atmosphere
    this.ambientLight.color.setHex(0xfff2e0);
    this.ambientLight.intensity = 2.0;
    this.scene.fog = new THREE.Fog(0x2b1055, 35, 120);

    // ----------------------------------------------------
    // DEDICATED CAMERA SETUP & POSITIONING
    // ----------------------------------------------------
    this.camera.fov = 52;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(0, 2.5, pandalZ + 6.8);
    this.camera.lookAt(0, 2.1, pandalZ);

    // ----------------------------------------------------
    // AUTOMATIC CAMERA & BOUNDING BOX DEBUG CHECKS
    // ----------------------------------------------------
    const idolModel = this.assemblyGroup.getObjectByName('lord_ganesha_idol') || this.assemblyGroup;
    const idolBBox = new THREE.Box3().setFromObject(idolModel);
    const idolWorldPos = new THREE.Vector3();
    idolModel.getWorldPosition(idolWorldPos);

    this.camera.updateMatrixWorld();
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    const inFrustum = frustum.intersectsBox(idolBBox);

    console.log('🕉️ [Divine Dash 3D] Lord Ganesha Final Reveal Debug Check:');
    console.log('  • Idol Model Exists in Scene:', !!idolModel);
    console.log('  • Idol World Position:', idolWorldPos);
    console.log('  • Idol Bounding Box:', { min: idolBBox.min, max: idolBBox.max });
    console.log('  • Camera Position:', this.camera.position);
    console.log('  • Camera LookAt Target:', { x: 0, y: 2.1, z: pandalZ });
    console.log('  • Idol Inside Camera Frustum:', inFrustum);
    console.log('  • Camera Near / Far Planes:', { near: this.camera.near, far: this.camera.far });

    // Celebration initial aura burst
    this.particles.emitPowerUpBurst(new THREE.Vector3(0, 2.5, pandalZ), 0xffd700);
    this.stats.recentMilestoneMessage = '🪷 Grand Idol Sthapana Aarti in Progress...';
    this.stats.milestoneMessageTimer = 8.0;

    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }
  }

  public skipAssemblyToVictory() {
    if (this.status !== 'assembling') return;
    this.assemblyTime = 7.0;
    // Reveal all pieces immediately
    if (this.assemblyGroup) {
      for (const piece of IDOL_PIECES) {
        const pieceObj = this.assemblyGroup.getObjectByName(`idol_${piece.id}`);
        if (pieceObj) {
          pieceObj.visible = true;
        }
      }
    }
    this.completeVictorySequence();
  }

  private updateAssemblyCutscene(delta: number) {
    this.assemblyTime += delta;
    this.particles.update(delta);

    const pandalZ = this.assemblyGroup ? this.assemblyGroup.position.z : -15;

    // Subtle idol breathing animation
    if (this.assemblyGroup) {
      const idolModel = this.assemblyGroup.getObjectByName('lord_ganesha_idol');
      if (idolModel) {
        idolModel.position.y = 0.5 + Math.sin(this.assemblyTime * 1.8) * 0.04;
      }
    }

    // Sequentially assemble the 6 sacred pieces every 0.85 seconds
    const targetPieces = Math.min(6, Math.floor(this.assemblyTime / 0.85));
    if (targetPieces > this.idolPiecesRevealed) {
      this.idolPiecesRevealed = targetPieces;
      const currentPiece = IDOL_PIECES[this.idolPiecesRevealed - 1];
      if (currentPiece && this.assemblyGroup) {
        const pObj = this.assemblyGroup.getObjectByName(`idol_${currentPiece.id}`);
        if (pObj) {
          pObj.visible = true;
        }
        soundEngine.playAssemblyPieceSnap();
        const pColor = parseInt(currentPiece.color.replace('#', '0x'), 16);
        this.particles.emitIdolPieceCollect(
          new THREE.Vector3(0, 2.2, pandalZ),
          pColor
        );
        this.stats.recentMilestoneMessage = `✨ ${currentPiece.name} Assembled! (${this.idolPiecesRevealed}/6)`;
        this.stats.milestoneMessageTimer = 3.0;
      }
    }

    // Continuous flower petal showers around the sanctuary
    if (Math.random() < 0.35) {
      this.particles.emitFlowerPetalBreeze(new THREE.Vector3((Math.random() - 0.5) * 6, 2.5, pandalZ + (Math.random() - 0.5) * 4));
    }

    // Gentle centered cinematic camera framing (front-facing, graceful subtle sway)
    if (this.assemblyGroup) {
      const targetCamX = Math.sin(this.assemblyTime * 0.35) * 0.4;
      const targetCamY = 2.4 + Math.sin(this.assemblyTime * 0.5) * 0.15;
      const targetCamZ = pandalZ + 6.6 - Math.min(0.6, this.assemblyTime * 0.1);

      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, delta * 3.0);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, delta * 3.0);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, delta * 3.0);
      this.camera.lookAt(0, 2.1, pandalZ);
    }

    // Update lighting softly
    this.updateLighting(delta);

    // Notify React HUD
    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }

    // Conclude cutscene into Victory State after full 5.8s reveal
    if (this.assemblyTime >= 5.8 && this.status === 'assembling') {
      this.completeVictorySequence();
    }
  }

  private completeVictorySequence() {
    this.status = 'victory';
    soundEngine.playVictoryAartiFanfare();
    const pandalZ = this.assemblyGroup ? this.assemblyGroup.position.z : -15;

    // Ensure all 6 pieces are 100% visible on victory
    if (this.assemblyGroup) {
      for (const piece of IDOL_PIECES) {
        const pieceObj = this.assemblyGroup.getObjectByName(`idol_${piece.id}`);
        if (pieceObj) {
          pieceObj.visible = true;
        }
      }
      this.particles.emitCelebrationFireworkShower(
        new THREE.Vector3(0, 4.5, pandalZ)
      );
    }
    this.stats.recentMilestoneMessage = '🙏 Ganpati Bappa Morya! Divine Idol Completed!';
    this.stats.milestoneMessageTimer = 10.0;

    if (this.onVictory) {
      this.onVictory({ ...this.stats });
    }
    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }
  }

  private updateVictoryState(delta: number) {
    this.assemblyTime += delta;
    this.particles.update(delta);
    const pandalZ = this.assemblyGroup ? this.assemblyGroup.position.z : -15;

    // Continuous soft celebratory petals and fireworks in victory
    if (Math.random() < 0.25 && this.assemblyGroup) {
      this.particles.emitCelebrationFireworkShower(
        new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          4.5 + Math.random() * 3.0,
          pandalZ + (Math.random() - 0.5) * 6
        )
      );
    }
    if (Math.random() < 0.4) {
      this.particles.emitFlowerPetalBreeze(new THREE.Vector3((Math.random() - 0.5) * 6, 2.5, pandalZ));
    }

    // Steady centered camera framing keeping the idol perfectly visible
    if (this.assemblyGroup) {
      const targetCamX = Math.sin(this.assemblyTime * 0.25) * 0.3;
      const targetCamY = 2.3 + Math.sin(this.assemblyTime * 0.35) * 0.12;
      const targetCamZ = pandalZ + 6.0;

      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, delta * 2.0);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, delta * 2.0);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, delta * 2.0);
      this.camera.lookAt(0, 2.1, pandalZ);
    }

    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.stats });
    }
  }

  private triggerGameOver() {
    this.status = 'gameover';
    this.player.isAlive = false;
    soundEngine.stopMusic();
    soundEngine.playCrash();
    this.shakeIntensity = 0.8;

    if (this.onGameOver) {
      this.onGameOver({ ...this.stats });
    }
  }

  private updateCamera(delta: number, isBoosting: boolean) {
    // Follow Player smoothly
    const targetCamX = this.player.group.position.x * 0.45;
    const targetCamY = GAME_CONSTANTS.CAMERA_OFFSET.y + this.player.group.position.y * 0.6;
    const targetCamZ = this.player.group.position.z + GAME_CONSTANTS.CAMERA_OFFSET.z;

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, delta * 10.0);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, delta * 10.0);
    this.camera.position.z = targetCamZ;

    // Camera LookAt
    const lookAtX = this.player.group.position.x * 0.2;
    const lookAtY = GAME_CONSTANTS.CAMERA_LOOKAT_OFFSET.y + this.player.group.position.y * 0.5;
    const lookAtZ = this.player.group.position.z + GAME_CONSTANTS.CAMERA_LOOKAT_OFFSET.z;
    this.camera.lookAt(lookAtX, lookAtY, lookAtZ);

    // Dynamic FOV (Speed effect)
    this.targetCameraFov = isBoosting ? 72 : 60;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetCameraFov, delta * 6.0);
    this.camera.updateProjectionMatrix();

    // Camera Shake Decay
    if (this.shakeIntensity > 0.01) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity = THREE.MathUtils.lerp(this.shakeIntensity, 0, delta * 8.0);
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.handleResize);
    soundEngine.stopMusic();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
