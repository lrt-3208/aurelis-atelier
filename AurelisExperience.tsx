"use client";
/* eslint-disable @next/next/no-img-element */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type R3FPointer = { x: number; y: number };

const collections = [
  {
    index: "01",
    name: "Aster",
    detail: "Silk organza · 01 / 05",
    caption: "A line of light held in suspension.",
    image: "/images/lookbook-ivory.webp",
    className: "collection-card--large",
  },
  {
    index: "02",
    name: "Nocturne",
    detail: "Silk faille · 02 / 05",
    caption: "For the hour after midnight.",
    image: "/images/lookbook-obsidian.webp",
    className: "collection-card--dark",
  },
  {
    index: "03",
    name: "Lumen",
    detail: "Washed satin · 03 / 05",
    caption: "The quiet architecture of a beginning.",
    image: "/images/hero-atelier.webp",
    className: "collection-card--tall",
  },
];

const lookbook = [
  { label: "01", name: "Aster", meta: "The first light", image: "/images/lookbook-ivory.webp" },
  { label: "02", name: "Nocturne", meta: "After midnight", image: "/images/lookbook-obsidian.webp" },
  { label: "03", name: "Lumen", meta: "A line of light", image: "/images/hero-atelier.webp" },
  { label: "04", name: "Oriel", meta: "Hand finished", image: "/images/lookbook-ivory.webp" },
  { label: "05", name: "Aureline", meta: "The last veil", image: "/images/lookbook-obsidian.webp" },
];

function CoutureSculpture({ pointer, progress }: { pointer: React.MutableRefObject<R3FPointer>; progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const fabricGroup = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(camera as THREE.PerspectiveCamera);
  const clock = useRef(0);

  const dressGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0.08, -2.9),
      new THREE.Vector2(0.34, -2.68),
      new THREE.Vector2(0.46, -2.28),
      new THREE.Vector2(0.42, -1.78),
      new THREE.Vector2(0.29, -1.22),
      new THREE.Vector2(0.26, -0.62),
      new THREE.Vector2(0.32, -0.1),
      new THREE.Vector2(0.42, 0.18),
      new THREE.Vector2(0.34, 0.48),
      new THREE.Vector2(0.22, 0.66),
      new THREE.Vector2(0.16, 0.85),
      new THREE.Vector2(0.18, 1.12),
      new THREE.Vector2(0.3, 1.3),
    ];
    return new THREE.LatheGeometry(points, 96);
  }, []);

  const ribbonCurves = useMemo(() => {
    return [0, 1, 2, 3].map((offset) => {
      const curve = new THREE.CatmullRomCurve3(
        Array.from({ length: 11 }, (_, index) => {
          const t = index / 10;
          const angle = t * Math.PI * 2.1 + offset * 1.2;
          const radius = 0.36 + t * 0.72 + (offset % 2) * 0.06;
          return new THREE.Vector3(
            Math.cos(angle) * radius,
            -2.35 + t * 3.42,
            Math.sin(angle) * radius * 0.68,
          );
        }),
      );
      return new THREE.TubeGeometry(curve, 64, 0.018 + offset * 0.006, 10, false);
    });
  }, []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i += 1) {
      const angleSeed = Math.abs(Math.sin(i * 12.9898 + 78.233));
      const radiusSeed = Math.abs(Math.sin(i * 4.123 + 12.77));
      const heightSeed = Math.abs(Math.sin(i * 9.17 + 3.91));
      const angle = angleSeed * Math.PI * 2;
      const radius = 1.1 + radiusSeed * 1.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -1.2 + heightSeed * 3.8;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.58;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const dressMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eee6db"),
        roughness: 0.24,
        metalness: 0.02,
        transmission: 0.38,
        thickness: 0.8,
        ior: 1.28,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame((_state, delta) => {
    clock.current += delta;
    const time = clock.current;
    const targetX = pointer.current.x * 0.34;
    const targetY = pointer.current.y * 0.18;
    const scroll = progress.current;

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, time * 0.085 + targetX * 0.45, 0.035);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetY * 0.45 - scroll * 0.08, 0.035);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(time * 0.52) * 0.045 - scroll * 0.22, 0.035);
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 0.96 + scroll * 0.09, 0.025));
    }

    if (fabricGroup.current) {
      fabricGroup.current.rotation.z = Math.sin(time * 0.45) * 0.018 + targetY * 0.04;
      fabricGroup.current.rotation.y = Math.sin(time * 0.3) * 0.08;
    }

    if (particles.current) {
      particles.current.rotation.y = time * 0.015;
      particles.current.rotation.x = Math.sin(time * 0.21) * 0.08;
      const material = particles.current.material as THREE.PointsMaterial;
      material.opacity = 0.26 + Math.sin(time * 0.7) * 0.04 + scroll * 0.12;
    }

    cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX * 0.7, 0.028);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY * 0.35, 0.028);
    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, 6.6 - scroll * 0.55, 0.028);
    cameraRef.current.lookAt(0, -0.52 - scroll * 0.12, 0);
  });

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <mesh geometry={dressGeometry} material={dressMaterial} castShadow receiveShadow />
      <mesh geometry={dressGeometry} scale={[1.07, 1, 1.07]} rotation={[0, 0.14, 0]}>
        <meshPhysicalMaterial
          color="#f8f1e7"
          roughness={0.32}
          metalness={0}
          transmission={0.2}
          thickness={0.45}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={fabricGroup}>
        {ribbonCurves.map((geometry, index) => (
          <mesh key={index} geometry={geometry}>
            <meshStandardMaterial
              color={index % 2 ? "#cbbba8" : "#f6eee3"}
              emissive={index % 2 ? "#3a2d24" : "#9e866d"}
              emissiveIntensity={0.18}
              roughness={0.32}
              metalness={0.08}
              transparent
              opacity={0.48 - index * 0.05}
            />
          </mesh>
        ))}
      </group>
      <points ref={particles} geometry={particleGeometry}>
        <pointsMaterial color="#dbc8af" size={0.018} sizeAttenuation transparent opacity={0.3} depthWrite={false} />
      </points>
    </group>
  );
}

function FlowingVeil({ position, rotation, scale, delay }: { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number]; delay: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(2.4, 3.6, 36, 48), []);

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime() + delay;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#c9b7a0") },
      uOpacity: { value: 0.15 },
    }),
    [],
  );

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={scale}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 transformed = position;
            float wave = sin(position.y * 1.65 + uTime * 0.75) * 0.15;
            wave += sin(position.x * 2.8 - uTime * 0.4) * 0.075;
            transformed.x += wave * (0.35 + uv.y);
            transformed.z += sin(position.y * 2.0 + uTime) * 0.06;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            float edge = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
            float fold = 0.72 + 0.28 * sin(vUv.y * 18.0);
            gl_FragColor = vec4(uColor, edge * fold * uOpacity);
          }
        `}
      />
    </mesh>
  );
}

function AtelierStage({ pointer, progress }: { pointer: React.MutableRefObject<R3FPointer>; progress: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.8} color="#8e7760" />
      <directionalLight position={[3, 5, 4]} intensity={3.2} color="#f5e6d0" castShadow />
      <pointLight position={[-3, -1, 2]} intensity={2.2} color="#b08d6c" />
      <pointLight position={[3, 1, -2]} intensity={1.8} color="#6c7d85" />
      <CoutureSculpture pointer={pointer} progress={progress} />
      <FlowingVeil position={[-1.85, 0.12, -0.75]} rotation={[0, 0.4, 0.14]} scale={[1.2, 1.35, 1]} delay={0.2} />
      <FlowingVeil position={[1.65, -0.15, -0.2]} rotation={[0, -0.5, -0.12]} scale={[0.92, 1.16, 1]} delay={2.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.03, 0]} receiveShadow>
        <circleGeometry args={[3.8, 64]} />
        <meshStandardMaterial color="#251d18" roughness={0.68} metalness={0.12} />
      </mesh>
    </>
  );
}

function StageFallback() {
  return (
    <div className="stage-fallback" aria-hidden="true">
      <div className="fallback-light" />
      <div className="fallback-dress">
        <span className="fallback-dress__bodice" />
        <span className="fallback-dress__skirt" />
        <span className="fallback-dress__veil fallback-dress__veil--one" />
        <span className="fallback-dress__veil fallback-dress__veil--two" />
        <span className="fallback-dress__sparkle" />
      </div>
    </div>
  );
}

function StageLayer({ pointer, progress }: { pointer: React.MutableRefObject<R3FPointer>; progress: React.MutableRefObject<number> }) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let available = false;
    try {
      const probe = document.createElement("canvas");
      available = Boolean(
        probe.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
          probe.getContext("webgl", { failIfMajorPerformanceCaveat: false }),
      );
    } catch {
      available = false;
    }
    // The probe is a one-time capability handshake; it intentionally updates the render path.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebglAvailable(available);
  }, []);

  if (webglAvailable === null) return null;
  if (!webglAvailable) return <StageFallback />;

  return (
    <Canvas
      dpr={[1, 1.45]}
      camera={{ position: [0, 0, 6.6], fov: 33 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
      shadows
    >
      <AtelierStage pointer={pointer} progress={progress} />
    </Canvas>
  );
}

function useAurelisMotion(progress: React.MutableRefObject<number>) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ autoRaf: false, duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(1000, 16);
    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTimeline
        .from(".hero-eyebrow", { y: 18, opacity: 0, duration: 1.1, delay: 0.45 })
        .from(".hero-title-line", { yPercent: 110, rotateX: -35, opacity: 0, duration: 1.25, stagger: 0.12 }, "-=0.8")
        .from(".hero-copy", { y: 18, opacity: 0, duration: 0.9 }, "-=0.68")
        .from(".hero-actions", { y: 14, opacity: 0, duration: 0.8 }, "-=0.58")
        .from(".hero-scroll-note", { opacity: 0, duration: 0.8 }, "-=0.38");

      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          gsap.set(".hero-content", { y: self.progress * -90, opacity: 1 - self.progress * 0.84 });
          gsap.set(".hero-image", { scale: 1 + self.progress * 0.13, yPercent: self.progress * 9, opacity: 0.72 - self.progress * 0.42 });
          gsap.set(".stage-layer", { scale: 1 + self.progress * 0.05, opacity: 1 - self.progress * 0.34 });
        },
      });

      gsap.fromTo(
        ".manifesto-word",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.045,
          scrollTrigger: { trigger: "#manifesto", start: "top 68%", end: "top 23%", scrub: 1 },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 82%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".collection-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 62 + index * 12, opacity: 0, rotate: index === 1 ? 1.4 : index === 2 ? -1 : 0 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 84%", once: true },
          },
        );
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: "#craft",
          start: "top top",
          end: "+=210%",
          scrub: 1,
          pin: true,
        },
      })
        .to(".craft-orbit", { rotation: 180, scale: 1.12, ease: "none" }, 0)
        .to(".craft-swatch", { yPercent: -24, xPercent: 12, rotate: 10, ease: "none" }, 0)
        .to(".craft-index", { opacity: 1, y: 0, stagger: 0.18, ease: "power2.out" }, 0.2)
        .to(".craft-image", { scale: 1.18, yPercent: -8, ease: "none" }, 0.1)
        .to(".craft-title", { letterSpacing: "0.03em", scale: 1.08, ease: "none" }, 0.38);

      const horizontal = document.querySelector<HTMLElement>(".lookbook-track");
      const lookbookWrap = document.querySelector<HTMLElement>("#lookbook");
      if (horizontal && lookbookWrap) {
        const getDistance = () => Math.max(0, horizontal.scrollWidth - window.innerWidth + 160);
        gsap.to(horizontal, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: lookbookWrap,
            start: "top top",
            end: () => "+=" + (getDistance() + window.innerHeight * 0.42),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.fromTo(
        ".story-line",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: "#story", start: "top 74%", end: "top 30%", scrub: 1 },
        },
      );

      ScrollTrigger.create({
        trigger: "#craft",
        start: "top 60%",
        end: "bottom 42%",
        onEnter: () => gsap.to(".stage-layer", { opacity: 0.84, duration: 0.8 }),
        onLeaveBack: () => gsap.to(".stage-layer", { opacity: 1, duration: 0.8 }),
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [progress]);
}

function LoadingExperience({ done }: { done: boolean }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + (value > 84 ? 2 : 7));
        if (next === 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setHidden(true), 420);
        }
        return next;
      });
    }, 55);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={"loading-screen " + (hidden || done ? "is-hidden" : "")} aria-hidden={hidden || done}>
      <div className="loading-wordmark">AURELIS</div>
      <div className="loading-meta">
        <span>Atelier digital · 2026</span>
        <span>{String(progress).padStart(3, "0")}</span>
      </div>
      <div className="loading-line">
        <span style={{ transform: "scaleX(" + progress / 100 + ")" }} />
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <a className="brand-mark" href="#hero" aria-label="Aurelis Atelier home">
      <span className="brand-mark__seal">A</span>
      <span className="brand-mark__name">Aurelis <em>Atelier</em></span>
    </a>
  );
}

export default function AurelisExperience() {
  const pointer = useRef<R3FPointer>({ x: 0, y: 0 });
  const progress = useRef(0);
  const cursor = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useAurelisMotion(progress);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 640);
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      if (cursor.current) {
        cursor.current.style.transform = "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const handlers = new Map<HTMLAnchorElement, (event: Event) => void>();
    links.forEach((link) => {
      const handler = (event: Event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setMenuOpen(false);
      };
      handlers.set(link, handler);
      link.addEventListener("click", handler);
    });
    return () => {
      handlers.forEach((handler, link) => link.removeEventListener("click", handler));
    };
  }, []);

  return (
    <div className="aurelis-site">
      <LoadingExperience done={loaded} />
      <div className="custom-cursor" ref={cursor} aria-hidden="true">
        <span />
      </div>

      <header className="site-nav">
        <BrandMark />
        <div className="nav-center">
          <span className="nav-kicker">Paris · New York · Shanghai</span>
        </div>
        <button className={"menu-toggle " + (menuOpen ? "is-open" : "")} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>
          <span>{menuOpen ? "Close" : "Index"}</span>
          <i /><i />
        </button>
      </header>

      <div className={"nav-drawer " + (menuOpen ? "is-open" : "")} aria-hidden={!menuOpen}>
        <div className="nav-drawer__inner">
          <span className="nav-drawer__eyebrow">Navigate the atelier</span>
          {[
            ["01", "The beginning", "#hero"],
            ["02", "Manifesto", "#manifesto"],
            ["03", "Collection", "#collection"],
            ["04", "Craft", "#craft"],
            ["05", "Lookbook", "#lookbook"],
            ["06", "Private fitting", "#contact"],
          ].map(([number, label, href]) => (
            <a href={href} key={href} className="nav-drawer__link">
              <span>{number}</span>
              {label}
            </a>
          ))}
          <div className="nav-drawer__footer">Available by appointment · atelier@aurelis.studio</div>
        </div>
      </div>

      <div className="stage-layer" aria-hidden="true">
        <StageLayer pointer={pointer} progress={progress} />
      </div>

      <div className="progress-rail" aria-hidden="true">
        <span>Scroll to enter</span>
        <i />
        <span>00—06</span>
      </div>

      <main>
        <section className="hero-section" id="hero">
          <img className="hero-image" src="/images/hero-atelier.webp" alt="" />
          <div className="hero-vignette" />
          <div className="hero-content page-grid">
            <div className="hero-copy-block">
              <p className="hero-eyebrow eyebrow">Aurelis Atelier <span>—</span> 2026 / Collection I</p>
              <h1 className="hero-title">
                <span className="hero-title-line">The quiet</span>
                <span className="hero-title-line hero-title-line--indent">architecture</span>
                <span className="hero-title-line hero-title-line--italic">of becoming.</span>
              </h1>
              <p className="hero-copy">Couture bridal objects for the threshold between who you were and who you are becoming.</p>
              <div className="hero-actions">
                <a className="circle-link" href="#collection" aria-label="Enter collection">
                  <span>Enter<br />collection</span>
                  <b>↘</b>
                </a>
                <span className="hero-note">A study in silk,<br />light &amp; restraint.</span>
              </div>
            </div>
            <div className="hero-side-note">
              <span>01</span>
              <span>Formation / 00:48</span>
            </div>
            <div className="hero-scroll-note"><span>Scroll to reveal</span><i /></div>
          </div>
        </section>

        <section className="manifesto-section dark-section" id="manifesto">
          <div className="page-grid manifesto-grid">
            <div className="manifesto-index eyebrow">Manifesto <span>—</span> 02</div>
            <p className="manifesto-copy">
              <span className="manifesto-word">A</span>{" "}
              <span className="manifesto-word">dress</span>{" "}
              <span className="manifesto-word">is</span>{" "}
              <span className="manifesto-word">worn</span>{" "}
              <span className="manifesto-word">once.</span><br />
              <span className="manifesto-word manifesto-word--faded">A</span>{" "}
              <span className="manifesto-word manifesto-word--faded">memory</span>{" "}
              <span className="manifesto-word manifesto-word--faded">learns</span>{" "}
              <span className="manifesto-word manifesto-word--faded">your</span>{" "}
              <span className="manifesto-word manifesto-word--faded">shape.</span>
            </p>
            <div className="manifesto-foot">
              <span>Not an occasion.</span>
              <span>A feeling, made visible.</span>
            </div>
          </div>
        </section>

        <section className="collection-section ivory-section" id="collection">
          <div className="page-grid">
            <div className="section-heading" data-reveal>
              <p className="eyebrow">Collection I <span>—</span> The threshold</p>
              <h2>Three ways<br /><em>to arrive.</em></h2>
              <p className="section-intro">A study of movement, proportion, and the small distance between the body and the light.</p>
            </div>
            <div className="collection-grid">
              {collections.map((item) => (
                <article className={"collection-card " + item.className} key={item.name}>
                  <div className="collection-card__image-wrap">
                    <img src={item.image} alt={item.name + " couture gown"} loading="lazy" />
                    <span className="collection-card__index">{item.index}</span>
                    <span className="collection-card__arrow">↗</span>
                  </div>
                  <div className="collection-card__meta">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                    </div>
                    <p>{item.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="craft-section dark-section" id="craft">
          <div className="craft-orbit" aria-hidden="true" />
          <div className="craft-swatch" aria-hidden="true"><span /><span /><span /></div>
          <div className="page-grid craft-grid">
            <div className="craft-intro">
              <p className="eyebrow">Atelier / Craft <span>—</span> 03</p>
              <h2 className="craft-title">Made<br /><em>in the pause.</em></h2>
              <p className="craft-copy">Every Aurelis piece begins as a conversation between a hand and a length of cloth. Nothing is added until the silence asks for it.</p>
              <a className="text-link" href="#story">Read the atelier notes <span>↗</span></a>
            </div>
            <div className="craft-detail-list">
              {[
                ["01", "Structure", "A hidden architecture, built to disappear."],
                ["02", "Air", "Layers of silk organza, allowed to move."],
                ["03", "Hand", "Each seam finished by one pair of hands."],
                ["04", "Light", "The final material in every composition."],
              ].map(([number, title, description]) => (
                <div className="craft-index" key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
          <img className="craft-image" src="/images/lookbook-ivory.webp" alt="" aria-hidden="true" />
          <div className="craft-image-caption">Aster / Detail study / Paris, 2026</div>
        </section>

        <section className="dress-experience-section">
          <div className="page-grid experience-grid">
            <div data-reveal>
              <p className="eyebrow">The dress in space <span>—</span> 04</p>
              <h2>Turn toward<br /><em>the light.</em></h2>
            </div>
            <div className="experience-copy" data-reveal>
              <p>Move through the sculpture. The room responds to your gaze; the cloth answers with its own slow gravity.</p>
              <div className="experience-readout"><span>Interactive study</span><b>Pointer / camera / silk</b></div>
            </div>
            <div className="experience-mark">A</div>
          </div>
        </section>

        <section className="lookbook-section ivory-section" id="lookbook">
          <div className="lookbook-header page-grid">
            <p className="eyebrow">Lookbook <span>—</span> Collection I</p>
            <span className="lookbook-header__count">05 / 05</span>
          </div>
          <div className="lookbook-track">
            {lookbook.map((look, index) => (
              <article className={"lookbook-card " + (index % 2 ? "lookbook-card--low" : "")} key={look.label + look.name}>
                <div className="lookbook-card__image">
                  <img src={look.image} alt={look.name + " look"} loading="lazy" />
                  <span>{look.label}</span>
                </div>
                <div className="lookbook-card__caption">
                  <h3>{look.name}</h3>
                  <p>{look.meta}</p>
                </div>
              </article>
            ))}
            <div className="lookbook-end-card">
              <span className="eyebrow">End of volume I</span>
              <strong>The rest<br /><em>is yours.</em></strong>
              <a className="text-link" href="#contact">Begin a fitting <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="story-section dark-section" id="story">
          <div className="page-grid story-grid">
            <p className="eyebrow">The atelier <span>—</span> 05</p>
            <div className="story-copy">
              <p className="story-lede">Aurelis is a small room in Paris, a long table, and the belief that <span className="story-line">the most lasting things do not need to announce themselves.</span></p>
              <div className="story-bottom">
                <p>Founded between river light and winter windows. Designed for one woman at a time.</p>
                <span>48°51′N / 2°21′E</span>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-image" />
          <div className="page-grid contact-grid">
            <p className="eyebrow">Private fitting <span>—</span> 06</p>
            <h2>Come closer<br /><em>to the cloth.</em></h2>
            <p className="contact-copy">For a private appointment, write to the atelier. We will answer in kind.</p>
            <a className="contact-button" href="mailto:atelier@aurelis.studio">atelier@aurelis.studio <span>↗</span></a>
          </div>
        </section>
      </main>

      <footer className="site-footer dark-section">
        <div className="page-grid footer-grid">
          <BrandMark />
          <div className="footer-links">
            <a href="#collection">Collection</a>
            <a href="#story">Journal</a>
            <a href="mailto:atelier@aurelis.studio">Contact</a>
          </div>
          <div className="footer-locations">
            <span>Paris</span>
            <span>New York</span>
            <span>Shanghai</span>
          </div>
          <p className="footer-legal">© 2026 Aurelis Atelier. Made slowly.</p>
        </div>
      </footer>
    </div>
  );
}
