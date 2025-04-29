import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RobotAnimationProps {
  className?: string;
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ className = '' }) => {
  const robotRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const armLeftRef = useRef<HTMLDivElement>(null);
  const armRightRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;

      const robotRect = robotRef.current.getBoundingClientRect();
      const robotCenterX = robotRect.left + robotRect.width / 2;
      const robotCenterY = robotRect.top + robotRect.height / 2;
      
      // Calculate the angle between mouse and robot center
      const dx = e.clientX - robotCenterX;
      const dy = e.clientY - robotCenterY;
      
      // Enhanced movement parameters
      const maxRotation = 20; // maximum rotation in degrees
      const maxArmRotation = 15; // maximum arm rotation in degrees
      const maxBodyRotation = 5; // maximum body rotation in degrees
      
      // Eyes follow mouse with more sensitivity
      if (eyesRef.current) {
        gsap.to(eyesRef.current, {
          duration: 0.5,
          x: dx / 15,
          y: dy / 15,
          ease: "power2.out"
        });
      }
      
      // Head follows mouse with less sensitivity
      if (headRef.current) {
        gsap.to(headRef.current, {
          duration: 0.8,
          rotationY: (dx / robotRect.width) * maxRotation * 1.2,
          rotationX: -(dy / robotRect.height) * maxRotation * 0.6,
          ease: "power2.out"
        });
      }
      
      // Body follows mouse with subtle movement
      if (bodyRef.current) {
        gsap.to(bodyRef.current, {
          duration: 1,
          rotationY: (dx / robotRect.width) * maxBodyRotation,
          rotationX: -(dy / robotRect.height) * maxBodyRotation / 2,
          x: dx / 50,
          ease: "power2.out"
        });
      }
      
      // Arms move slightly based on mouse position
      if (armLeftRef.current) {
        gsap.to(armLeftRef.current, {
          duration: 1,
          rotation: (dx / robotRect.width) * maxArmRotation - 5,
          y: Math.abs(dx) / 50,
          ease: "power2.out"
        });
      }
      
      if (armRightRef.current) {
        gsap.to(armRightRef.current, {
          duration: 1,
          rotation: (dx / robotRect.width) * maxArmRotation + 5,
          y: Math.abs(dx) / 50,
          ease: "power2.out"
        });
      }
      
      // Core pulse effect intensifies with mouse proximity
      if (coreRef.current) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt(robotRect.width * robotRect.width + robotRect.height * robotRect.height) / 2;
        const intensity = 1 - Math.min(distance / maxDistance, 1);
        
        gsap.to(coreRef.current, {
          duration: 0.5,
          scale: 1 + intensity * 0.2,
          opacity: 0.8 + intensity * 0.2,
          ease: "power2.out"
        });
      }
    };

    // Idle animation
    const idleAnimation = () => {
      if (headRef.current) {
        gsap.to(headRef.current, {
          duration: 3,
          rotationY: -3,
          rotationX: 2,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut"
        });
      }
      
      // Body subtle floating animation
      if (bodyRef.current) {
        gsap.to(bodyRef.current, {
          duration: 4,
          y: -5,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut"
        });
      }
      
      // Arms gentle swaying
      const armAnimation = {
        duration: 3,
        rotation: 3,
        y: 2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      };
      
      if (armLeftRef.current) {
        gsap.to(armLeftRef.current, { ...armAnimation, delay: 0.5 });
      }
      
      if (armRightRef.current) {
        gsap.to(armRightRef.current, { ...armAnimation, delay: 0 });
      }
      
      if (eyesRef.current) {
        // Occasional blink
        const blinkTimeline = gsap.timeline({repeat: -1, repeatDelay: 3});
        blinkTimeline.to(eyesRef.current, {
          scaleY: 0.1,
          duration: 0.1,
          ease: "power1.inOut"
        }).to(eyesRef.current, {
          scaleY: 1,
          duration: 0.1,
          ease: "power1.inOut"
        });
      }
    };

    // Start idle animation
    idleAnimation();
    
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={robotRef} className={`relative w-40 h-56 sm:w-48 sm:h-64 ${className}`}>
      {/* Robot Body */}
      <div 
        ref={bodyRef}
        className="absolute w-28 h-40 sm:w-32 sm:h-48 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-slate-700 to-slate-900 rounded-2xl flex flex-col items-center justify-start overflow-hidden transformstyle-preserve-3d"
      >
        <div className="w-full h-1/2 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-20"></div>
        
        {/* Energy Core */}
        <div 
          ref={coreRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-cyan-500 opacity-80 shadow-[0_0_15px_5px_rgba(6,182,212,0.5)] animate-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm"></div>
        </div>
        
        {/* Control Panels */}
        <div className="absolute bottom-4 w-3/4 h-6 sm:h-8 bg-slate-800 rounded-md flex justify-around items-center">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500"></div>
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-yellow-500"></div>
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Robot Head */}
      <div ref={headRef} className="absolute w-20 sm:w-24 h-20 sm:h-24 left-1/2 top-0 -translate-x-1/2 -translate-y-1/6 sm:-translate-y-1/4 bg-slate-800 rounded-2xl flex items-center justify-center transformstyle-preserve-3d perspective-800 origin-bottom">
        {/* Face Plate */}
        <div className="absolute inset-1 bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl"></div>
        
        {/* Eyes */}
        <div ref={eyesRef} className="flex space-x-3 sm:space-x-4 z-10">
          <div className="w-3 sm:w-4 h-1.5 sm:h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_2px_rgba(6,182,212,0.5)]"></div>
          <div className="w-3 sm:w-4 h-1.5 sm:h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_2px_rgba(6,182,212,0.5)]"></div>
        </div>
        
        {/* Antenna */}
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-0.5 sm:w-1 h-3 sm:h-4 bg-slate-600">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 animate-pulse"></div>
        </div>
      </div>
      
      {/* Robot Arms */}
      <div ref={armLeftRef} className="absolute w-4 sm:w-6 h-16 sm:h-20 left-0 top-1/4 sm:top-20 bg-slate-800 rounded-full origin-top transformstyle-preserve-3d"></div>
      <div ref={armRightRef} className="absolute w-4 sm:w-6 h-16 sm:h-20 right-0 top-1/4 sm:top-20 bg-slate-800 rounded-full origin-top transformstyle-preserve-3d"></div>
    </div>
  );
};

export default RobotAnimation;