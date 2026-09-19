import * as THREE from 'three';
import { GAME_CONSTANTS, FESTIVAL_COLORS } from './constants';
import { MaterialLibrary } from './models';
import { createCharacterFaceTexture, createKurtaFabricTexture } from './textures';
import { Lane } from '../types';
import { soundEngine } from '../audio/soundEngine';

export class Player {
  public group: THREE.Group;
  
  // Animation hierarchy nodes
  private characterRoot!: THREE.Group;
  private torsoGroup!: THREE.Group;
  private torsoMesh!: THREE.Mesh;
  private headGroup!: THREE.Group;
  private headMesh!: THREE.Mesh;
  private hairGroup!: THREE.Group;
  
  private leftArmGroup!: THREE.Group;
  private leftForearmGroup!: THREE.Group;
  private rightArmGroup!: THREE.Group;
  private rightForearmGroup!: THREE.Group;
  
  private leftLegGroup!: THREE.Group;
  private leftCalfGroup!: THREE.Group;
  private rightLegGroup!: THREE.Group;
  private rightCalfGroup!: THREE.Group;
  
  private scarfGroup!: THREE.Group;
  private scarfSegments: { mesh: THREE.Mesh; baseAngle: number }[] = [];

  // Aura & VFX nodes
  private shieldBubble!: THREE.Mesh;
  private magnetRing!: THREE.Mesh;
  private boostWingsGroup!: THREE.Group;
  private shadowMesh!: THREE.Mesh;
  private rimLight!: THREE.PointLight;

  // State
  public lane: Lane = 0;
  public targetX: number = 0;
  public currentX: number = 0;
  
  public y: number = 0;
  public velocityY: number = 0;
  public isGrounded: boolean = true;
  public onRampPlatform: boolean = false;
  public platformHeight: number = 0;

  public isSliding: boolean = false;
  public slideTimer: number = 0;

  public isNamaskar: boolean = false;
  public isInvincible: boolean = false;
  public hasShield: boolean = false;
  public hasMagnet: boolean = false;
  public isBoosting: boolean = false;

  public runCycle: number = 0;
  public isAlive: boolean = true;

  // Jump and landing dynamics
  private jumpProgress: number = 0;
  private landingSquashTimer: number = 0;
  private celebrationTimer: number = 0;

  // Dynamic Bounding Box
  public collider: THREE.Box3 = new THREE.Box3();

  constructor() {
    this.group = new THREE.Group();
    this.buildCharacterMesh();
    this.buildVFXNodes();
    this.updateCollider();
  }

  private buildCharacterMesh() {
    const mats = MaterialLibrary.get();

    // Inner character root allows whole-body squash, stretch, and landing dynamics
    this.characterRoot = new THREE.Group();
    this.group.add(this.characterRoot);

    // High quality shared PBR materials
    const faceTex = createCharacterFaceTexture();
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.55,
      metalness: 0.05,
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdca274, // Warm glowing golden-tan Indian skin
      roughness: 0.55,
      metalness: 0.05,
    });

    const kurtaTex = createKurtaFabricTexture();
    const kurtaMat = new THREE.MeshStandardMaterial({
      map: kurtaTex,
      roughness: 0.5,
      metalness: 0.1,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x18100c, // Rich dark espresso/black
      roughness: 0.35,
      metalness: 0.15,
    });

    const dhotiMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f3, // Crisp festive off-white/cream
      roughness: 0.65,
      metalness: 0.02,
    });

    const shoeBodyMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee, // Crisp cream-white sneakers with saffron trims
      roughness: 0.45,
      metalness: 0.05,
    });

    const shoeTrimMat = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.MARIGOLD_ORANGE,
      roughness: 0.4,
      metalness: 0.1,
    });

    const shoeSoleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.02,
    });

    const shoeGripMat = new THREE.MeshStandardMaterial({
      color: 0x2b2420,
      roughness: 0.8,
    });

    // ==========================================
    // 1. TORSO & FESTIVE KURTA
    // ==========================================
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 0.72, 0); // Waist pivot
    this.characterRoot.add(this.torsoGroup);

    // Main Kurta body (tapered chest to waist)
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.56, 16);
    this.torsoMesh = new THREE.Mesh(torsoGeo, kurtaMat);
    this.torsoMesh.position.set(0, 0.28, 0);
    this.torsoMesh.castShadow = true;
    this.torsoMesh.receiveShadow = true;
    this.torsoGroup.add(this.torsoMesh);

    // Kurta Lower Flare (A-line traditional cut over dhoti)
    const flareGeo = new THREE.CylinderGeometry(0.22, 0.27, 0.22, 16, 1, true);
    const flareMesh = new THREE.Mesh(flareGeo, kurtaMat);
    flareMesh.position.set(0, -0.05, 0);
    flareMesh.castShadow = true;
    this.torsoGroup.add(flareMesh);

    // Golden Zari Vertical Placket & Buttons
    const placketGeo = new THREE.BoxGeometry(0.065, 0.54, 0.25);
    const placketMesh = new THREE.Mesh(placketGeo, mats.goldMaterial);
    placketMesh.position.set(0, 0.28, 0.015);
    this.torsoGroup.add(placketMesh);

    // Festive Gold Button Studs
    for (let b = 0; b < 3; b++) {
      const buttonGeo = new THREE.SphereGeometry(0.018, 8, 8);
      const button = new THREE.Mesh(buttonGeo, mats.goldShineMaterial);
      button.position.set(0, 0.42 - b * 0.12, 0.14);
      this.torsoGroup.add(button);
    }

    // Mandarin Collar with Golden Piping
    const collarGeo = new THREE.CylinderGeometry(0.13, 0.14, 0.08, 16);
    const collarMesh = new THREE.Mesh(collarGeo, mats.goldMaterial);
    collarMesh.position.set(0, 0.58, 0);
    this.torsoGroup.add(collarMesh);

    // Golden Waist Sash / Patka with Ruby Accent
    const sashGeo = new THREE.TorusGeometry(0.225, 0.032, 8, 24);
    const sashMesh = new THREE.Mesh(sashGeo, mats.goldMaterial);
    sashMesh.rotation.x = Math.PI / 2;
    sashMesh.position.set(0, 0.04, 0);
    this.torsoGroup.add(sashMesh);

    const sashKnotGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const sashKnot = new THREE.Mesh(sashKnotGeo, mats.rubyCrimsonMaterial);
    sashKnot.position.set(0.12, 0.04, 0.2);
    this.torsoGroup.add(sashKnot);

    // ==========================================
    // 2. HEAD, STYLIZED FACE & HAIR
    // ==========================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.62, 0); // Neck pivot
    this.torsoGroup.add(this.headGroup);

    // Stylized Neck
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.12, 12);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 0.04, 0);
    this.headGroup.add(neckMesh);

    // Stylized Rounded Head with Face Texture
    // Rotate cylinder/sphere texture coordinates to front facing (+Z)
    const headGeo = new THREE.SphereGeometry(0.22, 24, 20);
    headGeo.rotateY(Math.PI / 2); // Align texture canvas perfectly with front face
    this.headMesh = new THREE.Mesh(headGeo, faceMat);
    this.headMesh.position.set(0, 0.22, 0.02);
    this.headMesh.castShadow = true;
    this.headGroup.add(this.headMesh);

    // Sculpted Stylized Ears
    [-1, 1].forEach(side => {
      const earGeo = new THREE.SphereGeometry(0.045, 8, 8);
      earGeo.scale(0.5, 1.2, 0.8);
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.position.set(side * 0.21, 0.22, -0.01);
      ear.rotation.y = side * 0.2;
      this.headGroup.add(ear);
    });

    // ==========================================
    // 3. SCULPTED STYLISH DARK HAIRSTYLE
    // ==========================================
    this.hairGroup = new THREE.Group();
    this.hairGroup.position.set(0, 0.22, 0.02);
    this.headGroup.add(this.hairGroup);

    // Main Hair Dome (Top, Sides and Crown)
    const hairCrownGeo = new THREE.SphereGeometry(0.245, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
    hairCrown.position.set(0, 0.04, -0.02);
    hairCrown.castShadow = true;
    this.hairGroup.add(hairCrown);

    // Voluminous Pompadour / Swept Front Crest
    const crestGeo = new THREE.SphereGeometry(0.14, 12, 10);
    crestGeo.scale(1.4, 0.9, 1.6);
    const crest = new THREE.Mesh(crestGeo, hairMat);
    crest.position.set(0, 0.16, 0.08);
    crest.rotation.x = -0.3;
    crest.castShadow = true;
    this.hairGroup.add(crest);

    // Stylish Front Bang / Swept Fringe Tuft
    const fringeGeo = new THREE.ConeGeometry(0.08, 0.18, 8);
    const fringe = new THREE.Mesh(fringeGeo, hairMat);
    fringe.position.set(-0.06, 0.16, 0.16);
    fringe.rotation.set(-1.2, 0.2, -0.4);
    this.hairGroup.add(fringe);

    const fringe2 = new THREE.ConeGeometry(0.06, 0.14, 8);
    const fringeMesh2 = new THREE.Mesh(fringe2, hairMat);
    fringeMesh2.position.set(0.08, 0.17, 0.15);
    fringeMesh2.rotation.set(-1.1, -0.3, 0.5);
    this.hairGroup.add(fringeMesh2);

    // Tapered Sideburns
    [-1, 1].forEach(side => {
      const sideburnGeo = new THREE.BoxGeometry(0.04, 0.14, 0.08);
      const sideburn = new THREE.Mesh(sideburnGeo, hairMat);
      sideburn.position.set(side * 0.21, -0.02, 0.04);
      sideburn.rotation.z = side * -0.1;
      this.hairGroup.add(sideburn);
    });

    // Sculpted Back Neck Hair
    const backHairGeo = new THREE.SphereGeometry(0.18, 12, 10);
    backHairGeo.scale(1.1, 0.8, 0.9);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, -0.04, -0.12);
    this.hairGroup.add(backHair);

    // ==========================================
    // 4. FLOWING CRIMSON & GOLD SCARF (UTTARIYA)
    // ==========================================
    this.scarfGroup = new THREE.Group();
    this.scarfGroup.position.set(0, 0.54, 0); // Draped on shoulders
    this.torsoGroup.add(this.scarfGroup);

    // Scarf Collar / Shoulder Wrap
    const scarfCollarGeo = new THREE.TorusGeometry(0.23, 0.045, 8, 20);
    const scarfCollar = new THREE.Mesh(scarfCollarGeo, mats.rubyCrimsonMaterial);
    scarfCollar.rotation.x = Math.PI / 2;
    scarfCollar.position.set(0, 0, 0);
    this.scarfGroup.add(scarfCollar);

    // Gold borders along the scarf wrap
    const scarfTrimGeo = new THREE.TorusGeometry(0.245, 0.015, 6, 20);
    const scarfTrim = new THREE.Mesh(scarfTrimGeo, mats.goldMaterial);
    scarfTrim.rotation.x = Math.PI / 2;
    this.scarfGroup.add(scarfTrim);

    // Articulated Fluttering Scarf Tail Segments
    this.scarfSegments = [];
    const numSegments = 6;
    for (let i = 0; i < numSegments; i++) {
      const w = 0.28 - i * 0.025;
      const h = 0.025;
      const d = 0.18;
      
      const segGeo = new THREE.BoxGeometry(w, h, d);
      const segMesh = new THREE.Mesh(segGeo, mats.rubyCrimsonMaterial);
      segMesh.castShadow = true;
      
      // Golden border stripe along edge of scarf tail
      const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.01, h + 0.005, 0.03), mats.goldMaterial);
      goldTrim.position.set(0, 0, (i === numSegments - 1) ? -d / 2 : 0);
      segMesh.add(goldTrim);

      segMesh.position.set(0, -0.02 - i * 0.04, -0.14 - i * 0.15);
      this.scarfSegments.push({ mesh: segMesh, baseAngle: i * 0.15 });
      this.scarfGroup.add(segMesh);
    }

    // ==========================================
    // 5. ARTICULATED ARMS & HANDS
    // ==========================================
    const shoulderOffset = 0.32;
    const armY = 0.44;

    // --- LEFT ARM ---
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-shoulderOffset, armY, 0);
    this.torsoGroup.add(this.leftArmGroup);

    // Shoulder Sphere joint
    const shoulderGeo = new THREE.SphereGeometry(0.08, 10, 8);
    const leftShoulder = new THREE.Mesh(shoulderGeo, kurtaMat);
    this.leftArmGroup.add(leftShoulder);

    // Upper Arm (Festive Sleeve)
    const upperArmGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.26, 12);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, kurtaMat);
    leftUpperArm.position.set(0, -0.13, 0);
    leftUpperArm.castShadow = true;
    this.leftArmGroup.add(leftUpperArm);

    // Golden Sleeve Cuff
    const cuffGeo = new THREE.TorusGeometry(0.072, 0.015, 6, 16);
    const leftCuff = new THREE.Mesh(cuffGeo, mats.goldMaterial);
    leftCuff.rotation.x = Math.PI / 2;
    leftCuff.position.set(0, -0.24, 0);
    this.leftArmGroup.add(leftCuff);

    // Left Forearm Group (Elbow pivot)
    this.leftForearmGroup = new THREE.Group();
    this.leftForearmGroup.position.set(0, -0.26, 0);
    this.leftArmGroup.add(this.leftForearmGroup);

    const forearmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.24, 12);
    const leftForearm = new THREE.Mesh(forearmGeo, skinMat);
    leftForearm.position.set(0, -0.12, 0);
    leftForearm.castShadow = true;
    this.leftForearmGroup.add(leftForearm);

    // Left Hand (Natural runner fist)
    const handGeo = new THREE.SphereGeometry(0.06, 10, 8);
    handGeo.scale(0.8, 1.2, 0.9);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0, -0.26, 0.02);
    this.leftForearmGroup.add(leftHand);

    // --- RIGHT ARM ---
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(shoulderOffset, armY, 0);
    this.torsoGroup.add(this.rightArmGroup);

    const rightShoulder = new THREE.Mesh(shoulderGeo, kurtaMat);
    this.rightArmGroup.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, kurtaMat);
    rightUpperArm.position.set(0, -0.13, 0);
    rightUpperArm.castShadow = true;
    this.rightArmGroup.add(rightUpperArm);

    const rightCuff = new THREE.Mesh(cuffGeo, mats.goldMaterial);
    rightCuff.rotation.x = Math.PI / 2;
    rightCuff.position.set(0, -0.24, 0);
    this.rightArmGroup.add(rightCuff);

    // Right Forearm Group (Elbow pivot)
    this.rightForearmGroup = new THREE.Group();
    this.rightForearmGroup.position.set(0, -0.26, 0);
    this.rightArmGroup.add(this.rightForearmGroup);

    const rightForearm = new THREE.Mesh(forearmGeo, skinMat);
    rightForearm.position.set(0, -0.12, 0);
    rightForearm.castShadow = true;
    this.rightForearmGroup.add(rightForearm);

    // Traditional Gold Kada (Bangle) on Right Wrist!
    const kadaGeo = new THREE.TorusGeometry(0.062, 0.016, 8, 16);
    const rightKada = new THREE.Mesh(kadaGeo, mats.goldShineMaterial);
    rightKada.rotation.x = Math.PI / 2;
    rightKada.position.set(0, -0.22, 0);
    this.rightForearmGroup.add(rightKada);

    // Right Hand
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0, -0.26, 0.02);
    this.rightForearmGroup.add(rightHand);

    // ==========================================
    // 6. LOWER BODY: DHOTI-PANTS & RUNNER SNEAKERS
    // ==========================================
    const hipOffset = 0.15;
    const hipY = 0.68;

    // --- LEFT LEG ---
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-hipOffset, hipY, 0);
    this.characterRoot.add(this.leftLegGroup);

    // Upper Thigh (Dhoti / Festive pyjama volume)
    const thighGeo = new THREE.CylinderGeometry(0.12, 0.095, 0.36, 14);
    const leftThigh = new THREE.Mesh(thighGeo, dhotiMat);
    leftThigh.position.set(0, -0.18, 0);
    leftThigh.castShadow = true;
    this.leftLegGroup.add(leftThigh);

    // Gold piping down side of dhoti
    const goldPipingGeo = new THREE.BoxGeometry(0.02, 0.36, 0.08);
    const leftPiping = new THREE.Mesh(goldPipingGeo, mats.goldMaterial);
    leftPiping.position.set(-0.11, -0.18, 0);
    this.leftLegGroup.add(leftPiping);

    // Left Calf & Knee Group
    this.leftCalfGroup = new THREE.Group();
    this.leftCalfGroup.position.set(0, -0.36, 0);
    this.leftLegGroup.add(this.leftCalfGroup);

    const calfGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.32, 12);
    const leftCalf = new THREE.Mesh(calfGeo, dhotiMat);
    leftCalf.position.set(0, -0.16, 0);
    leftCalf.castShadow = true;
    this.leftCalfGroup.add(leftCalf);

    // Left Modern High-Top Festival Sneaker
    this.buildSneaker(this.leftCalfGroup, shoeBodyMat, shoeTrimMat, shoeSoleMat, shoeGripMat, mats.goldMaterial, false);

    // --- RIGHT LEG ---
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(hipOffset, hipY, 0);
    this.characterRoot.add(this.rightLegGroup);

    const rightThigh = new THREE.Mesh(thighGeo, dhotiMat);
    rightThigh.position.set(0, -0.18, 0);
    rightThigh.castShadow = true;
    this.rightLegGroup.add(rightThigh);

    const rightPiping = new THREE.Mesh(goldPipingGeo, mats.goldMaterial);
    rightPiping.position.set(0.11, -0.18, 0);
    this.rightLegGroup.add(rightPiping);

    // Right Calf & Knee Group
    this.rightCalfGroup = new THREE.Group();
    this.rightCalfGroup.position.set(0, -0.36, 0);
    this.rightLegGroup.add(this.rightCalfGroup);

    const rightCalf = new THREE.Mesh(calfGeo, dhotiMat);
    rightCalf.position.set(0, -0.16, 0);
    rightCalf.castShadow = true;
    this.rightCalfGroup.add(rightCalf);

    // Right Modern High-Top Festival Sneaker
    this.buildSneaker(this.rightCalfGroup, shoeBodyMat, shoeTrimMat, shoeSoleMat, shoeGripMat, mats.goldMaterial, true);

    // ==========================================
    // 7. SOFT DYNAMIC GROUND SHADOW
    // ==========================================
    const shadowGeo = new THREE.PlaneGeometry(1.3, 1.3);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x1a0d05,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = 0.02;
    this.group.add(this.shadowMesh);
  }

  /**
   * Builds an attractive, stylized modern running sneaker with festival accents
   */
  private buildSneaker(
    parent: THREE.Group,
    bodyMat: THREE.Material,
    trimMat: THREE.Material,
    soleMat: THREE.Material,
    gripMat: THREE.Material,
    goldMat: THREE.Material,
    isRight: boolean
  ) {
    const sneakerGroup = new THREE.Group();
    sneakerGroup.position.set(0, -0.32, 0.04);
    parent.add(sneakerGroup);

    // Sneaker Upper Body (Rounded athletic shape)
    const upperGeo = new THREE.BoxGeometry(0.16, 0.12, 0.28);
    const upper = new THREE.Mesh(upperGeo, bodyMat);
    upper.position.set(0, 0.04, 0.03);
    upper.castShadow = true;
    sneakerGroup.add(upper);

    // Rounded Toe Cap
    const toeGeo = new THREE.SphereGeometry(0.08, 10, 8);
    toeGeo.scale(0.98, 0.6, 1.1);
    const toe = new THREE.Mesh(toeGeo, trimMat);
    toe.position.set(0, 0.02, 0.16);
    sneakerGroup.add(toe);

    // Dynamic Saffron Running Stripe / Swoosh
    const stripeGeo = new THREE.BoxGeometry(0.166, 0.04, 0.18);
    const stripe = new THREE.Mesh(stripeGeo, trimMat);
    stripe.position.set(0, 0.04, 0.02);
    sneakerGroup.add(stripe);

    // Golden Heel Accent
    const heelAccentGeo = new THREE.BoxGeometry(0.164, 0.06, 0.05);
    const heelAccent = new THREE.Mesh(heelAccentGeo, goldMat);
    heelAccent.position.set(0, 0.06, -0.11);
    sneakerGroup.add(heelAccent);

    // Thick Cushioned Athletic Midsole (Crisp White)
    const soleGeo = new THREE.BoxGeometry(0.18, 0.05, 0.32);
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.set(0, -0.03, 0.03);
    sole.castShadow = true;
    sneakerGroup.add(sole);

    // Dark Bottom Grip Tread
    const gripGeo = new THREE.BoxGeometry(0.176, 0.015, 0.31);
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(0, -0.058, 0.03);
    sneakerGroup.add(grip);
  }

  private buildVFXNodes() {
    const mats = MaterialLibrary.get();

    // Shield Bubble (Lotus Shield)
    const shieldGeo = new THREE.IcosahedronGeometry(1.2, 2);
    this.shieldBubble = new THREE.Mesh(shieldGeo, mats.shieldMaterial);
    this.shieldBubble.position.y = 1.0;
    this.shieldBubble.visible = false;
    this.group.add(this.shieldBubble);

    // Magnet Aura Ring
    const magnetGeo = new THREE.TorusGeometry(1.3, 0.04, 8, 32);
    const magnetMat = new THREE.MeshBasicMaterial({ color: 0xff0066, transparent: true, opacity: 0.65 });
    this.magnetRing = new THREE.Mesh(magnetGeo, magnetMat);
    this.magnetRing.rotation.x = Math.PI / 2;
    this.magnetRing.position.y = 0.8;
    this.magnetRing.visible = false;
    this.group.add(this.magnetRing);

    // Dash Boost Wings
    this.boostWingsGroup = new THREE.Group();
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(0.8, 0.6);
    wingShape.lineTo(1.4, 0.2);
    wingShape.lineTo(0.6, -0.3);
    wingShape.closePath();

    const wingGeo = new THREE.ShapeGeometry(wingShape);
    const wingL = new THREE.Mesh(wingGeo, mats.boostWingsMaterial);
    wingL.position.set(-0.35, 1.1, -0.2);
    wingL.rotation.y = -0.3;
    this.boostWingsGroup.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, mats.boostWingsMaterial);
    wingR.position.set(0.35, 1.1, -0.2);
    wingR.rotation.y = Math.PI + 0.3;
    this.boostWingsGroup.add(wingR);

    // Subtle Golden Rim Light (Gives crisp silhouette highlight against festival night/dusk)
    this.rimLight = new THREE.PointLight(0xffd580, 0.85, 4.5, 2.0);
    this.rimLight.position.set(0, 1.4, -0.6);
    this.group.add(this.rimLight);
  }

  public switchLane(deltaLane: -1 | 1): boolean {
    if (!this.isAlive) return false;
    const newLane = (this.lane + deltaLane) as Lane;
    if (newLane >= -1 && newLane <= 1) {
      this.lane = newLane;
      this.targetX = GAME_CONSTANTS.LANE_POSITIONS[this.lane + 1];
      return true;
    }
    return false;
  }

  public jump(): boolean {
    if (!this.isAlive) return false;
    if (this.isGrounded) {
      this.velocityY = GAME_CONSTANTS.JUMP_VELOCITY;
      this.isGrounded = false;
      this.isSliding = false; // Jump cancels slide
      this.jumpProgress = 0;
      return true;
    }
    return false;
  }

  public slide(): boolean {
    if (!this.isAlive) return false;
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = GAME_CONSTANTS.SLIDE_DURATION;
      if (!this.isGrounded) {
        // Fast downward dive if sliding mid-air
        this.velocityY = Math.min(this.velocityY, -22.0);
      }
      return true;
    }
    return false;
  }

  public triggerCollectCelebration() {
    this.celebrationTimer = 0.45;
  }

  public update(delta: number, runningSpeed: number) {
    if (!this.isAlive) {
      this.animateDeath(delta);
      return;
    }

    // 1. Smooth Lateral Lane Switching & Dynamic Banking Lean
    this.currentX = THREE.MathUtils.lerp(
      this.currentX, 
      this.targetX, 
      delta * GAME_CONSTANTS.LANE_SWITCH_SPEED
    );
    this.group.position.x = this.currentX;

    // Body Bank/Tilt when shifting lanes (dynamic roll and yaw)
    const laneDiff = this.targetX - this.currentX;
    this.characterRoot.rotation.z = -laneDiff * 0.16;
    this.characterRoot.rotation.y = laneDiff * 0.12;

    // 2. Vertical Physics (Jump, Elevation, Gravity & Landing)
    const baseFloor = this.onRampPlatform ? this.platformHeight : 0;

    if (!this.isGrounded) {
      this.velocityY += GAME_CONSTANTS.GRAVITY * delta;
      this.y += this.velocityY * delta;
      this.jumpProgress += delta;

      if (this.y <= baseFloor) {
        this.y = baseFloor;
        this.velocityY = 0;
        this.isGrounded = true;
        // Trigger landing squash reaction and soft cushioned sound
        this.landingSquashTimer = 0.18;
        soundEngine.playLanding();
      }
    } else {
      // Smoothly follow ramp incline or platform drop
      this.y = THREE.MathUtils.lerp(this.y, baseFloor, delta * 18.0);
    }

    this.group.position.y = this.y;

    // 3. Sliding Timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 4. Timers
    if (this.landingSquashTimer > 0) {
      this.landingSquashTimer -= delta;
    }
    if (this.celebrationTimer > 0) {
      this.celebrationTimer -= delta;
    }

    // 5. Advanced Character Skeletal Animation
    this.animateCharacter(delta, runningSpeed);

    // 6. Update Visual Effects & Auras
    this.updateVFX(delta);

    // 7. Update Dynamic Collider Bounding Box
    this.updateCollider();

    // 8. Ground Shadow Tracking & Attenuation
    const heightAboveGround = Math.max(0, this.y - baseFloor);
    this.shadowMesh.position.y = (baseFloor - this.y) + 0.025;
    const shadowScale = Math.max(0.4, 1.0 - heightAboveGround * 0.22);
    this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
    (this.shadowMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.15, 0.48 - heightAboveGround * 0.12);
  }

  private animateCharacter(delta: number, speed: number) {
    // Reset root scale/transforms
    this.characterRoot.scale.set(1, 1, 1);
    this.characterRoot.position.set(0, 0, 0);

    // ----------------------------------------------------
    // STATE 1: SLIDING POSE (Parkour Baseball Slide)
    // ----------------------------------------------------
    if (this.isSliding) {
      // Drop character center of gravity low to ground
      this.characterRoot.position.y = -0.28;
      this.characterRoot.position.z = 0.15;
      
      // Torso angled backwards for low clearance
      this.torsoGroup.position.set(0, 0.45, 0);
      this.torsoGroup.rotation.set(-0.65, 0.15, -0.15);
      
      // Head looking forward down the track
      this.headGroup.rotation.set(0.6, -0.1, 0.1);
      
      // Leading leg extended straight forward to slide
      this.leftLegGroup.position.set(-0.14, 0.38, 0.15);
      this.leftLegGroup.rotation.set(-1.45, 0.1, 0.1);
      this.leftCalfGroup.rotation.set(0.2, 0, 0);

      // Trailing leg tucked underneath
      this.rightLegGroup.position.set(0.16, 0.32, -0.05);
      this.rightLegGroup.rotation.set(-0.35, 0.3, -0.3);
      this.rightCalfGroup.rotation.set(-1.5, 0, 0);

      // Arms balancing the slide
      this.leftArmGroup.rotation.set(0.7, 0.2, -0.4);
      this.leftForearmGroup.rotation.set(0.8, 0, 0);
      this.rightArmGroup.rotation.set(0.9, -0.2, 0.5);
      this.rightForearmGroup.rotation.set(0.6, 0, 0);

      // Scarf streaming flat backwards
      this.scarfSegments.forEach((seg, idx) => {
        seg.mesh.rotation.x = 0.1 + idx * 0.04 + Math.sin(this.runCycle * 2 + idx) * 0.08;
        seg.mesh.rotation.y = 0.05;
        seg.mesh.position.y = -0.02;
      });
      return;
    }

    // ----------------------------------------------------
    // STATE 2: JUMPING / AIRBORNE POSE
    // ----------------------------------------------------
    if (!this.isGrounded) {
      // Mid-air athletic leap pose
      this.torsoGroup.position.set(0, 0.72, 0);
      this.torsoGroup.rotation.set(0.18, 0, 0);
      this.headGroup.rotation.set(-0.15, 0, 0);

      // Lead knee tucked high, trailing leg extended back
      this.leftLegGroup.position.set(-0.15, 0.68, 0);
      this.leftLegGroup.rotation.set(-0.9, 0, 0);
      this.leftCalfGroup.rotation.set(-1.1, 0, 0); // Knee bent tightly

      this.rightLegGroup.position.set(0.15, 0.68, 0);
      this.rightLegGroup.rotation.set(0.55, 0, 0);
      this.rightCalfGroup.rotation.set(-0.3, 0, 0); // Trailing leg back

      // Arms raised dynamically for airborne balance
      this.leftArmGroup.rotation.set(-1.8, 0.2, -0.4);
      this.leftForearmGroup.rotation.set(0.6, 0, 0);
      this.rightArmGroup.rotation.set(-1.4, -0.2, 0.4);
      this.rightForearmGroup.rotation.set(0.8, 0, 0);

      // Scarf billowing upward/backward from air drag
      this.scarfSegments.forEach((seg, idx) => {
        seg.mesh.rotation.x = -0.35 + idx * 0.08 + Math.sin(this.jumpProgress * 8 + idx) * 0.12;
        seg.mesh.rotation.y = Math.sin(this.jumpProgress * 5 + idx) * 0.08;
      });
      return;
    }

    // ----------------------------------------------------
    // STATE 3: LANDING COMPRESSION SQUASH
    // ----------------------------------------------------
    if (this.landingSquashTimer > 0) {
      const squash = Math.sin((this.landingSquashTimer / 0.18) * Math.PI) * 0.18;
      this.characterRoot.scale.set(1 + squash * 0.5, 1 - squash, 1 + squash * 0.5);
    }

    // ----------------------------------------------------
    // STATE 4: FLUID RUNNING GAIT CYCLE / IDLE READY STANCE / NAMASKAR PRAYER POSE
    // ----------------------------------------------------
    if (this.isNamaskar) {
      // Reverent Devotional Namaskar Stance facing Lord Ganesha
      this.runCycle += delta * 2.0;
      const prayerSin = Math.sin(this.runCycle);

      this.torsoGroup.position.set(0, 0.72 + prayerSin * 0.01, 0);
      this.torsoGroup.rotation.set(0.08, 0, 0); // Slight respectful bow forward
      this.headGroup.rotation.set(-0.25 + prayerSin * 0.02, 0, 0); // Looking up with devotion at the idol

      // Anjali Mudra: Hands folded together in front of heart
      this.leftArmGroup.rotation.set(-0.5, 0.45, 0.55);
      this.leftForearmGroup.rotation.set(-1.15, 0.35, 0);

      this.rightArmGroup.rotation.set(-0.5, -0.45, -0.55);
      this.rightForearmGroup.rotation.set(-1.15, -0.35, 0);

      this.leftLegGroup.position.set(-0.14, 0.68, 0);
      this.leftLegGroup.rotation.set(0, 0, -0.02);
      this.leftCalfGroup.rotation.set(0, 0, 0);

      this.rightLegGroup.position.set(0.14, 0.68, 0);
      this.rightLegGroup.rotation.set(0, 0, 0.02);
      this.rightCalfGroup.rotation.set(0, 0, 0);

      this.scarfSegments.forEach((seg, idx) => {
        seg.mesh.rotation.x = 0.15 + Math.sin(this.runCycle + idx * 0.3) * 0.04;
        seg.mesh.rotation.y = Math.cos(this.runCycle * 0.5 + idx) * 0.03;
        seg.mesh.rotation.z = 0;
      });
      return;
    }

    if (speed < 0.1) {
      // Idle Breathing & Ready Stance
      this.runCycle += delta * 2.5;
      const idleSin = Math.sin(this.runCycle);
      const idleCos = Math.cos(this.runCycle);

      // Gentle chest rise & fall
      this.torsoGroup.position.set(0, 0.72 + idleSin * 0.015, 0);
      this.torsoGroup.rotation.set(0.04, 0, 0);
      this.headGroup.rotation.set(-0.02 + idleCos * 0.02, idleSin * 0.03, 0);

      // Relaxed ready arms
      this.leftArmGroup.rotation.set(0.2 + idleSin * 0.04, 0.1, -0.15);
      this.leftForearmGroup.rotation.set(0.4, 0, 0);

      this.rightArmGroup.rotation.set(0.2 - idleSin * 0.04, -0.1, 0.15);
      this.rightForearmGroup.rotation.set(0.4, 0, 0);

      // Grounded stable stance
      this.leftLegGroup.position.set(-0.15, 0.68, 0);
      this.leftLegGroup.rotation.set(0, 0, -0.05);
      this.leftCalfGroup.rotation.set(0.05, 0, 0);

      this.rightLegGroup.position.set(0.15, 0.68, 0);
      this.rightLegGroup.rotation.set(0, 0, 0.05);
      this.rightCalfGroup.rotation.set(0.05, 0, 0);

      // Scarf resting with gentle breeze
      this.scarfSegments.forEach((seg, idx) => {
        seg.mesh.rotation.x = 0.18 + Math.sin(this.runCycle + idx * 0.3) * 0.05;
        seg.mesh.rotation.y = Math.cos(this.runCycle * 0.6 + idx) * 0.04;
        seg.mesh.rotation.z = 0;
      });
      return;
    }

    const animSpeed = speed * 0.78;
    this.runCycle += delta * animSpeed;
    const sinCycle = Math.sin(this.runCycle);
    const cosCycle = Math.cos(this.runCycle);
    const doubleCycle = Math.sin(this.runCycle * 2);

    // Torso harmonic bounce & athletic forward sprint lean
    const bounceY = 0.72 + Math.abs(cosCycle) * 0.07;
    this.torsoGroup.position.set(0, bounceY, 0);
    this.torsoGroup.rotation.x = 0.14; // Forward lean
    this.torsoGroup.rotation.y = -sinCycle * 0.08; // Torso yaw twisting against stride
    this.torsoGroup.rotation.z = -cosCycle * 0.04; // Subtle hip sway

    // Head stabilization (counter-bobs to keep gaze steady forward)
    this.headGroup.rotation.x = -0.12 + doubleCycle * 0.03;
    this.headGroup.rotation.y = sinCycle * 0.05;

    // --- LEGS STRIDE WITH KNEE BEND ---
    this.leftLegGroup.position.set(-0.15, 0.68, 0);
    this.rightLegGroup.position.set(0.15, 0.68, 0);

    // Thigh pitch
    this.leftLegGroup.rotation.x = sinCycle * 0.95;
    this.rightLegGroup.rotation.x = -sinCycle * 0.95;

    // Knee flex on back-kick: bend when leg is moving backward
    const leftBackKick = Math.max(0, -sinCycle);
    const rightBackKick = Math.max(0, sinCycle);
    this.leftCalfGroup.rotation.x = -leftBackKick * 1.3 - 0.1;
    this.rightCalfGroup.rotation.x = -rightBackKick * 1.3 - 0.1;

    // --- ARMS PUMPING WITH NATURAL ELBOW BEND ---
    // Arms swing in opposite rhythm to legs
    this.leftArmGroup.rotation.x = -sinCycle * 0.85;
    this.leftArmGroup.rotation.z = -0.15 + Math.abs(sinCycle) * 0.05;
    this.leftForearmGroup.rotation.x = 0.6 + Math.max(0, sinCycle) * 0.4; // Flexes during forward pump

    this.rightArmGroup.rotation.x = sinCycle * 0.85;
    this.rightArmGroup.rotation.z = 0.15 - Math.abs(sinCycle) * 0.05;
    this.rightForearmGroup.rotation.x = 0.6 + Math.max(0, -sinCycle) * 0.4;

    // --- CELEBRATION OVERRIDE (Modak Collected!) ---
    if (this.celebrationTimer > 0) {
      // Pump right hand high in cheerful triumph
      this.rightArmGroup.rotation.set(-2.2, -0.3, 0.3);
      this.rightForearmGroup.rotation.set(0.4, 0, 0);
    }

    // --- DYNAMIC SCARF CLOTH WAVE PHYSICS ---
    this.scarfSegments.forEach((seg, idx) => {
      const phase = this.runCycle - idx * 0.45;
      const wave = Math.sin(phase) * 0.18;
      const flutter = Math.cos(phase * 1.6) * 0.08;
      seg.mesh.rotation.x = 0.28 + idx * 0.06 + wave;
      seg.mesh.rotation.y = Math.sin(phase * 0.7) * 0.12;
      seg.mesh.rotation.z = flutter;
    });
  }

  private updateVFX(delta: number) {
    // Shield
    this.shieldBubble.visible = this.hasShield;
    if (this.hasShield) {
      this.shieldBubble.rotation.y += delta * 2.2;
      this.shieldBubble.rotation.x += delta * 1.4;
    }

    // Magnet
    this.magnetRing.visible = this.hasMagnet;
    if (this.hasMagnet) {
      this.magnetRing.rotation.z += delta * 3.8;
    }

    // Speed Boost
    this.boostWingsGroup.visible = this.isBoosting;
    if (this.isBoosting) {
      const flap = Math.sin(this.runCycle * 2.8) * 0.35;
      this.boostWingsGroup.children[0].rotation.z = flap;
      this.boostWingsGroup.children[1].rotation.z = -flap;
    }
  }

  private animateDeath(delta: number) {
    // Tumble & slide gracefully on crash
    this.group.position.y = Math.max(0, this.group.position.y - delta * 4.0);
    this.characterRoot.rotation.x += delta * 5.0;
    this.characterRoot.rotation.z += delta * 3.5;
    this.characterRoot.rotation.y += delta * 2.0;
  }

  public updateCollider() {
    const height = this.isSliding ? GAME_CONSTANTS.PLAYER_SLIDE_HEIGHT : GAME_CONSTANTS.PLAYER_NORMAL_HEIGHT;
    const halfW = GAME_CONSTANTS.PLAYER_WIDTH / 2;
    const halfD = GAME_CONSTANTS.PLAYER_DEPTH / 2;

    this.collider.min.set(
      this.group.position.x - halfW,
      this.group.position.y,
      this.group.position.z - halfD
    );
    this.collider.max.set(
      this.group.position.x + halfW,
      this.group.position.y + height,
      this.group.position.z + halfD
    );
  }

  public reset() {
    this.lane = 0;
    this.targetX = 0;
    this.currentX = 0;
    this.y = 0;
    this.velocityY = 0;
    this.isGrounded = true;
    this.onRampPlatform = false;
    this.platformHeight = 0;
    this.isSliding = false;
    this.slideTimer = 0;
    this.isInvincible = false;
    this.hasShield = false;
    this.hasMagnet = false;
    this.isBoosting = false;
    this.runCycle = 0;
    this.isAlive = true;
    this.jumpProgress = 0;
    this.landingSquashTimer = 0;
    this.celebrationTimer = 0;

    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
    if (this.characterRoot) {
      this.characterRoot.position.set(0, 0, 0);
      this.characterRoot.rotation.set(0, 0, 0);
      this.characterRoot.scale.set(1, 1, 1);
    }
    this.updateCollider();
  }
}
