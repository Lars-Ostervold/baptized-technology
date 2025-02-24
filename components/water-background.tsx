/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

const WaterBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement)
    }

    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;

          vec3 color = vec3(0.0);
          
          // Dark blue base color
          color = vec3(0.098, 0.153, 0.204);

          // Water ripple effect
          float t = u_time * 0.1;
          vec2 uv = st * 10.0; 
          
          for(float i = 1.0; i < 3.0; i++){
            uv.y += i * 0.15 * sin(uv.x * i * 0.5 + t * i);
            uv.x += i * 0.15 * cos(uv.y * i * 0.5 + t * i);
          }

          float r = abs(sin(uv.x - uv.y));
          
          // Add subtle blue highlights
          color += vec3(0.0, 0.10, 0.15) * r;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    camera.position.z = 1

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      uniforms.u_resolution.value.x = window.innerWidth
      uniforms.u_resolution.value.y = window.innerHeight
    }

    function onMouseMove(event: { clientX: number; clientY: number }) {
      uniforms.u_mouse.value.x = event.clientX
      uniforms.u_mouse.value.y = window.innerHeight - event.clientY
    }

    window.addEventListener("resize", onWindowResize)
    window.addEventListener("mousemove", onMouseMove)

    onWindowResize()

    function animate() {
      requestAnimationFrame(animate)
      uniforms.u_time.value += 0.05
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)
      window.removeEventListener("mousemove", onMouseMove)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-[-1]" />
}

export default WaterBackground