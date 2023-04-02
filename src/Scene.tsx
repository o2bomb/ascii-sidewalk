export interface SceneProps {}

export const Scene = () => {
  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial color="hotpink" />
    </mesh>
  );
};
