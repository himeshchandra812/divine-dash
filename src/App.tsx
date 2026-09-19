import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/gameEngine';
import { HUD } from './components/HUD';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { MobileControls } from './components/MobileControls';
import { soundEngine } from './audio/soundEngine';
import { GameStats, GameSettings, GameStatus, GraphicsQuality } from './types';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    modaks: 0,
    blessingTokens: 0,
    stage: 1,
    stageName: 'Mandir Marg',
    highScore: 0,
    speed: 22.0,
    multiplier: 1,
    activePowerUps: [],
    collectedPieces: [],
    totalPieces: 6,
    recentMilestoneMessage: null,
    milestoneMessageTimer: 0,
  });

  const [settings, setSettings] = useState<GameSettings>({
    quality: 'high',
    musicVolume: 0.5,
    sfxVolume: 0.7,
    bloom: true,
    shadows: true,
  });

  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Touch Swipe tracking
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Initialize Three.js Game Engine
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const engine = new GameEngine(containerRef.current);
      engineRef.current = engine;

      engine.onStatsUpdate = (newStats) => {
        setStats(newStats);
        if (engine.status !== gameStatus && (engine.status === 'assembling' || engine.status === 'victory')) {
          setGameStatus(engine.status);
        }
      };

      engine.onGameOver = (finalStats) => {
        setStats(finalStats);
        setGameStatus('gameover');
      };

      engine.onVictory = (finalStats) => {
        setStats(finalStats);
        setGameStatus('victory');
      };

      engine.onNewHighScore = () => {
        setIsNewHigh(true);
      };

      // Load initial high score
      setStats((prev) => ({ ...prev, highScore: engine.stats.highScore }));
      setInitError(null);
    } catch (err: unknown) {
      console.error('Failed to initialize Three.js Game Engine:', err);
      setInitError(err instanceof Error ? err.message : 'WebGL Initialization Error');
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Update Settings in Engine and Sound
  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    soundEngine.setVolumes(newSettings.musicVolume, newSettings.sfxVolume);
    if (engineRef.current) {
      engineRef.current.applyQualitySettings(newSettings.quality);
      engineRef.current.settings = newSettings;
    }
  }, []);

  const handleStartGame = useCallback(() => {
    setIsNewHigh(false);
    if (engineRef.current) {
      engineRef.current.start();
      setGameStatus('playing');
    }
  }, []);

  const handlePauseGame = useCallback(() => {
    if (engineRef.current && gameStatus === 'playing') {
      engineRef.current.pause();
      setGameStatus('paused');
    }
  }, [gameStatus]);

  const handleResumeGame = useCallback(() => {
    if (engineRef.current && gameStatus === 'paused') {
      engineRef.current.resume();
      setGameStatus('playing');
    }
  }, [gameStatus]);

  const handleRestartGame = useCallback(() => {
    setIsNewHigh(false);
    if (engineRef.current) {
      engineRef.current.restart();
      setGameStatus('playing');
    }
  }, []);

  const handleMainMenu = useCallback(() => {
    setIsNewHigh(false);
    if (engineRef.current) {
      engineRef.current.restart();
      engineRef.current.status = 'idle';
    }
    setGameStatus('idle');
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (gameStatus === 'idle') {
        if (e.code === 'Space' || e.code === 'Enter') {
          handleStartGame();
        }
        return;
      }

      if (gameStatus === 'gameover' || gameStatus === 'victory') {
        if (e.code === 'Space' || e.code === 'Enter') {
          handleRestartGame();
        }
        return;
      }

      if (gameStatus === 'paused') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          handleResumeGame();
        }
        return;
      }

      if (gameStatus === 'playing' && engineRef.current) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          engineRef.current.switchLaneLeft();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          engineRef.current.switchLaneRight();
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
          engineRef.current.jump();
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          engineRef.current.slide();
        } else if (e.code === 'Escape' || e.code === 'KeyP') {
          handlePauseGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, handleStartGame, handleRestartGame, handleResumeGame, handlePauseGame]);

  // Touch Swipe Gesture Listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !engineRef.current || gameStatus !== 'playing') return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const minSwipeDist = 25; // threshold in px

    if (Math.max(absX, absY) > minSwipeDist) {
      if (absX > absY) {
        // Horizontal Swipe
        if (dx > 0) {
          engineRef.current.switchLaneRight();
        } else {
          engineRef.current.switchLaneLeft();
        }
      } else {
        // Vertical Swipe
        if (dy > 0) {
          engineRef.current.slide();
        } else {
          engineRef.current.jump();
        }
      }
    }

    touchStartPos.current = null;
  };

  return (
    <main 
      id="game-viewport"
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Three.js WebGL Canvas Mount */}
      <div 
        ref={containerRef} 
        id="threejs-canvas-container"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Initialization Error Fallback */}
      {initError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-neutral-950/95 text-center">
          <div className="max-w-md bg-neutral-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl">
            <div className="text-3xl mb-2">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Graphics Initialization Failed</h2>
            <p className="text-xs text-neutral-300 mb-4">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl cursor-pointer"
            >
              Reload Game
            </button>
          </div>
        </div>
      )}

      {/* In-game HUD */}
      {(gameStatus === 'playing' || gameStatus === 'assembling') && (
        <>
          <HUD stats={stats} onPause={handlePauseGame} onOpenAudio={() => setShowAudioModal(true)} />
          {gameStatus === 'playing' && (
            <MobileControls
              onLeft={() => engineRef.current?.switchLaneLeft()}
              onRight={() => engineRef.current?.switchLaneRight()}
              onJump={() => engineRef.current?.jump()}
              onSlide={() => engineRef.current?.slide()}
            />
          )}
        </>
      )}

      {/* Start Screen */}
      {gameStatus === 'idle' && (
        <StartScreen
          highScore={stats.highScore}
          quality={settings.quality}
          onQualityChange={(q) => handleUpdateSettings({ ...settings, quality: q })}
          onStart={handleStartGame}
          onOpenAudio={() => setShowAudioModal(true)}
        />
      )}

      {/* Pause Modal */}
      {gameStatus === 'paused' && (
        <PauseModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResume={handleResumeGame}
          onRestart={handleRestartGame}
          onOpenAudio={() => setShowAudioModal(true)}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Audio Settings Modal */}
      {showAudioModal && (
        <AudioSettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowAudioModal(false)}
        />
      )}

      {/* Game Over Modal */}
      {gameStatus === 'gameover' && (
        <GameOverModal
          stats={stats}
          isNewHigh={isNewHigh}
          onRestart={handleRestartGame}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Grand Victory Sthapana Modal */}
      {gameStatus === 'victory' && (
        <VictoryModal
          stats={stats}
          onRestart={handleRestartGame}
          onMainMenu={handleMainMenu}
        />
      )}
    </main>
  );
}
