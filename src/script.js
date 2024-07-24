import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import {Sky} from "three/addons/objects/sky.js"

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture
const textureLoader = new THREE.TextureLoader()
const floorAlhaTexture = textureLoader.load('./floor/alpha.webp')
// static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp
const floorColorTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

//bricks texture
const bricksColorTexture = textureLoader.load('/wall/coast_bricks/castle_brick_broken_06_diff_1k.webp')
const bricksArmTexture = textureLoader.load('/wall/coast_bricks/castle_brick_broken_06_arm_1k.webp')
const bricksNormalTexture = textureLoader.load('/wall/coast_bricks/castle_brick_broken_06_nor_gl_1k.webp')

floorColorTexture.colorSpace = THREE.SRGBColorSpace
bricksColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8,8)
floorARMTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)
floorDisplacementTexture.repeat.set(8,8)



floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
// roof texture
const roofColorTexture = textureLoader.load('/roof/roof_slates/roof_slates_02_diff_1k.webp')
const roofArmTexture = textureLoader.load('/roof/roof_slates/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('/roof/roof_slates/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace


roofArmTexture.repeat.set(3,1)
roofColorTexture.repeat.set(3,1)
roofNormalTexture.repeat.set(3,1)
roofArmTexture.wrapS = THREE.RepeatWrapping
roofColorTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping
// bush
const bushColorTexture = textureLoader.load('/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushArmTexture = textureLoader.load('/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace
bushArmTexture.repeat.set(2,1)
bushColorTexture.repeat.set(2,1)
bushNormalTexture.repeat.set(2,1)
bushArmTexture.wrapS = THREE.RepeatWrapping
bushColorTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// grave
const graveColorTexture = textureLoader.load('/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveArmTexture = textureLoader.load('/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace
graveArmTexture.repeat.set(0.3,0.4)
graveColorTexture.repeat.set(0.3,0.4)
graveNormalTexture.repeat.set(0.3,0.4)
graveArmTexture.wrapS = THREE.RepeatWrapping
graveColorTexture.wrapS = THREE.RepeatWrapping
graveNormalTexture.wrapS = THREE.RepeatWrapping

const doorColorTexture = textureLoader.load('/door/color.webp')
const doorAlphaTexture = textureLoader.load('/door/alpha.webp')
const doorOcculusionTexture = textureLoader.load('/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('/door/height.webp')
const doorNormalTexture = textureLoader.load('/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('/door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace



/**
 * House
 */


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({ 
        alphaMap: floorAlhaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
     })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement Scale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias')

scene.add(floor)

// House Container

const house = new THREE.Group()
scene.add(house)

// Walls

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksArmTexture,
        roughnessMap: bricksArmTexture,
        metalnessMap: bricksArmTexture,
        normalMap: bricksNormalTexture

    })
)
walls.position.y = 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofArmTexture,
        roughnessMap: roofArmTexture,
        metalnessMap: roofArmTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door 
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2, 100,100),
    new THREE.MeshStandardMaterial({
        color: '#aa7b7b',
        transparent: true,
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorOcculusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
    
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushArmTexture,
    roughnessMap: bushArmTexture,
    metalnessMap: bushArmTexture,
    normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.rotation.x = -0.75
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.setScalar(0.25)
bush2.rotation.x = -0.75
bush2.position.set(1.4, 0.1, 2.1)


const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.setScalar(0.4)
bush3.rotation.x = -0.75
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.setScalar(0.15)
bush4.rotation.x = -0.75
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1,bush2,bush3,bush4)

// Graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveArmTexture,
    roughnessMap: graveArmTexture,
    metalnessMap: graveArmTexture,
    normalMap: graveNormalTexture,
})
const graves = new THREE.Group()
scene.add(graves)

for(let i = 0; i < 30; i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 5
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // grave.position.z
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4


    graves.add(grave)
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)

// ghost1.position.set(1, 0.2, 4.2)
// ghost2.position.set(-6, 0.2, 2.2)
// ghost3.position.set(6, 0.2, 2.2)

// ghost1.position.set(1, 0.2, 4.2)

scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

graves.children.forEach(grave => {
    grave.castShadow = true
    grave.receiveShadow = true
})

directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.near = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far =10
// open helper


// directionalLight.shadow.camera.right = 8

const sky = new Sky()
sky.scale.set(100,100,100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

// fog

scene.fog = new THREE.FogExp2('#04343f', 0.1)



/**2
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    const angle = elapsedTime * 0.5
    // animate ghosts
    ghost1.position.x = Math.cos(angle) * 4
    ghost1.position.z = Math.sin(angle)* 4 
    ghost1.position.y = Math.sin(angle) * Math.sin(angle * 2.34) * Math.sin(angle * 3.45)

    const angle2 = elapsedTime * 0.38

    ghost2.position.x = Math.cos(angle2) * 5
    ghost2.position.z = Math.sin(angle2)* 5
    ghost2.position.y = Math.sin(angle2) * Math.sin(angle2 * 2.34) * Math.sin(angle2 * 3.45)

    const angle3 = elapsedTime * 0.2

    ghost3.position.x = Math.cos(angle3) * 6
    ghost3.position.z = Math.sin(angle3)* 6
    ghost3.position.y = Math.sin(angle3) * Math.sin(angle3 * 2.34) * Math.sin(angle3 * 3.45)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()