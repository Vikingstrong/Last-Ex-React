import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Model(props:any){
    const {scene} = useGLTF('/iphone_17_pro_max.glb')
    const ref = useRef<THREE.Group>(null!)

    useFrame((state) => {
        const targetY = state.pointer.x * Math.PI * 0.3 
        const targetX = -state.pointer.y * Math.PI * 0.15 

        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.1)
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.00)
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetX, 0.05)
    })

    return <primitive ref={ref} object={scene} {...props} />
}

export default function IphoneModel() {
    return (
        <div className='w-1/2 h-100'>
            <Canvas camera={{ position: [1, 0, 0], fov: 70 }}>
                <Stage environment="city" intensity={3}>
                    <Model scale={1.3} />
                </Stage>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/iphone_17_pro_max.glb')