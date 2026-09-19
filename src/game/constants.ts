import * as THREE from 'three';

// Rich Indian Festival Palette
export const FESTIVAL_COLORS = {
  MARIGOLD_ORANGE: 0xff6b00,
  MARIGOLD_YELLOW: 0xffb800,
  TEMPLE_GOLD: 0xffd700,
  RUBY_CRIMSON: 0xd62246,
  PEACOCK_TEAL: 0x008080,
  ROYAL_INDIGO: 0x2b1055,
  ROYAL_PURPLE: 0x5a189a,
  LOTUS_PINK: 0xff4d8d,
  SAFFRON_BRIGHT: 0xff7700,
  SANDSTONE: 0xd4a373,
  TERRACOTTA: 0xbf5700,
  DEEP_SKY_NIGHT: 0x160c28,
  GOLDEN_GLOW: 0xfff2a3,
  WOOD_DARK: 0x4a2511,
  DIYA_FLAME: 0xffa000,
  EMERALD_GREEN: 0x2a9d8f,
};

export const FESTIVAL_STAGES = [
  {
    stage: 1 as const,
    name: 'Mandir Marg (Golden Hour Aarti)',
    subtitle: 'Neighborhood Pandals, Golden Sunlight & Floral Showers',
    threshold: 0,
    // Warm Golden-Hour Hue
    skyColor: 0xf59e72, // Warm golden-hour amber-peach
    fogColor: 0xf59e72,
    ambientColor: 0xffedd8, // Warm honey-gold ambient light
    ambientIntensity: 1.45,
    dirColor: 0xfff2cc, // Radiant golden afternoon sunlight
    dirIntensity: 2.6,
    dirAngle: { x: 14, y: 22, z: 16 },
    hemiSky: 0xffb703, // Amber-gold sky bounce
    hemiGround: 0x6e3828, // Terracotta ground bounce
    hemiIntensity: 1.25,
    skyTint: 0xfff8ee, // Pure bright golden daylight tint
    exposure: 1.20,
  },
  {
    stage: 2 as const,
    name: 'Dhol-Tasha Bazaar (Sunset Twilight)',
    subtitle: 'Festival Marketplace, Sunset Crimson & Dhol Celebrations',
    threshold: 400,
    // Sunset Dusk Transition
    skyColor: 0xb83b5e, // Sunset rose-crimson twilight
    fogColor: 0xb83b5e,
    ambientColor: 0xffcfb3, // Warm sunset rose-amber
    ambientIntensity: 1.35,
    dirColor: 0xff9e00, // Deep glowing sunset orange
    dirIntensity: 2.4,
    dirAngle: { x: 16, y: 18, z: 14 },
    hemiSky: 0xff7900, // Vibrant sunset orange sky glow
    hemiGround: 0x4a1835, // Sunset plum/purple earth
    hemiIntensity: 1.25,
    skyTint: 0xffa885, // Saffron-orange twilight tint
    exposure: 1.22,
  },
  {
    stage: 3 as const,
    name: 'Raj Marg Boulevard (Grand Evening)',
    subtitle: 'Illuminated Pandals, Royal Evening Purple & Vibrant Orange Glow',
    threshold: 900,
    // Vibrant Evening Purple and Orange
    skyColor: 0x220738, // Vibrant deep royal evening purple
    fogColor: 0x220738,
    ambientColor: 0x9d4edd, // Vibrant evening purple ambient glow
    ambientIntensity: 1.30,
    dirColor: 0xff6200, // Vibrant electric festive orange spotlight & lanterns
    dirIntensity: 2.65,
    dirAngle: { x: 17, y: 15, z: 12 },
    hemiSky: 0xff8500, // Electric festive orange sky glow & lanterns
    hemiGround: 0x280544, // Deep royal evening purple ground bounce
    hemiIntensity: 1.45,
    skyTint: 0xd175ff, // Vibrant evening royal purple-violet wash
    exposure: 1.28,
  },
];

export const GAME_CONSTANTS = {
  // Lanes (Spacious 3-Lane Festival Boulevard)
  LANE_SPACING: 2.8,
  LANE_POSITIONS: [-2.8, 0, 2.8] as const, // Lane -1, 0, 1
  LANE_SWITCH_SPEED: 15.0,

  // Speed & Distance
  INITIAL_SPEED: 22.0,
  MAX_SPEED: 52.0,
  SPEED_ACCELERATION: 0.28, // Speed increase per second
  BOOST_SPEED_MULTIPLIER: 1.85,

  // Physics
  GRAVITY: -42.0,
  JUMP_VELOCITY: 16.5,
  SLIDE_DURATION: 0.75, // in seconds

  // World Generation & Object Pooling
  CHUNK_LENGTH: 55.0,
  ACTIVE_CHUNKS: 10,
  BEHIND_CHUNKS: 2,
  FOG_NEAR: 120.0,
  FOG_FAR: 380.0,
  ROAD_WIDTH: 9.2,

  // Camera (Cinematic third-person endless runner view)
  CAMERA_OFFSET: new THREE.Vector3(0, 4.8, 7.2),
  CAMERA_LOOKAT_OFFSET: new THREE.Vector3(0, 2.0, -12.0),

  // Scoring
  MODAK_POINTS: 100,
  BLESSING_TOKEN_POINTS: 250,
  DISTANCE_POINTS_PER_SEC: 10,

  // Power-up durations
  MAGNET_DURATION: 10.0,
  SHIELD_DURATION: 15.0,
  MULTIPLIER_DURATION: 12.0,
  BOOST_DURATION: 6.5,
  MAGNET_RADIUS: 10.0,

  // Player Collider Dimensions
  PLAYER_NORMAL_HEIGHT: 1.8,
  PLAYER_SLIDE_HEIGHT: 0.7,
  PLAYER_WIDTH: 0.8,
  PLAYER_DEPTH: 0.8,
};

// 6 Sacred Ganpati Idol Quest Pieces
export const IDOL_PIECES = [
  {
    id: 'base' as const,
    name: 'Lotus Pedestal Base',
    sanskritName: 'पद्मासन (Padmasana)',
    description: 'Sacred carved marble & radiant golden pink lotus throne',
    stage: 1 as const,
    targetDistance: 110,
    icon: '🪷',
    color: '#ff4d8d',
  },
  {
    id: 'ornaments' as const,
    name: 'Sacred Floral Ornaments',
    sanskritName: 'अलंकार व पुष्पमाला (Alankara)',
    description: 'Golden pearl necklaces & fragrant marigold garland',
    stage: 1 as const,
    targetDistance: 270,
    icon: '🌺',
    color: '#ffb703',
  },
  {
    id: 'hands' as const,
    name: 'Sacred Blessing Hands',
    sanskritName: 'अभयमुद्रा व मोदक (Abhaya Mudra)',
    description: 'Divine hand granting fearlessness and holding golden modak',
    stage: 2 as const,
    targetDistance: 530,
    icon: '✋',
    color: '#00f5d4',
  },
  {
    id: 'ears' as const,
    name: 'Auspicious Attentive Ears',
    sanskritName: 'शूर्पकर्ण (Supakarna)',
    description: 'Large listening ears adorned with golden filigree kundalas',
    stage: 2 as const,
    targetDistance: 740,
    icon: '👂',
    color: '#d62246',
  },
  {
    id: 'trunk' as const,
    name: 'Curved Auspicious Trunk',
    sanskritName: 'वक्रतुण्ड (Vakratunda)',
    description: 'Graceful trunk decorated with holy Chandan tilak',
    stage: 3 as const,
    targetDistance: 990,
    icon: '🐘',
    color: '#fb8500',
  },
  {
    id: 'crown' as const,
    name: 'Grand Golden Crown',
    sanskritName: 'दिव्य मुकुट (Divya Mukut)',
    description: 'Radiant jeweled crown of Lord Ganesha with peacock plume',
    stage: 3 as const,
    targetDistance: 1200,
    icon: '👑',
    color: '#ffd700',
  },
];

export const MILESTONE_MESSAGES = {
  PIECE_COLLECTED: [
    'Padmasana Base Secured! The foundation is ready!',
    'Sacred Ornaments Adorned! Radiating festive beauty!',
    'Abhaya Mudra Gathered! Divine blessings bestowed!',
    'Supakarna Ears Collected! Listening to prayers!',
    'Vakratunda Trunk Received! Almost ready for celebration!',
    'Divya Mukut Crown Collected! All 6 Sacred Pieces Gathered!',
  ],
  APPROACHING_PANDAL: 'Entering the Grand Celebration Pandal!',
};

