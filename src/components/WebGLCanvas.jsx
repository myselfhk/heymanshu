import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const HERO_OBJECTS = [
  { type: 'box', args: [2.5, 0.2, 1.5], pos: [-3.5, 1.5, -1], rot: [0.2, 0.5, 0.1], speed: 0.4, amp: 0.3 },
  { type: 'torus', args: [0.8, 0.25, 16, 32], pos: [3.2, 2, -2], rot: [0.8, 0.3, 0], speed: 0.3, amp: 0.4 },
  { type: 'cylinder', args: [0.15, 0.15, 3, 8], pos: [-2, -1.5, -1.5], rot: [0, 0, 0.7], speed: 0.5, amp: 0.25 },
  { type: 'cylinder', args: [0.8, 0.8, 0.2, 32], pos: [2, -2, -1], rot: [0.4, 0, 0], speed: 0.35, amp: 0.35 },
  { type: 'box', args: [1.2, 1.8, 0.1], pos: [4, 0.5, -2], rot: [0.1, -0.3, 0.05], speed: 0.25, amp: 0.3 },
  { type: 'torusKnot', args: [0.4, 0.15, 64, 8, 2, 3], pos: [-4, -0.5, -3], rot: [0.5, 0.2, 0], speed: 0.2, amp: 0.4 },
  { type: 'box', args: [2, 1.2, 0.15], pos: [0, 2.5, -2.5], rot: [0.3, 0.1, -0.1], speed: 0.3, amp: 0.2 },
  { type: 'dodecahedron', args: [0.6, 0], pos: [-1, -2.5, -2], rot: [0.4, 0.6, 0], speed: 0.45, amp: 0.35 },
  { type: 'box', args: [0.8, 0.3, 1.5], pos: [1, 0, -1.5], rot: [0.15, 0.8, 0.2], speed: 0.35, amp: 0.25 },
]

function createGeometry(type, args) {
  switch (type) {
    case 'box': return new THREE.BoxGeometry(...args)
    case 'torus': return new THREE.TorusGeometry(...args)
    case 'cylinder': return new THREE.CylinderGeometry(...args)
    case 'torusKnot': return new THREE.TorusKnotGeometry(...args)
    case 'dodecahedron': return new THREE.DodecahedronGeometry(...args)
    default: return new THREE.BoxGeometry(1, 1, 1)
  }
}

export default function WebGLCanvas({ loading }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Hero scene
    const heroScene = new THREE.Scene()
    const heroCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    heroCamera.position.z = 10

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    heroScene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 5, 5)
    heroScene.add(dirLight)

    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.4,
      metalness: 0.3,
    })

    const heroMeshes = HERO_OBJECTS.map((obj) => {
      const geo = createGeometry(obj.type, obj.args)
      const mesh = new THREE.Mesh(geo, material)
      mesh.position.set(obj.pos[0], obj.pos[1], obj.pos[2])
      mesh.rotation.set(obj.rot[0], obj.rot[1], obj.rot[2])
      mesh.scale.set(0, 0, 0)
      mesh.userData = { startY: obj.pos[1], speed: obj.speed, amp: obj.amp, phase: Math.random() * Math.PI * 2 }
      heroScene.add(mesh)
      return mesh
    })

    // Manifesto cube
    const cubeScene = new THREE.Scene()
    const cubeCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    cubeCamera.position.z = 5

    const cubeAmbient = new THREE.AmbientLight(0xffffff, 0.4)
    cubeScene.add(cubeAmbient)
    const cubeDirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    cubeDirLight.position.set(3, 3, 5)
    cubeScene.add(cubeDirLight)

    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.6,
      metalness: 0.2,
    })
    const cubeGeo = new THREE.BoxGeometry(2, 2, 2)
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial)
    cubeScene.add(cubeMesh)

    sceneRef.current = { renderer, heroScene, heroCamera, cubeScene, cubeCamera, heroMeshes, cubeMesh }

    const clock = new THREE.Clock()
    let heroOpacity = { value: 0 }
    let scrollProgress = { hero: 0, cube: 0 }
    let animFrameId

    // ScrollTrigger for hero objects fade out
    const heroST = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.hero = self.progress
      },
    })

    // ScrollTrigger for cube rotation
    const cubeST = ScrollTrigger.create({
      trigger: '#manifesto',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.cube = self.progress
      },
    })

    function animate() {
      animFrameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Hero objects animation
      heroMeshes.forEach((mesh) => {
        const { startY, speed, amp, phase } = mesh.userData
        mesh.position.y = startY + Math.sin(elapsed * speed + phase) * amp
        mesh.rotation.x += 0.002
        mesh.rotation.y += 0.003

        // Fade/scatter based on scroll
        const fadeOut = 1 - scrollProgress.hero
        mesh.material.opacity = fadeOut
        mesh.material.transparent = true
      })

      // Cube rotation based on scroll
      cubeMesh.rotation.x = scrollProgress.cube * Math.PI * 2
      cubeMesh.rotation.y = scrollProgress.cube * Math.PI * 1.5

      renderer.autoClear = true
      renderer.render(heroScene, heroCamera)

      // Render cube in a viewport area matching .manifesto__animation
      const cubeEl = document.querySelector('.manifesto__animation')
      if (cubeEl) {
        const rect = cubeEl.getBoundingClientRect()
        const w = window.innerWidth
        const h = window.innerHeight
        const left = rect.left
        const bottom = h - rect.bottom
        const width = rect.width
        const height = rect.height

        renderer.setViewport(left, bottom, width, height)
        renderer.setScissor(left, bottom, width, height)
        renderer.setScissorTest(true)
        renderer.autoClear = false
        renderer.render(cubeScene, cubeCamera)
        renderer.setScissorTest(false)
        renderer.setViewport(0, 0, w, h)
      }
    }

    animate()

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      heroCamera.aspect = w / h
      heroCamera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animFrameId)
      heroST.kill()
      cubeST.kill()
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  // Animate hero objects in when loading completes
  useEffect(() => {
    if (!loading && sceneRef.current.heroMeshes) {
      sceneRef.current.heroMeshes.forEach((mesh, i) => {
        gsap.to(mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: 1,
          ease: 'back.out(1.7)',
          delay: 0.1 * i + 0.3,
        })
      })
    }
  }, [loading])

  return (
    <canvas
      ref={canvasRef}
      id="webgl"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
