import React, { useEffect, useState, useRef } from "react";

interface Circle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  scale: number;
}

interface BackgroundCirclesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  color?: string;
  animated?: boolean;
  zIndex?: number;
  className?: string;
}

const BackgroundCircles: React.FC<BackgroundCirclesProps> = ({
  count = 15,
  minSize = 50,
  maxSize = 200,
  minOpacity = 0.1,
  maxOpacity = 0.3,
  color = "#005A8D",
  animated = true,
  zIndex = 0,
  className = "",
}) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);

  // Set initial dimensions safely for SSR
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  // Generate random circles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newCircles: Circle[] = [];
    for (let i = 0; i < count; i++) {
      newCircles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        scale: 0.95 + Math.random() * 0.1,
      });
    }
    setCircles(newCircles);
  }, [
    dimensions.width,
    dimensions.height,
    count,
    minSize,
    maxSize,
    minOpacity,
    maxOpacity,
  ]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!animated) return;

    const animate = () => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          let newX = circle.x + circle.speedX;
          let newY = circle.y + circle.speedY;
          let newSpeedX = circle.speedX;
          let newSpeedY = circle.speedY;

          if (newX < 0 || newX > dimensions.width) {
            newSpeedX *= -1;
            newX = Math.max(0, Math.min(newX, dimensions.width));
          }
          if (newY < 0 || newY > dimensions.height) {
            newSpeedY *= -1;
            newY = Math.max(0, Math.min(newY, dimensions.height));
          }

          const newScale =
            circle.scale + Math.sin(Date.now() / 2000 + circle.id) * 0.01;

          return {
            ...circle,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            scale: newScale,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animated, dimensions.width, dimensions.height]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex, backgroundColor: "#0B0B39" }}
    >
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full transform transition-transform duration-[2000ms] ease-in-out"
          style={{
            left: `${circle.x}px`,
            top: `${circle.y}px`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            backgroundColor: color,
            opacity: circle.opacity,
            transform: `translate(-50%, -50%) scale(${circle.scale})`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundCircles;
