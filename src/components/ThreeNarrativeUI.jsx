import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { usePromptStream } from '../hooks/usePromptStream';
import { User, LogIn, Github, Apple, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

// --- 1. THE 3D SCENE (Three.js) ---

// Particle System that transitions from random "Stuck" to structured "Octahedron"
const ParticleSystem = ({ stage, typingIntensity }) => {
    const meshRef = useRef();
    const particleCount = 400;

    // Generate random positions (Void) and structured positions (Octahedron surface)
    const { randomPositions, structuredPositions } = useMemo(() => {
        const randomPos = new Float32Array(particleCount * 3);
        const structuredPos = new Float32Array(particleCount * 3);
        const geometry = new THREE.OctahedronGeometry(2, 2);
        const targetPositions = geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            // Random void positions
            randomPos[i * 3] = (Math.random() - 0.5) * 15;
            randomPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            randomPos[i * 3 + 2] = (Math.random() - 0.5) * 15;

            // Map to octahedron surface, handle different point counts safely
            const tIndex = (i % (targetPositions.length / 3)) * 3;
            structuredPos[i * 3] = targetPositions[tIndex] * 1.5;
            structuredPos[i * 3 + 1] = targetPositions[tIndex + 1] * 1.5;
            structuredPos[i * 3 + 2] = targetPositions[tIndex + 2] * 1.5;
        }
        return { randomPositions: randomPos, structuredPositions: structuredPos };
    }, [particleCount]);

    const [currentPositions] = useState(() => new Float32Array(randomPositions));

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Transition logic
        const positions = meshRef.current.geometry.attributes.position.array;
        const targetStage = stage === 'stuck' ? 0 : stage === 'craft' ? 1 : 2;

        // Speed of transition
        const lerpFactor = targetStage > 0 ? 2.5 * delta : 1.0 * delta;

        for (let i = 0; i < particleCount * 3; i++) {
            const targetPos = targetStage > 0 ? structuredPositions[i] : randomPositions[i];

            // Add some jitter based on typing intensity during craft stage
            let jitter = 0;
            if (stage === 'craft') {
                jitter = (Math.random() - 0.5) * typingIntensity * 0.2;
            }

            // In stage 2 (login/preview), lock structure firmly
            if (stage === 'preview') {
                 jitter = (Math.random() - 0.5) * 0.02; // Tiny breathing room
            }

            positions[i] = THREE.MathUtils.lerp(positions[i], targetPos + jitter, lerpFactor);
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true;

        // Rotation
        meshRef.current.rotation.y += delta * 0.2 * (1 + typingIntensity * 5);
        meshRef.current.rotation.x += delta * 0.1;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={currentPositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#00D4FF"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
};

// Camera Controller for Dolly Zoom
const CameraController = ({ stage, typingIntensity }) => {
    const { camera } = useThree();

    useFrame((state, delta) => {
        let targetZ = 8; // Stuck distance
        let targetFov = 75;

        if (stage === 'craft') {
            // Zoom closer, tie to typing intensity
            targetZ = 6 - (typingIntensity * 1.5);
            targetFov = 65 + (typingIntensity * 10);
        } else if (stage === 'preview') {
            // Login/Preview distance (side-by-side view)
            targetZ = 4.5;
            targetFov = 50;

            // Move camera slightly right to make room for UI
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, 2, delta * 2);
        }

        // Return camera to center if not in preview
        if (stage !== 'preview') {
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 2);
        }

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3);
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 3);
        camera.updateProjectionMatrix();
    });

    return null;
};

// --- 2. THE UI OVERLAY & LOGIC (Framer Motion + React) ---

export const ThreeNarrativeUI = ({ onLoginSuccess }) => {
    // Application State
    const [stage, setStage] = useState('stuck'); // 'stuck' | 'craft' | 'preview'
    const [inputValue, setInputValue] = useState('');
    const [typingIntensity, setIntensity] = useState(0);
    const intensityTimer = useRef(null);
    const [isLocked, setIsLocked] = useState(false);

    // Auth & Security Mock State
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Backend Streaming Hook
    const { startStream, result, isLoading, error: streamError, statusHook } = usePromptStream();

    // 3. SECURITY & PERFORMANCE: Input Sanitization & Debounce
    const handleInput = (e) => {
        if (isLocked) return;

        let val = e.target.value;

        // Strip HTML tags
        val = val.replace(/<[^>]*>?/gm, '');

        // Block prompt injection
        if (val.toLowerCase().includes("ignore previous instructions")) {
            val = val.replace(/ignore previous instructions/gi, "*** BLOCKED ***");
        }

        // Max 10k chars
        if (val.length > 10000) {
            val = val.substring(0, 10000);
        }

        setInputValue(val);

        // Update typing intensity for Dolly Zoom
        setIntensity(Math.min(1, typingIntensity + 0.2));

        if (intensityTimer.current) clearTimeout(intensityTimer.current);
        intensityTimer.current = setTimeout(() => {
            setIntensity(0);
        }, 300); // 300ms debounce drop-off
    };

    const handleCraftSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLocked) return;

        // Trigger 3D transition and start streaming simultaneously
        setStage('preview');
        startStream(inputValue, "Creative", () => {
             console.log("Transition complete, starting stream display.");
        });
    };

    // 3. SECURITY & PERFORMANCE: Brute-Force Lockout
    const handleLoginSubmit = (e) => {
        e.preventDefault();

        // Dummy check
        if (authEmail === 'admin@promptcraft.ai' && authPassword === 'password') {
            // Success logic would go here
            setAuthError('Login successful. System online.');
            setTimeout(() => {
                if (onLoginSuccess) onLoginSuccess();
            }, 1000);
        } else {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);

            if (newAttempts >= 3) {
                // Trigger Brute Force Lockout
                setIsLocked(true);
                setAuthError('BRUTE FORCE DETECTED. SYSTEM LOCKED FOR 60s.');

                setTimeout(() => {
                    setIsLocked(false);
                    setLoginAttempts(0);
                    setAuthError('');
                }, 60000);
            } else {
                setAuthError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
            }
        }
    };

    // Cleanup WebGL contexts on unmount (Anti-Crash)
    useEffect(() => {
        return () => {
             if (intensityTimer.current) clearTimeout(intensityTimer.current);
        };
    }, []);

    // --- RENDER ---
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#05080F', overflow: 'hidden', fontFamily: 'sans-serif' }}>

            {/* 3D Canvas Layer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%' }}>
                <Canvas
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                    dpr={[1, 2]} // Performance: limit pixel ratio
                    camera={{ position: [0, 0, 8], fov: 75 }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#F5A623" />
                    <ParticleSystem stage={stage} typingIntensity={typingIntensity} />
                    <CameraController stage={stage} typingIntensity={typingIntensity} />
                </Canvas>
            </div>

            {/* Red Freeze Overlay for Security Lockout */}
            <AnimatePresence>
                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, zIndex: 10, backgroundColor: '#dc2626', pointerEvents: 'none', mixBlendMode: 'overlay' }}
                    />
                )}
            </AnimatePresence>

            {/* UI Layer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>

                {/* STAGE 1 & 2: STUCK / CRAFT */}
                <AnimatePresence mode="wait">
                    {stage !== 'preview' && (
                        <motion.div
                            key="craft-ui"
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '42rem', width: '100%', padding: '0 1.5rem', pointerEvents: 'auto' }}
                        >
                            {/* Heading */}
                            <motion.h1
                                style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem', fontFamily: 'Syne, sans-serif', textAlign: 'center' }}
                            >
                                {stage === 'stuck' ? "Stuck in the Void?" : "Shape Your Idea"}
                            </motion.h1>

                            {/* Input Form */}
                            <form onSubmit={handleCraftSubmit} style={{ width: '100%', position: 'relative' }}>
                                <motion.div
                                    animate={{
                                        boxShadow: `0 0 ${10 + typingIntensity * 40}px rgba(0, 212, 255, ${0.2 + typingIntensity * 0.5})`,
                                        borderColor: `rgba(0, 212, 255, ${0.3 + typingIntensity * 0.7})`
                                    }}
                                    style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', transition: 'background-color 0.3s, border-color 0.3s' }}
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInput}
                                        onFocus={() => setStage('craft')}
                                        disabled={isLocked}
                                        placeholder="Type one word to ignite the core..."
                                        style={{ width: '100%', backgroundColor: 'transparent', color: 'white', padding: '1.5rem 4rem 1.5rem 2rem', fontSize: '1.25rem', outline: 'none', border: 'none', fontFamily: "'JetBrains Mono', monospace" }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isLocked}
                                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#00D4FF', color: '#05080F', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: (!inputValue.trim() || isLocked) ? 'not-allowed' : 'pointer', opacity: (!inputValue.trim() || isLocked) ? 0.5 : 1, transition: 'background-color 0.3s' }}
                                    >
                                        <Sparkles style={{ width: '1.5rem', height: '1.5rem' }} />
                                    </button>
                                </motion.div>
                            </form>

                            {stage === 'stuck' && (
                                <p style={{ marginTop: '1.5rem', color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Awaiting Neural Input
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* STAGE 3: PREVIEW / LOGIN */}
                <AnimatePresence>
                    {stage === 'preview' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 2rem', pointerEvents: 'none', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

                            {/* Left Side: Generated Content Preview */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                style={{ width: '50%', paddingRight: '3rem', color: 'white', pointerEvents: 'auto' }}
                            >
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00D4FF', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid rgba(0, 212, 255, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(0, 212, 255, 0.1)' }}>
                                    <Sparkles style={{ width: '1rem', height: '1rem' }} />
                                    <span>Neural Core Active</span>
                                </div>

                                <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif' }}>
                                    "{inputValue}"
                                </h2>

                                <div style={{ maxWidth: 'none' }}>
                                    <div
                                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.625, minHeight: '200px', padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)' }}
                                    >
                                        {isLoading && !result && statusHook && (
                                            <span style={{ color: '#F5A623', fontStyle: 'italic', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>{statusHook}</span>
                                        )}
                                        {isLoading && !result && !statusHook && (
                                            <span style={{ color: '#F5A623', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Synthesizing response...</span>
                                        )}
                                        {result || streamError}
                                        {isLoading && result && (
                                            <span style={{ display: 'inline-block', width: '0.5rem', height: '1.25rem', marginLeft: '0.25rem', backgroundColor: '#00D4FF', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', verticalAlign: 'middle' }} />
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side: Authentication Card */}
                            <motion.div
                                initial={{ opacity: 0, z: -500, rotateY: -30, x: 100 }}
                                animate={{ opacity: 1, z: 0, rotateY: 0, x: 0 }}
                                transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
                                style={{ width: '420px', marginLeft: 'auto', pointerEvents: 'auto', flexShrink: 0, transformStyle: "preserve-3d" }}
                            >
                                <div style={{ backgroundColor: 'rgba(5, 8, 15, 0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 0 50px rgba(0, 212, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
                                    {/* Accent line */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #00D4FF, #F5A623)' }} />

                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                                        Save & Continue
                                    </h3>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                                        Join PromptCraft to unlock full API access and save your architectures.
                                    </p>

                                    {/* OAuth Buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: 'white', color: 'black', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                                            <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                            <span>Continue with Google</span>
                                        </button>
                                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#111', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                                            <Github style={{ width: '1.25rem', height: '1.25rem' }} />
                                            <span>Continue with GitHub</span>
                                        </button>
                                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: 'black', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                                            <Apple style={{ width: '1.25rem', height: '1.25rem' }} />
                                            <span>Continue with Apple</span>
                                        </button>
                                    </div>

                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '1rem 0', marginBottom: '1rem' }}>
                                        <div style={{ flexGrow: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                                        <span style={{ flexShrink: 0, margin: '0 1rem', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or enter coordinates</span>
                                        <div style={{ flexGrow: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                                    </div>

                                    {/* Credential Login Form */}
                                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <input
                                                type="email"
                                                value={authEmail}
                                                onChange={(e) => setAuthEmail(e.target.value)}
                                                placeholder="Email Address"
                                                disabled={isLocked}
                                                style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                value={authPassword}
                                                onChange={(e) => setAuthPassword(e.target.value)}
                                                placeholder="Password"
                                                disabled={isLocked}
                                                style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>

                                        {authError && (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: isLocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)', color: isLocked ? '#f87171' : '#fb923c' }}>
                                                <AlertTriangle style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.125rem' }} />
                                                <span style={{ fontFamily: 'monospace' }}>{authError}</span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLocked || !authEmail || !authPassword}
                                            style={{ width: '100%', background: 'linear-gradient(to right, #00D4FF, #0099FF)', color: 'white', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: (isLocked || !authEmail || !authPassword) ? 'not-allowed' : 'pointer', opacity: (isLocked || !authEmail || !authPassword) ? 0.5 : 1 }}
                                        >
                                            <span>Initialize</span>
                                            <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                                        </button>
                                    </form>

                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};
