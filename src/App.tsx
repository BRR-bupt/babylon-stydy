import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders'
import { useEffect, useRef } from 'react'

export default function App() {
  const canvas = useRef()
  let engine: BABYLON.Engine
  let box: BABYLON.Mesh
  let roof: BABYLON.Mesh
  let ground: BABYLON.Mesh
  let house: BABYLON.Mesh

  function createScene() {
    engine = new BABYLON.Engine(canvas.current, true)
    const scene = new BABYLON.Scene(engine)
    /** ** Set camera and light *****/
    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0))
    camera.attachControl(canvas, true)
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0))

    // buildDwellings()
    BABYLON.SceneLoader.ImportMeshAsync('', './meshs/', 'scene.glb')

    return scene
  }

  function buildDwellings() {
    const ground = buildGround()

    const detached_house = buildHouse(1)
    detached_house.rotation.y = -Math.PI / 16
    detached_house.position.x = -6.8
    detached_house.position.z = 2.5

    const semi_house = buildHouse(2)
    semi_house.rotation.y = -Math.PI / 16
    semi_house.position.x = -4.5
    semi_house.position.z = 3

    const places = [] // each entry is an array [house type, rotation, x, z]
    places.push([1, -Math.PI / 16, -6.8, 2.5])
    places.push([2, -Math.PI / 16, -4.5, 3])
    places.push([2, -Math.PI / 16, -1.5, 4])
    places.push([2, -Math.PI / 3, 1.5, 6])
    places.push([2, 15 * Math.PI / 16, -6.4, -1.5])
    places.push([1, 15 * Math.PI / 16, -4.1, -1])
    places.push([2, 15 * Math.PI / 16, -2.1, -0.5])
    places.push([1, 5 * Math.PI / 4, 0, -1])
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3])
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5])
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7])
    places.push([2, Math.PI / 1.9, 4.75, -1])
    places.push([1, Math.PI / 1.95, 4.5, -3])
    places.push([2, Math.PI / 1.9, 4.75, -5])
    places.push([1, Math.PI / 1.9, 4.75, -7])
    places.push([2, -Math.PI / 3, 5.25, 2])
    places.push([1, -Math.PI / 3, 6, 4])

    // Create instances from the first two that were built
    const houses = []
    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1)
        houses[i] = detached_house.createInstance(`house${i}`)

      else
        houses[i] = semi_house.createInstance(`house${i}`)

      houses[i].rotation.y = places[i][1]
      houses[i].position.x = places[i][2]
      houses[i].position.z = places[i][3]
    }
  }

  function buildHouse(width: number) {
    const box = buildBox(width)
    const roof = buildRoof(width)

    return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true)
  }

  function buildBox(width: number): BABYLON.Mesh {
    const boxMat = new BABYLON.StandardMaterial('boxMat')
    if (width === 2)
      boxMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/semihouse.png')

    else
      boxMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/cubehouse.png')

    // options parameter to set different images on each side
    const faceUV = []
    if (width === 2) {
      faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0) // rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0) // front face
      faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0) // right side
      faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0) // left side
    }
    else {
      faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0) // rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0) // front face
      faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0) // right side
      faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0) // left side
    }
    // top 4 and bottom 5 not seen so not set

    /** ** World Objects *****/
    const box = BABYLON.MeshBuilder.CreateBox('box', { width, faceUV, wrap: true })
    box.material = boxMat
    box.position.y = 0.5

    return box
  }

  function buildRoof(width: number): BABYLON.Mesh {
    const roofMat = new BABYLON.StandardMaterial('roofMat')
    roofMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/roof.jpg')

    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 })
    roof.scaling.x = 0.75
    roof.scaling.y = width
    roof.rotation.z = Math.PI / 2
    roof.position.y = 1.22
    roof.material = roofMat

    return roof
  }

  function buildGround(): BABYLON.Mesh {
    const groundMat = new BABYLON.StandardMaterial('groundMat')
    groundMat.diffuseTexture = new BABYLON.Texture('https://www.babylonjs-playground.com/textures/floor.png')
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 16, height: 16 })
    ground.material = groundMat

    return ground
  }

  function onRender(scene: BABYLON.Scene) {
    // update your scene here
    const deltaTimeInMillis = scene.getEngine().getDeltaTime()
    const rpm = 10
    house.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
  }

  useEffect(() => {
    const scene = createScene()

    engine.runRenderLoop(() => {
      if (scene && scene.activeCamera) {
        // onRender(scene)
        scene.render()
      }
    })
  }, [])

  return (
    <canvas ref={canvas} className="w-screen h-auto focus:outline-none touch-none"></canvas>
  )
}
