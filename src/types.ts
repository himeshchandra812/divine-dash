export type Lane = -1 | 0 | 1;

export type ObstacleType = 
  | 'low_hurdle'          // Jump over or switch lane (marigold barrier)
  | 'high_banner'         // Slide under or switch lane (silk toran)
  | 'tall_pillar'         // Must switch lane (sandstone pillar)
  | 'festival_cart'       // Wide obstacle blocking 1 lane (bazaar cart)
  | 'wooden_ramp'         // Walk up onto elevated path
  | 'flower_crate'        // Marigold flower crates (jump over or dodge)
  | 'festival_barricade'; // Decorative festival barricade with diyas

export type PowerUpType = 
  | 'magnet'      // Pulls all nearby modaks and tokens
  | 'shield'      // Protects from 1 collision
  | 'multiplier'  // 2x score for 10 seconds
  | 'boost';      // High-speed invincible dash for 6 seconds

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
  duration: number;
}

export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface GameSettings {
  quality: GraphicsQuality;
  musicVolume: number;
  sfxVolume: number;
  muted?: boolean;
  bloom: boolean;
  shadows: boolean;
}

export type IdolPieceId = 
  | 'base'        // Lotus Pedestal Base (Padmasana)
  | 'ornaments'   // Sacred Ornaments & Floral Garland
  | 'hands'       // Sacred Blessing Hands (Abhaya Mudra)
  | 'ears'        // Auspicious Large Ears (Supakarna)
  | 'trunk'       // Curved Trunk (Vakratunda)
  | 'crown';      // Grand Golden Crown (Mukut)

export interface IdolPieceDefinition {
  id: IdolPieceId;
  name: string;
  sanskritName: string;
  description: string;
  stage: 1 | 2 | 3;
  targetDistance: number;
  icon: string;
  color: string;
}

export interface GameStats {
  score: number;
  distance: number;
  modaks: number;
  blessingTokens: number;
  highScore: number;
  speed: number;
  multiplier: number;
  activePowerUps: ActivePowerUp[];
  stage: 1 | 2 | 3;
  stageName: string;
  collectedPieces: IdolPieceId[];
  totalPieces: number;
  recentMilestoneMessage: string | null;
  milestoneMessageTimer: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'assembling' | 'victory';

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

