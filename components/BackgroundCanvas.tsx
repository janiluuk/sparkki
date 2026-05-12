"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  VERSO_BG_NAV_EVENT,
  type VersoBgNavDetail,
} from "@/lib/background-nav";

/** Decorative ambient canvas — DESIGN_SYSTEM.md + ROADMAP */
export function BackgroundCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 20;

    const geometry = new THREE.IcosahedronGeometry(0.3, 0);
    const meshes: THREE.Mesh[] = [];

    type MeshWithVel = THREE.Mesh & {
      _vel: THREE.Vector3;
      _phase: number;
    };

    /** Brief boost when user navigates (decays each frame). */
    let navImpulse = 0;

    const bumpNavImpulse = (e: Event) => {
      const ce = e as CustomEvent<VersoBgNavDetail>;
      const s =
        typeof ce.detail?.strength === "number" && ce.detail.strength > 0
          ? ce.detail.strength
          : 1;
      navImpulse = Math.min(1, navImpulse + 0.48 * s);
    };

    const onPopState = () => {
      navImpulse = Math.min(1, navImpulse + 0.28);
    };

    window.addEventListener(VERSO_BG_NAV_EVENT, bumpNavImpulse);
    window.addEventListener("popstate", onPopState);

    if (reducedMotion) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x1df5a0,
        transparent: true,
        opacity: 0.14,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(0, 0, 0);
      mesh.scale.setScalar(1.45);
      scene.add(mesh);
      meshes.push(mesh);
      renderer.render(scene, camera);
    } else {
      const count = 100;
      for (let i = 0; i < count; i++) {
        const amber = Math.random() < 0.15;
        const mat = new THREE.MeshBasicMaterial({
          color: amber ? 0xf5a623 : 0x1df5a0,
          transparent: true,
          opacity: amber
            ? 0.05 + Math.random() * 0.05
            : 0.06 + Math.random() * 0.12,
          wireframe: true,
        });
        const mesh = new THREE.Mesh(geometry, mat) as unknown as MeshWithVel;
        mesh.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
        );
        const s = 0.3 + Math.random() * 1.2;
        mesh.scale.setScalar(s);
        mesh._vel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          0,
        );
        mesh._phase = Math.random() * Math.PI * 2;
        scene.add(mesh);
        meshes.push(mesh);
      }
    }

    let animId = 0;
    let last = 0;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (now - last < 33) return;
      last = now;

      const impulse = navImpulse;
      navImpulse *= 0.9;

      if (reducedMotion) {
        const m = meshes[0];
        const base = 1.45;
        m.scale.setScalar(base + impulse * 0.42);
        m.rotation.z += 0.0012 + impulse * 0.014;
        m.rotation.y += 0.0006 + impulse * 0.006;
      } else {
        meshes.forEach((m) => {
          const mm = m as MeshWithVel;
          const speed = 1 + impulse * 2.4;
          mm.position.addScaledVector(mm._vel, speed);

          const bob =
            Math.sin(now * 0.00016 + mm._phase) * 0.0022 +
            Math.sin(now * 0.00011 + mm._phase * 1.7) * 0.0011;
          mm.position.x += bob * 0.55;
          mm.position.y +=
            Math.cos(now * 0.00014 + mm._phase * 0.85) * 0.0018;

          const spin = 1 + impulse * 2.2;
          m.rotation.x += 0.002 * spin;
          m.rotation.y += 0.001 * spin;
          m.rotation.z += Math.sin(now * 0.00012 + mm._phase) * 0.00035;

          if (Math.abs(m.position.x) > 22) mm._vel.x *= -1;
          if (Math.abs(m.position.y) > 17) mm._vel.y *= -1;
        });
      }

      renderer.render(scene, camera);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(animate);
    };

    if (!document.hidden) {
      animId = requestAnimationFrame(animate);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener(VERSO_BG_NAV_EVENT, bumpNavImpulse);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 max-h-dvh max-w-full"
    />
  );
}
