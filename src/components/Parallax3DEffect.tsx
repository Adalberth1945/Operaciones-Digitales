import React, { useState, useEffect, ReactNode } from 'react';

interface Parallax3DProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  perspective?: number;
}

const Parallax3DEffect: React.FC<Parallax3DProps> = ({ 
  children, 
  className = '', 
  depth = 10, 
  perspective = 1000 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });
  const [elementPosition, setElementPosition] = useState({ left: 0, top: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isHovering || !ref) return;

    // Calculate position relative to the center of the element
    const x = e.clientX - elementPosition.left - elementSize.width / 2;
    const y = e.clientY - elementPosition.top - elementSize.height / 2;
    
    // Normalize between -1 and 1
    const normalizedX = x / (elementSize.width / 2);
    const normalizedY = y / (elementSize.height / 2);
    
    setPosition({ 
      x: normalizedX * depth, 
      y: normalizedY * depth 
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Animate back to center position
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!ref) return;

    // Update element size and position
    const updateElementMetrics = () => {
      if (ref) {
        const { width, height, left, top } = ref.getBoundingClientRect();
        setElementSize({ width, height });
        setElementPosition({ left, top });
      }
    };

    updateElementMetrics();
    window.addEventListener('resize', updateElementMetrics);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateElementMetrics);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, isHovering]);

  return (
    <div
      ref={setRef}
      className={`relative overflow-visible ${className}`}
      style={{ perspective: `${perspective}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateY(${position.x * 0.01}deg) rotateX(${-position.y * 0.01}deg) translateZ(${isHovering ? 20 : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Parallax3DEffect;