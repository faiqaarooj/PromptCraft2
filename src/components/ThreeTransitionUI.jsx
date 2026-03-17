import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- CUSTOM HOOKS ---

// 300ms Debounce Hook for Input
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- 3D SCENE COMPONENTS ---

const PARTICLE_COUNT = 3000;

function Scene({ stage, isFrozen }) {
  const { camera } = useThree();
  const pointsRef = useRef();

  // Create structured geometry (Octahedron vertices)
  const targetPositions = useMemo(() => {
    const geom = new THREE.OctahedronGeometry(4, 3);
    geom.computeVertexNormals();
    // We need PARTICLE_COUNT positions. Let's sample the geometry.
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const posAttr = geom.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i % posAttr.count;
      positions[i * 3] = posAttr.getX(idx) + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = posAttr.getY(idx) + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = posAttr.getZ(idx) + (Math.random() - 0.5) * 0.2;
    }
    return positions;
  }, []);

  // Create random initial positions (Stuck)
  const randomPositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
  }, []);

  // State to hold current positions for animation
  const [positions] = useState(() => new Float32Array(randomPositions));

  // Initialize particle attributes
  const geometryRef = useRef();
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, [positions]);

  // Color logic
  const particleColor = useMemo(() => {
    if (isFrozen) return new THREE.Color('#DC2626'); // Red
    if (stage === 1) return new THREE.Color('#00D4FF'); // Cyan
    return new THREE.Color('#F5A623'); // Gold
  }, [stage, isFrozen]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;

    // Transition Particles
    const positionsAttr = geometryRef.current.attributes.position;
    const currentPositions = positionsAttr.array;

    const isCrafting = stage >= 2;
    const target = isCrafting ? targetPositions : randomPositions;
    const lerpFactor = isCrafting ? 2.0 * delta : 0.5 * delta;

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      if (isCrafting) {
         // Pull to Octahedron
         currentPositions[i] = THREE.MathUtils.lerp(currentPositions[i], target[i], lerpFactor);
      } else {
         // Random drift when 'Stuck'
         if (!isFrozen) {
           currentPositions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
         }
      }
    }
    positionsAttr.needsUpdate = true;

    // Rotate the entire particle system slowly
    if (!isFrozen) {
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.x += delta * 0.05;
    }

    // Camera Dolly Zoom
    let targetZ = 15;
    if (stage === 1) targetZ = 15;
    if (stage === 2) targetZ = 10;
    if (stage === 3) targetZ = 6;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 2.0 * delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.08}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- MAIN TRANSITION COMPONENT ---

export default function ThreeTransitionUI({ onComplete }) {
  const [stage, setStage] = useState(1); // 1: LOST, 2: CRAFT, 3: LOGIN
  const [isFrozen, setIsFrozen] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rawInput, setRawInput] = useState('');

  // Real-time sanitized input (prevent UI blocking)
  const debouncedInput = useDebounce(rawInput, 300);
  // Basic sanitization: strip HTML
  const sanitizedInput = useMemo(() => {
    return debouncedInput.replace(/<\/?[^>]+(>|$)/g, "");
  }, [debouncedInput]);

  // Stage Handlers
  useEffect(() => {
    const handleScroll = (e) => {
      if (stage === 1 && e.deltaY > 0 && !isFrozen) {
        setStage(2);
      }
    };
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [stage, isFrozen]);

  useEffect(() => {
    if (isFrozen) {
      const timer = setTimeout(() => {
        setIsFrozen(false);
        setLoginAttempts(0); // Reset after 30s freeze
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [isFrozen]);

  const handleCraftSubmit = (e) => {
    if (e.key === 'Enter' && sanitizedInput.length > 0) {
      setStage(3);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isFrozen) return;

    // Always succeed after typing 'admin' for demo, otherwise fail
    const password = e.target.password.value;
    if (password === 'admin') {
      onComplete();
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      // Mock brute-force check
      if (newAttempts >= 3) {
        setIsFrozen(true);
        setLoginAttempts(0);
      }
    }
  };

  // UI Styles
  const fontHead = "'Syne', sans-serif";
  const fontMono = "'JetBrains Mono', monospace";

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      background: '#05080F',
      overflow: 'hidden',
      zIndex: 9999,
      fontFamily: fontHead
    }}>
      {/* 3D BACKGROUND */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
           <color attach="background" args={['#05080F']} />
           <Scene stage={stage} isFrozen={isFrozen} />
        </Canvas>
      </div>

      {/* 3D FREEZE OVERLAY */}
      <AnimatePresence>
        {isFrozen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: '#DC2626', pointerEvents: 'none', zIndex: 10
            }}
          />
        )}
      </AnimatePresence>

      {/* FRAMER MOTION UI OVERLAYS */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#FFF', zIndex: 20, pointerEvents: isFrozen ? 'none' : 'auto'
      }}>

        {/* STAGE 1: LOST */}
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ textAlign: 'center' }}
            >
              <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: 0, color: '#00D4FF', textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
                Stuck in the Void?
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#9CA3AF', marginTop: '1rem' }}>
                Scroll to find your way.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE 2: CRAFT */}
        <AnimatePresence>
          {stage === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}
            >
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: '#F5A623' }}>
                Let's Craft.
              </h2>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="What do you want to build? (Press Enter)"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  onKeyDown={handleCraftSubmit}
                  style={{
                    width: '100%',
                    padding: '1.2rem 1.5rem',
                    fontSize: '1.2rem',
                    fontFamily: fontMono,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(245, 166, 35, 0.3)',
                    borderRadius: '12px',
                    color: '#FFF',
                    outline: 'none',
                    // Glow scales with input length (max 30px)
                    boxShadow: `0 0 ${Math.min(rawInput.length * 2, 30)}px rgba(245, 166, 35, 0.4)`,
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE 3: LOGIN */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              initial={{ opacity: 0, z: -500, rotateX: 20 }}
              animate={{ opacity: 1, z: 0, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                transformStyle: 'preserve-3d', // For 3D Z-axis pop
                perspective: '1000px'
              }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: '#FFF' }}>
                Unlock PromptCraft
              </h2>

              {isFrozen && (
                <div style={{ color: '#DC2626', textAlign: 'center', marginBottom: '1rem', fontFamily: fontMono, fontSize: '0.9rem' }}>
                  SYSTEM LOCKED (30s)
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter Password (admin)"
                  disabled={isFrozen}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: fontMono,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                    borderColor: isFrozen ? '#DC2626' : 'rgba(255,255,255,0.1)'
                  }}
                />
                <button
                  type="submit"
                  disabled={isFrozen}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: isFrozen ? '#DC2626' : 'linear-gradient(135deg, #F5A623, #EA580C)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFF',
                    cursor: isFrozen ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isFrozen ? 0.5 : 1
                  }}
                >
                  {isFrozen ? 'LOCKED' : 'ENTER'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
