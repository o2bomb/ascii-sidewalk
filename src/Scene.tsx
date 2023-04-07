import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export const Scene = () => {
  const meshRef = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.8;
    meshRef.current.rotation.y += delta * 0.8;
    meshRef.current.rotation.z += delta * 0.8;
  });

  return (
    <>
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <mesh
        ref={meshRef}
        rotation-x={(45 * Math.PI) / 180}
        rotation-y={(45 * Math.PI) / 180}
        rotation-z={(45 * Math.PI) / 180}
      >
        <torusKnotGeometry />
        <meshLambertMaterial color="white" />
      </mesh>
    </>
  );
};
