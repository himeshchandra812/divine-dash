import * as THREE from 'three';
import { GAME_CONSTANTS, FESTIVAL_STAGES, IDOL_PIECES } from './constants';
import { 
  MaterialLibrary, 
  createModakMesh, 
  createBlessingTokenMesh,
  createPowerUpMesh, 
  createIdolPieceMesh,
  createLowHurdleMesh, 
  createHighBannerMesh, 
  createTallPillarMesh, 
  createFestivalCartMesh, 
  createRampMesh, 
  createFlowerBoxMesh,
  createFestivalBarricadeMesh,
  createFestivalPandalMesh,
  createDholTashaEnsembleMesh,
  createCrowdCheeringStripMesh,
  createStreetBuildingMesh, 
  createStreetPlanterMesh,
  createFestivalStreetLampMesh,
  createSkyLanternMesh, 
  createTempleGateArchMesh,
  createCitySkylineMesh,
  createRoadsideBannerPost,
  createOverheadBuntingMesh
} from './models';
import { PowerUpType, IdolPieceId } from '../types';

export interface WorldObstacle {
  mesh: THREE.Group;
  type: string;
  lane: number;
  z: number;
  active: boolean;
  isRamp?: boolean;
  collider?: { min: THREE.Vector3; max: THREE.Vector3 };
  rampStart?: number;
  rampEnd?: number;
  platformStart?: number;
  platformEnd?: number;
  rampHeight?: number;
}

export interface WorldCollectible {
  mesh: THREE.Group;
  isModak: boolean;
  isBlessingToken?: boolean;
  isIdolPiece?: boolean;
  idolPieceId?: IdolPieceId;
  powerUpType?: PowerUpType;
  lane: number;
  z: number;
  y: number;
  active: boolean;
  collected: boolean;
}

export interface StreetChunk {
  group: THREE.Group;
  z: number;
  obstacles: WorldObstacle[];
  collectibles: WorldCollectible[];
  lanterns: THREE.Group[];
}

export class WorldManager {
  public scene: THREE.Scene;
  public chunks: StreetChunk[] = [];
  
  // Object Pools
  private modakPool: THREE.Group[] = [];
  private blessingTokenPool: THREE.Group[] = [];
  private powerUpPool: Map<PowerUpType, THREE.Group[]> = new Map();
  private idolPiecePool: Map<IdolPieceId, THREE.Group> = new Map();
  private obstaclePools: Map<string, THREE.Group[]> = new Map();

  // Track collected and actively spawned idol pieces
  public collectedPieceIds: Set<IdolPieceId> = new Set();
  public spawnedPieceIds: Set<IdolPieceId> = new Set();

  // Floating Lanterns
  private skyLanterns: { mesh: THREE.Group; baseY: number; floatSpeed: number; swaySpeed: number; offset: number }[] = [];

  // Distant City Skyline
  private skylineMesh?: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initPools();
    this.initSkyline();
    this.initInitialWorld();
  }

  private initSkyline() {
    this.skylineMesh = createCitySkylineMesh();
    this.scene.add(this.skylineMesh);
  }

  private initPools() {
    // 1. Modaks Pool (60 pre-allocated)
    for (let i = 0; i < 60; i++) {
      const modak = createModakMesh();
      modak.visible = false;
      this.scene.add(modak);
      this.modakPool.push(modak);
    }

    // 2. Blessing Tokens Pool (20 pre-allocated)
    for (let i = 0; i < 20; i++) {
      const token = createBlessingTokenMesh();
      token.visible = false;
      this.scene.add(token);
      this.blessingTokenPool.push(token);
    }

    // 3. 6 Sacred Idol Quest Collectible Pieces Pool
    const pieceIds: IdolPieceId[] = ['base', 'ornaments', 'hands', 'ears', 'trunk', 'crown'];
    pieceIds.forEach((pId) => {
      const pMesh = createIdolPieceMesh(pId);
      pMesh.visible = false;
      this.scene.add(pMesh);
      this.idolPiecePool.set(pId, pMesh);
    });

    // 4. Power-ups Pool
    const pTypes: PowerUpType[] = ['magnet', 'shield', 'multiplier', 'boost'];
    pTypes.forEach((type) => {
      this.powerUpPool.set(type, []);
      for (let i = 0; i < 4; i++) {
        const pMesh = createPowerUpMesh(type);
        pMesh.visible = false;
        this.scene.add(pMesh);
        this.powerUpPool.get(type)!.push(pMesh);
      }
    });

    // 5. Obstacle Pools
    const obstacleTypes = [
      'low_hurdle',
      'high_banner',
      'tall_pillar',
      'festival_cart',
      'wooden_ramp',
      'flower_crate',
      'festival_barricade'
    ];

    obstacleTypes.forEach((type) => {
      this.obstaclePools.set(type, []);
      for (let i = 0; i < 8; i++) {
        const obsMesh = this.instantiateObstacle(type);
        obsMesh.visible = false;
        this.scene.add(obsMesh);
        this.obstaclePools.get(type)!.push(obsMesh);
      }
    });
  }


  private instantiateObstacle(type: string): THREE.Group {
    if (type === 'low_hurdle') return createLowHurdleMesh();
    if (type === 'high_banner') return createHighBannerMesh();
    if (type === 'tall_pillar') return createTallPillarMesh();
    if (type === 'festival_cart') return createFestivalCartMesh();
    if (type === 'flower_crate') return createFlowerBoxMesh();
    if (type === 'festival_barricade') return createFestivalBarricadeMesh();
    return createRampMesh();
  }

  private getPooledObstacle(type: string): THREE.Group {
    const pool = this.obstaclePools.get(type);
    if (pool && pool.length > 0) {
      for (const item of pool) {
        if (!item.visible) {
          item.visible = true;
          return item;
        }
      }
    }
    // Fallback if pool exhausted
    const newMesh = this.instantiateObstacle(type);
    this.scene.add(newMesh);
    if (pool) pool.push(newMesh);
    return newMesh;
  }

  private getPooledModak(): THREE.Group {
    for (const m of this.modakPool) {
      if (!m.visible) {
        m.visible = true;
        return m;
      }
    }
    const newM = createModakMesh();
    this.scene.add(newM);
    this.modakPool.push(newM);
    return newM;
  }

  private getPooledBlessingToken(): THREE.Group {
    for (const t of this.blessingTokenPool) {
      if (!t.visible) {
        t.visible = true;
        return t;
      }
    }
    const newT = createBlessingTokenMesh();
    this.scene.add(newT);
    this.blessingTokenPool.push(newT);
    return newT;
  }

  private getPooledPowerUp(type: PowerUpType): THREE.Group {
    const pool = this.powerUpPool.get(type);
    if (pool) {
      for (const p of pool) {
        if (!p.visible) {
          p.visible = true;
          return p;
        }
      }
    }
    const newP = createPowerUpMesh(type);
    this.scene.add(newP);
    if (pool) pool.push(newP);
    return newP;
  }

  public getStageForDistance(distance: number): 1 | 2 | 3 {
    if (distance >= FESTIVAL_STAGES[2].threshold) return 3;
    if (distance >= FESTIVAL_STAGES[1].threshold) return 2;
    return 1;
  }


  private initInitialWorld() {
    // Generate initial chunks: start BEHIND_CHUNKS behind the player (positive Z)
    // and up to ACTIVE_CHUNKS ahead of player (negative Z)
    const behindChunks = GAME_CONSTANTS.BEHIND_CHUNKS ?? 2;
    const startI = -behindChunks;
    const endI = GAME_CONSTANTS.ACTIVE_CHUNKS - behindChunks;

    for (let i = startI; i < endI; i++) {
      const zPos = -i * GAME_CONSTANTS.CHUNK_LENGTH;
      const isStartChunk = i <= 1; // Safe starting zone
      this.spawnChunk(zPos, isStartChunk);
    }
  }

  private spawnChunk(chunkZ: number, isSafe: boolean = false) {
    const chunkGroup = new THREE.Group();
    chunkGroup.position.z = chunkZ;

    const mats = MaterialLibrary.get();

    // 1. Street Cobblestone Road Ground
    const roadGeo = new THREE.PlaneGeometry(GAME_CONSTANTS.ROAD_WIDTH, GAME_CONSTANTS.CHUNK_LENGTH);
    const road = new THREE.Mesh(roadGeo, mats.streetMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
    road.receiveShadow = true;
    chunkGroup.add(road);

    // 2. Sandstone Curbs & Spacious Sidewalks on left & right (5.2m wide)
    const sidewalkWidth = 5.2;
    const sidewalkGeo = new THREE.BoxGeometry(sidewalkWidth, 0.3, GAME_CONSTANTS.CHUNK_LENGTH);
    const sidewalkL = new THREE.Mesh(sidewalkGeo, mats.sandstoneMaterial);
    sidewalkL.position.set(-GAME_CONSTANTS.ROAD_WIDTH / 2 - sidewalkWidth / 2, 0.15, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
    sidewalkL.receiveShadow = true;
    chunkGroup.add(sidewalkL);

    const sidewalkR = new THREE.Mesh(sidewalkGeo, mats.sandstoneMaterial);
    sidewalkR.position.set(GAME_CONSTANTS.ROAD_WIDTH / 2 + sidewalkWidth / 2, 0.15, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
    sidewalkR.receiveShadow = true;
    chunkGroup.add(sidewalkR);

    // Cheering Festival Crowd Silhouettes along the sidewalk outer edges
    const crowdL = createCrowdCheeringStripMesh(GAME_CONSTANTS.CHUNK_LENGTH);
    crowdL.position.set(-GAME_CONSTANTS.ROAD_WIDTH / 2 - sidewalkWidth + 0.8, 0.3, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
    crowdL.rotation.y = Math.PI / 2;
    chunkGroup.add(crowdL);

    const crowdR = createCrowdCheeringStripMesh(GAME_CONSTANTS.CHUNK_LENGTH);
    crowdR.position.set(GAME_CONSTANTS.ROAD_WIDTH / 2 + sidewalkWidth - 0.8, 0.3, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
    crowdR.rotation.y = -Math.PI / 2;
    chunkGroup.add(crowdR);

    // Potted Terracotta Marigold Planters along the curb edge
    [-8, -20, -34, -46].forEach((pz) => {
      const planterL = createStreetPlanterMesh();
      planterL.position.set(-GAME_CONSTANTS.ROAD_WIDTH / 2 - 0.55, 0.3, pz);
      chunkGroup.add(planterL);

      const planterR = createStreetPlanterMesh();
      planterR.position.set(GAME_CONSTANTS.ROAD_WIDTH / 2 + 0.55, 0.3, pz - 4);
      chunkGroup.add(planterR);
    });

    // Festival Street Lamps with Glowing Lanterns
    [-14, -38].forEach((lz) => {
      const lampL = createFestivalStreetLampMesh();
      lampL.position.set(-GAME_CONSTANTS.ROAD_WIDTH / 2 - 1.2, 0.3, lz);
      chunkGroup.add(lampL);

      const lampR = createFestivalStreetLampMesh();
      lampR.position.set(GAME_CONSTANTS.ROAD_WIDTH / 2 + 1.2, 0.3, lz);
      lampR.rotation.y = Math.PI;
      chunkGroup.add(lampR);
    });

    // Current stage for thematic props
    const currentStage = this.getStageForDistance(Math.abs(chunkZ));
    const chunkIndex = Math.floor(Math.abs(chunkZ) / GAME_CONSTANTS.CHUNK_LENGTH);

    // 3. Buildings along the street sides (Open vista placed 14m from center)
    let bIndex = chunkIndex * 4;
    for (let z = -6; z > -GAME_CONSTANTS.CHUNK_LENGTH; z -= 14) {
      const bL = createStreetBuildingMesh(true, bIndex);
      bL.position.set(-GAME_CONSTANTS.ROAD_WIDTH / 2 - sidewalkWidth - 4.2, 0, z);
      chunkGroup.add(bL);

      const bR = createStreetBuildingMesh(false, bIndex + 1);
      bR.position.set(GAME_CONSTANTS.ROAD_WIDTH / 2 + sidewalkWidth + 4.2, 0, z - 3);
      chunkGroup.add(bR);
      bIndex++;
    }

    // 4. Grand Ganesh Chaturthi Pandal (Placed respectfully on the roadside sidewalk)
    // Alternate between left and right sides every 2 chunks
    if (chunkIndex >= 1 && chunkIndex % 2 === 1) {
      const isPandalLeft = chunkIndex % 4 === 1;
      const pandal = createFestivalPandalMesh(currentStage, isPandalLeft);
      const pandalX = isPandalLeft
        ? -GAME_CONSTANTS.ROAD_WIDTH / 2 - sidewalkWidth - 2.5
        : GAME_CONSTANTS.ROAD_WIDTH / 2 + sidewalkWidth + 2.5;
      pandal.position.set(pandalX, 0, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
      chunkGroup.add(pandal);

      // Traditional Dhol-Tasha ensemble placed on the opposite sidewalk
      const dholEnsemble = createDholTashaEnsembleMesh();
      const dholX = isPandalLeft
        ? GAME_CONSTANTS.ROAD_WIDTH / 2 + 2.8
        : -GAME_CONSTANTS.ROAD_WIDTH / 2 - 2.8;
      dholEnsemble.position.set(dholX, 0.3, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
      if (isPandalLeft) dholEnsemble.rotation.y = -Math.PI / 2;
      else dholEnsemble.rotation.y = Math.PI / 2;
      chunkGroup.add(dholEnsemble);
    }

    // 5. Overhead Temple Gate Arch every 3 chunks
    if (Math.abs(chunkZ) % (GAME_CONSTANTS.CHUNK_LENGTH * 3) === 0 && chunkIndex > 0) {
      const arch = createTempleGateArchMesh();
      arch.position.set(0, 0, -GAME_CONSTANTS.CHUNK_LENGTH / 2);
      chunkGroup.add(arch);
    }

    // 6. Overhead Festival Bunting (Strings of colorful fluttering pennant flags)
    const bunting1 = createOverheadBuntingMesh(GAME_CONSTANTS.ROAD_WIDTH);
    bunting1.position.set(0, 0, -10);
    chunkGroup.add(bunting1);

    const bunting2 = createOverheadBuntingMesh(GAME_CONSTANTS.ROAD_WIDTH);
    bunting2.position.set(0, 0, -30);
    chunkGroup.add(bunting2);

    // 7. Roadside Hanging Banners ("गणपती बाप्पा मोरया" on left, "॥ गणेशोत्सव ॥" on right)
    // Placed prominently on sidewalk edges matching reference image
    const bannerPostL = createRoadsideBannerPost(true);
    bannerPostL.position.set(-GAME_CONSTANTS.ROAD_WIDTH / 2 - 1.8, 0.3, -16);
    chunkGroup.add(bannerPostL);

    const bannerPostR = createRoadsideBannerPost(false);
    bannerPostR.position.set(GAME_CONSTANTS.ROAD_WIDTH / 2 + 1.8, 0.3, -24);
    chunkGroup.add(bannerPostR);

    // 8. Sky Lanterns in background
    const chunkLanterns: THREE.Group[] = [];
    for (let l = 0; l < 3; l++) {
      const lantern = createSkyLanternMesh();
      const lx = (Math.random() - 0.5) * 28;
      const ly = 10 + Math.random() * 14;
      const lz = -Math.random() * GAME_CONSTANTS.CHUNK_LENGTH;
      lantern.position.set(lx, ly, lz);
      chunkGroup.add(lantern);
      chunkLanterns.push(lantern);

      this.skyLanterns.push({
        mesh: lantern,
        baseY: ly,
        floatSpeed: 0.5 + Math.random() * 0.5,
        swaySpeed: 1.0 + Math.random() * 1.5,
        offset: Math.random() * 10,
      });
    }

    this.scene.add(chunkGroup);

    const chunkData: StreetChunk = {
      group: chunkGroup,
      z: chunkZ,
      obstacles: [],
      collectibles: [],
      lanterns: chunkLanterns,
    };

    // 7. Spawn Obstacles & Collectibles (if not safe start chunk)
    if (!isSafe) {
      this.populateChunkGameplay(chunkData);
    } else {
      // Safe introductory modak trail
      this.spawnModakLine(chunkData, 0, -10, 8);
      // First blessing token as an easy introduction!
      this.spawnBlessingToken(chunkData, 0, -32);
    }

    this.chunks.push(chunkData);
  }

  private populateChunkGameplay(chunk: StreetChunk) {
    const lanes = [-1, 0, 1] as const;

    // Check if a sacred Idol Piece is due to spawn in this chunk
    const chunkDist = Math.abs(chunk.z);
    const pieceToSpawn = IDOL_PIECES.find(
      p => !this.collectedPieceIds.has(p.id) && !this.spawnedPieceIds.has(p.id) && chunkDist >= (p.targetDistance - 30)
    );

    if (pieceToSpawn) {
      // Spawn Sacred Idol Piece with a grand welcoming golden pathway
      const targetLane = 0; // Sacred center lane
      this.spawnIdolPiece(chunk, pieceToSpawn.id, targetLane, -25, 1.3);
      this.spawnedPieceIds.add(pieceToSpawn.id);

      // Preceding and trailing modak trail leading right through the piece
      this.spawnModakLine(chunk, targetLane, -8, 5);
      this.spawnModakLine(chunk, targetLane, -32, 5);

      // Side hurdles on outer lanes leaving center clear
      [-1, 1].forEach((l) => {
        const obsType = Math.random() > 0.5 ? 'flower_crate' : 'low_hurdle';
        const obsMesh = this.getPooledObstacle(obsType);
        obsMesh.position.set(GAME_CONSTANTS.LANE_POSITIONS[l + 1], 0, chunk.z - 24);
        chunk.obstacles.push({
          mesh: obsMesh,
          type: obsType,
          lane: l,
          z: chunk.z - 24,
          active: true,
          collider: obsMesh.userData.collider,
        });
      });

      return;
    }

    const patternRoll = Math.random();


    if (patternRoll < 0.22) {
      // Pattern 1: Wooden Ramp with elevated golden modak bridge & Blessing Token!
      const rampLane = lanes[Math.floor(Math.random() * 3)];
      const rampZ = -18;
      const rampMesh = this.getPooledObstacle('wooden_ramp');
      const laneX = GAME_CONSTANTS.LANE_POSITIONS[rampLane + 1];
      rampMesh.position.set(laneX, 0, chunk.z + rampZ);

      chunk.obstacles.push({
        mesh: rampMesh,
        type: 'wooden_ramp',
        lane: rampLane,
        z: chunk.z + rampZ,
        active: true,
        isRamp: true,
        rampStart: chunk.z + rampZ + 3.0,
        rampEnd: chunk.z + rampZ - 3.0,
        platformStart: chunk.z + rampZ - 3.0,
        platformEnd: chunk.z + rampZ - 10.0,
        rampHeight: 1.8,
      });

      // Modaks along the top of the ramp
      for (let i = 0; i < 5; i++) {
        const modakMesh = this.getPooledModak();
        const mZ = chunk.z + rampZ - (i * 2.0);
        const mY = (i < 2) ? 0.8 + i * 0.5 : 2.4;
        modakMesh.position.set(laneX, mY, mZ);
        chunk.collectibles.push({
          mesh: modakMesh,
          isModak: true,
          lane: rampLane,
          z: mZ,
          y: mY,
          active: true,
          collected: false,
        });
      }

      // High-value Blessing Token at the end of the elevated ramp!
      this.spawnBlessingToken(chunk, rampLane, rampZ - 10.5, 2.6);

      // Other lanes get hurdle or flower box
      const otherLanes = lanes.filter(l => l !== rampLane);
      const obsType = Math.random() > 0.5 ? 'flower_crate' : 'low_hurdle';
      const otherLane = otherLanes[Math.floor(Math.random() * otherLanes.length)];
      const obsMesh = this.getPooledObstacle(obsType);
      const obsX = GAME_CONSTANTS.LANE_POSITIONS[otherLane + 1];
      obsMesh.position.set(obsX, 0, chunk.z - 32);

      chunk.obstacles.push({
        mesh: obsMesh,
        type: obsType,
        lane: otherLane,
        z: chunk.z - 32,
        active: true,
        collider: obsMesh.userData.collider,
      });

    } else if (patternRoll < 0.48) {
      // Pattern 2: Flower Crates & Toran Banners with Jump Modak Arc
      const obs1Lane = lanes[Math.floor(Math.random() * 3)];
      const obs1Type = Math.random() > 0.5 ? 'flower_crate' : 'low_hurdle';
      const obs1Mesh = this.getPooledObstacle(obs1Type);
      obs1Mesh.position.set(GAME_CONSTANTS.LANE_POSITIONS[obs1Lane + 1], 0, chunk.z - 12);
      chunk.obstacles.push({
        mesh: obs1Mesh,
        type: obs1Type,
        lane: obs1Lane,
        z: chunk.z - 12,
        active: true,
        collider: obs1Mesh.userData.collider,
      });

      // Modak jump arc over hurdle
      this.spawnModakArc(chunk, obs1Lane, -12);

      // Second obstacle: Silk Toran Banner or Barricade
      const obs2Lanes = lanes.filter(l => l !== obs1Lane);
      const obs2Lane = obs2Lanes[Math.floor(Math.random() * obs2Lanes.length)];
      const obs2Type = Math.random() > 0.5 ? 'high_banner' : 'festival_barricade';
      const obs2Mesh = this.getPooledObstacle(obs2Type);
      obs2Mesh.position.set(GAME_CONSTANTS.LANE_POSITIONS[obs2Lane + 1], 0, chunk.z - 34);
      chunk.obstacles.push({
        mesh: obs2Mesh,
        type: obs2Type,
        lane: obs2Lane,
        z: chunk.z - 34,
        active: true,
        collider: obs2Mesh.userData.collider,
      });

      // Open lane gets powerup or blessing token
      const freeLane = lanes.find(l => l !== obs1Lane && l !== obs2Lane) ?? 0;
      if (Math.random() < 0.35) {
        this.spawnPowerUp(chunk, freeLane, -26);
      } else if (Math.random() < 0.35) {
        this.spawnBlessingToken(chunk, freeLane, -26);
      } else {
        this.spawnModakLine(chunk, freeLane, -22, 5);
      }

    } else if (patternRoll < 0.74) {
      // Pattern 3: Festival Market Cart & Tall Sandstone Pillars
      const cartLane = lanes[Math.floor(Math.random() * 3)];
      const cartMesh = this.getPooledObstacle('festival_cart');
      cartMesh.position.set(GAME_CONSTANTS.LANE_POSITIONS[cartLane + 1], 0, chunk.z - 20);
      chunk.obstacles.push({
        mesh: cartMesh,
        type: 'festival_cart',
        lane: cartLane,
        z: chunk.z - 20,
        active: true,
        collider: cartMesh.userData.collider,
      });

      // Festival barricade on another lane
      const barLane = lanes[(cartLane + 2) % 3];
      const barMesh = this.getPooledObstacle('festival_barricade');
      barMesh.position.set(GAME_CONSTANTS.LANE_POSITIONS[barLane + 1], 0, chunk.z - 38);
      chunk.obstacles.push({
        mesh: barMesh,
        type: 'festival_barricade',
        lane: barLane,
        z: chunk.z - 38,
        active: true,
        collider: barMesh.userData.collider,
      });

      // Modak lines on the open path
      const freeLane = lanes.find(l => l !== cartLane) ?? 0;
      this.spawnModakLine(chunk, freeLane, -12, 6);
      this.spawnBlessingToken(chunk, freeLane, -32);

    } else {
      // Pattern 4: Double Hurdles (Banner + Pillar / Barricade) with Golden Center Path
      const laneA = -1;
      const laneC = 1;

      const meshA = this.getPooledObstacle('high_banner');
      meshA.position.set(GAME_CONSTANTS.LANE_POSITIONS[laneA + 1], 0, chunk.z - 22);
      chunk.obstacles.push({
        mesh: meshA,
        type: 'high_banner',
        lane: laneA,
        z: chunk.z - 22,
        active: true,
        collider: meshA.userData.collider,
      });

      const meshC = this.getPooledObstacle('tall_pillar');
      meshC.position.set(GAME_CONSTANTS.LANE_POSITIONS[laneC + 1], 0, chunk.z - 22);
      chunk.obstacles.push({
        mesh: meshC,
        type: 'tall_pillar',
        lane: laneC,
        z: chunk.z - 22,
        active: true,
        collider: meshC.userData.collider,
      });

      // Golden path right down the middle with power-up & modaks
      if (Math.random() < 0.5) {
        this.spawnPowerUp(chunk, 0, -22);
      } else {
        this.spawnBlessingToken(chunk, 0, -22);
      }
      this.spawnModakLine(chunk, 0, -32, 6);
    }
  }

  public spawnBlessingToken(chunk: StreetChunk, lane: number, relativeZ: number, customY: number = 0.8) {
    const mesh = this.getPooledBlessingToken();
    const laneX = GAME_CONSTANTS.LANE_POSITIONS[lane + 1];
    const z = chunk.z + relativeZ;
    mesh.position.set(laneX, customY, z);

    chunk.collectibles.push({
      mesh,
      isModak: false,
      isBlessingToken: true,
      lane,
      z,
      y: customY,
      active: true,
      collected: false,
    });
  }

  public getPooledIdolPiece(pieceId: IdolPieceId): THREE.Group {
    let mesh = this.idolPiecePool.get(pieceId);
    if (!mesh) {
      mesh = createIdolPieceMesh(pieceId);
      this.scene.add(mesh);
      this.idolPiecePool.set(pieceId, mesh);
    }
    mesh.visible = true;
    return mesh;
  }

  public spawnIdolPiece(chunk: StreetChunk, pieceId: IdolPieceId, lane: number, relativeZ: number, customY: number = 1.3) {
    const mesh = this.getPooledIdolPiece(pieceId);
    const laneX = GAME_CONSTANTS.LANE_POSITIONS[lane + 1];
    const z = chunk.z + relativeZ;
    mesh.position.set(laneX, customY, z);

    chunk.collectibles.push({
      mesh,
      isModak: false,
      isIdolPiece: true,
      idolPieceId: pieceId,
      lane,
      z,
      y: customY,
      active: true,
      collected: false,
    });
  }

  public setCollectedPieces(collectedIds: IdolPieceId[]) {
    this.collectedPieceIds = new Set(collectedIds);
  }

  private spawnModakLine(chunk: StreetChunk, lane: number, startRelativeZ: number, count: number) {

    const laneX = GAME_CONSTANTS.LANE_POSITIONS[lane + 1];
    for (let i = 0; i < count; i++) {
      const mesh = this.getPooledModak();
      const z = chunk.z + startRelativeZ - (i * 2.2);
      const y = 0.6;
      mesh.position.set(laneX, y, z);

      chunk.collectibles.push({
        mesh,
        isModak: true,
        lane,
        z,
        y,
        active: true,
        collected: false,
      });
    }
  }

  private spawnModakArc(chunk: StreetChunk, lane: number, centerRelativeZ: number) {
    const laneX = GAME_CONSTANTS.LANE_POSITIONS[lane + 1];
    const offsets = [-3.5, -1.8, 0, 1.8, 3.5];
    const heights = [0.6, 1.5, 2.2, 1.5, 0.6];

    offsets.forEach((oz, idx) => {
      const mesh = this.getPooledModak();
      const z = chunk.z + centerRelativeZ + oz;
      const y = heights[idx];
      mesh.position.set(laneX, y, z);

      chunk.collectibles.push({
        mesh,
        isModak: true,
        lane,
        z,
        y,
        active: true,
        collected: false,
      });
    });
  }

  private spawnPowerUp(chunk: StreetChunk, lane: number, relativeZ: number) {
    const types: PowerUpType[] = ['magnet', 'shield', 'multiplier', 'boost'];
    const type = types[Math.floor(Math.random() * types.length)];
    const mesh = this.getPooledPowerUp(type);
    const laneX = GAME_CONSTANTS.LANE_POSITIONS[lane + 1];
    const z = chunk.z + relativeZ;
    const y = 0.9;
    mesh.position.set(laneX, y, z);

    chunk.collectibles.push({
      mesh,
      isModak: false,
      powerUpType: type,
      lane,
      z,
      y,
      active: true,
      collected: false,
    });
  }

  public update(playerZ: number, delta: number) {
    const time = performance.now() * 0.001;

    // 1. Move Distant City Skyline with the player
    if (this.skylineMesh) {
      this.skylineMesh.position.z = playerZ - 260;
    }

    // 2. Animate Collectibles (Spinning modaks, rotating blessing tokens, idol pieces & powerups)
    const spinAngle = delta * 3.2;
    for (const chunk of this.chunks) {
      for (const item of chunk.collectibles) {
        if (item.active && !item.collected) {
          item.mesh.rotation.y += spinAngle;
          
          if (item.isBlessingToken) {
            item.mesh.position.y = item.y + Math.sin(time * 3.5 + item.z * 0.5) * 0.12;
            item.mesh.rotation.z = Math.sin(time * 2.0) * 0.08;
          } else if (item.isIdolPiece) {
            // Sacred bobbing and floating aura spin
            item.mesh.position.y = item.y + Math.sin(time * 2.8 + item.z * 0.4) * 0.18;
            const auraRing = item.mesh.getObjectByName('pieceAuraRing');
            if (auraRing) {
              auraRing.rotation.z += delta * 2.5;
              auraRing.rotation.x = Math.sin(time * 2.0) * 0.3;
            }
          }

          // Power-up extra spin
          if (item.mesh.userData.ring) {
            item.mesh.userData.ring.rotation.x += delta * 4.0;
          }
        }
      }
    }

    // 3. Animate Sky Lanterns gentle floating & swaying
    for (const lantern of this.skyLanterns) {
      lantern.mesh.position.y = lantern.baseY + Math.sin(time * lantern.floatSpeed + lantern.offset) * 0.8;
      lantern.mesh.rotation.z = Math.sin(time * lantern.swaySpeed + lantern.offset) * 0.12;
    }

    // 4. Check for chunk recycling (keep chunks behind player until completely out of camera view)
    const behindDistance = (GAME_CONSTANTS.BEHIND_CHUNKS ?? 2) * GAME_CONSTANTS.CHUNK_LENGTH;
    const recycleThreshold = playerZ + behindDistance;
    while (this.chunks.length > 0 && this.chunks[0].z > recycleThreshold) {
      const oldChunk = this.chunks.shift()!;
      this.recycleChunk(oldChunk);

      // Spawn next chunk in sequence far ahead
      const furthestZ = this.chunks[this.chunks.length - 1].z;
      const nextZ = furthestZ - GAME_CONSTANTS.CHUNK_LENGTH;
      this.spawnChunk(nextZ, false);
    }
  }

  private recycleChunk(chunk: StreetChunk) {
    // Return obstacles to pool
    for (const obs of chunk.obstacles) {
      obs.mesh.visible = false;
    }
    // Return collectibles to pool
    for (const col of chunk.collectibles) {
      col.mesh.visible = false;
      if (col.isIdolPiece && col.idolPieceId && !col.collected) {
        // Player missed this piece without collecting; release so it can re-spawn ahead!
        this.spawnedPieceIds.delete(col.idolPieceId);
      }
    }
    // Clean up lanterns associated with this chunk from skyLanterns animation list
    if (chunk.lanterns && chunk.lanterns.length > 0) {
      const lanternSet = new Set(chunk.lanterns);
      this.skyLanterns = this.skyLanterns.filter(l => !lanternSet.has(l.mesh));
    }
    // Remove chunk group from scene
    this.scene.remove(chunk.group);
  }

  public updateSkyTint(targetTint: THREE.Color, lerpFactor: number) {
    if (this.skylineMesh) {
      const skyPlane = this.skylineMesh.getObjectByName('skyBackdropPlane') as THREE.Mesh;
      if (skyPlane && skyPlane.material) {
        const mat = skyPlane.material as THREE.MeshBasicMaterial;
        mat.color.lerp(targetTint, lerpFactor);
      }
    }
  }

  public clearObstaclesNear(minZ: number, maxZ: number) {
    for (const chunk of this.chunks) {
      for (const obs of chunk.obstacles) {
        if (obs.z >= minZ && obs.z <= maxZ) {
          obs.active = false;
          obs.mesh.visible = false;
        }
      }
      for (const col of chunk.collectibles) {
        if (col.z >= minZ && col.z <= maxZ) {
          col.active = false;
          col.mesh.visible = false;
        }
      }
    }
  }

  public reset() {
    // Clean all active chunks
    for (const chunk of this.chunks) {
      this.recycleChunk(chunk);
    }
    this.chunks = [];
    this.skyLanterns = [];
    this.collectedPieceIds.clear();
    this.spawnedPieceIds.clear();
    this.initInitialWorld();
  }
}
