"use client";
/* eslint-disable @next/next/no-img-element */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { aurelisCopy, type AurelisCopy, type AurelisLanguage } from "@/lib/aurelis-i18n";

type R3FPointer = { x: number; y: number };

const collectionArtwork = [
  {
    index: "01",
    image: "/images/lookbook-ivory.webp",
    className: "collection-card--large",
  },
  {
    index: "02",
    image: "/images/lookbook-obsidian.webp",
    className: "collection-card--dark",
  },
  {
    index: "03",
    image: "/images/hero-atelier.webp",
    className: "collection-card--tall",
  },
];

const lookbookArtwork = [
  { label: "01", name: "Aster", image: "/images/lookbook-ivory.webp" },
  { label: "02", name: "Nocturne", image: "/images/lookbook-obsidian.webp" },
  { label: "03", name: "Lumen", image: "/images/hero-atelier.webp" },
  { label: "04", name: "Oriel", image: "/images/lookbook-ivory.webp" },
  { label: "05", name: "Aureline", image: "/images/lookbook-obsidian.webp" },
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
    return new THREE.LatheGeometry(points, 64);
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
      return new THREE.TubeGeometry(curve, 40, 0.018 + offset * 0.006, 8, false);
    });
  }, []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i += 1) {
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

    if (typeof document !== "undefined" && document.hidden) return;

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
  const geometry = useMemo(() => new THREE.PlaneGeometry(2.4, 3.6, 24, 32), []);

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
        <circleGeometry args={[3.8, 48]} />
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
      dpr={[1, 1.2]}
      camera={{ position: [0, 0, 6.6], fov: 33 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
      shadows="basic"
    >
      <AtelierStage pointer={pointer} progress={progress} />
    </Canvas>
  );
}

function useAurelisMotion(
  progress: React.MutableRefObject<number>,
  lenisRef: React.MutableRefObject<Lenis | null>,
) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = prefersReducedMotion ? null : new Lenis({ autoRaf: false, duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    if (lenis) lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    if (lenis) gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(1000, 16);
    const ctx = gsap.context(() => {
      const setHeroContentY = gsap.quickSetter(".hero-content", "y", "px");
      const setHeroContentOpacity = gsap.quickSetter(".hero-content", "opacity");
      const setHeroImageScale = gsap.quickSetter(".hero-image", "scale");
      const setHeroImageY = gsap.quickSetter(".hero-image", "yPercent");
      const setHeroImageOpacity = gsap.quickSetter(".hero-image", "opacity");
      const setStageScale = gsap.quickSetter(".stage-layer", "scale");
      const setStageOpacity = gsap.quickSetter(".stage-layer", "opacity");
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
          const sectionProgress = self.progress;
          progress.current = sectionProgress;
          setHeroContentY(sectionProgress * -90);
          setHeroContentOpacity(1 - sectionProgress * 0.84);
          setHeroImageScale(1 + sectionProgress * 0.13);
          setHeroImageY(sectionProgress * 9);
          setHeroImageOpacity(0.72 - sectionProgress * 0.42);
          setStageScale(1 + sectionProgress * 0.05);
          setStageOpacity(1 - sectionProgress * 0.34);
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
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
      lenisRef.current = null;
    };
  }, [lenisRef, progress]);
}

function LoadingExperience({ done, copy }: { done: boolean; copy: AurelisCopy }) {
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
        <span>{copy.loadingMeta}</span>
        <span>{String(progress).padStart(3, "0")}</span>
      </div>
      <div className="loading-line">
        <span style={{ transform: "scaleX(" + progress / 100 + ")" }} />
      </div>
    </div>
  );
}

function BrandMark({ homeLabel }: { homeLabel: string }) {
  return (
    <a className="brand-mark" href="#hero" aria-label={homeLabel}>
      <span className="brand-mark__seal">A</span>
      <span className="brand-mark__name">Aurelis <em>Atelier</em></span>
    </a>
  );
}

function Eyebrow({ text }: { text: string }) {
  const [label, detail] = text.split(" — ");
  return <>{label}{detail ? <> <span>—</span> {detail}</> : null}</>;
}

export default function AurelisExperience() {
  const pointer = useRef<R3FPointer>({ x: 0, y: 0 });
  const progress = useRef(0);
  const cursor = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [language, setLanguage] = useState<AurelisLanguage>("en");
  const copy = aurelisCopy[language];
  useAurelisMotion(progress, lenisRef);

  useEffect(() => {
    let languageFrame = 0;
    try {
      const stored = window.localStorage.getItem("aurelis-language");
      const browserLanguage = window.navigator.language.toLowerCase();
      const nextLanguage: AurelisLanguage = stored === "zh" || stored === "en"
        ? stored
        : browserLanguage.startsWith("zh")
          ? "zh"
          : "en";
      document.documentElement.lang = nextLanguage;
      languageFrame = window.requestAnimationFrame(() => setLanguage(nextLanguage));
    } catch {
      document.documentElement.lang = "en";
    }
    return () => {
      if (languageFrame) window.cancelAnimationFrame(languageFrame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem("aurelis-language", language);
    } catch {
      // Local preference storage is optional.
    }
  }, [language]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 640);
    let cursorFrame = 0;
    let cursorX = -100;
    let cursorY = -100;
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (!cursorFrame) {
        cursorFrame = window.requestAnimationFrame(() => {
          if (cursor.current) {
            cursor.current.style.transform = "translate3d(" + cursorX + "px," + cursorY + "px,0)";
          }
          cursorFrame = 0;
        });
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.clearTimeout(timer);
      if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
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
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target as HTMLElement, { duration: 1.05 });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setMenuOpen(false);
      };
      handlers.set(link, handler);
      link.addEventListener("click", handler);
    });
    return () => {
      handlers.forEach((handler, link) => link.removeEventListener("click", handler));
    };
  }, [lenisRef]);

  return (
    <div className="aurelis-site">
      <LoadingExperience done={loaded} copy={copy} />
      <div className="custom-cursor" ref={cursor} aria-hidden="true">
        <span />
      </div>

      <header className="site-nav">
        <BrandMark homeLabel={copy.homeLabel} />
        <div className="nav-center">
          <span className="nav-kicker">{copy.locations}</span>
        </div>
        <div className="nav-tools">
          <div className="language-switcher" role="group" aria-label={copy.languageLabel}>
            <button className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
            <span aria-hidden="true">/</span>
            <button className={language === "zh" ? "is-active" : ""} onClick={() => setLanguage("zh")} aria-pressed={language === "zh"}>中</button>
          </div>
          <button className={"menu-toggle " + (menuOpen ? "is-open" : "")} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? copy.close : copy.index}>
            <span>{menuOpen ? copy.close : copy.index}</span>
            <i /><i />
          </button>
        </div>
      </header>

      <div className={"nav-drawer " + (menuOpen ? "is-open" : "")} aria-hidden={!menuOpen}>
        <div className="nav-drawer__inner">
          <span className="nav-drawer__eyebrow">{copy.navigationLabel}</span>
          {[
            ["01", copy.beginning, "#hero"],
            ["02", copy.manifesto.label, "#manifesto"],
            ["03", copy.footer.collection, "#collection"],
            ["04", copy.craft.eyebrow.split(" — ")[0], "#craft"],
            ["05", copy.lookbook.eyebrow.split(" — ")[0], "#lookbook"],
            ["06", copy.contact.eyebrow.split(" — ")[0], "#contact"],
          ].map(([number, label, href]) => (
            <a href={href} key={href} className="nav-drawer__link">
              <span>{number}</span>
              {label}
            </a>
          ))}
          <div className="nav-drawer__footer">{copy.appointment}</div>
        </div>
      </div>

      <div className="stage-layer" aria-hidden="true">
        <StageLayer pointer={pointer} progress={progress} />
      </div>

      <div className="progress-rail" aria-hidden="true">
        <span>{copy.scrollToEnter}</span>
        <i />
        <span>00—06</span>
      </div>

      <main>
        <section className="hero-section" id="hero">
          <img className="hero-image" src="/images/hero-atelier.webp" alt="" fetchPriority="high" decoding="async" />
          <div className="hero-vignette" />
          <div className="hero-content page-grid">
            <div className="hero-copy-block">
              <p className="hero-eyebrow eyebrow"><Eyebrow text={copy.hero.eyebrow} /></p>
              <h1 className="hero-title">
                <span className="hero-title-line">{copy.hero.titleLineOne}</span>
                <span className="hero-title-line hero-title-line--indent">{copy.hero.titleLineTwo}</span>
                <span className="hero-title-line hero-title-line--italic">{copy.hero.titleLineThree}</span>
              </h1>
              <p className="hero-copy">{copy.hero.copy}</p>
              <div className="hero-actions">
                <a className="circle-link" href="#collection" aria-label={copy.hero.enterLabel}>
                  <span>{copy.hero.enter}<br />{copy.footer.collection.toLowerCase()}</span>
                  <b>↘</b>
                </a>
                <span className="hero-note">{copy.hero.note}</span>
              </div>
            </div>
            <div className="hero-side-note">
              <span>01</span>
              <span>{copy.formation}</span>
            </div>
            <div className="hero-scroll-note"><span>{copy.scrollToReveal}</span><i /></div>
          </div>
        </section>

        <section className="manifesto-section dark-section" id="manifesto">
          <div className="page-grid manifesto-grid">
            <div className="manifesto-index eyebrow">{copy.manifesto.label} <span>—</span> 02</div>
            <p className="manifesto-copy">
              {copy.manifesto.lineOne.map((word, index) => <span className="manifesto-word" key={word}>{word}{language === "en" && index < copy.manifesto.lineOne.length - 1 ? " " : ""}</span>)}<br />
              {copy.manifesto.lineTwo.map((word, index) => <span className="manifesto-word manifesto-word--faded" key={word}>{word}{language === "en" && index < copy.manifesto.lineTwo.length - 1 ? " " : ""}</span>)}
            </p>
            <div className="manifesto-foot">
              <span>{copy.manifesto.footOne}</span>
              <span>{copy.manifesto.footTwo}</span>
            </div>
          </div>
        </section>

        <section className="collection-section ivory-section" id="collection">
          <div className="page-grid">
            <div className="section-heading" data-reveal>
              <p className="eyebrow"><Eyebrow text={copy.collection.eyebrow} /></p>
              <h2>{copy.collection.titleLineOne}<br /><em>{copy.collection.titleLineTwo}</em></h2>
              <p className="section-intro">{copy.collection.intro}</p>
            </div>
            <div className="collection-grid">
              {collectionArtwork.map((item, index) => {
                const itemCopy = copy.collection.items[index];
                const name = ["Aster", "Nocturne", "Lumen"][index];
                return <article className={"collection-card " + item.className} key={name}>
                  <div className="collection-card__image-wrap">
                    <img src={item.image} alt={itemCopy.alt} loading="lazy" decoding="async" />
                    <span className="collection-card__index">{item.index}</span>
                    <span className="collection-card__arrow">↗</span>
                  </div>
                  <div className="collection-card__meta">
                    <div>
                      <h3>{name}</h3>
                      <p>{itemCopy.detail}</p>
                    </div>
                    <p>{itemCopy.caption}</p>
                  </div>
                </article>
              })}
            </div>
          </div>
        </section>

        <section className="craft-section dark-section" id="craft">
          <div className="craft-orbit" aria-hidden="true" />
          <div className="craft-swatch" aria-hidden="true"><span /><span /><span /></div>
          <div className="page-grid craft-grid">
            <div className="craft-intro">
              <p className="eyebrow"><Eyebrow text={copy.craft.eyebrow} /></p>
              <h2 className="craft-title">{copy.craft.titleLineOne}<br /><em>{copy.craft.titleLineTwo}</em></h2>
              <p className="craft-copy">{copy.craft.copy}</p>
              <a className="text-link" href="#story">{copy.craft.readNotes} <span>↗</span></a>
            </div>
            <div className="craft-detail-list">
              {copy.craft.items.map((item, index) => (
                <div className="craft-index" key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <img className="craft-image" src="/images/lookbook-ivory.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="craft-image-caption">{copy.craft.caption}</div>
        </section>

        <section className="dress-experience-section">
          <div className="page-grid experience-grid">
            <div data-reveal>
              <p className="eyebrow"><Eyebrow text={copy.experience.eyebrow} /></p>
              <h2>{copy.experience.titleLineOne}<br /><em>{copy.experience.titleLineTwo}</em></h2>
            </div>
            <div className="experience-copy" data-reveal>
              <p>{copy.experience.copy}</p>
              <div className="experience-readout"><span>{copy.experience.label}</span><b>{copy.experience.readout}</b></div>
            </div>
            <div className="experience-mark">A</div>
          </div>
        </section>

        <section className="lookbook-section ivory-section" id="lookbook">
          <div className="lookbook-header page-grid">
            <p className="eyebrow"><Eyebrow text={copy.lookbook.eyebrow} /></p>
            <span className="lookbook-header__count">{copy.lookbook.count}</span>
          </div>
          <div className="lookbook-track">
            {lookbookArtwork.map((look, index) => (
              <article className={"lookbook-card " + (index % 2 ? "lookbook-card--low" : "")} key={look.label + look.name}>
                <div className="lookbook-card__image">
                  <img src={look.image} alt={copy.lookbook.items[index].alt} loading="lazy" decoding="async" />
                  <span>{look.label}</span>
                </div>
                <div className="lookbook-card__caption">
                  <h3>{look.name}</h3>
                  <p>{copy.lookbook.items[index].meta}</p>
                </div>
              </article>
            ))}
            <div className="lookbook-end-card">
              <span className="eyebrow">{copy.lookbook.endLabel}</span>
              <strong>{copy.lookbook.endLineOne}<br /><em>{copy.lookbook.endLineTwo}</em></strong>
              <a className="text-link" href="#contact">{copy.lookbook.beginFitting} <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="story-section dark-section" id="story">
          <div className="page-grid story-grid">
            <p className="eyebrow"><Eyebrow text={copy.story.eyebrow} /></p>
            <div className="story-copy">
              <p className="story-lede">{copy.story.copyBeforeLine} <span className="story-line">{copy.story.line}</span></p>
              <div className="story-bottom">
                <p>{copy.story.bottomCopy}</p>
                <span>48°51′N / 2°21′E</span>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-image" />
          <div className="page-grid contact-grid">
            <p className="eyebrow"><Eyebrow text={copy.contact.eyebrow} /></p>
            <h2>{copy.contact.titleLineOne}<br /><em>{copy.contact.titleLineTwo}</em></h2>
            <p className="contact-copy">{copy.contact.copy}</p>
            <a className="contact-button" href="mailto:atelier@aurelis.studio">atelier@aurelis.studio <span>↗</span></a>
          </div>
        </section>
      </main>

      <footer className="site-footer dark-section">
        <div className="page-grid footer-grid">
          <BrandMark homeLabel={copy.homeLabel} />
          <div className="footer-links">
            <a href="#collection">{copy.footer.collection}</a>
            <a href="#story">{copy.footer.journal}</a>
            <a href="mailto:atelier@aurelis.studio">{copy.footer.contact}</a>
          </div>
          <div className="footer-locations">
            <span>Paris</span>
            <span>New York</span>
            <span>Shanghai</span>
          </div>
          <p className="footer-legal">{copy.footer.legal}</p>
        </div>
      </footer>
    </div>
  );
}
