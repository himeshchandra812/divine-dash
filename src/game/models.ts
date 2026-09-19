import * as THREE from 'three';
import { FESTIVAL_COLORS } from './constants';
import { 
  createStreetTexture, 
  createTempleSandstoneTexture, 
  createAwningTexture, 
  createGlowParticleTexture,
  createPandalBackdropTexture,
  createDholTexture,
  createCrowdTexture,
  createBlessingTokenTexture,
  createHazardStripeTexture,
  createCartBackTexture,
  createLeftBannerTexture,
  createRightBannerTexture,
  createSunsetSkyTexture,
  createGaneshaDhotiTexture,
  createGaneshaCrownTexture,
  createGaneshaPedestalTexture,
  createGaneshaPrabhavaliTexture,
  createAltarRangoliTexture
} from './textures';

/**
 * Reusable material library to keep draw calls minimal and performance at 60+ FPS
 */
export class MaterialLibrary {
  private static instance: MaterialLibrary;
  
  public goldMaterial: THREE.MeshStandardMaterial;
  public goldShineMaterial: THREE.MeshPhysicalMaterial;
  public sandstoneMaterial: THREE.MeshStandardMaterial;
  public darkWoodMaterial: THREE.MeshStandardMaterial;
  public marigoldOrangeMaterial: THREE.MeshStandardMaterial;
  public marigoldYellowMaterial: THREE.MeshStandardMaterial;
  public rubyCrimsonMaterial: THREE.MeshStandardMaterial;
  public peacockTealMaterial: THREE.MeshStandardMaterial;
  public terracottaMaterial: THREE.MeshStandardMaterial;
  public diyaFlameMaterial: THREE.MeshBasicMaterial;
  public streetMaterial: THREE.MeshStandardMaterial;
  public whiteClothMaterial: THREE.MeshStandardMaterial;
  public glowingAuraMaterial: THREE.MeshBasicMaterial;
  public boostWingsMaterial: THREE.MeshBasicMaterial;
  public shieldMaterial: THREE.MeshStandardMaterial;
  
  // Festival-themed materials
  public blessingTokenMaterial: THREE.MeshStandardMaterial;
  public pandalBackdropMaterial: THREE.MeshStandardMaterial;
  public dholMaterial: THREE.MeshStandardMaterial;
  public crowdMaterial: THREE.MeshBasicMaterial;
  public saffronBrightMaterial: THREE.MeshStandardMaterial;
  public royalPurpleMaterial: THREE.MeshStandardMaterial;
  public lotusPinkMaterial: THREE.MeshStandardMaterial;
  public emeraldMaterial: THREE.MeshStandardMaterial;

  // High-Definition Lord Ganesha PBR Materials
  public ganeshaSkinMaterial: THREE.MeshStandardMaterial;
  public ganeshaGoldMaterial: THREE.MeshPhysicalMaterial;
  public ganeshaDhotiMaterial: THREE.MeshStandardMaterial;
  public ganeshaShawlMaterial: THREE.MeshStandardMaterial;
  public ganeshaCrownMaterial: THREE.MeshPhysicalMaterial;
  public ganeshaIvoryMaterial: THREE.MeshStandardMaterial;
  public ganeshaRubyMaterial: THREE.MeshPhysicalMaterial;
  public ganeshaEmeraldMaterial: THREE.MeshPhysicalMaterial;
  public ganeshaPedestalMarbleMaterial: THREE.MeshStandardMaterial;
  public altarRangoliMaterial: THREE.MeshStandardMaterial;
  public ganeshaPrabhavaliMaterial: THREE.MeshBasicMaterial;

  private constructor() {
    this.goldMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.TEMPLE_GOLD,
      metalness: 0.85,
      roughness: 0.25,
      emissive: FESTIVAL_COLORS.TEMPLE_GOLD,
      emissiveIntensity: 0.15,
    });

    this.goldShineMaterial = new THREE.MeshPhysicalMaterial({
      color: FESTIVAL_COLORS.TEMPLE_GOLD,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0xffaa00,
      emissiveIntensity: 0.25,
    });

    const templeTex = createTempleSandstoneTexture();
    this.sandstoneMaterial = new THREE.MeshStandardMaterial({
      map: templeTex,
      color: 0xdeb887,
      roughness: 0.8,
      metalness: 0.05,
    });

    this.darkWoodMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.WOOD_DARK,
      roughness: 0.7,
      metalness: 0.1,
    });

    this.marigoldOrangeMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.MARIGOLD_ORANGE,
      roughness: 0.6,
      emissive: FESTIVAL_COLORS.MARIGOLD_ORANGE,
      emissiveIntensity: 0.1,
    });

    this.marigoldYellowMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.MARIGOLD_YELLOW,
      roughness: 0.6,
      emissive: FESTIVAL_COLORS.MARIGOLD_YELLOW,
      emissiveIntensity: 0.1,
    });

    this.rubyCrimsonMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.RUBY_CRIMSON,
      roughness: 0.5,
      metalness: 0.1,
    });

    this.peacockTealMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.PEACOCK_TEAL,
      roughness: 0.4,
      metalness: 0.2,
    });

    this.terracottaMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.TERRACOTTA,
      roughness: 0.9,
      metalness: 0.0,
    });

    this.diyaFlameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.95,
    });

    const streetTex = createStreetTexture();
    streetTex.repeat.set(1, 4);
    this.streetMaterial = new THREE.MeshStandardMaterial({
      map: streetTex,
      roughness: 0.7,
      metalness: 0.15,
    });

    this.whiteClothMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbfbfb,
      roughness: 0.6,
    });

    this.glowingAuraMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });

    this.boostWingsMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });

    this.shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x4cc9f0,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0x00f5d4,
      emissiveIntensity: 0.3,
    });

    // Festive additions
    const tokenTex = createBlessingTokenTexture();
    this.blessingTokenMaterial = new THREE.MeshStandardMaterial({
      map: tokenTex,
      color: 0xffffff,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3,
    });

    const pandalTex = createPandalBackdropTexture();
    this.pandalBackdropMaterial = new THREE.MeshStandardMaterial({
      map: pandalTex,
      roughness: 0.7,
      metalness: 0.1,
    });

    const dholTex = createDholTexture();
    this.dholMaterial = new THREE.MeshStandardMaterial({
      map: dholTex,
      roughness: 0.5,
      metalness: 0.2,
    });

    const crowdTex = createCrowdTexture();
    this.crowdMaterial = new THREE.MeshBasicMaterial({
      map: crowdTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.saffronBrightMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.SAFFRON_BRIGHT,
      roughness: 0.5,
      emissive: FESTIVAL_COLORS.SAFFRON_BRIGHT,
      emissiveIntensity: 0.15,
    });

    this.royalPurpleMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.ROYAL_PURPLE,
      roughness: 0.5,
      metalness: 0.15,
    });

    this.lotusPinkMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.LOTUS_PINK,
      roughness: 0.4,
      emissive: FESTIVAL_COLORS.LOTUS_PINK,
      emissiveIntensity: 0.1,
    });

    this.emeraldMaterial = new THREE.MeshStandardMaterial({
      color: FESTIVAL_COLORS.EMERALD_GREEN,
      roughness: 0.4,
      metalness: 0.2,
    });

    // High-Definition Lord Ganesha PBR Materials
    this.ganeshaSkinMaterial = new THREE.MeshStandardMaterial({
      color: 0xf58a22, // Rich warm divine saffron terracotta
      roughness: 0.52,
      metalness: 0.05,
      emissive: 0xd96500,
      emissiveIntensity: 0.12,
    });

    this.ganeshaGoldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffd700,
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      emissive: 0xb8860b,
      emissiveIntensity: 0.22,
    });

    const dhotiTex = createGaneshaDhotiTexture();
    this.ganeshaDhotiMaterial = new THREE.MeshStandardMaterial({
      map: dhotiTex,
      roughness: 0.45,
      metalness: 0.15,
      emissive: 0x995500,
      emissiveIntensity: 0.1,
    });

    this.ganeshaShawlMaterial = new THREE.MeshStandardMaterial({
      color: 0x990022, // Deep velvet crimson
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x550011,
      emissiveIntensity: 0.15,
    });

    const crownTex = createGaneshaCrownTexture();
    this.ganeshaCrownMaterial = new THREE.MeshPhysicalMaterial({
      map: crownTex,
      color: 0xffe680,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      emissive: 0xb8860b,
      emissiveIntensity: 0.2,
    });

    this.ganeshaIvoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffff2,
      roughness: 0.22,
      metalness: 0.04,
      emissive: 0xfffae0,
      emissiveIntensity: 0.08,
    });

    this.ganeshaRubyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd90429,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0xa0001e,
      emissiveIntensity: 0.4,
    });

    this.ganeshaEmeraldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06d6a0,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0x047857,
      emissiveIntensity: 0.35,
    });

    const pedestalTex = createGaneshaPedestalTexture();
    this.ganeshaPedestalMarbleMaterial = new THREE.MeshStandardMaterial({
      map: pedestalTex,
      roughness: 0.32,
      metalness: 0.08,
    });

    const rangoliTex = createAltarRangoliTexture();
    this.altarRangoliMaterial = new THREE.MeshStandardMaterial({
      map: rangoliTex,
      roughness: 0.5,
      metalness: 0.1,
      emissive: 0x590d22,
      emissiveIntensity: 0.25,
    });

    const prabhavaliTex = createGaneshaPrabhavaliTexture();
    this.ganeshaPrabhavaliMaterial = new THREE.MeshBasicMaterial({
      map: prabhavaliTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }


  public static get(): MaterialLibrary {
    if (!MaterialLibrary.instance) {
      MaterialLibrary.instance = new MaterialLibrary();
    }
    return MaterialLibrary.instance;
  }
}

/**
 * Creates the Golden Modak 3D model (signature divine collectible)
 */
export function createModakMesh(): THREE.Group {
  const group = new THREE.Group();
  const mat = MaterialLibrary.get().goldShineMaterial;

  // Modak characteristic dumpling shape (rounded base tapering to a pointed crown with pleats)
  const baseGeo = new THREE.SphereGeometry(0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7);
  const baseMesh = new THREE.Mesh(baseGeo, mat);
  baseMesh.castShadow = true;
  baseMesh.position.y = 0.2;
  group.add(baseMesh);

  // Pointed swirl tip
  const tipGeo = new THREE.ConeGeometry(0.24, 0.45, 16);
  const tipMesh = new THREE.Mesh(tipGeo, mat);
  tipMesh.position.y = 0.52;
  tipMesh.castShadow = true;
  group.add(tipMesh);

  // Tiny golden blessing bead on apex
  const beadGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const beadMesh = new THREE.Mesh(beadGeo, mat);
  beadMesh.position.y = 0.78;
  group.add(beadMesh);

  // Subtle halo / aura ring around modak
  const ringGeo = new THREE.TorusGeometry(0.5, 0.02, 8, 24);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffea00,
    transparent: true,
    opacity: 0.6,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0.35;
  group.add(ringMesh);

  group.userData = { isModak: true };
  return group;
}

/**
 * Creates the Blessing Token 3D model (sacred abstract golden festival medallion)
 */
export function createBlessingTokenMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // 1. Central Golden Coin Medallion with embossed lotus pattern
  const coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 24);
  const coinMesh = new THREE.Mesh(coinGeo, mats.blessingTokenMaterial);
  coinMesh.rotation.x = Math.PI / 2;
  coinMesh.castShadow = true;
  group.add(coinMesh);

  // 2. Outer Ornate Golden Filigree Beaded Rim
  const rimGeo = new THREE.TorusGeometry(0.42, 0.035, 8, 24);
  const rimMesh = new THREE.Mesh(rimGeo, mats.goldShineMaterial);
  group.add(rimMesh);

  // 3. Spinning Radiant Aura Halo
  const auraGeo = new THREE.TorusGeometry(0.55, 0.02, 6, 24);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0xffe066,
    transparent: true,
    opacity: 0.75,
  });
  const auraMesh = new THREE.Mesh(auraGeo, auraMat);
  group.add(auraMesh);

  // 4. Subtle Floating Golden Star Sparkles
  const sparkGeo = new THREE.OctahedronGeometry(0.06, 0);
  for (let i = 0; i < 4; i++) {
    const spark = new THREE.Mesh(sparkGeo, mats.goldMaterial);
    const angle = (i * Math.PI) / 2;
    spark.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0);
    group.add(spark);
  }

  group.userData = { isBlessingToken: true, isCollectible: true };
  return group;
}

/**
 * Power-up 3D Meshes (Magnet, Shield, Multiplier, Speed Boost)
 */
export function createPowerUpMesh(type: 'magnet' | 'shield' | 'multiplier' | 'boost'): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Floating rotating pedestal orb
  const orbGeo = new THREE.SphereGeometry(0.55, 16, 16);
  let orbMat: THREE.Material = mats.shieldMaterial;
  
  if (type === 'magnet') {
    orbMat = new THREE.MeshStandardMaterial({
      color: 0xef233c,
      emissive: 0xd90429,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2
    });
  } else if (type === 'multiplier') {
    orbMat = new THREE.MeshStandardMaterial({
      color: 0x9d4edd,
      emissive: 0x7b2cbf,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2
    });
  } else if (type === 'boost') {
    orbMat = new THREE.MeshStandardMaterial({
      color: 0xffbe0b,
      emissive: 0xfb5607,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2
    });
  }

  const orb = new THREE.Mesh(orbGeo, orbMat);
  group.add(orb);

  // Inner Symbol Icon
  if (type === 'magnet') {
    // Horseshoe shape
    const uGeo = new THREE.TorusGeometry(0.28, 0.09, 8, 16, Math.PI);
    const uMesh = new THREE.Mesh(uGeo, mats.goldMaterial);
    uMesh.rotation.z = Math.PI;
    group.add(uMesh);
  } else if (type === 'shield') {
    // Lotus Shield
    const shieldGeo = new THREE.OctahedronGeometry(0.3, 0);
    const shieldMesh = new THREE.Mesh(shieldGeo, mats.goldMaterial);
    group.add(shieldMesh);
  } else if (type === 'multiplier') {
    // 2X Star
    const starGeo = new THREE.DodecahedronGeometry(0.28, 0);
    const starMesh = new THREE.Mesh(starGeo, mats.goldMaterial);
    group.add(starMesh);
  } else if (type === 'boost') {
    // Golden Feather / Wing
    const wingGeo = new THREE.ConeGeometry(0.25, 0.6, 6);
    const wingMesh = new THREE.Mesh(wingGeo, mats.goldMaterial);
    wingMesh.rotation.z = Math.PI / 4;
    group.add(wingMesh);
  }

  // Outer spinning energy ring
  const ringGeo = new THREE.TorusGeometry(0.7, 0.03, 8, 24);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  group.add(ring);
  group.userData = { isPowerUp: true, powerUpType: type, ring };

  return group;
}

/**
 * 1. Low Hurdle Obstacle: Striped Festival Road Barricade with Marigold Garland & Diyas
 * (Jump over or switch lane)
 */
export function createLowHurdleMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Striped Wooden Barricade Plank (Matching reference image)
  const stripeTex = createHazardStripeTexture();
  const barMat = new THREE.MeshStandardMaterial({
    map: stripeTex,
    roughness: 0.6,
  });
  const barGeo = new THREE.BoxGeometry(2.0, 0.45, 0.22);
  const barMesh = new THREE.Mesh(barGeo, barMat);
  barMesh.position.y = 0.42;
  barMesh.castShadow = true;
  group.add(barMesh);

  // Two sturdy dark wood support legs
  const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.75, 8);
  const legL = new THREE.Mesh(legGeo, mats.darkWoodMaterial);
  legL.position.set(-0.82, 0.38, 0);
  legL.castShadow = true;
  group.add(legL);

  const legR = new THREE.Mesh(legGeo, mats.darkWoodMaterial);
  legR.position.set(0.82, 0.38, 0);
  legR.castShadow = true;
  group.add(legR);

  // Marigold garland across the top edge
  const flowerGeo = new THREE.SphereGeometry(0.12, 6, 6);
  for (let x = -0.9; x <= 0.9; x += 0.18) {
    const flowerMat = (Math.abs(x) % 0.36 < 0.18) ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial;
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    flower.position.set(x, 0.66, 0.04);
    group.add(flower);
  }

  // Glowing Diya lamps on each end post
  [-0.82, 0.82].forEach((xPos) => {
    const diyaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.08, 8), mats.terracottaMaterial);
    diyaBase.position.set(xPos, 0.76, 0);
    group.add(diyaBase);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), mats.diyaFlameMaterial);
    flame.position.set(xPos, 0.86, 0);
    group.add(flame);
  });

  group.userData = {
    obstacleType: 'low_hurdle',
    collider: { min: new THREE.Vector3(-1.0, 0, -0.3), max: new THREE.Vector3(1.0, 0.85, 0.3) }
  };
  return group;
}

/**
 * 2. High Banner Obstacle: Hanging Festival Toran & Hanging Lanterns
 * (Must SLIDE under or switch lane)
 */
export function createHighBannerMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Two tall side bamboo/brass poles
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 8);
  const poleL = new THREE.Mesh(poleGeo, mats.goldMaterial);
  poleL.position.set(-1.0, 1.7, 0);
  poleL.castShadow = true;
  group.add(poleL);

  const poleR = new THREE.Mesh(poleGeo, mats.goldMaterial);
  poleR.position.set(1.0, 1.7, 0);
  poleR.castShadow = true;
  group.add(poleR);

  // Top crossbar
  const crossGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8);
  const cross = new THREE.Mesh(crossGeo, mats.goldMaterial);
  cross.rotation.z = Math.PI / 2;
  cross.position.set(0, 3.2, 0);
  group.add(cross);

  // Hanging Silk Banner (From y=1.2 to y=3.2) - player slides under at y < 1.0!
  const bannerGeo = new THREE.PlaneGeometry(1.9, 1.6);
  const bannerMat = new THREE.MeshStandardMaterial({
    color: FESTIVAL_COLORS.RUBY_CRIMSON,
    side: THREE.DoubleSide,
    roughness: 0.6,
  });
  const banner = new THREE.Mesh(bannerGeo, bannerMat);
  banner.position.set(0, 2.3, 0);
  banner.castShadow = true;
  group.add(banner);

  // Hanging Decorative Lanterns
  [-0.6, 0, 0.6].forEach((xPos) => {
    const lanternGeo = new THREE.OctahedronGeometry(0.2, 0);
    const lantern = new THREE.Mesh(lanternGeo, mats.marigoldYellowMaterial);
    lantern.position.set(xPos, 1.35, 0);
    group.add(lantern);

    const tasselGeo = new THREE.ConeGeometry(0.08, 0.2, 6);
    const tassel = new THREE.Mesh(tasselGeo, mats.marigoldOrangeMaterial);
    tassel.rotation.x = Math.PI;
    tassel.position.set(xPos, 1.15, 0);
    group.add(tassel);
  });

  group.userData = {
    obstacleType: 'high_banner',
    collider: { min: new THREE.Vector3(-1.0, 1.05, -0.3), max: new THREE.Vector3(1.0, 3.4, 0.3) }
  };
  return group;
}

/**
 * 3. Tall Pillar Obstacle: Carved Sandstone Temple Column with Golden Finial
 * (Full height - MUST switch lane)
 */
export function createTallPillarMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Base plinth
  const baseGeo = new THREE.BoxGeometry(1.3, 0.5, 1.3);
  const base = new THREE.Mesh(baseGeo, mats.sandstoneMaterial);
  base.position.y = 0.25;
  base.castShadow = true;
  group.add(base);

  // Column shaft (faceted octagonal)
  const shaftGeo = new THREE.CylinderGeometry(0.42, 0.48, 3.0, 8);
  const shaft = new THREE.Mesh(shaftGeo, mats.sandstoneMaterial);
  shaft.position.y = 2.0;
  shaft.castShadow = true;
  group.add(shaft);

  // Carved capital
  const capGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
  const cap = new THREE.Mesh(capGeo, mats.sandstoneMaterial);
  cap.position.y = 3.6;
  cap.castShadow = true;
  group.add(cap);

  // Golden Kalash / Dome finial
  const kalashGeo = new THREE.SphereGeometry(0.35, 12, 12);
  const kalash = new THREE.Mesh(kalashGeo, mats.goldMaterial);
  kalash.position.y = 4.1;
  kalash.castShadow = true;
  group.add(kalash);

  // Marigold garland wrapped around pillar
  const wrapGeo = new THREE.TorusGeometry(0.52, 0.08, 6, 16);
  const wrap1 = new THREE.Mesh(wrapGeo, mats.marigoldOrangeMaterial);
  wrap1.rotation.x = Math.PI / 2;
  wrap1.position.y = 1.5;
  group.add(wrap1);

  const wrap2 = new THREE.Mesh(wrapGeo, mats.marigoldYellowMaterial);
  wrap2.rotation.x = Math.PI / 2;
  wrap2.position.y = 2.6;
  group.add(wrap2);

  group.userData = {
    obstacleType: 'tall_pillar',
    collider: { min: new THREE.Vector3(-0.65, 0, -0.65), max: new THREE.Vector3(0.65, 4.2, 0.65) }
  };
  return group;
}

/**
 * 4. Festival Bazaar Stall Obstacle (Flower & Modak Cart with Turquoise Floral Panel)
 * (Blocks full lane, jump or lane switch)
 */
export function createFestivalCartMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Wooden cart body
  const cartGeo = new THREE.BoxGeometry(1.8, 0.7, 1.5);
  const cart = new THREE.Mesh(cartGeo, mats.darkWoodMaterial);
  cart.position.y = 0.55;
  cart.castShadow = true;
  group.add(cart);

  // Turquoise Painted Wooden Back Panel facing the runner (at +z)
  const cartBackTex = createCartBackTexture();
  const backPanelMat = new THREE.MeshStandardMaterial({
    map: cartBackTex,
    roughness: 0.5,
  });
  const backPanelGeo = new THREE.PlaneGeometry(1.7, 0.65);
  const backPanel = new THREE.Mesh(backPanelGeo, backPanelMat);
  backPanel.position.set(0, 0.55, 0.76);
  group.add(backPanel);

  // 4 Brass/Wooden wheels
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 14);
  [-0.92, 0.92].forEach((x) => {
    [-0.45, 0.45].forEach((z) => {
      const wheel = new THREE.Mesh(wheelGeo, mats.darkWoodMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.32, z);
      wheel.castShadow = true;

      // Brass hubcap
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 8), mats.goldMaterial);
      hub.position.y = 0;
      wheel.add(hub);

      group.add(wheel);
    });
  });

  // 4 Canopy support poles
  const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6);
  [-0.78, 0.78].forEach((x) => {
    [-0.6, 0.6].forEach((z) => {
      const pole = new THREE.Mesh(poleGeo, mats.darkWoodMaterial);
      pole.position.set(x, 1.4, z);
      group.add(pole);
    });
  });

  // Flat Flower Roof Canopy (Densely laden with golden & orange marigolds)
  const roofPlankGeo = new THREE.BoxGeometry(1.85, 0.08, 1.55);
  const roofPlank = new THREE.Mesh(roofPlankGeo, mats.darkWoodMaterial);
  roofPlank.position.y = 2.05;
  group.add(roofPlank);

  // Dense Marigold Flower Mounds across top of roof (Matching reference image)
  const flowerGeo = new THREE.SphereGeometry(0.12, 6, 6);
  for (let rx = -0.75; rx <= 0.75; rx += 0.22) {
    for (let rz = -0.6; rz <= 0.6; rz += 0.22) {
      const isYellow = (Math.abs(rx * 7 + rz * 13) % 2) > 0.8;
      const flower = new THREE.Mesh(flowerGeo, isYellow ? mats.marigoldYellowMaterial : mats.marigoldOrangeMaterial);
      flower.position.set(rx, 2.14 + (Math.sin(rx * 3) * 0.06), rz);
      group.add(flower);
    }
  }

  // Hanging Marigold Garlands draping from roof edges
  for (let gx = -0.8; gx <= 0.8; gx += 0.28) {
    const garlandDropGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.35, 6);
    const drop = new THREE.Mesh(garlandDropGeo, mats.marigoldOrangeMaterial);
    drop.position.set(gx, 1.88, 0.72);
    group.add(drop);
  }

  // Large brass pooja thaali on cart front
  const thaliGeo = new THREE.CylinderGeometry(0.3, 0.26, 0.05, 12);
  const thali = new THREE.Mesh(thaliGeo, mats.goldMaterial);
  thali.position.set(0, 0.95, 0);
  group.add(thali);

  group.userData = {
    obstacleType: 'festival_cart',
    collider: { min: new THREE.Vector3(-0.95, 0, -0.8), max: new THREE.Vector3(0.95, 2.3, 0.8) }
  };
  return group;
}

/**
 * 5. Wooden Festival Ramp with Elevated Walkway
 * Run UP the ramp onto a raised path where golden modaks wait!
 */
export function createRampMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Sloped ramp wedge (Length: 6 units, Width: 2.0 units, Height: 1.8 units)
  const rampShape = new THREE.Shape();
  rampShape.moveTo(0, 0);
  rampShape.lineTo(0, 0.05);
  rampShape.lineTo(6.0, 1.8);
  rampShape.lineTo(6.0, 0);
  rampShape.closePath();

  const extrudeSettings = { depth: 2.0, bevelEnabled: false };
  const rampGeo = new THREE.ExtrudeGeometry(rampShape, extrudeSettings);
  const rampMesh = new THREE.Mesh(rampGeo, mats.darkWoodMaterial);
  // Center it in lane and orient along Z axis
  rampMesh.rotation.y = Math.PI / 2;
  rampMesh.position.set(1.0, 0, 3.0);
  rampMesh.castShadow = true;
  rampMesh.receiveShadow = true;
  group.add(rampMesh);

  // Elevated flat platform bridge behind ramp (Length: 10 units)
  const platGeo = new THREE.BoxGeometry(2.0, 0.3, 10.0);
  const plat = new THREE.Mesh(platGeo, mats.darkWoodMaterial);
  plat.position.set(0, 1.65, -5.0);
  plat.castShadow = true;
  plat.receiveShadow = true;
  group.add(plat);

  // Support pillars under platform
  const pillarGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.6, 8);
  [-0.8, 0.8].forEach((x) => {
    [-2.0, -5.0, -8.0].forEach((z) => {
      const p = new THREE.Mesh(pillarGeo, mats.darkWoodMaterial);
      p.position.set(x, 0.8, z);
      p.castShadow = true;
      group.add(p);
    });
  });

  // Decorative Toran garland on sides of elevated walk
  for (let z = -0.5; z >= -9.5; z -= 1.5) {
    [-0.95, 0.95].forEach((x) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), mats.marigoldOrangeMaterial);
      f.position.set(x, 1.9, z);
      group.add(f);
    });
  }

  group.userData = {
    obstacleType: 'wooden_ramp',
    isRamp: true,
    rampStart: 3.0,
    rampEnd: -3.0,
    platformStart: -3.0,
    platformEnd: -10.0,
    rampHeight: 1.8,
  };
  return group;
}

/**
 * 6. Scenery: Street Side Building (3 Distinct Indian Festival Architectural Archetypes)
 * Creates authentic heritage havelis, bazaar market shops, and temple pavilions
 */
export function createStreetBuildingMesh(isLeft: boolean, styleIndex: number = 0): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();
  const facingSign = isLeft ? 1 : -1;

  // Modulo style index
  const style = Math.abs(styleIndex) % 3;

  if (style === 0) {
    // -------------------------------------------------------------
    // STYLE 0: Heritage Rajasthani / Maratha Haveli (Carved Sandstone & Jharokhas)
    // -------------------------------------------------------------
    const height = 9.5 + (Math.sin(styleIndex * 13) * 1.5);
    const bldgWidth = 8.5;
    const bldgDepth = 11.0;

    // Ground & Main Floor Block
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bldgWidth, height, bldgDepth), mats.sandstoneMaterial);
    bldg.position.set(0, height / 2, 0);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    group.add(bldg);

    // Ground floor arched portico colonnade facing street
    const archPillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.2, 8);
    for (let pz = -3.6; pz <= 3.6; pz += 2.4) {
      const pillar = new THREE.Mesh(archPillarGeo, mats.sandstoneMaterial);
      pillar.position.set(facingSign * (bldgWidth / 2 - 0.2), 1.6, pz);
      pillar.castShadow = true;
      group.add(pillar);
    }

    // Carved decorative horizontal cornice separating floors
    const corniceGeo = new THREE.BoxGeometry(bldgWidth + 0.6, 0.35, bldgDepth + 0.4);
    const cornice = new THREE.Mesh(corniceGeo, mats.sandstoneMaterial);
    cornice.position.set(0, 4.0, 0);
    cornice.castShadow = true;
    group.add(cornice);

    // Projecting Ornamental Jharokha Balconies on second floor
    [-2.2, 2.2].forEach((bz) => {
      // Balcony projection box
      const balconyGeo = new THREE.BoxGeometry(1.6, 2.0, 1.8);
      const balcony = new THREE.Mesh(balconyGeo, mats.sandstoneMaterial);
      balcony.position.set(facingSign * (bldgWidth / 2 + 0.6), 5.8, bz);
      balcony.castShadow = true;
      group.add(balcony);

      // Sloped stone sun-shade canopy (chhajja) atop balcony
      const chhajjaGeo = new THREE.ConeGeometry(1.4, 0.6, 4);
      const chhajja = new THREE.Mesh(chhajjaGeo, mats.rubyCrimsonMaterial);
      chhajja.position.set(facingSign * (bldgWidth / 2 + 0.6), 7.1, bz);
      chhajja.rotation.y = Math.PI / 4;
      group.add(chhajja);

      // Jaali / lattice window panel inside jharokha
      const jaali = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), mats.goldMaterial);
      jaali.position.set(facingSign * (bldgWidth / 2 + 1.41), 5.8, bz);
      jaali.rotation.y = facingSign * Math.PI / 2;
      group.add(jaali);

      // Glowing diya on balcony ledge
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.06, 8), mats.terracottaMaterial);
      diya.position.set(facingSign * (bldgWidth / 2 + 1.2), 6.85, bz);
      group.add(diya);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), mats.diyaFlameMaterial);
      flame.position.set(facingSign * (bldgWidth / 2 + 1.2), 6.95, bz);
      group.add(flame);
    });

    // Rooftop carved balustrade / parapet
    const parapetGeo = new THREE.BoxGeometry(bldgWidth + 0.3, 0.7, bldgDepth + 0.3);
    const parapet = new THREE.Mesh(parapetGeo, mats.sandstoneMaterial);
    parapet.position.set(0, height + 0.35, 0);
    group.add(parapet);

    // Corner Chhatri Pavilions on rooftop
    [-bldgDepth / 2 + 1.2, bldgDepth / 2 - 1.2].forEach((cz) => {
      const chhatriBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), mats.sandstoneMaterial);
      chhatriBase.position.set(0, height + 0.8, cz);
      group.add(chhatriBase);

      // 4 slender pillars
      const chhatriPillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6);
      [-0.6, 0.6].forEach((px) => {
        [-0.6, 0.6].forEach((pz) => {
          const cp = new THREE.Mesh(chhatriPillarGeo, mats.sandstoneMaterial);
          cp.position.set(px, height + 1.75, cz + pz);
          group.add(cp);
        });
      });

      // Golden ribbed dome
      const chhatriDome = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        mats.goldMaterial
      );
      chhatriDome.position.set(0, height + 2.5, cz);
      group.add(chhatriDome);

      // Kalash finial
      const kalash = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 6), mats.goldShineMaterial);
      kalash.position.set(0, height + 3.6, cz);
      group.add(kalash);
    });

  } else if (style === 1) {
    // -------------------------------------------------------------
    // STYLE 1: Vibrant Festival Bazaar Shop / Sweet Stall (Modaks, Pooja Flowers & Brassware)
    // -------------------------------------------------------------
    const height = 7.8;
    const bldgWidth = 8.0;
    const bldgDepth = 10.5;

    // Stucco Building Body (Warm Terracotta / Saffron Stucco)
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bldgWidth, height, bldgDepth), mats.terracottaMaterial);
    bldg.position.set(0, height / 2, 0);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    group.add(bldg);

    // Striped Festive Fabric Awning (Crimson & Gold or Saffron & Cream)
    const awningWidth = bldgDepth * 0.9;
    const awningGeo = new THREE.BoxGeometry(2.4, 0.12, awningWidth);
    const awning = new THREE.Mesh(awningGeo, mats.saffronBrightMaterial);
    awning.position.set(facingSign * (bldgWidth / 2 + 1.1), 3.2, 0);
    awning.rotation.z = facingSign * 0.35; // Slanted downward
    awning.castShadow = true;
    group.add(awning);

    // Awning support wooden poles
    [-awningWidth / 2 + 0.4, awningWidth / 2 - 0.4].forEach((pz) => {
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 6);
      const pole = new THREE.Mesh(poleGeo, mats.darkWoodMaterial);
      pole.position.set(facingSign * (bldgWidth / 2 + 2.0), 1.4, pz);
      group.add(pole);
    });

    // Roadside Market Shop Counter with Brass Pooja Items & Flower Baskets
    const counterGeo = new THREE.BoxGeometry(1.2, 1.1, awningWidth * 0.85);
    const counter = new THREE.Mesh(counterGeo, mats.sandstoneMaterial);
    counter.position.set(facingSign * (bldgWidth / 2 + 0.7), 0.55, 0);
    group.add(counter);

    // Flower Garland Strands hanging from awning edge
    for (let z = -awningWidth / 2 + 0.6; z <= awningWidth / 2 - 0.6; z += 0.8) {
      const garlandGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6);
      const garlandMat = (Math.abs(z) % 1.6 < 0.8) ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial;
      const garland = new THREE.Mesh(garlandGeo, garlandMat);
      garland.position.set(facingSign * (bldgWidth / 2 + 2.0), 2.3, z);
      group.add(garland);
    }

    // Upper floor shuttered arched windows with decorative flower boxes
    [-2.4, 2.4].forEach((wz) => {
      const winArch = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), mats.pandalBackdropMaterial);
      winArch.position.set(facingSign * (bldgWidth / 2 + 0.02), 5.6, wz);
      winArch.rotation.y = facingSign * Math.PI / 2;
      group.add(winArch);

      // Window planter box
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 1.4), mats.terracottaMaterial);
      box.position.set(facingSign * (bldgWidth / 2 + 0.15), 4.7, wz);
      group.add(box);

      // Marigold flowers in box
      const flowerClusters = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 1.3), mats.marigoldOrangeMaterial);
      flowerClusters.position.set(facingSign * (bldgWidth / 2 + 0.15), 4.9, wz);
      group.add(flowerClusters);
    });

    // Rooftop Festive Dhwaja Flags
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6), mats.goldMaterial);
    flagPole.position.set(0, height + 1.1, 0);
    group.add(flagPole);

    const flagGeo = new THREE.BufferGeometry();
    const flagVerts = new Float32Array([
      0, 0, 0,
      1.1 * facingSign, -0.4, 0,
      0, -0.8, 0,
    ]);
    flagGeo.setAttribute('position', new THREE.BufferAttribute(flagVerts, 3));
    const flagMesh = new THREE.Mesh(flagGeo, mats.saffronBrightMaterial);
    flagMesh.position.set(0, height + 2.0, 0);
    group.add(flagMesh);

  } else {
    // -------------------------------------------------------------
    // STYLE 2: Grand Temple Sanctum Pavilion (Tiered Stepped Shikhara & Golden Spire)
    // -------------------------------------------------------------
    const height = 8.8;
    const bldgWidth = 8.5;
    const bldgDepth = 11.0;

    // Carved Sandstone Base Sanctum
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bldgWidth, height, bldgDepth), mats.sandstoneMaterial);
    bldg.position.set(0, height / 2, 0);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    group.add(bldg);

    // Carved stone niches and niches with glowing oil lamps
    [-3.0, 0, 3.0].forEach((nz) => {
      const niche = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, 0.9), mats.darkWoodMaterial);
      niche.position.set(facingSign * (bldgWidth / 2 - 0.1), 3.0, nz);
      group.add(niche);

      const diya = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 6), mats.diyaFlameMaterial);
      diya.position.set(facingSign * (bldgWidth / 2 + 0.05), 2.5, nz);
      group.add(diya);
    });

    // Tiered Stepped Temple Shikhara Spire on rooftop
    const tiers = 4;
    for (let t = 0; t < tiers; t++) {
      const tw = (bldgWidth * 0.75) * (1 - t * 0.2);
      const td = (bldgDepth * 0.65) * (1 - t * 0.2);
      const th = 0.9;
      const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(tw, th, td), mats.sandstoneMaterial);
      tierMesh.position.set(0, height + 0.45 + t * th, 0);
      tierMesh.castShadow = true;
      group.add(tierMesh);

      // Gold rim line on each tier
      const rim = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.15, 0.1, td + 0.15), mats.goldMaterial);
      rim.position.set(0, height + 0.45 + t * th + 0.4, 0);
      group.add(rim);
    }

    // Sacred Amalaka Stone Crown on Spire
    const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.6, 16), mats.goldMaterial);
    amalaka.position.set(0, height + 4.3, 0);
    group.add(amalaka);

    // Golden Kalash Finial on top
    const kalash = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.1, 8), mats.goldShineMaterial);
    kalash.position.set(0, height + 5.1, 0);
    group.add(kalash);

    // Saffron Temple Dhwaja Flag
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6), mats.goldMaterial);
    flagPole.position.set(0, height + 5.8, 0);
    group.add(flagPole);

    const flagGeo = new THREE.BufferGeometry();
    const flagVerts = new Float32Array([
      0, 0, 0,
      1.2 * facingSign, -0.4, 0,
      0, -0.8, 0,
    ]);
    flagGeo.setAttribute('position', new THREE.BufferAttribute(flagVerts, 3));
    const flagMesh = new THREE.Mesh(flagGeo, mats.saffronBrightMaterial);
    flagMesh.position.set(0, height + 6.6, 0);
    group.add(flagMesh);

    // Row of glowing diya lamps along parapet edge
    for (let pz = -bldgDepth / 2 + 0.8; pz <= bldgDepth / 2 - 0.8; pz += 1.8) {
      const diyaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.05, 8), mats.goldMaterial);
      diyaBase.position.set(facingSign * (bldgWidth / 2 - 0.3), height + 0.05, pz);
      group.add(diyaBase);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), mats.diyaFlameMaterial);
      flame.position.set(facingSign * (bldgWidth / 2 - 0.3), height + 0.15, pz);
      group.add(flame);
    }
  }

  return group;
}

/**
 * 7. Scenery: Floating Glowing Sky Lantern (Kandil / Akasha Deepa)
 */
export function createSkyLanternMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Cylindrical warm glowing paper lantern
  const bodyGeo = new THREE.CylinderGeometry(0.35, 0.28, 0.7, 10);
  const bodyMat = new THREE.MeshBasicMaterial({
    color: (Math.random() > 0.5) ? FESTIVAL_COLORS.MARIGOLD_ORANGE : FESTIVAL_COLORS.MARIGOLD_YELLOW,
    transparent: true,
    opacity: 0.88,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Warm core light glow
  const coreGeo = new THREE.SphereGeometry(0.18, 8, 8);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Hanging silk tassels
  const tasselGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.35, 6);
  const tassel = new THREE.Mesh(tasselGeo, mats.rubyCrimsonMaterial);
  tassel.position.y = -0.45;
  group.add(tassel);

  return group;
}

/**
 * 8. Scenery: Archway spanning across all 3 lanes (Marigold & Sandstone Gateway)
 * Wide 13.5m span that spans safely over the 9.2m road without crowding the lanes
 */
export function createTempleGateArchMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  const pillarX = 6.6; // Clear of road edge (4.6m) and sidewalk curb

  // Two massive side pillars (Left & Right of the entire street)
  const pillarGeo = new THREE.CylinderGeometry(0.65, 0.8, 6.8, 8);
  const pL = new THREE.Mesh(pillarGeo, mats.sandstoneMaterial);
  pL.position.set(-pillarX, 3.4, 0);
  pL.castShadow = true;
  group.add(pL);

  const pR = new THREE.Mesh(pillarGeo, mats.sandstoneMaterial);
  pR.position.set(pillarX, 3.4, 0);
  pR.castShadow = true;
  group.add(pR);

  // Golden capitals on pillars
  [-pillarX, pillarX].forEach((px) => {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.6), mats.goldMaterial);
    cap.position.set(px, 6.9, 0);
    group.add(cap);

    // Spiraling marigold garlands around pillars
    for (let y = 1.0; y < 6.0; y += 1.2) {
      const ringGeo = new THREE.TorusGeometry(0.82, 0.08, 6, 12);
      const ring = new THREE.Mesh(ringGeo, mats.marigoldOrangeMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(px, y, 0);
      group.add(ring);
    }
  });

  // Overhead Ornate Arch beam spanning across entire boulevard
  const archSpan = pillarX * 2 + 1.2;
  const archGeo = new THREE.BoxGeometry(archSpan, 1.2, 1.4);
  const arch = new THREE.Mesh(archGeo, mats.sandstoneMaterial);
  arch.position.set(0, 7.2, 0);
  arch.castShadow = true;
  group.add(arch);

  // Gold Trim along Arch
  const goldTrimGeo = new THREE.BoxGeometry(archSpan + 0.2, 0.15, 1.45);
  const goldTrim = new THREE.Mesh(goldTrimGeo, mats.goldMaterial);
  goldTrim.position.set(0, 6.6, 0);
  group.add(goldTrim);

  // Center Golden Dome Crest
  const crestDomeGeo = new THREE.SphereGeometry(1.2, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const crestDome = new THREE.Mesh(crestDomeGeo, mats.goldMaterial);
  crestDome.position.set(0, 8.4, 0);
  crestDome.castShadow = true;
  group.add(crestDome);

  // Kalash Finial atop Arch Center
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.8, 8), mats.goldShineMaterial);
  finial.position.set(0, 9.8, 0);
  group.add(finial);

  // Hanging Marigold Garlands draping from arch
  for (let x = -5.5; x <= 5.5; x += 0.8) {
    const garlandLen = 1.0 + Math.sin((x + 6) / 12 * Math.PI) * 0.9;
    const strandGeo = new THREE.CylinderGeometry(0.06, 0.06, garlandLen, 6);
    const strandMat = (Math.abs(x) % 1.6 < 0.8) ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial;
    const strand = new THREE.Mesh(strandGeo, strandMat);
    strand.position.set(x, 6.5 - garlandLen / 2, 0);
    group.add(strand);
  }

  // Hanging Brass Bell in the middle
  const bellGeo = new THREE.ConeGeometry(0.42, 0.6, 8);
  const bell = new THREE.Mesh(bellGeo, mats.goldMaterial);
  bell.position.set(0, 5.8, 0);
  bell.castShadow = true;
  group.add(bell);

  // "॥ गणेशोत्सव ॥" Welcome Inscription Plaque
  const bannerGeo = new THREE.BoxGeometry(5.4, 0.75, 0.18);
  const banner = new THREE.Mesh(bannerGeo, mats.rubyCrimsonMaterial);
  banner.position.set(0, 7.2, 0.8);
  group.add(banner);

  const bannerGoldRim = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.85, 0.12), mats.goldMaterial);
  bannerGoldRim.position.set(0, 7.2, 0.75);
  group.add(bannerGoldRim);

  return group;
}

/**
 * Potted Terracotta Planter with Flowering Marigolds & Fan Palm (Sidewalk decoration)
 */
export function createStreetPlanterMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Terracotta Urn / Pot
  const potGeo = new THREE.CylinderGeometry(0.35, 0.22, 0.55, 10);
  const pot = new THREE.Mesh(potGeo, mats.terracottaMaterial);
  pot.position.y = 0.28;
  pot.castShadow = true;
  group.add(pot);

  // Green foliage sphere / palm fronds
  const bushGeo = new THREE.SphereGeometry(0.38, 8, 8);
  const bush = new THREE.Mesh(bushGeo, mats.emeraldMaterial);
  bush.position.y = 0.65;
  bush.scale.set(1.2, 0.8, 1.2);
  group.add(bush);

  // Bright marigold flower blossoms atop bush
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      (i % 2 === 0) ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial
    );
    flower.position.set(Math.cos(angle) * 0.32, 0.78 + (i % 2) * 0.08, Math.sin(angle) * 0.32);
    group.add(flower);
  }

  return group;
}

/**
 * Ornate Brass Street Lamp with Hanging Glowing Diya Lantern
 */
export function createFestivalStreetLampMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Sandstone Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), mats.sandstoneMaterial);
  base.position.y = 0.15;
  group.add(base);

  // Fluted Brass Pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.8, 8), mats.goldMaterial);
  pole.position.y = 2.05;
  pole.castShadow = true;
  group.add(pole);

  // Curved Hanging Lamp Arm
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), mats.goldMaterial);
  arm.position.set(0.3, 3.8, 0);
  group.add(arm);

  // Hanging Glass Lantern
  const lanternGeo = new THREE.CylinderGeometry(0.2, 0.14, 0.4, 6);
  const lanternMat = new THREE.MeshBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.85,
  });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.set(0.6, 3.4, 0);
  group.add(lantern);

  // Glowing Diya Flame inside lantern
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), mats.diyaFlameMaterial);
  flame.position.set(0.6, 3.35, 0);
  group.add(flame);

  return group;
}

/**
 * 9. Obstacle: Marigold & Gulab Flower Box Crate
 * (Jump over or switch lane)
 */
export function createFlowerBoxMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Bottom Wooden Crate
  const crateGeo = new THREE.BoxGeometry(1.8, 0.5, 0.85);
  const crate = new THREE.Mesh(crateGeo, mats.darkWoodMaterial);
  crate.position.y = 0.25;
  crate.castShadow = true;
  group.add(crate);

  // Brass corner braces
  [-0.85, 0.85].forEach((x) => {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.87), mats.goldMaterial);
    brace.position.set(x, 0.25, 0);
    group.add(brace);
  });

  // Mountain of vibrant flower blooms (Marigold orange, yellow & Gulab rose pink)
  const flowerGeo = new THREE.SphereGeometry(0.12, 6, 6);
  for (let x = -0.7; x <= 0.7; x += 0.24) {
    for (let z = -0.3; z <= 0.3; z += 0.24) {
      const colMat = ((Math.abs(x) + Math.abs(z)) % 0.48 < 0.2)
        ? mats.marigoldOrangeMaterial
        : (((Math.abs(x) + Math.abs(z)) % 0.48 < 0.35) ? mats.marigoldYellowMaterial : mats.lotusPinkMaterial);
      const bloom = new THREE.Mesh(flowerGeo, colMat);
      bloom.position.set(x, 0.55 + Math.random() * 0.1, z);
      group.add(bloom);
    }
  }

  // Glowing Diya on top center
  const diyaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.08, 8), mats.terracottaMaterial);
  diyaBase.position.set(0, 0.68, 0);
  group.add(diyaBase);

  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), mats.diyaFlameMaterial);
  flame.position.set(0, 0.78, 0);
  group.add(flame);

  group.userData = {
    obstacleType: 'flower_crate',
    collider: { min: new THREE.Vector3(-0.95, 0, -0.45), max: new THREE.Vector3(0.95, 0.8, 0.45) }
  };
  return group;
}

/**
 * 10. Obstacle: Festival Barricade with Brass Lanterns
 * (Jump over or switch lane)
 */
export function createFestivalBarricadeMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Two sturdy side posts with brass finials
  [-0.9, 0.9].forEach((x) => {
    const postGeo = new THREE.CylinderGeometry(0.07, 0.09, 1.0, 8);
    const post = new THREE.Mesh(postGeo, mats.darkWoodMaterial);
    post.position.set(x, 0.5, 0);
    post.castShadow = true;
    group.add(post);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mats.goldMaterial);
    finial.position.set(x, 1.05, 0);
    group.add(finial);

    // Glowing Lantern on post top
    const lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), mats.diyaFlameMaterial);
    lamp.position.set(x, 1.25, 0);
    group.add(lamp);
  });

  // Cross rail planks
  const railGeo = new THREE.BoxGeometry(1.8, 0.15, 0.08);
  const topRail = new THREE.Mesh(railGeo, mats.saffronBrightMaterial);
  topRail.position.set(0, 0.75, 0);
  topRail.castShadow = true;
  group.add(topRail);

  const botRail = new THREE.Mesh(railGeo, mats.darkWoodMaterial);
  botRail.position.set(0, 0.35, 0);
  group.add(botRail);

  // Marigold garland draped across top
  for (let x = -0.75; x <= 0.75; x += 0.2) {
    const fMat = (Math.abs(x) % 0.4 < 0.2) ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial;
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), fMat);
    f.position.set(x, 0.82 - Math.sin(((x + 0.75) / 1.5) * Math.PI) * 0.15, 0);
    group.add(f);
  }

  group.userData = {
    obstacleType: 'festival_barricade',
    collider: { min: new THREE.Vector3(-0.95, 0, -0.2), max: new THREE.Vector3(0.95, 0.95, 0.2) }
  };
  return group;
}

/**
 * 11. Environmental Side Element: Grand Ganesh Festival Pandal
 * Respectfully placed along the roadside (sidewalks).
 * Features an artistic Lord Ganesha sanctuary with gold ornaments, lotus throne, velvet backdrop, and glowing diyas.
 */
export function createFestivalPandalMesh(stage: number = 1, isLeft: boolean = true): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // 1. Raised Sanctuary Plinth & Red Carpet
  const plinthWidth = 6.0;
  const plinthDepth = 7.0;
  const plinthHeight = 0.6;
  const plinthGeo = new THREE.BoxGeometry(plinthWidth, plinthHeight, plinthDepth);
  const plinth = new THREE.Mesh(plinthGeo, mats.sandstoneMaterial);
  plinth.position.set(0, plinthHeight / 2, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Red velvet runner stairs
  const carpetGeo = new THREE.BoxGeometry(plinthWidth * 0.6, 0.05, plinthDepth * 1.1);
  const carpet = new THREE.Mesh(carpetGeo, mats.rubyCrimsonMaterial);
  carpet.position.set(0, plinthHeight + 0.02, 0);
  group.add(carpet);

  // 2. Ornate Carved Sanctuary Pillars (4 Corners)
  const pillarGeo = new THREE.CylinderGeometry(0.2, 0.25, 4.5, 8);
  const colX = (plinthWidth / 2) - 0.5;
  const colZ = (plinthDepth / 2) - 0.5;

  [-colX, colX].forEach((x) => {
    [-colZ, colZ].forEach((z) => {
      const col = new THREE.Mesh(pillarGeo, mats.sandstoneMaterial);
      col.position.set(x, 2.5, z);
      col.castShadow = true;
      group.add(col);

      // Golden capital on pillar
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.6), mats.goldMaterial);
      cap.position.set(x, 4.8, z);
      group.add(cap);

      // Marigold garland spirals
      const ringGeo = new THREE.TorusGeometry(0.26, 0.05, 6, 12);
      const ring = new THREE.Mesh(ringGeo, mats.marigoldOrangeMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 2.5, z);
      group.add(ring);
    });
  });

  // 3. Grand Canopy Roof / Mandap Chhatra
  const roofGeo = new THREE.ConeGeometry(plinthWidth * 0.75, 2.5, 4);
  const roof = new THREE.Mesh(roofGeo, stage === 3 ? mats.goldMaterial : mats.rubyCrimsonMaterial);
  roof.position.set(0, 6.2, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  // Golden Kalash Finial on Apex
  const finialGeo = new THREE.SphereGeometry(0.4, 10, 10);
  const finial = new THREE.Mesh(finialGeo, mats.goldMaterial);
  finial.position.set(0, 7.6, 0);
  group.add(finial);

  // Waving Saffron Festival Flag (Dhwaja) atop mandap
  const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), mats.goldMaterial);
  flagPole.position.set(0, 8.4, 0);
  group.add(flagPole);

  const flagGeo = new THREE.BufferGeometry();
  const flagVerts = new Float32Array([
    0, 0, 0,
    0.8, -0.3, 0,
    0, -0.6, 0
  ]);
  flagGeo.setAttribute('position', new THREE.BufferAttribute(flagVerts, 3));
  const flagMesh = new THREE.Mesh(flagGeo, mats.saffronBrightMaterial);
  flagMesh.position.set(0, 9.0, 0);
  group.add(flagMesh);

  // 4. Backing Velvet Sanctum Backdrop with Gold Mandala
  const backGeo = new THREE.PlaneGeometry(plinthWidth - 1.0, 4.2);
  const backdrop = new THREE.Mesh(backGeo, mats.pandalBackdropMaterial);
  backdrop.position.set(0, 2.7, -colZ + 0.1);
  group.add(backdrop);

  // 5. Sanctum Centerpiece: Respectful, Artistic 3D Lord Ganesha Murti Representation
  const idolGroup = new THREE.Group();
  idolGroup.position.set(0, plinthHeight, -0.4);

  // Raised Golden Lotus Throne (Padmasana)
  const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.4, 16), mats.goldMaterial);
  lotusBase.position.y = 0.2;
  idolGroup.add(lotusBase);

  // Lotus Petals surround
  const petalCount = 12;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount;
    const petMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.6), mats.lotusPinkMaterial);
    petMesh.position.set(Math.cos(angle) * 1.1, 0.3, Math.sin(angle) * 1.1);
    petMesh.rotation.y = -angle;
    idolGroup.add(petMesh);
  }

  // Cross-legged seated posture (Lower Body in Royal Dhoti)
  const legsMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.45, 12), mats.saffronBrightMaterial);
  legsMesh.position.y = 0.6;
  idolGroup.add(legsMesh);

  // Serene Torso with Golden Angavastram (Pitambara)
  const idolTorso = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 10), mats.goldMaterial);
  idolTorso.position.y = 1.25;
  idolTorso.scale.set(1.1, 1.0, 0.9);
  idolGroup.add(idolTorso);

  // Golden Sacred Thread (Yajnopavita) & Pearl Garland
  const mala = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 6, 16), mats.goldShineMaterial);
  mala.rotation.x = Math.PI / 2.5;
  mala.position.set(0, 1.3, 0.4);
  idolGroup.add(mala);

  // Serene Head Form
  const idolHead = new THREE.Mesh(new THREE.SphereGeometry(0.48, 14, 12), mats.goldMaterial);
  idolHead.position.set(0, 1.85, 0.05);
  idolGroup.add(idolHead);

  // Distinctive Gentle Curving Trunk (Vakratunda)
  const trunkCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 1.75, 0.42),
    new THREE.Vector3(0, 1.45, 0.55),
    new THREE.Vector3(0.2, 1.2, 0.5),
    new THREE.Vector3(0.35, 1.3, 0.42)
  );
  const trunkGeo = new THREE.TubeGeometry(trunkCurve, 12, 0.12, 8, false);
  const trunkMesh = new THREE.Mesh(trunkGeo, mats.goldMaterial);
  idolGroup.add(trunkMesh);

  // Large graceful ears (Supakarana)
  [-0.45, 0.45].forEach((xSign) => {
    const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.05, 10), mats.goldMaterial);
    ear.rotation.z = Math.PI / 2;
    ear.rotation.y = xSign > 0 ? 0.3 : -0.3;
    ear.position.set(xSign, 1.9, 0);
    idolGroup.add(ear);

    // Kundal / Earring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), mats.goldShineMaterial);
    ring.position.set(xSign * 1.05, 1.72, 0);
    idolGroup.add(ring);
  });

  // Right Hand in Abhaya Mudra (Blessing & Protection posture)
  const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.08), mats.goldMaterial);
  rightHand.position.set(-0.65, 1.45, 0.45);
  rightHand.rotation.z = -0.2;
  idolGroup.add(rightHand);

  // Left Hand holding Modak
  const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.28), mats.goldMaterial);
  leftHand.position.set(0.65, 1.3, 0.42);
  idolGroup.add(leftHand);

  const blessingModak = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 8), mats.goldShineMaterial);
  blessingModak.position.set(0.65, 1.44, 0.42);
  idolGroup.add(blessingModak);

  // Radiant Golden Mukut (Crown)
  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.3, 12), mats.goldShineMaterial);
  crownBase.position.set(0, 2.22, 0.05);
  idolGroup.add(crownBase);

  const crownSpire = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.65, 8), mats.goldShineMaterial);
  crownSpire.position.set(0, 2.65, 0.05);
  idolGroup.add(crownSpire);

  // Sacred Radiant Halo (Prabhavali Aura) Disc behind idol
  const haloGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 24);
  const haloMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffa500,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.1,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.rotation.x = Math.PI / 2;
  haloMesh.position.set(0, 1.85, -0.32);
  idolGroup.add(haloMesh);

  // Offerings bowl (Prasad & Modaks) at lotus base
  const prasadBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 0.15, 12), mats.goldMaterial);
  prasadBowl.position.set(0, 0.45, 0.9);
  idolGroup.add(prasadBowl);

  const modakGems = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), mats.goldShineMaterial);
  modakGems.position.set(0, 0.58, 0.9);
  idolGroup.add(modakGems);

  group.add(idolGroup);

  // 6. Glowing Samai (Traditional Standing Diya Towers) flanking entrance
  [-plinthWidth / 2 + 0.6, plinthWidth / 2 - 0.6].forEach((xPos) => {
    const samaiGeo = new THREE.CylinderGeometry(0.06, 0.1, 1.6, 8);
    const samai = new THREE.Mesh(samaiGeo, mats.goldMaterial);
    samai.position.set(xPos, plinthHeight + 0.8, colZ - 0.4);
    group.add(samai);

    // Multi-tier oil dishes with flames
    [0.6, 1.1, 1.6].forEach((yTier) => {
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.08, 0.06, 10), mats.goldMaterial);
      dish.position.set(xPos, plinthHeight + yTier, colZ - 0.4);
      group.add(dish);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 6), mats.diyaFlameMaterial);
      flame.position.set(xPos, plinthHeight + yTier + 0.1, colZ - 0.4);
      group.add(flame);
    });
  });

  // Hanging Marigold Torans across front arch
  for (let x = -colX; x <= colX; x += 0.5) {
    const toranLen = 0.8 + Math.sin(((x + colX) / (colX * 2)) * Math.PI) * 0.5;
    const strand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, toranLen, 6),
      (Math.abs(x) % 1.0 < 0.5) ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial
    );
    strand.position.set(x, 4.8 - toranLen / 2, colZ);
    group.add(strand);
  }

  // Hanging Brass Bell in sanctum center
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.45, 8), mats.goldMaterial);
  bell.position.set(0, 4.4, colZ * 0.3);
  group.add(bell);

  // Orient towards the street
  if (isLeft) {
    group.rotation.y = Math.PI / 2;
  } else {
    group.rotation.y = -Math.PI / 2;
  }

  return group;
}

/**
 * 12. Scenery: Traditional Dhol-Tasha Celebration Ensemble
 * (Roadside decoration outside stalls & pandals)
 */
export function createDholTashaEnsembleMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // 1. Dhol Drum 1 (Main Bass Drum)
  const dhol1Geo = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 16);
  const dhol1 = new THREE.Mesh(dhol1Geo, mats.dholMaterial);
  dhol1.rotation.z = Math.PI / 2;
  dhol1.position.set(-0.6, 0.75, 0);
  dhol1.castShadow = true;
  group.add(dhol1);

  // Wooden X-Stand for Dhol 1
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6);
  [-0.9, -0.3].forEach((x) => {
    const l1 = new THREE.Mesh(legGeo, mats.darkWoodMaterial);
    l1.rotation.z = 0.35;
    l1.position.set(x, 0.4, 0.2);
    group.add(l1);

    const l2 = new THREE.Mesh(legGeo, mats.darkWoodMaterial);
    l2.rotation.z = -0.35;
    l2.position.set(x, 0.4, -0.2);
    group.add(l2);
  });

  // Curved Dhol Playing Stick (Tiparu)
  const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
  const stick = new THREE.Mesh(stickGeo, mats.darkWoodMaterial);
  stick.position.set(-0.6, 1.15, 0.3);
  stick.rotation.x = Math.PI / 4;
  group.add(stick);

  // 2. Brass Tasha Cymbal / Drum on Stand
  const tashaGeo = new THREE.CylinderGeometry(0.35, 0.15, 0.25, 12);
  const tasha = new THREE.Mesh(tashaGeo, mats.goldShineMaterial);
  tasha.position.set(0.7, 0.9, 0);
  tasha.castShadow = true;
  group.add(tasha);

  const tashaStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.8, 6), mats.darkWoodMaterial);
  tashaStand.position.set(0.7, 0.4, 0);
  group.add(tashaStand);

  // Saffron Festival Banner beside drums
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 6), mats.goldMaterial);
  pole.position.set(0.1, 1.6, -0.6);
  group.add(pole);

  const bannerGeo = new THREE.PlaneGeometry(0.9, 1.8);
  const bannerMat = mats.saffronBrightMaterial;
  const banner = new THREE.Mesh(bannerGeo, bannerMat);
  banner.position.set(0.5, 2.1, -0.6);
  group.add(banner);

  return group;
}

/**
 * 13. Scenery: Cheering Festival Crowd Strip
 * (Optimized double-sided billboards placed along sidewalks)
 */
export function createCrowdCheeringStripMesh(length: number = 24): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  const stripGeo = new THREE.PlaneGeometry(length, 2.2);
  const strip = new THREE.Mesh(stripGeo, mats.crowdMaterial);
  strip.position.y = 1.1;
  group.add(strip);

  return group;
}

/**
 * 14. Scenery: Distant Illuminated City Skyline with Temple Shikharas & Pandals
 */
export function createCitySkylineMesh(): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  const bldgMat = new THREE.MeshBasicMaterial({
    color: 0x18092e,
    transparent: true,
    opacity: 0.9,
  });

  const litWindowMat = new THREE.MeshBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.8,
  });

  // Skyline towers across distant horizon
  for (let i = -12; i <= 12; i++) {
    const x = i * 8.0;
    const h = 14.0 + Math.abs(Math.sin(i * 37)) * 18.0;
    const w = 5.0 + (Math.abs(i) % 3) * 1.5;

    const bldg = new THREE.Mesh(new THREE.BoxGeometry(w, h, 8.0), bldgMat);
    bldg.position.set(x, h / 2, -110);
    group.add(bldg);

    // Temple Shikhara / Dome on every few buildings
    if (Math.abs(i) % 2 === 1) {
      const spire = new THREE.Mesh(new THREE.ConeGeometry(w * 0.45, 6.0, 8), bldgMat);
      spire.position.set(x, h + 3.0, -110);
      group.add(spire);

      // Glowing temple golden kalash on top
      const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), mats.goldMaterial);
      kalash.position.set(x, h + 6.2, -110);
      group.add(kalash);
    }

    // Glowing festival windows & lights
    for (let wy = 4; wy < h - 2; wy += 3.5) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.2), litWindowMat);
      win.position.set(x + (i % 2 === 0 ? 1.2 : -1.2), wy, -105.9);
      group.add(win);
    }
  }

  // Majestic Golden Sunset Sky Backdrop (Matching reference image golden sunset)
  const skyTex = createSunsetSkyTexture();
  const skyMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    depthWrite: false,
    fog: false,
  });
  const skyMesh = new THREE.Mesh(new THREE.PlaneGeometry(320, 110), skyMat);
  skyMesh.position.set(0, 42, -120);
  skyMesh.name = 'skyBackdropPlane';
  group.add(skyMesh);

  return group;
}

/**
 * 15. Sidewalk Roadside Hanging Banners ("गणपती बाप्पा मोरया" on left, "॥ गणेशोत्सव ॥" on right)
 * Matching the exact roadside banners shown in the reference image!
 */
export function createRoadsideBannerPost(isLeft: boolean): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Ornate Sandstone & Brass Base Plinth
  const plinthGeo = new THREE.BoxGeometry(0.7, 0.5, 0.7);
  const plinth = new THREE.Mesh(plinthGeo, mats.sandstoneMaterial);
  plinth.position.y = 0.25;
  plinth.castShadow = true;
  group.add(plinth);

  // Tall Brass & Gold Pillar Pole
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 5.2, 8);
  const pole = new THREE.Mesh(poleGeo, mats.goldMaterial);
  pole.position.y = 2.8;
  pole.castShadow = true;
  group.add(pole);

  // Golden Kalash Spear Finial on top
  const finialGeo = new THREE.ConeGeometry(0.18, 0.6, 8);
  const finial = new THREE.Mesh(finialGeo, mats.goldMaterial);
  finial.position.y = 5.7;
  group.add(finial);

  // Horizontal Brass Hanging Arm
  const armLength = 1.6;
  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, armLength, 8);
  const arm = new THREE.Mesh(armGeo, mats.goldMaterial);
  arm.rotation.z = Math.PI / 2;
  const armOffset = isLeft ? 0.7 : -0.7;
  arm.position.set(armOffset, 4.8, 0);
  group.add(arm);

  // Hanging Crimson Festival Silk Banner with Golden Devanagari Inscriptions
  const bannerTex = isLeft ? createLeftBannerTexture() : createRightBannerTexture();
  const bannerMat = new THREE.MeshStandardMaterial({
    map: bannerTex,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });
  const bannerGeo = new THREE.PlaneGeometry(1.3, 2.7);
  const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
  bannerMesh.position.set(armOffset, 3.4, 0);
  bannerMesh.castShadow = true;
  group.add(bannerMesh);

  // Golden Tassels hanging at bottom of banner
  [-0.45, 0, 0.45].forEach((tx) => {
    const tasselGeo = new THREE.ConeGeometry(0.06, 0.22, 6);
    const tassel = new THREE.Mesh(tasselGeo, mats.goldMaterial);
    tassel.rotation.x = Math.PI;
    tassel.position.set(armOffset + tx, 1.95, 0);
    group.add(tassel);
  });

  // Glowing Diya on base plinth
  const diyaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.08, 8), mats.terracottaMaterial);
  diyaBase.position.set(0, 0.54, 0);
  group.add(diyaBase);

  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), mats.diyaFlameMaterial);
  flame.position.set(0, 0.64, 0);
  group.add(flame);

  return group;
}

/**
 * 16. Overhead Festive Bunting (Strings of colorful triangular pennants fluttering across street)
 */
export function createOverheadBuntingMesh(roadWidth: number = 8.0): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Overhead wire catenary string
  const span = roadWidth + 5.0;
  const wireCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-span / 2, 4.8, 0),
    new THREE.Vector3(0, 4.1, 0),
    new THREE.Vector3(span / 2, 4.8, 0)
  );
  const wireGeo = new THREE.TubeGeometry(wireCurve, 20, 0.02, 4, false);
  const wireMat = mats.darkWoodMaterial;
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  // Triangular flags along the wire
  const flagCount = 18;
  const flagGeo = new THREE.ConeGeometry(0.2, 0.45, 3);
  const flagColors = [
    mats.marigoldOrangeMaterial,
    mats.marigoldYellowMaterial,
    mats.rubyCrimsonMaterial,
    mats.peacockTealMaterial,
    mats.saffronBrightMaterial,
  ];

  for (let i = 1; i < flagCount; i++) {
    const t = i / flagCount;
    const pt = wireCurve.getPoint(t);
    const colMat = flagColors[i % flagColors.length];

    const flag = new THREE.Mesh(flagGeo, colMat);
    flag.rotation.x = Math.PI; // Point triangle downward
    flag.position.set(pt.x, pt.y - 0.22, pt.z);
    // Slight fluttering angle
    flag.rotation.z = Math.sin(i * 1.5) * 0.18;
    flag.rotation.y = Math.cos(i * 2.1) * 0.2;
    group.add(flag);
  }

  return group;
}

/**
 * =========================================================================
 * 17. 6 SACRED GANPATI IDOL QUEST 3D COLLECTIBLE PIECES
 * =========================================================================
 */

export function createIdolPieceMesh(pieceId: string): THREE.Group {
  const group = new THREE.Group();
  const mats = MaterialLibrary.get();

  // Floating Golden Aura Disk & Ring for all sacred pieces
  const auraGeo = new THREE.TorusGeometry(0.85, 0.04, 12, 32);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.85,
  });
  const auraRing = new THREE.Mesh(auraGeo, auraMat);
  auraRing.name = 'pieceAuraRing';
  group.add(auraRing);

  // Soft glowing halo disc behind object
  const haloGeo = new THREE.CircleGeometry(0.75, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffe066,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const haloDisc = new THREE.Mesh(haloGeo, haloMat);
  group.add(haloDisc);

  const pieceGroup = new THREE.Group();
  pieceGroup.name = 'pieceModel';

  if (pieceId === 'base') {
    // 1. LOTUS PEDESTAL BASE (Padmasana)
    const discBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.65, 0.18, 24),
      mats.goldMaterial
    );
    pieceGroup.add(discBase);

    // Tier 1: Outer Lotus Petals
    const petalGeo = new THREE.ConeGeometry(0.14, 0.38, 5);
    const petalMat = mats.lotusPinkMaterial;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.45, 0.1, Math.sin(angle) * 0.45);
      petal.rotation.y = angle;
      petal.rotation.x = 0.55;
      pieceGroup.add(petal);
    }

    // Tier 2: Inner Golden Lotus Petals
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.25;
      const petalInner = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 5), mats.goldShineMaterial);
      petalInner.position.set(Math.cos(angle) * 0.3, 0.16, Math.sin(angle) * 0.3);
      petalInner.rotation.y = angle;
      petalInner.rotation.x = 0.4;
      pieceGroup.add(petalInner);
    }

    // Golden center cushion
    const cushion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.08, 16),
      mats.marigoldYellowMaterial
    );
    cushion.position.y = 0.15;
    pieceGroup.add(cushion);

  } else if (pieceId === 'ornaments') {
    // 2. SACRED FLORAL ORNAMENTS & GARLAND
    const necklaceCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.38, 0.25, 0),
      new THREE.Vector3(-0.25, -0.15, 0.1),
      new THREE.Vector3(0, -0.32, 0.15),
      new THREE.Vector3(0.25, -0.15, 0.1),
      new THREE.Vector3(0.38, 0.25, 0),
    ]);
    const neckGeo = new THREE.TubeGeometry(necklaceCurve, 24, 0.045, 8, false);
    const neckMesh = new THREE.Mesh(neckGeo, mats.goldShineMaterial);
    pieceGroup.add(neckMesh);

    // Central Ruby Locket Pendant
    const locket = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8), mats.goldShineMaterial);
    locket.position.set(0, -0.32, 0.15);
    locket.rotation.x = Math.PI / 2;
    pieceGroup.add(locket);

    const rubyGem = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mats.rubyCrimsonMaterial);
    rubyGem.position.set(0, -0.32, 0.19);
    pieceGroup.add(rubyGem);

    // Double Marigold Floral Garland (Outer loop)
    const garlandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.5, 0.35, 0),
      new THREE.Vector3(-0.35, -0.3, 0.15),
      new THREE.Vector3(0, -0.55, 0.2),
      new THREE.Vector3(0.35, -0.3, 0.15),
      new THREE.Vector3(0.5, 0.35, 0),
    ]);
    const beadCount = 14;
    for (let i = 0; i <= beadCount; i++) {
      const pt = garlandCurve.getPoint(i / beadCount);
      const isOrange = i % 2 === 0;
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        isOrange ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial
      );
      bead.position.copy(pt);
      pieceGroup.add(bead);
    }

  } else if (pieceId === 'hands') {
    // 3. SACRED BLESSING HANDS (Abhaya Mudra & Modak Platter)
    const rightHand = new THREE.Group();
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.06), mats.goldShineMaterial);
    rightHand.add(palm);

    const palmMark = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), mats.rubyCrimsonMaterial);
    palmMark.position.set(0, 0, 0.035);
    rightHand.add(palmMark);

    [-0.08, -0.026, 0.026, 0.08].forEach((fx, idx) => {
      const fHeight = idx === 1 || idx === 2 ? 0.22 : 0.18;
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, fHeight, 8), mats.goldShineMaterial);
      finger.position.set(fx, 0.14 + fHeight / 2, 0);
      rightHand.add(finger);
    });
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.14, 8), mats.goldShineMaterial);
    thumb.position.set(-0.14, 0.04, 0);
    thumb.rotation.z = 0.55;
    rightHand.add(thumb);

    rightHand.position.set(-0.25, 0, 0);
    pieceGroup.add(rightHand);

    // Left Hand holding Golden Modak Platter
    const leftHand = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.04, 16), mats.goldShineMaterial);
    plate.position.y = -0.05;
    leftHand.add(plate);

    const modakBase = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mats.marigoldYellowMaterial);
    modakBase.scale.set(1, 0.8, 1);
    modakBase.position.y = 0.04;
    leftHand.add(modakBase);

    const modakTip = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.18, 10), mats.marigoldYellowMaterial);
    modakTip.position.y = 0.14;
    leftHand.add(modakTip);

    leftHand.position.set(0.25, 0, 0);
    pieceGroup.add(leftHand);

  } else if (pieceId === 'ears') {
    // 4. AUSPICIOUS ATTENTIVE EARS (Supakarna with Golden Kundalas)
    [-0.32, 0.32].forEach((ex, idx) => {
      const earGroup = new THREE.Group();
      const earMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.05), mats.saffronBrightMaterial);
      earMesh.rotation.y = idx === 0 ? 0.2 : -0.2;
      earGroup.add(earMesh);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 16, Math.PI), mats.goldShineMaterial);
      rim.rotation.z = idx === 0 ? Math.PI / 2 : -Math.PI / 2;
      earGroup.add(rim);

      const jhumka = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 8), mats.goldShineMaterial);
      jhumka.position.set(idx === 0 ? -0.1 : 0.1, -0.28, 0);
      earGroup.add(jhumka);

      const jhumkaBead = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mats.rubyCrimsonMaterial);
      jhumkaBead.position.set(idx === 0 ? -0.1 : 0.1, -0.37, 0);
      earGroup.add(jhumkaBead);

      earGroup.position.set(ex, 0, 0);
      pieceGroup.add(earGroup);
    });

  } else if (pieceId === 'trunk') {
    // 5. CURVED AUSPICIOUS TRUNK (Vakratunda)
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.38, 0),
      new THREE.Vector3(0.05, 0.15, 0.08),
      new THREE.Vector3(0.08, -0.08, 0.12),
      new THREE.Vector3(-0.06, -0.28, 0.16),
      new THREE.Vector3(-0.24, -0.32, 0.18),
      new THREE.Vector3(-0.28, -0.22, 0.16),
    ]);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 28, 0.12, 12, false);
    const trunkMesh = new THREE.Mesh(trunkGeo, mats.saffronBrightMaterial);
    pieceGroup.add(trunkMesh);

    const tilak = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.02), mats.rubyCrimsonMaterial);
    tilak.position.set(0.02, 0.25, 0.12);
    pieceGroup.add(tilak);

    const tipRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16), mats.goldShineMaterial);
    tipRing.position.set(-0.26, -0.24, 0.17);
    pieceGroup.add(tipRing);

    const treatModak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 8), mats.goldShineMaterial);
    treatModak.position.set(-0.26, -0.15, 0.17);
    pieceGroup.add(treatModak);

  } else {
    // 6. GRAND GOLDEN CROWN (Divya Mukut)
    const crownBand = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.16, 16), mats.goldShineMaterial);
    pieceGroup.add(crownBand);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const isRuby = i % 2 === 0;
      const gem = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        isRuby ? mats.rubyCrimsonMaterial : mats.emeraldMaterial
      );
      gem.position.set(Math.cos(angle) * 0.38, 0, Math.sin(angle) * 0.38);
      pieceGroup.add(gem);
    }

    const midDome = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.28, 16), mats.goldShineMaterial);
    midDome.position.y = 0.2;
    pieceGroup.add(midDome);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 16), mats.goldShineMaterial);
    spire.position.y = 0.52;
    pieceGroup.add(spire);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), mats.goldShineMaterial);
    finial.position.y = 0.78;
    pieceGroup.add(finial);

    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 6), mats.peacockTealMaterial);
    plume.position.set(0, 0.88, -0.05);
    plume.rotation.x = -0.3;
    pieceGroup.add(plume);
  }

  group.add(pieceGroup);
  group.userData.pieceId = pieceId;

  return group;
}

/**
 * =========================================================================
 * 18. HIGH-DEFINITION GRAND LORD GANESHA IDOL 3D MODEL
 * Mastercrafted, Respectful, Stylized PBR 3D Deity Model
 * =========================================================================
 */
export interface GaneshaIdolModelParts {
  rootGroup: THREE.Group;
  baseGroup: THREE.Group;
  torsoGroup: THREE.Group;
  ornamentsGroup: THREE.Group;
  handsGroup: THREE.Group;
  headGroup: THREE.Group;
  earsGroup: THREE.Group;
  trunkGroup: THREE.Group;
  crownGroup: THREE.Group;
  prabhavaliHalo: THREE.Group;
  diyaPlates: THREE.Group;
}

export function createLordGaneshaIdolModel(): GaneshaIdolModelParts {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'LordGaneshaIdolRoot';
  const mats = MaterialLibrary.get();

  // -------------------------------------------------------------------------
  // 1. BASE GROUP (Carved Marble Altar, Dual-Tier Lotus Throne, Mooshak Companion)
  // -------------------------------------------------------------------------
  const baseGroup = new THREE.Group();
  baseGroup.name = 'idol_base';

  // 1a. Carved Makrana Sandstone & Marble Plinth (Octagonal Stepped Base)
  const plinthLow = new THREE.Mesh(
    new THREE.CylinderGeometry(2.0, 2.2, 0.35, 16),
    mats.ganeshaPedestalMarbleMaterial
  );
  plinthLow.position.y = 0.175;
  plinthLow.receiveShadow = true;
  baseGroup.add(plinthLow);

  const plinthGoldBand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.85, 1.95, 0.1, 24),
    mats.ganeshaGoldMaterial
  );
  plinthGoldBand.position.y = 0.4;
  baseGroup.add(plinthGoldBand);

  const plinthMid = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.8, 0.3, 16),
    mats.ganeshaPedestalMarbleMaterial
  );
  plinthMid.position.y = 0.6;
  baseGroup.add(plinthMid);

  // 1b. Dual-Tier Blossoming Lotus Throne (Kamalasana)
  // Outer Layer: 24 Rose-Pink Sculpted Petals with Golden Tips
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const petalMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.7, 6),
      mats.lotusPinkMaterial
    );
    petalMesh.position.set(Math.cos(angle) * 1.48, 0.72, Math.sin(angle) * 1.48);
    petalMesh.rotation.y = angle;
    petalMesh.rotation.x = 0.68;
    petalMesh.castShadow = true;
    baseGroup.add(petalMesh);

    // Golden tip accent on outer petals
    const tipMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 6, 6),
      mats.ganeshaGoldMaterial
    );
    tipMesh.position.set(Math.cos(angle) * 1.72, 0.62, Math.sin(angle) * 1.72);
    baseGroup.add(tipMesh);
  }

  // Inner Layer: 16 Radiant Gold Lotus Petals
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + 0.18;
    const innerPetal = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.55, 6),
      mats.ganeshaGoldMaterial
    );
    innerPetal.position.set(Math.cos(angle) * 1.08, 0.84, Math.sin(angle) * 1.08);
    innerPetal.rotation.y = angle;
    innerPetal.rotation.x = 0.48;
    innerPetal.castShadow = true;
    baseGroup.add(innerPetal);
  }

  // Lotus Core Seating Disc
  const lotusCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.15, 0.12, 24),
    mats.ganeshaGoldMaterial
  );
  lotusCenter.position.y = 0.88;
  baseGroup.add(lotusCenter);

  // 1c. Mooshak (Sacred Divine Mouse Vahana) Sitting Respectfully at the Altar
  const mooshakGroup = new THREE.Group();
  mooshakGroup.name = 'idol_mooshak';

  const mooshakBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 12),
    mats.ganeshaGoldMaterial
  );
  mooshakBody.scale.set(1.4, 0.95, 1.05);
  mooshakGroup.add(mooshakBody);

  const mooshakHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.22, 10),
    mats.ganeshaGoldMaterial
  );
  mooshakHead.rotation.z = -Math.PI / 2;
  mooshakHead.position.set(0.22, 0.06, 0);
  mooshakGroup.add(mooshakHead);

  [-0.08, 0.08].forEach((ez) => {
    const mooshakEar = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      mats.ganeshaGoldMaterial
    );
    mooshakEar.position.set(0.18, 0.16, ez);
    mooshakGroup.add(mooshakEar);
  });

  const mooshakTailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0, 0),
    new THREE.Vector3(-0.35, 0.1, -0.05),
    new THREE.Vector3(-0.4, 0.25, 0.05),
  ]);
  const mooshakTail = new THREE.Mesh(
    new THREE.TubeGeometry(mooshakTailCurve, 12, 0.02, 6, false),
    mats.ganeshaGoldMaterial
  );
  mooshakGroup.add(mooshakTail);

  // Mooshak holding sacred modak offering with both paws
  const mooshakModak = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.12, 8),
    mats.marigoldYellowMaterial
  );
  mooshakModak.position.set(0.36, 0.04, 0);
  mooshakGroup.add(mooshakModak);

  mooshakGroup.position.set(0.98, 0.72, 1.05);
  mooshakGroup.rotation.y = -Math.PI / 3.5;
  baseGroup.add(mooshakGroup);

  // 1d. Pooja Offerings at Altar Base (Brass Pooja Thali with Modaks & Fresh Flowers)
  const thali = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.32, 0.04, 18),
    mats.ganeshaGoldMaterial
  );
  thali.position.set(-0.85, 0.72, 1.0);
  baseGroup.add(thali);

  // Modak pyramid stack on thali
  const modakPositions = [
    { x: -0.85, y: 0.8, z: 1.0 },
    { x: -0.92, y: 0.8, z: 0.95 },
    { x: -0.78, y: 0.8, z: 0.95 },
    { x: -0.85, y: 0.8, z: 1.07 },
    { x: -0.85, y: 0.91, z: 0.99 }, // Top center apex modak
  ];
  modakPositions.forEach((pos, idx) => {
    const modak = new THREE.Mesh(
      new THREE.ConeGeometry(idx === 4 ? 0.07 : 0.06, 0.12, 8),
      mats.marigoldYellowMaterial
    );
    modak.position.set(pos.x, pos.y, pos.z);
    baseGroup.add(modak);
  });

  rootGroup.add(baseGroup);

  // -------------------------------------------------------------------------
  // 2. TORSO & LEGS GROUP (Royal Yogic Lalitasana Seated Posture)
  // -------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'idol_torso';

  // 2a. Legs wrapped in pleated golden silk Dhoti (Pitambar)
  // Left Leg folded horizontally resting on lotus throne
  const leftLegCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 1.1, 0.0),
    new THREE.Vector3(-0.65, 0.98, 0.25),
    new THREE.Vector3(-0.2, 0.94, 0.58),
  ]);
  const leftLegMesh = new THREE.Mesh(
    new THREE.TubeGeometry(leftLegCurve, 16, 0.22, 12, false),
    mats.ganeshaDhotiMaterial
  );
  torsoGroup.add(leftLegMesh);

  // Left Foot resting gently in center
  const leftFoot = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 10, 10),
    mats.ganeshaSkinMaterial
  );
  leftFoot.scale.set(1.4, 0.8, 1.1);
  leftFoot.position.set(-0.15, 0.94, 0.6);
  torsoGroup.add(leftFoot);

  // Golden Anklet (Payal)
  const leftPayal = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.025, 8, 16),
    mats.ganeshaGoldMaterial
  );
  leftPayal.position.set(-0.24, 0.95, 0.52);
  leftPayal.rotation.y = Math.PI / 3;
  torsoGroup.add(leftPayal);

  // Right Leg resting forward with knee bent gracefully
  const rightLegCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 1.1, 0.0),
    new THREE.Vector3(0.68, 0.98, 0.25),
    new THREE.Vector3(0.48, 0.82, 0.58),
  ]);
  const rightLegMesh = new THREE.Mesh(
    new THREE.TubeGeometry(rightLegCurve, 16, 0.22, 12, false),
    mats.ganeshaDhotiMaterial
  );
  torsoGroup.add(rightLegMesh);

  // Right Foot resting forward
  const rightFoot = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 10, 10),
    mats.ganeshaSkinMaterial
  );
  rightFoot.scale.set(1.4, 0.8, 1.1);
  rightFoot.position.set(0.48, 0.82, 0.65);
  torsoGroup.add(rightFoot);

  const rightPayal = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.025, 8, 16),
    mats.ganeshaGoldMaterial
  );
  rightPayal.position.set(0.48, 0.86, 0.55);
  rightPayal.rotation.x = Math.PI / 2.5;
  torsoGroup.add(rightPayal);

  // Dhoti Central Pleats / Patka cascading down the center
  const dhotiWrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.88, 0.52, 18),
    mats.ganeshaDhotiMaterial
  );
  dhotiWrap.position.set(0, 1.12, 0.08);
  torsoGroup.add(dhotiWrap);

  const dhotiFrontFan = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.45, 0.08),
    mats.ganeshaDhotiMaterial
  );
  dhotiFrontFan.position.set(0, 0.96, 0.56);
  dhotiFrontFan.rotation.x = 0.2;
  torsoGroup.add(dhotiFrontFan);

  // 2b. Magnificent Pot-Belly (Lambodara) with Smooth Curvature
  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 22, 22),
    mats.ganeshaSkinMaterial
  );
  belly.scale.set(1.08, 1.02, 1.14);
  belly.position.set(0, 1.5, 0.12);
  belly.castShadow = true;
  torsoGroup.add(belly);

  // Divine Navel (Nabhi) with Golden Gem Inlay
  const navel = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    mats.ganeshaRubyMaterial
  );
  navel.position.set(0, 1.45, 0.8);
  torsoGroup.add(navel);

  // 2c. Upper Chest & Shoulders
  const chest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.52, 0.55, 18),
    mats.ganeshaSkinMaterial
  );
  chest.position.set(0, 1.95, 0.04);
  chest.castShadow = true;
  torsoGroup.add(chest);

  // 2d. Naga Bandha (Sacred Serpent Waist Belt)
  const nagaBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.045, 10, 28),
    mats.peacockTealMaterial
  );
  nagaBand.rotation.x = Math.PI / 2.2;
  nagaBand.position.set(0, 1.38, 0.14);
  torsoGroup.add(nagaBand);

  // Serpent Crown Buckle
  const nagaHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 8),
    mats.ganeshaGoldMaterial
  );
  nagaHead.position.set(0, 1.4, 0.76);
  torsoGroup.add(nagaHead);

  // 2e. Sacred Thread (Janeu) Running Diagonally Across Chest
  const janeuCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.38, 2.18, 0.15),
    new THREE.Vector3(-0.18, 1.82, 0.42),
    new THREE.Vector3(0.22, 1.42, 0.38),
    new THREE.Vector3(0.5, 1.15, 0.06),
  ]);
  const janeu = new THREE.Mesh(
    new THREE.TubeGeometry(janeuCurve, 24, 0.024, 8, false),
    mats.ganeshaGoldMaterial
  );
  torsoGroup.add(janeu);

  // 2f. Silk Angavastram (Shoulder Shawl) Draping Behind & Over Arms
  const shawlCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.75, 1.9, 0.1),
    new THREE.Vector3(-0.6, 2.15, -0.1),
    new THREE.Vector3(0, 2.1, -0.2),
    new THREE.Vector3(0.6, 2.15, -0.1),
    new THREE.Vector3(0.75, 1.9, 0.1),
  ]);
  const shawlMesh = new THREE.Mesh(
    new THREE.TubeGeometry(shawlCurve, 20, 0.1, 10, false),
    mats.ganeshaShawlMaterial
  );
  torsoGroup.add(shawlMesh);

  rootGroup.add(torsoGroup);

  // -------------------------------------------------------------------------
  // 3. ORNAMENTS GROUP (Royal Necklaces, Marigold Garland, Armlets, Chest Padakam)
  // -------------------------------------------------------------------------
  const ornamentsGroup = new THREE.Group();
  ornamentsGroup.name = 'idol_ornaments';

  // 3a. Golden Choker (Kanthi Mala) with Embedded Gems
  const choker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.46, 0.12, 20),
    mats.ganeshaGoldMaterial
  );
  choker.position.set(0, 2.18, 0.06);
  ornamentsGroup.add(choker);

  // Choker Ruby Center Jewel
  const chokerGem = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    mats.ganeshaRubyMaterial
  );
  chokerGem.position.set(0, 2.18, 0.52);
  ornamentsGroup.add(chokerGem);

  // 3b. Grand Golden Necklace with Filigree Padakam (Pendant)
  const neckCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.46, 2.12, 0.18),
    new THREE.Vector3(-0.28, 1.82, 0.48),
    new THREE.Vector3(0, 1.68, 0.56),
    new THREE.Vector3(0.28, 1.82, 0.48),
    new THREE.Vector3(0.46, 2.12, 0.18),
  ]);
  const neckMesh = new THREE.Mesh(
    new THREE.TubeGeometry(neckCurve, 24, 0.045, 8, false),
    mats.ganeshaGoldMaterial
  );
  ornamentsGroup.add(neckMesh);

  // Golden Medallion Pendant (Padakam)
  const padakam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12),
    mats.ganeshaGoldMaterial
  );
  padakam.position.set(0, 1.66, 0.58);
  padakam.rotation.x = Math.PI / 2;
  ornamentsGroup.add(padakam);

  const padakamGem = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    mats.ganeshaEmeraldMaterial
  );
  padakamGem.position.set(0, 1.66, 0.61);
  ornamentsGroup.add(padakamGem);

  // 3c. Traditional Marigold & Rose Garland (Pushpa Vanamala)
  const garlandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.65, 2.18, 0.05),
    new THREE.Vector3(-0.62, 1.55, 0.38),
    new THREE.Vector3(-0.32, 1.05, 0.62),
    new THREE.Vector3(0, 0.96, 0.66),
    new THREE.Vector3(0.32, 1.05, 0.62),
    new THREE.Vector3(0.62, 1.55, 0.38),
    new THREE.Vector3(0.65, 2.18, 0.05),
  ]);
  for (let i = 0; i <= 32; i++) {
    const pt = garlandCurve.getPoint(i / 32);
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 8, 8),
      i % 3 === 0
        ? mats.rubyCrimsonMaterial
        : i % 2 === 0
        ? mats.marigoldOrangeMaterial
        : mats.marigoldYellowMaterial
    );
    bead.position.copy(pt);
    ornamentsGroup.add(bead);
  }

  rootGroup.add(ornamentsGroup);

  // -------------------------------------------------------------------------
  // 4. HANDS GROUP (Four Divine Arms - Chaturbhuja)
  // -------------------------------------------------------------------------
  const handsGroup = new THREE.Group();
  handsGroup.name = 'idol_hands';

  // 4a. FRONT RIGHT ARM (Abhaya / Varada Blessing Mudra)
  const armFR = new THREE.Group();
  const upperArmFR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.48, 12),
    mats.ganeshaSkinMaterial
  );
  upperArmFR.position.set(0.56, 1.95, 0.18);
  upperArmFR.rotation.z = -0.55;
  armFR.add(upperArmFR);

  // Armlet (Keyura)
  const armletFR = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.03, 8, 16),
    mats.ganeshaGoldMaterial
  );
  armletFR.position.set(0.52, 2.05, 0.18);
  armletFR.rotation.y = Math.PI / 2;
  armFR.add(armletFR);

  // Forearm & Open Blessing Palm
  const forearmFR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.08, 0.38, 10),
    mats.ganeshaSkinMaterial
  );
  forearmFR.position.set(0.78, 1.95, 0.32);
  forearmFR.rotation.x = -Math.PI / 4;
  armFR.add(forearmFR);

  // Gold Bangle (Kada)
  const kadaFR = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.025, 8, 16),
    mats.ganeshaGoldMaterial
  );
  kadaFR.position.set(0.82, 1.98, 0.42);
  kadaFR.rotation.x = Math.PI / 4;
  armFR.add(kadaFR);

  // Raised Palm Facing Devotee
  const palmFR = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.28, 0.06),
    mats.ganeshaSkinMaterial
  );
  palmFR.position.set(0.85, 2.08, 0.46);
  palmFR.rotation.y = -0.15;
  armFR.add(palmFR);

  // Modeled blessing fingers
  for (let f = 0; f < 4; f++) {
    const finger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.022, 0.14, 6),
      mats.ganeshaSkinMaterial
    );
    finger.position.set(0.77 + f * 0.05, 2.26, 0.46);
    armFR.add(finger);
  }

  // Auspicious Red Kumkum / Lotus Imprint on Palm Center
  const palmLotus = new THREE.Mesh(
    new THREE.CircleGeometry(0.07, 14),
    mats.rubyCrimsonMaterial
  );
  palmLotus.position.set(0.85, 2.08, 0.495);
  palmLotus.rotation.y = -0.15;
  armFR.add(palmLotus);

  const palmDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.025, 8),
    mats.ganeshaGoldMaterial
  );
  palmDot.position.set(0.85, 2.08, 0.498);
  armFR.add(palmDot);

  handsGroup.add(armFR);

  // 4b. FRONT LEFT ARM (Cradling Golden Modak Katori)
  const armFL = new THREE.Group();
  const upperArmFL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.48, 12),
    mats.ganeshaSkinMaterial
  );
  upperArmFL.position.set(-0.56, 1.95, 0.18);
  upperArmFL.rotation.z = 0.55;
  armFL.add(upperArmFL);

  const armletFL = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.03, 8, 16),
    mats.ganeshaGoldMaterial
  );
  armletFL.position.set(-0.52, 2.05, 0.18);
  armletFL.rotation.y = Math.PI / 2;
  armFL.add(armletFL);

  const forearmFL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.08, 0.42, 10),
    mats.ganeshaSkinMaterial
  );
  forearmFL.position.set(-0.68, 1.68, 0.38);
  forearmFL.rotation.z = 0.4;
  forearmFL.rotation.x = 0.6;
  armFL.add(forearmFL);

  // Golden Modak Bowl (Katori)
  const katori = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.22, 0.08, 16),
    mats.ganeshaGoldMaterial
  );
  katori.position.set(-0.72, 1.56, 0.52);
  armFL.add(katori);

  // Delicious Modaks stacked in bowl
  const bowlModaks = [
    { x: -0.72, y: 1.62, z: 0.52 },
    { x: -0.79, y: 1.62, z: 0.47 },
    { x: -0.65, y: 1.62, z: 0.47 },
    { x: -0.72, y: 1.62, z: 0.58 },
    { x: -0.72, y: 1.72, z: 0.52 }, // Sweet top modak
  ];
  bowlModaks.forEach((pos, idx) => {
    const modak = new THREE.Mesh(
      new THREE.ConeGeometry(idx === 4 ? 0.075 : 0.06, 0.14, 8),
      mats.marigoldYellowMaterial
    );
    modak.position.set(pos.x, pos.y, pos.z);
    armFL.add(modak);
  });

  handsGroup.add(armFL);

  // 4c. BACK RIGHT ARM (Holding Golden Ankusha / Divine Axe)
  const armBR = new THREE.Group();
  const upperArmBR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.09, 0.5, 10),
    mats.ganeshaSkinMaterial
  );
  upperArmBR.position.set(0.68, 2.25, -0.05);
  upperArmBR.rotation.z = -1.15;
  armBR.add(upperArmBR);

  const forearmBR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.075, 0.35, 10),
    mats.ganeshaSkinMaterial
  );
  forearmBR.position.set(0.92, 2.45, 0.05);
  forearmBR.rotation.z = -0.2;
  armBR.add(forearmBR);

  // Golden Ankusha (Divine Goad)
  const ankushaShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8),
    mats.ganeshaGoldMaterial
  );
  ankushaShaft.position.set(0.96, 2.58, 0.12);
  ankushaShaft.rotation.z = -0.35;
  armBR.add(ankushaShaft);

  const ankushaBlade = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.03, 8, 16, Math.PI),
    mats.ganeshaGoldMaterial
  );
  ankushaBlade.position.set(1.05, 2.82, 0.12);
  ankushaBlade.rotation.z = Math.PI / 1.6;
  armBR.add(ankushaBlade);

  handsGroup.add(armBR);

  // 4d. BACK LEFT ARM (Holding Sacred Pasha / Lasso & Pink Lotus)
  const armBL = new THREE.Group();
  const upperArmBL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.09, 0.5, 10),
    mats.ganeshaSkinMaterial
  );
  upperArmBL.position.set(-0.68, 2.25, -0.05);
  upperArmBL.rotation.z = 1.15;
  armBL.add(upperArmBL);

  const forearmBL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.075, 0.35, 10),
    mats.ganeshaSkinMaterial
  );
  forearmBL.position.set(-0.92, 2.45, 0.05);
  forearmBL.rotation.z = 0.2;
  armBL.add(forearmBL);

  // Sacred Pasha (Golden Noose Ring)
  const pashaRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.03, 8, 20),
    mats.ganeshaGoldMaterial
  );
  pashaRing.position.set(-0.98, 2.65, 0.12);
  pashaRing.rotation.y = 0.4;
  armBL.add(pashaRing);

  // Fresh Blooming Pink Lotus Bud
  const lotusBud = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.28, 8),
    mats.lotusPinkMaterial
  );
  lotusBud.position.set(-0.98, 2.65, 0.12);
  lotusBud.rotation.z = -0.3;
  armBL.add(lotusBud);

  handsGroup.add(armBL);

  rootGroup.add(handsGroup);

  // -------------------------------------------------------------------------
  // 5. HEAD GROUP (Mastercrafted Elephant Head, Temples, Tilak, Tusks, Eyes)
  // -------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'idol_head';

  // 5a. Master Elephant Head (Gajanan) with Frontal Kumbha Bulbs
  const headMain = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 24, 24),
    mats.ganeshaSkinMaterial
  );
  headMain.scale.set(1.06, 1.18, 1.12);
  headMain.position.set(0, 2.55, 0.14);
  headMain.castShadow = true;
  headGroup.add(headMain);

  // Twin Frontal Lobes (Ganda Sthala) on Forehead
  [-0.18, 0.18].forEach((lx) => {
    const lobe = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 14, 14),
      mats.ganeshaSkinMaterial
    );
    lobe.position.set(lx, 2.85, 0.38);
    headGroup.add(lobe);
  });

  // 5b. Auspicious Sacred Sindoor Tilak & Chandan Crescent
  // White Chandan Tripundra Arches
  const tilakWhite = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.045, 0.02),
    mats.whiteClothMaterial
  );
  tilakWhite.position.set(0, 2.82, 0.64);
  headGroup.add(tilakWhite);

  const tilakWhite2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.035, 0.02),
    mats.whiteClothMaterial
  );
  tilakWhite2.position.set(0, 2.88, 0.64);
  headGroup.add(tilakWhite2);

  // Crimson Sindoor Trishul Flame & Bindi in Center
  const tilakRed = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.22, 0.03),
    mats.ganeshaRubyMaterial
  );
  tilakRed.position.set(0, 2.82, 0.65);
  headGroup.add(tilakRed);

  const tilakBindi = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    mats.ganeshaGoldMaterial
  );
  tilakBindi.position.set(0, 2.68, 0.64);
  headGroup.add(tilakBindi);

  // 5c. Serene Elephant Eyes with Eyelids & Divine Gaze
  [-0.22, 0.22].forEach((eyeX) => {
    // Sclera / Eye Base
    const eyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 10, 10),
      mats.whiteClothMaterial
    );
    eyeWhite.position.set(eyeX, 2.62, 0.56);
    headGroup.add(eyeWhite);

    // Dark Iris & Pupil
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      mats.darkWoodMaterial
    );
    pupil.position.set(eyeX + (eyeX > 0 ? -0.01 : 0.01), 2.62, 0.6);
    headGroup.add(pupil);

    // Delicate Upper Eyelid
    const eyelid = new THREE.Mesh(
      new THREE.TorusGeometry(0.065, 0.018, 6, 12, Math.PI),
      mats.ganeshaGoldMaterial
    );
    eyelid.position.set(eyeX, 2.64, 0.58);
    eyelid.rotation.z = Math.PI;
    headGroup.add(eyelid);
  });

  // 5d. Sacred Tusks (Ekadanta: Right Tusk Whole, Left Tusk Respectfully Broken)
  // Right Tusk (Complete, Polished Ivory with Gold Ring Band)
  const rightTusk = new THREE.Mesh(
    new THREE.ConeGeometry(0.055, 0.32, 10),
    mats.ganeshaIvoryMaterial
  );
  rightTusk.position.set(0.24, 2.28, 0.52);
  rightTusk.rotation.x = 0.75;
  rightTusk.rotation.z = -0.2;
  headGroup.add(rightTusk);

  const tuskRingR = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.015, 6, 12),
    mats.ganeshaGoldMaterial
  );
  tuskRingR.position.set(0.23, 2.34, 0.48);
  tuskRingR.rotation.x = 0.75;
  headGroup.add(tuskRingR);

  // Left Tusk (Sacred Broken Tusk - Used to inscribe the Mahabharata)
  const leftTusk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.055, 0.12, 10),
    mats.ganeshaIvoryMaterial
  );
  leftTusk.position.set(-0.24, 2.34, 0.48);
  leftTusk.rotation.x = 0.75;
  leftTusk.rotation.z = 0.2;
  headGroup.add(leftTusk);

  const tuskRingL = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.015, 6, 12),
    mats.ganeshaGoldMaterial
  );
  tuskRingL.position.set(-0.23, 2.36, 0.46);
  tuskRingL.rotation.x = 0.75;
  headGroup.add(tuskRingL);

  rootGroup.add(headGroup);

  // -------------------------------------------------------------------------
  // 6. EARS GROUP (Wide Fan-Shaped Shurpa-karna Ears with Royal Kundala Earrings)
  // -------------------------------------------------------------------------
  const earsGroup = new THREE.Group();
  earsGroup.name = 'idol_ears';

  [-0.64, 0.64].forEach((earX, idx) => {
    const earGroup = new THREE.Group();

    // Curved Outer Ear Flap
    const earOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.48, 0.06, 16),
      mats.ganeshaSkinMaterial
    );
    earOuter.scale.set(1.25, 1.4, 0.8);
    earOuter.rotation.x = Math.PI / 2;
    earOuter.rotation.y = idx === 0 ? 0.35 : -0.35;
    earGroup.add(earOuter);

    // Golden Inner Ear Filigree Rim
    const earRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.025, 8, 20),
      mats.ganeshaGoldMaterial
    );
    earRim.rotation.y = idx === 0 ? 0.35 : -0.35;
    earGroup.add(earRim);

    // Dangling Royal Kundala Earring with Pearl Drops
    const earringStud = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      mats.ganeshaRubyMaterial
    );
    earringStud.position.set(0, -0.42, 0);
    earGroup.add(earringStud);

    const earringJhumka = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.22, 10),
      mats.ganeshaGoldMaterial
    );
    earringJhumka.position.set(0, -0.58, 0);
    earGroup.add(earringJhumka);

    const earringPearl = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      mats.whiteClothMaterial
    );
    earringPearl.position.set(0, -0.72, 0);
    earGroup.add(earringPearl);

    earGroup.position.set(earX, 2.58, 0.08);
    earsGroup.add(earGroup);
  });

  rootGroup.add(earsGroup);

  // -------------------------------------------------------------------------
  // 7. TRUNK GROUP (Vakratunda - Gracefully Curving to the Left with Golden Modak)
  // -------------------------------------------------------------------------
  const trunkGroup = new THREE.Group();
  trunkGroup.name = 'idol_trunk';

  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.55, 0.58),
    new THREE.Vector3(0.08, 2.25, 0.68),
    new THREE.Vector3(0.1, 1.95, 0.74),
    new THREE.Vector3(-0.16, 1.65, 0.78),
    new THREE.Vector3(-0.46, 1.58, 0.72),
    new THREE.Vector3(-0.52, 1.76, 0.66), // Sweeps upwards holding modak
  ]);

  const trunkMesh = new THREE.Mesh(
    new THREE.TubeGeometry(trunkCurve, 36, 0.16, 16, false),
    mats.ganeshaSkinMaterial
  );
  trunkMesh.castShadow = true;
  trunkGroup.add(trunkMesh);

  // Wrinkled Golden Segment Rings along Trunk
  for (let r = 1; r <= 8; r++) {
    const pt = trunkCurve.getPoint(r / 10);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.14 - r * 0.008, 0.016, 6, 14),
      mats.ganeshaGoldMaterial
    );
    ring.position.copy(pt);
    trunkGroup.add(ring);
  }

  // Golden Modak delicately held at the tip of the trunk
  const trunkModak = new THREE.Mesh(
    new THREE.ConeGeometry(0.095, 0.18, 10),
    mats.marigoldYellowMaterial
  );
  trunkModak.position.set(-0.52, 1.86, 0.66);
  trunkGroup.add(trunkModak);

  rootGroup.add(trunkGroup);

  // -------------------------------------------------------------------------
  // 8. GRAND CROWN GROUP (Royal Multi-Tiered Kiritamukuta with Gemstones & Plume)
  // -------------------------------------------------------------------------
  const crownGroup = new THREE.Group();
  crownGroup.name = 'idol_crown';

  // Tier 1: Base Gold Diadem with Gemstones
  const crownBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.56, 0.25, 24),
    mats.ganeshaCrownMaterial
  );
  crownBase.position.y = 3.08;
  crownGroup.add(crownBase);

  // Ruby & Emerald Inlays around base tier
  for (let g = 0; g < 12; g++) {
    const angle = (g / 12) * Math.PI * 2;
    const gem = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      g % 2 === 0 ? mats.ganeshaRubyMaterial : mats.ganeshaEmeraldMaterial
    );
    gem.position.set(Math.cos(angle) * 0.54, 3.08, Math.sin(angle) * 0.54);
    crownGroup.add(gem);
  }

  // Tier 2: Mid Spire Dome with Filigree
  const crownMid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.48, 0.4, 20),
    mats.ganeshaCrownMaterial
  );
  crownMid.position.y = 3.38;
  crownGroup.add(crownMid);

  // Tier 3: Temple Shikhara Spire
  const crownSpire = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 0.65, 20),
    mats.ganeshaCrownMaterial
  );
  crownSpire.position.y = 3.85;
  crownGroup.add(crownSpire);

  // Tier 4: Sacred Kalash Finial Top
  const kalashPot = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 14, 14),
    mats.ganeshaGoldMaterial
  );
  kalashPot.position.y = 4.22;
  crownGroup.add(kalashPot);

  const kalashSpike = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.18, 10),
    mats.ganeshaGoldMaterial
  );
  kalashSpike.position.y = 4.38;
  crownGroup.add(kalashSpike);

  // Peacock Feather Plume (Mor Pankh) at the Crown's Crest
  const peacockPlume = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.45, 8),
    mats.peacockTealMaterial
  );
  peacockPlume.position.set(0, 4.45, -0.08);
  peacockPlume.rotation.x = -0.32;
  crownGroup.add(peacockPlume);

  const peacockEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    mats.ganeshaEmeraldMaterial
  );
  peacockEye.position.set(0, 4.52, -0.05);
  crownGroup.add(peacockEye);

  rootGroup.add(crownGroup);

  // -------------------------------------------------------------------------
  // 9. PRABHAVALI HALO (Divine Radiant Sunburst Aura Archway)
  // -------------------------------------------------------------------------
  const prabhavaliHalo = new THREE.Group();
  prabhavaliHalo.name = 'idol_prabhavali';

  // Heavy Golden Aureole Arch
  const archTorus = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.09, 14, 36, Math.PI),
    mats.ganeshaGoldMaterial
  );
  archTorus.position.set(0, 2.65, -0.28);
  prabhavaliHalo.add(archTorus);

  // 24 Solar Fire Rays radiating outward from halo
  for (let i = 0; i <= 24; i++) {
    const angle = (i / 24) * Math.PI;
    const ray = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.48, 6),
      mats.ganeshaGoldMaterial
    );
    ray.position.set(
      Math.cos(angle) * 1.88,
      2.65 + Math.sin(angle) * 1.88,
      -0.28
    );
    ray.rotation.z = angle - Math.PI / 2;
    prabhavaliHalo.add(ray);
  }

  // Radiant Golden Solar Disc with Sacred Geometry
  const auraDisc = new THREE.Mesh(
    new THREE.CircleGeometry(1.68, 32),
    mats.ganeshaPrabhavaliMaterial
  );
  auraDisc.position.set(0, 2.65, -0.3);
  prabhavaliHalo.add(auraDisc);

  // Secondary Ethereal Glow Backing
  const glowBacking = new THREE.Mesh(
    new THREE.CircleGeometry(1.85, 24),
    new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  glowBacking.position.set(0, 2.65, -0.32);
  prabhavaliHalo.add(glowBacking);

  rootGroup.add(prabhavaliHalo);

  // -------------------------------------------------------------------------
  // 10. DIYA PLATES & TALL BRASS SAMAI AARTI LAMPS
  // -------------------------------------------------------------------------
  const diyaPlates = new THREE.Group();
  diyaPlates.name = 'idol_diyas';

  [-1.4, 1.4].forEach((dx) => {
    // Stepped Brass Samai Lamp Base
    const samaiBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.42, 0.18, 16),
      mats.ganeshaGoldMaterial
    );
    samaiBase.position.set(dx, 0.1, 0.95);
    diyaPlates.add(samaiBase);

    // Carved Pillar Shaft
    const samaiPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 1.4, 12),
      mats.ganeshaGoldMaterial
    );
    samaiPillar.position.set(dx, 0.85, 0.95);
    diyaPlates.add(samaiPillar);

    // Brass Oil Bowl with Petal Rim
    const samaiBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.12, 0.14, 16),
      mats.ganeshaGoldMaterial
    );
    samaiBowl.position.set(dx, 1.58, 0.95);
    diyaPlates.add(samaiBowl);

    // Multilayer Dancing Golden Aarti Flame
    const flameInner = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 10),
      mats.diyaFlameMaterial
    );
    flameInner.position.set(dx, 1.74, 0.95);
    diyaPlates.add(flameInner);

    const flameOuter = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.6,
      })
    );
    flameOuter.position.set(dx, 1.74, 0.95);
    diyaPlates.add(flameOuter);
  });

  rootGroup.add(diyaPlates);

  return {
    rootGroup,
    baseGroup,
    torsoGroup,
    ornamentsGroup,
    handsGroup,
    headGroup,
    earsGroup,
    trunkGroup,
    crownGroup,
    prabhavaliHalo,
    diyaPlates,
  };
}

/**
 * High-Definition Procedural Fallback Ganesha Idol (Robust fail-safe)
 */
export function createProceduralFallbackGaneshaIdol(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'lord_ganesha_idol';
  const mats = MaterialLibrary.get();

  // 1. Altar Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.5, 20), mats.ganeshaPedestalMarbleMaterial);
  base.name = 'idol_base';
  base.position.y = 0.25;
  root.add(base);

  // Lotus Petals
  const lotus = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.35, 18), mats.lotusPinkMaterial);
  lotus.position.y = 0.6;
  root.add(lotus);

  // 2. Torso
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.68, 20, 20), mats.ganeshaSkinMaterial);
  torso.name = 'idol_torso';
  torso.scale.set(1.1, 1.02, 1.12);
  torso.position.set(0, 1.45, 0.08);
  root.add(torso);

  // Dhoti Wrap
  const dhoti = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.88, 0.55, 18), mats.ganeshaDhotiMaterial);
  dhoti.position.set(0, 1.08, 0.06);
  root.add(dhoti);

  // 3. Ornaments
  const garland = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.11, 10, 24), mats.marigoldOrangeMaterial);
  garland.name = 'idol_ornaments';
  garland.rotation.x = Math.PI / 2.3;
  garland.position.set(0, 1.65, 0.22);
  root.add(garland);

  // 4. Hands
  const hands = new THREE.Group();
  hands.name = 'idol_hands';
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), mats.ganeshaGoldMaterial);
  leftHand.position.set(-0.78, 1.55, 0.32);
  hands.add(leftHand);
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), mats.ganeshaGoldMaterial);
  rightHand.position.set(0.78, 1.85, 0.32);
  hands.add(rightHand);
  root.add(hands);

  // 5. Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 20, 20), mats.ganeshaSkinMaterial);
  head.name = 'idol_head';
  head.position.set(0, 2.38, 0.12);
  root.add(head);

  // 6. Ears
  const ears = new THREE.Group();
  ears.name = 'idol_ears';
  [-0.68, 0.68].forEach((ex) => {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.08), mats.ganeshaSkinMaterial);
    ear.position.set(ex, 2.45, 0.05);
    ears.add(ear);
  });
  root.add(ears);

  // 7. Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.13, 0.22, 0.95, 14);
  const trunk = new THREE.Mesh(trunkGeo, mats.ganeshaSkinMaterial);
  trunk.name = 'idol_trunk';
  trunk.position.set(-0.16, 1.85, 0.48);
  trunk.rotation.z = -0.32;
  root.add(trunk);

  // 8. Crown
  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.2, 16), mats.ganeshaCrownMaterial);
  crown.name = 'idol_crown';
  crown.position.set(0, 3.2, 0.04);
  root.add(crown);

  // 9. Prabhavali Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.09, 10, 28), mats.ganeshaGoldMaterial);
  halo.name = 'idol_prabhavali';
  halo.position.set(0, 2.45, -0.3);
  root.add(halo);

  return root;
}

/**
 * =========================================================================
 * 19. GRAND ASSEMBLY PANDAL SANCTUARY MESH (Temple Pavilion for Victory)
 * =========================================================================
 */
export function createGrandAssemblyPandalMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'GrandAssemblyPandalGroup';
  const mats = MaterialLibrary.get();

  // Grand Sandstone Platform Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.6, 28), mats.sandstoneMaterial);
  floor.position.set(0, -0.3, 0);
  floor.receiveShadow = true;
  group.add(floor);

  // High-Definition Altar Rangoli Carpet
  const rangoliPlane = new THREE.Mesh(
    new THREE.CircleGeometry(7.2, 36),
    mats.altarRangoliMaterial
  );
  rangoliPlane.rotation.x = -Math.PI / 2;
  rangoliPlane.position.set(0, 0.03, 0);
  group.add(rangoliPlane);

  // Center Elevated Marble Altar Pedestal for the Deity
  const altarPlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.9, 0.45, 20),
    mats.ganeshaPedestalMarbleMaterial
  );
  altarPlatform.position.set(0, 0.22, 0);
  altarPlatform.receiveShadow = true;
  altarPlatform.castShadow = true;
  group.add(altarPlatform);

  // Stepped Gold Base Ring
  const altarGoldRing = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 2.5, 0.15, 28),
    mats.ganeshaGoldMaterial
  );
  altarGoldRing.position.set(0, 0.48, 0);
  group.add(altarGoldRing);

  // 4 Grand Carved Temple Pillars with Golden Capitals
  const pillarOffsets = [
    { x: -7.0, z: -7.0 },
    { x: 7.0, z: -7.0 },
    { x: -7.0, z: 7.0 },
    { x: 7.0, z: 7.0 },
  ];

  pillarOffsets.forEach((pos) => {
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.9, 1.6),
      mats.sandstoneMaterial
    );
    plinth.position.set(pos.x, 0.45, pos.z);
    group.add(plinth);

    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 8.0, 16),
      mats.ganeshaGoldMaterial
    );
    col.position.set(pos.x, 4.5, pos.z);
    col.castShadow = true;
    group.add(col);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.7, 1.8),
      mats.sandstoneMaterial
    );
    cap.position.set(pos.x, 8.8, pos.z);
    group.add(cap);
  });

  // Royal Golden & Crimson Canopy Roof (Shikhara Pavilion)
  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(11.8, 4.8, 8),
    mats.rubyCrimsonMaterial
  );
  canopy.position.set(0, 11.2, 0);
  group.add(canopy);

  // Golden Spire Finial (Kalash)
  const roofSpire = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 2.8, 10),
    mats.ganeshaGoldMaterial
  );
  roofSpire.position.set(0, 14.2, 0);
  group.add(roofSpire);

  // Hanging Marigold Flower Garlands & Festive Torans
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const gx = Math.cos(angle) * 8.2;
    const gz = Math.sin(angle) * 8.2;
    for (let j = 0; j < 14; j++) {
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        j % 2 === 0 ? mats.marigoldOrangeMaterial : mats.marigoldYellowMaterial
      );
      flower.position.set(gx, 8.2 - j * 0.48, gz);
      group.add(flower);
    }
  }

  // ATTACH THE HIGH-DEFINITION LORD GANESHA IDOL IN THE ALTAR CENTER
  try {
    const idolParts = createLordGaneshaIdolModel();
    const idolRoot = idolParts.rootGroup;
    idolRoot.name = 'lord_ganesha_idol';
    idolRoot.position.set(0, 0.52, 0);
    group.add(idolRoot);
  } catch (err) {
    console.error('Failed to create high-definition Ganesha idol, fallback engaged:', err);
    const fallbackIdol = createProceduralFallbackGaneshaIdol();
    fallbackIdol.position.set(0, 0.52, 0);
    group.add(fallbackIdol);
  }

  return group;
}



