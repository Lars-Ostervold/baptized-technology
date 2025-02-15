"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// The Water class from Three.js examples:
import { Water } from "three/examples/jsm/objects/Water.js";

const RealisticWaterBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ----------------------------
    // 1) Basic Scene + Renderer
    // ----------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    camera.position.set(0, 20, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent if you want
    containerRef.current.appendChild(renderer.domElement);

    // ----------------------------
    // 2) Lighting
    // ----------------------------
    // A dim directional light for nighttime
    const directionalLight = new THREE.DirectionalLight(0xaabbee, 0.2);
    directionalLight.position.set(-100, 100, -100).normalize();
    scene.add(directionalLight);

    // Optionally add a small ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    // ----------------------------
    // 3) Sky / Environment
    // ----------------------------
    // For a simple dark “night sky,” we can create a giant sphere or box:
    // (Replace with a starry texture or a real skybox for reflections!)
    const skyGeo = new THREE.SphereGeometry(10000, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // ----------------------------
    // 4) Water Setup
    // ----------------------------
    // Use a large plane geometry to represent an infinite body of water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    // Load water normals (must be in your public folder, e.g. /textures/waternormals.jpg)
    const waterNormals = new THREE.TextureLoader().load("/textures/waternormals.jpg");
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    // Create the Water object from the example
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      alpha: 1.0,
      // Slightly greenish-blue water color for a natural look
      waterColor: 0x001e0f,
      // For a nighttime effect, you can reduce reflection or tweak the color
      distortionScale: 3.0,
      fog: false,
    });

    // Rotate the water so it’s horizontal
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // ----------------------------
    // 5) Animation Loop
    // ----------------------------
    let frameId: number;
    const animate = () => {
      // Update water time to animate subtle waves
      // “time” is used internally for wave motion
      water.material.uniforms["time"].value += 0.5 / 60.0;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ----------------------------
    // 6) Responsive Resize
    // ----------------------------
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // ----------------------------
    // 7) Optional Mouse Interaction
    // ----------------------------
    // If you want to create subtle ripples where the user’s mouse is,
    // you’ll need to modify the Water shader or do your own custom approach.
    // The official Water class doesn't directly expose "mouse ripple" control.
    // However, we can do a hack by changing the water's "distortionScale" or
    // wave speed in response to mouse movement, for example:
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      // Example: Adjust distortion slightly based on cursor
      water.material.uniforms["distortionScale"].value = 3.0 + x * 2.0;
    };
    window.addEventListener("pointermove", onPointerMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("pointermove", onPointerMove);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // behind your content
        overflow: "hidden",
      }}
    />
  );
};

export default RealisticWaterBackground;
