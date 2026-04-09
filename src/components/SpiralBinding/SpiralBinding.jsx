import { useMemo } from 'react';

const SpiralBinding = ({ count = 14 }) => {
  const rings = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <div className="spiral-binding" aria-hidden="true">
      {rings.map((i) => (
        <div key={i} className="spiral-ring" />
      ))}
    </div>
  );
};

export default SpiralBinding;
