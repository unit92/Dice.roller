import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function createFaceTexture(number) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000000'
  ctx.font = `${size * 0.6}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(number), size / 2, size / 2)
  return new THREE.CanvasTexture(canvas)
}

function createDice() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const materials = [1, 2, 3, 4, 5, 6].map((n) =>
    new THREE.MeshStandardMaterial({ map: createFaceTexture(n) })
  )
  return new THREE.Mesh(geometry, materials)
}

export default function DiceCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambient)
    const directional = new THREE.DirectionalLight(0xffffff, 0.5)
    directional.position.set(5, 5, 5)
    scene.add(directional)

    const dice1 = createDice()
    dice1.position.x = -1.2
    const dice2 = createDice()
    dice2.position.x = 1.2
    scene.add(dice1)
    scene.add(dice2)

    const onResize = () => {
      const { clientWidth, clientHeight } = mount
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let frameId
    const animate = () => {
      dice1.rotation.x += 0.01
      dice1.rotation.y += 0.01
      dice2.rotation.x += 0.01
      dice2.rotation.y += 0.01
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}
