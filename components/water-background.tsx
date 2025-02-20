"use client"
import { useRef, useEffect } from "react"
import * as THREE from "three"

const WaterBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })

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
      u_mouseDelta: { value: new THREE.Vector2() },
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
        uniform vec2 u_mouseDelta;

        float circle(vec2 uv, vec2 center, float radius, float blur) {
          float d = length(uv - center);
          return smoothstep(radius, radius * (1.0 - blur), d);
        }

        // Improved ripple function with very sharp falloff
        float ripple(float dist, float time, float frequency, float amplitude) {
          float wave = sin(dist * frequency - time);
          float envelope = exp(-dist * 16.0); // Much sharper distance falloff
          return wave * envelope * amplitude;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;
          
          vec2 mouse = u_mouse / u_resolution.xy;
          mouse.x *= u_resolution.x / u_resolution.y;

          vec3 color = vec3(0.0);
          
          // Dark blue base color
          color = vec3(0.0, 0.02, 0.05);

          // Water ripple effect
          float t = u_time * 0.1;
          vec2 uv = st * 10.0;
          
          // Basic water movement
          for(float i = 1.0; i < 3.0; i++){
            uv.y += i * 0.15 * sin(uv.x * i * 0.5 + t * i);
            uv.x += i * 0.15 * cos(uv.y * i * 0.5 + t * i);
          }

          // Mouse interaction ripples
          float distToMouse = length(st - mouse);
          
          // Primary ripple with stronger local distortion but tighter radius
          float primaryRipple = ripple(distToMouse, u_time * 1.5, 30.0, 1.0);
          
          // Secondary ripple for added detail, also with tighter radius
          float secondaryRipple = ripple(distToMouse, u_time * 2.0, 35.0, 0.5);
          
          // Combine ripples
          float mouseRipple = primaryRipple + secondaryRipple;
          
          // Add mouse movement distortion with much smaller radius but stronger effect
          vec2 movement = u_mouseDelta / u_resolution.xy;
          float movementStrength = length(movement) * 15.0; // Even stronger local effect
          float movementRipple = circle(st, mouse, 0.03, 0.98) * movementStrength; // Much smaller radius
          
          // Sharp falloff for the ripple effect
          mouseRipple *= smoothstep(0.04, 0.0, distToMouse); // Very tight radius for ripple visibility

          // Combine effects
          float r = abs(sin(uv.x - uv.y));
          r += mouseRipple + movementRipple;
          
          // Enhanced local distortion with tighter radius
          vec2 distortion = vec2(
            sin(distToMouse * 20.0 + u_time),
            cos(distToMouse * 20.0 + u_time)
          ) * movementRipple * 0.03; // Stronger local UV distortion
          
          // Apply distortion to color sampling
          color += vec3(0.0, 0.08, 0.15) * r;
          
          // Add more pronounced local highlights with tighter radius
          float localHighlight = smoothstep(0.01, 0.0, distToMouse) * movementStrength;
          color += vec3(0.0, 0.15, 0.3) * localHighlight;
          
          // Add subtle color variation based on distortion
          color += vec3(0.01, 0.05, 0.1) * length(distortion) * 3.0;
          
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
      const newX = event.clientX
      const newY = window.innerHeight - event.clientY

      // Calculate mouse movement delta
      uniforms.u_mouseDelta.value.x = newX - mouseRef.current.x
      uniforms.u_mouseDelta.value.y = newY - mouseRef.current.y

      // Update target mouse position
      targetMouseRef.current.x = newX
      targetMouseRef.current.y = newY

      // Store current position for next frame
      mouseRef.current.x = newX
      mouseRef.current.y = newY
    }

    window.addEventListener("resize", onWindowResize)
    window.addEventListener("mousemove", onMouseMove)

    onWindowResize()

    function animate() {
      requestAnimationFrame(animate)
      uniforms.u_time.value += 0.03

      // Smooth mouse movement
      uniforms.u_mouse.value.x += (targetMouseRef.current.x - uniforms.u_mouse.value.x) * 0.1
      uniforms.u_mouse.value.y += (targetMouseRef.current.y - uniforms.u_mouse.value.y) * 0.1

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

