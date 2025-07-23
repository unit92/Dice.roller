import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

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

export default function DiceCanvas({ trigger }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const directional = new THREE.DirectionalLight(0xffffff, 0.8)
    directional.position.set(5, 10, 7)
    scene.add(directional)

    // physics world with gravity
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    })

    // ground plane
    const planeBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    })
    planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    world.addBody(planeBody)

    const planeGeometry = new THREE.PlaneGeometry(10, 10)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    const diceShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))

    const diceBody1 = new CANNON.Body({ mass: 1, shape: diceShape })
    diceBody1.position.set(-1.2, 3, 0)
    world.addBody(diceBody1)
    const dice1 = createDice()
    scene.add(dice1)

    const diceBody2 = new CANNON.Body({ mass: 1, shape: diceShape })
    diceBody2.position.set(1.2, 3, 0)
    world.addBody(diceBody2)
    const dice2 = createDice()
    scene.add(dice2)

    const onResize = () => {
      const { clientWidth, clientHeight } = mount
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let lastTime = performance.now()
    let frameId
    const animate = () => {
      const time = performance.now()
      const delta = (time - lastTime) / 1000
      lastTime = time

      world.step(1 / 60, delta)

      dice1.position.set(diceBody1.position.x, diceBody1.position.y, diceBody1.position.z)
      dice1.quaternion.set(
        diceBody1.quaternion.x,
        diceBody1.quaternion.y,
        diceBody1.quaternion.z,
        diceBody1.quaternion.w,
      )
      dice2.position.set(diceBody2.position.x, diceBody2.position.y, diceBody2.position.z)
      dice2.quaternion.set(
        diceBody2.quaternion.x,
        diceBody2.quaternion.y,
        diceBody2.quaternion.z,
        diceBody2.quaternion.w,
      )

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

  useEffect(() => {
    console.log('trigger', trigger)
  }, [trigger])

  return <div ref={mountRef} className="w-full h-full" />
}
