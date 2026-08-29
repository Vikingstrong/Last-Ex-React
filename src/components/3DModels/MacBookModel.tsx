import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Model(props:any){
    const {scene} = useGLTF('/macbook.glb')
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

export default function MacBookModel() {
    return (
        <div className='w-full h-full max-w-full min-w-0 overflow-hidden flex items-center justify-center'>
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
                <Stage environment="city" intensity={1}>
                    <Model scale={1}/>
                </Stage>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/macbook.glb')