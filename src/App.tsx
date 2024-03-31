import * as BABYLON from '@babylonjs/core'
import { useEffect, useRef } from 'react'

export default function App() {
  const canvas = useRef()
  let engine: BABYLON.Engine
  let box: BABYLON.Mesh
  let roof: BABYLON.Mesh
  let ground: BABYLON.Mesh

  function createScene() {
    engine = new BABYLON.Engine(canvas.current, true)
    const scene = new BABYLON.Scene(engine)

    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 6, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true)
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, -1), scene)

    ground = buildGround()
    box = buildBox()
    roof = buildRoof()

    return scene
  }

  function buildBox(): BABYLON.Mesh {
    const boxMat = new BABYLON.StandardMaterial('boxMat')
    boxMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/cubehouse.png')

    const faceUV = []
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0) // rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0) // front face
    faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0) // right side
    faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0) // left side

    const box = BABYLON.MeshBuilder.CreateBox('box', { faceUV, wrap: true })
    box.position.y = 0.5
    box.material = boxMat

    return box
  }

  function buildRoof(): BABYLON.Mesh {
    const roofMat = new BABYLON.StandardMaterial('roofMat')
    roofMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/roof.jpg')

    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 })
    roof.scaling.x = 0.75
    roof.rotation.z = Math.PI / 2
    roof.position.y = 1.22
    roof.material = roofMat

    return roof
  }

  function buildGround(): BABYLON.Mesh {
    const groundMat = new BABYLON.StandardMaterial('groundMat')
    groundMat.diffuseTexture = new BABYLON.Texture('https://www.babylonjs-playground.com/textures/floor.png')
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 })
    ground.material = groundMat

    return ground
  }

  function onRender(scene: BABYLON.Scene) {
    // update your scene here
    const deltaTimeInMillis = scene.getEngine().getDeltaTime()
    const rpm = 10
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
    roof.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
  }

  useEffect(() => {
    const scene = createScene()

    engine.runRenderLoop(() => {
      if (scene && scene.activeCamera) {
        onRender(scene)
        scene.render()
      }
    })
  }, [])

  return (
    <canvas ref={canvas} className="w-screen h-auto focus:outline-none touch-none"></canvas>
  )
}
