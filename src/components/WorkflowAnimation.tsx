import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowAnimationProps {
  className?: string;
}

const WorkflowAnimation: React.FC<WorkflowAnimationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isActive = useRef<boolean>(false);
  const mousePositionRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const [instructionVisible, setInstructionVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Animation parameters
  const NODE_COUNT = 12;
  const LINE_COLOR = '#67e8f9';
  const NODE_COLORS = ['#67e8f9', '#a78bfa', '#38bdf8', '#fb7185'];
  const ORGANIZED_POSITIONS: {x: number, y: number}[] = [];
  
  useEffect(() => {
    // Check if we're on a mobile device based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size based on container
    const resizeCanvas = () => {
      if (canvas && container) {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
        
        // Calculate organized positions in a workflow pattern
        calculateOrganizedPositions(rect.width, rect.height);
      }
    };
    
    const calculateOrganizedPositions = (width: number, height: number) => {
      // Clear previous positions
      ORGANIZED_POSITIONS.length = 0;
      
      // Create a flowing S-pattern for the workflow
      const centerY = height / 2;
      const horizontalSpacing = width / (NODE_COUNT / 2 + 1);
      
      for (let i = 0; i < NODE_COUNT; i++) {
        let x, y;
        
        if (i < NODE_COUNT / 2) {
          // First half goes from left to right
          x = horizontalSpacing * (i + 1);
          y = centerY - (height * 0.15);
        } else {
          // Second half goes from right to left in a slightly lower row
          x = width - horizontalSpacing * (i - NODE_COUNT / 2 + 1);
          y = centerY + (height * 0.15);
        }
        
        ORGANIZED_POSITIONS.push({ x, y });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create nodes
    interface Node {
      id: number;
      x: number;
      y: number;
      initialX: number;
      initialY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      connections: number[];
      strokeColor: string;
      strokeWidth: number;
      processing: boolean;
      pulseFrequency: number;
      pulseMagnitude: number;
      interactionStrength: number;
      hoverGlow: number;
      orderProgress: number; // Track progress from chaos to order (0 to 1)
      isolated: boolean; // Flag to mark nodes as isolated initially
    }
    
    const nodes: Node[] = [];
    
    // Get node size based on screen width
    const getNodeSize = () => {
      const width = window.innerWidth;
      // Scale down node size on smaller screens
      if (width < 480) return { min: 4, max: 8 }; // Extra small screens
      if (width < 768) return { min: 6, max: 10 }; // Mobile
      if (width < 1024) return { min: 8, max: 12 }; // Tablet
      return { min: 10, max: 15 }; // Desktop
    };
    
    const nodeSizeRange = getNodeSize();
    
    // Initialize nodes with some isolated from the main group
    for (let i = 0; i < NODE_COUNT; i++) {
      // Determine if this node should be isolated
      const isIsolated = i === 0 || i === 4 || i === 9; // Make 3 nodes isolated initially
      
      let x, y;
      
      if (isIsolated) {
        // Position isolated nodes far from the center
        if (i === 0) {
          // Top left corner
          x = canvas.width * 0.15;
          y = canvas.height * 0.15;
        } else if (i === 4) {
          // Bottom right corner
          x = canvas.width * 0.85;
          y = canvas.height * 0.85;
        } else {
          // Top right corner
          x = canvas.width * 0.85;
          y = canvas.height * 0.2;
        }
      } else {
        // The rest of the nodes in a semi-organized cluster
        const section = Math.floor((i % 9) / 3); // Divide into 3 sections
        const sectionWidth = canvas.width / 3;
        
        // More controlled random positioning in the center area
        x = sectionWidth * (section + 0.5) + Math.random() * sectionWidth * 0.6 - sectionWidth * 0.3;
        y = canvas.height * 0.5 + Math.random() * (canvas.height * 0.3) - (canvas.height * 0.15);
      }
      
      nodes.push({
        id: i,
        x: x,
        y: y,
        initialX: x,
        initialY: y,
        size: Math.random() * (nodeSizeRange.max - nodeSizeRange.min) + nodeSizeRange.min, // Responsive size based on screen
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        vx: (Math.random() - 0.5) * 1.2, // Lower initial velocity
        vy: (Math.random() - 0.5) * 1.2,
        targetX: ORGANIZED_POSITIONS[i]?.x || 0,
        targetY: ORGANIZED_POSITIONS[i]?.y || 0,
        connections: [],
        strokeColor: 'rgba(255,255,255,0.2)',
        strokeWidth: 1,
        processing: i % 4 === 0, // Some nodes start as "processing"
        pulseFrequency: 0.8 + Math.random() * 2, // Slower pulse frequency
        pulseMagnitude: 1.5 + Math.random() * 3, // Gentler pulse
        interactionStrength: 0.03 + Math.random() * 0.07, // Gentler interaction
        hoverGlow: 0,
        orderProgress: 0, // Start at 0 (chaotic)
        isolated: isIsolated // Mark node as isolated
      });
    }
    
    // Create connections between consecutive nodes for the main workflow, 
    // but SKIP connections to isolated nodes initially
    for (let i = 0; i < nodes.length - 1; i++) {
      // Don't create connections TO isolated nodes
      if (!nodes[i + 1].isolated) {
        // Don't create connections FROM isolated nodes
        if (!nodes[i].isolated) {
          nodes[i].connections.push(i + 1);
        }
      }
    }
    
    // Create a few internal connections within the main cluster
    for (let i = 0; i < 4; i++) {
      const sourceIdx = Math.floor(Math.random() * nodes.length);
      const targetIdx = Math.floor(Math.random() * nodes.length);
      
      // Only create connections between non-isolated nodes
      if (!nodes[sourceIdx].isolated && !nodes[targetIdx].isolated && 
          sourceIdx !== targetIdx && !nodes[sourceIdx].connections.includes(targetIdx)) {
        nodes[sourceIdx].connections.push(targetIdx);
      }
    }
    
    // Create some isolated mini-clusters among the isolated nodes
    if (nodes[0] && nodes[4] && nodes[0].isolated && nodes[4].isolated) {
      // Connect isolated node 0 to isolated node 9 (they form their own mini-cluster)
      nodes[0].connections.push(9);
    }
    
    // Draw a node with realistic glow
    const drawNode = (node: Node, time: number) => {
      if (!ctx) return;
      
      // Pulse effect
      const pulseFactor = Math.sin(time * node.pulseFrequency) * node.pulseMagnitude;
      let displaySize = node.size + (node.processing ? pulseFactor : 0) + node.hoverGlow;
      
      // Ensure displaySize is never negative before using it in gradient calculations
      displaySize = Math.max(0.1, displaySize);
      
      // Outer glow
      const glowSize = displaySize * 1.5;
      const glowGradient = ctx.createRadialGradient(
        node.x, node.y, displaySize * 0.5,
        node.x, node.y, glowSize
      );
      
      // Calculate glow opacity based on processing status, hover, and order progress
      const baseGlowOpacity = node.processing ? 0.3 : 0.1;
      const hoverGlowBoost = node.hoverGlow > 0 ? 0.4 : 0;
      const orderBoost = node.orderProgress * 0.2; // More glow as ordering increases
      const glowOpacity = baseGlowOpacity + hoverGlowBoost + orderBoost;
      
      glowGradient.addColorStop(0, `${node.color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`);
      glowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // Main circle with gradient
      const gradient = ctx.createRadialGradient(
        node.x - displaySize * 0.3, node.y - displaySize * 0.3, displaySize * 0.1,
        node.x, node.y, displaySize
      );
      
      // Make the color more vibrant when processing, hovered, or ordered
      const colorIntensity = node.processing || node.hoverGlow > 0 ? 1 : 0.7 + (node.orderProgress * 0.3);
      
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, `rgba(${parseInt(node.color.slice(1, 3), 16) * colorIntensity}, ${parseInt(node.color.slice(3, 5), 16) * colorIntensity}, ${parseInt(node.color.slice(5, 7), 16) * colorIntensity}, 0.7)`);
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, displaySize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Inner highlight for 3D effect
      ctx.beginPath();
      ctx.arc(node.x - displaySize * 0.25, node.y - displaySize * 0.25, displaySize * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${node.processing ? 0.2 : 0.1 + (node.orderProgress * 0.1)})`;
      ctx.fill();
      
      // Stroke
      ctx.beginPath();
      ctx.arc(node.x, node.y, displaySize, 0, Math.PI * 2);
      ctx.strokeStyle = node.hoverGlow > 0 ? '#ffffff' : (node.orderProgress > 0.5 ? `rgba(255, 255, 255, ${0.2 + (node.orderProgress * 0.3)})` : node.strokeColor);
      ctx.lineWidth = node.hoverGlow > 0 ? 2 : node.strokeWidth;
      ctx.stroke();
      
      // If node is processing, add a spinning arc
      if (node.processing) {
        const arcStart = (time * 2) % (Math.PI * 2);
        const arcEnd = arcStart + Math.PI;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, displaySize + 5, arcStart, arcEnd);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Add an order indicator when transitioning
      if (node.orderProgress > 0.1 && node.orderProgress < 0.95) {
        const indicatorSize = 3 + (node.orderProgress * 4);
        const indicatorAngle = Math.PI * 2 * node.orderProgress;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, displaySize + 8, 0, indicatorAngle);
        ctx.strokeStyle = `rgba(255, 255, 255, ${node.orderProgress})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Add indicator for isolated nodes
      if (node.isolated && node.orderProgress < 0.5) {
        const dashLength = 5;
        const gapLength = 3;
        const radius = displaySize + 10;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.setLineDash([dashLength, gapLength]);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash pattern
      }
    };
    
    // Draw connections between nodes with flow animation
    const drawConnections = (time: number) => {
      if (!ctx) return;
      
      // Draw connections first (behind nodes)
      for (const node of nodes) {
        for (const connIdx of node.connections) {
          const connectedNode = nodes[connIdx];
          
          // Determine if this is an ordered connection (part of the main workflow)
          const isOrderedConnection = Math.abs(node.id - connectedNode.id) === 1;
          
          // Calculate control points for curved lines
          const midX = (node.x + connectedNode.x) / 2;
          const midY = (node.y + connectedNode.y) / 2;
          
          // Add some vertical offset to the control point for a nice curve
          const dx = connectedNode.x - node.x;
          const dy = connectedNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Adjust control point curvature based on order progress
          // Less curve when ordered, more curve when chaotic
          const curveFactor = 0.2 - (node.orderProgress * 0.15);
          
          const controlPointX = midX;
          const controlPointY = midY - distance * curveFactor;
          
          // Draw curved connection
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.quadraticCurveTo(controlPointX, controlPointY, connectedNode.x, connectedNode.y);
          
          // Create gradient for connection
          const gradient = ctx.createLinearGradient(
            node.x, node.y,
            connectedNode.x, connectedNode.y
          );
          
          gradient.addColorStop(0, node.color);
          gradient.addColorStop(1, connectedNode.color);
          
          // Calculate line opacity based on state and connection type
          let lineOpacity = 0.2;
          
          // Increase opacity for main workflow connections as ordering increases
          if (isOrderedConnection) {
            lineOpacity = 0.2 + (node.orderProgress * 0.5);
          } else {
            // Decrease opacity for chaotic connections as ordering increases
            lineOpacity = 0.2 - (node.orderProgress * 0.15);
          }
          
          // Boost opacity when system is active
          if (isActive.current) {
            lineOpacity += 0.1;
          }
          
          ctx.strokeStyle = `rgba(${parseInt(node.color.slice(1, 3), 16)}, ${parseInt(node.color.slice(3, 5), 16)}, ${parseInt(node.color.slice(5, 7), 16)}, ${lineOpacity})`;
          ctx.lineWidth = isOrderedConnection ? (1 + node.orderProgress * 0.8) : (1 - node.orderProgress * 0.5);
          ctx.stroke();
          
          // Draw flow particles along the curve when active
          if (isActive.current) {
            // More particles for ordered connections
            const particleCount = isOrderedConnection ? 3 : 1;
            
            // Create multiple particles for each connection
            for (let i = 0; i < particleCount; i++) {
              // Calculate flow animation position (0 to 1)
              const flowPosition = ((time * (0.2 + i * 0.1) + node.id * 0.1) % 1);
              
              // Position along the quadratic curve
              const t = flowPosition;
              const particleX = (1 - t) * (1 - t) * node.x + 2 * (1 - t) * t * controlPointX + t * t * connectedNode.x;
              const particleY = (1 - t) * (1 - t) * node.y + 2 * (1 - t) * t * controlPointY + t * t * connectedNode.y;
              
              // Particle size based on flow position (bigger in the middle)
              // Scale the particle size based on screen size
              const baseParticleSize = isMobile ? 1 : 1.5;
              const particleSize = baseParticleSize + 2 * Math.sin(flowPosition * Math.PI) + (node.orderProgress * 1.5);
              
              // Draw particle
              ctx.beginPath();
              ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
              
              // Particle color based on connection type and order progress
              const particleOpacity = 0.5 + 0.3 * Math.sin(flowPosition * Math.PI) + (isOrderedConnection ? node.orderProgress * 0.2 : 0);
              const particleColor = isOrderedConnection 
                ? `rgba(255, 255, 255, ${particleOpacity})`
                : `rgba(180, 180, 180, ${Math.max(0.1, particleOpacity - node.orderProgress * 0.5)})`;
              
              ctx.fillStyle = particleColor;
              ctx.fill();
              
              // Add glow effect
              ctx.beginPath();
              ctx.arc(particleX, particleY, particleSize * 2, 0, Math.PI * 2);
              const particleGlow = ctx.createRadialGradient(
                particleX, particleY, 0,
                particleX, particleY, particleSize * 3
              );
              
              const glowColor = isOrderedConnection ? node.color : '#4682b4';
              
              particleGlow.addColorStop(0, `rgba(${parseInt(glowColor.slice(1, 3), 16)}, ${parseInt(glowColor.slice(3, 5), 16)}, ${parseInt(glowColor.slice(5, 7), 16)}, 0.3)`);
              particleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
              ctx.fillStyle = particleGlow;
              ctx.fill();
            }
          }
        }
      }
    };
    
    // Draw organization progress indicator
    const drawOrganizationIndicator = () => {
      if (!ctx || !canvas) return;
      
      // Calculate average order progress
      let totalProgress = 0;
      nodes.forEach(node => {
        totalProgress += node.orderProgress;
      });
      
      const avgProgress = totalProgress / nodes.length;
      
      // Only show indicator during transition
      if (avgProgress > 0.05 && avgProgress < 0.95) {
        const width = canvas.width / dpr;
        const height = 4;
        const x = 0;
        const y = 20;
        
        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y, width, height);
        
        // Progress
        const gradient = ctx.createLinearGradient(x, y, width * avgProgress, y);
        gradient.addColorStop(0, '#67e8f9');
        gradient.addColorStop(1, '#a78bfa');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width * avgProgress, height);
      }
    };
    
    // Handle device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    
    // Add visual feedback for mouse position
    const drawMouseIndicator = () => {
      if (!ctx || !isActive.current) return;
      
      const { x, y } = mousePositionRef.current;
      
      // Draw subtle mouse indicator
      const radius = isMobile ? 25 : 40;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw moving particles around mouse
      const time = Date.now() / 1000;
      const particleCount = isMobile ? 3 : 5;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (time * (0.5 + i * 0.1)) % (Math.PI * 2);
        const distance = (isMobile ? 20 : 30) + Math.sin(time * 2 + i) * 10;
        
        const particleX = x + Math.cos(angle) * distance;
        const particleY = y + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, isMobile ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      mousePositionRef.current = { x: mouseX, y: mouseY };
      
      // Hide instruction after first interaction
      setInstructionVisible(false);
      
      // Activate animation when mouse enters
      if (!isActive.current) {
        // Trigger a transition from chaos to order
        isActive.current = true;
        
        // First, connect isolated nodes to the main workflow
        connectIsolatedNodes();
        
        // Animate all nodes to their ordered positions with staggered timing
        nodes.forEach((node, index) => {
          gsap.to(node, {
            targetX: ORGANIZED_POSITIONS[index].x,
            targetY: ORGANIZED_POSITIONS[index].y,
            orderProgress: 1,  // Fully ordered
            duration: 1.5,
            delay: index * 0.05,
            ease: "elastic.out(1, 0.7)",
          });
          
          // Clear isolated status as ordering happens
          gsap.to(node, {
            onComplete: () => {
              node.isolated = false;
            },
            delay: index * 0.05 + 0.5
          });
        });
      }
    };
    
    // Function to connect isolated nodes to the main workflow
    const connectIsolatedNodes = () => {
      const isolatedNodes = nodes.filter(node => node.isolated);
      
      // Connect each isolated node to appropriate parts of the workflow
      isolatedNodes.forEach(node => {
        const id = node.id;
        
        // Connect isolated node to a sequential position in the workflow
        if (id > 0 && id < nodes.length - 1) {
          // Create bidirectional connection to make it part of the main flow
          const prevNode = nodes[id - 1];
          const nextNode = nodes[id + 1];
          
          // Create connections if they don't exist
          if (!prevNode.connections.includes(id)) {
            prevNode.connections.push(id);
          }
          
          if (!node.connections.includes(id + 1)) {
            node.connections.push(id + 1);
          }
          
          // Add some cross connections for more integration
          const randomNodeIdx = Math.floor(Math.random() * nodes.length);
          if (randomNodeIdx !== id && !node.connections.includes(randomNodeIdx)) {
            node.connections.push(randomNodeIdx);
          }
        } else if (id === 0) {
          // First node connects to second
          node.connections.push(1);
          
          // And to some random node
          const randomNodeIdx = 2 + Math.floor(Math.random() * (nodes.length - 2));
          if (!node.connections.includes(randomNodeIdx)) {
            node.connections.push(randomNodeIdx);
          }
        } else if (id === nodes.length - 1) {
          // Last node gets connected from second-to-last
          const prevNode = nodes[id - 1];
          if (!prevNode.connections.includes(id)) {
            prevNode.connections.push(id);
          }
        }
        
        // Animate connection creation with a visual effect
        gsap.to(node, {
          pulseMagnitude: node.pulseMagnitude * 2,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          delay: 0.2
        });
      });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!container) return;
      
      // Get the first touch
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      mousePositionRef.current = { x: touchX, y: touchY };
      
      // Hide instruction after first interaction
      setInstructionVisible(false);
      
      // Activate animation if not already active
      if (!isActive.current) {
        isActive.current = true;
        
        // Connect isolated nodes to the main workflow
        connectIsolatedNodes();
        
        // Animate all nodes to their ordered positions with staggered timing
        nodes.forEach((node, index) => {
          gsap.to(node, {
            targetX: ORGANIZED_POSITIONS[index].x,
            targetY: ORGANIZED_POSITIONS[index].y,
            orderProgress: 1,  // Fully ordered
            duration: 1.5,
            delay: index * 0.05,
            ease: "elastic.out(1, 0.7)",
          });
          
          // Clear isolated status as ordering happens
          gsap.to(node, {
            onComplete: () => {
              node.isolated = false;
            },
            delay: index * 0.05 + 0.5
          });
        });
      }
    };
    
    const handleMouseEnter = () => {
      // Visual feedback for entering the container
      const pulseTimeline = gsap.timeline();
      
      // Pulse all nodes slightly
      nodes.forEach(node => {
        pulseTimeline.to(node, {
          size: node.size * 1.2,
          duration: 0.2,
          ease: "power1.out"
        }, 0); // Start all at the same time
        
        pulseTimeline.to(node, {
          size: node.size,
          duration: 0.3,
          ease: "elastic.out(1.2, 0.5)"
        }, 0.2); // Return to normal size with slight elastic effect
        
        // Increase pulse parameters for processing nodes
        if (node.processing) {
          gsap.to(node, {
            pulseFrequency: node.pulseFrequency * 1.5,
            pulseMagnitude: node.pulseMagnitude * 1.3,
            duration: 0.5
          });
        }
      });
    };
    
    const handleMouseLeave = () => {
      // Delay setting isActive to false to keep animations smooth
      isActive.current = false;
      
      // Return nodes to original state with animation
      nodes.forEach((node, index) => {
        // Reset order progress
        gsap.to(node, {
          orderProgress: 0, // Return to chaos
          duration: 0.8 + index * 0.05,
          ease: "power2.inOut"
        });
        
        // Return isolated nodes to their original positions
        if (node.id === 0 || node.id === 4 || node.id === 9) {
          // Re-isolate nodes
          node.isolated = true;
          
          // Return to original positions
          gsap.to(node, {
            x: node.initialX,
            y: node.initialY,
            duration: 1 + index * 0.05,
            ease: "power2.inOut"
          });
        }
        
        // Reset processing status gradually
        setTimeout(() => {
          node.processing = index % 4 === 0;
        }, 500 + index * 50);
        
        // Reset pulse parameters
        gsap.to(node, {
          pulseFrequency: 0.8 + Math.random() * 2,
          pulseMagnitude: 1.5 + Math.random() * 3,
          duration: 0.5
        });
      });
      
      // Show instruction again after a delay
      setTimeout(() => {
        setInstructionVisible(true);
      }, 2000);
    };
    
    // Add tooltips for nodes
    const handleClick = (e: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Check if a node was clicked
      for (const node of nodes) {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < node.size + 5) {
          // Toggle processing state with animation
          node.processing = !node.processing;
          
          if (node.processing) {
            // Animate size increase
            gsap.to(node, {
              size: node.size * 1.3,
              duration: 0.3,
              yoyo: true,
              repeat: 1
            });
            
            // Trigger a ripple effect to connected nodes
            node.connections.forEach(connIdx => {
              const connectedNode = nodes[connIdx];
              
              setTimeout(() => {
                gsap.to(connectedNode, {
                  size: connectedNode.size * 1.2,
                  duration: 0.2,
                  yoyo: true,
                  repeat: 1
                });
              }, 150);
            });
          }
          
          break;
        }
      }
    };
    
    // Handle touch end (equivalent to click for touch devices)
    const handleTouchEnd = (e: TouchEvent) => {
      if (!container) return;
      
      // Get the position of the last touch
      const touch = e.changedTouches[0];
      const rect = container.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Check if a node was touched
      for (const node of nodes) {
        const dx = touchX - node.x;
        const dy = touchY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < node.size + 10) { // Slightly larger touch target
          // Toggle processing state with animation
          node.processing = !node.processing;
          
          if (node.processing) {
            // Animate size increase
            gsap.to(node, {
              size: node.size * 1.3,
              duration: 0.3,
              yoyo: true,
              repeat: 1
            });
          }
          
          break;
        }
      }
    };
    
    // Set up event listeners for both mouse and touch
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);
    
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      const time = Date.now() / 1000;
      const { width, height } = container.getBoundingClientRect();
      
      // Clear canvas with trail effect
      ctx.fillStyle = 'rgba(10, 11, 16, 0.15)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw background grid effect
      // Scale grid size based on screen width
      const gridSize = isMobile ? 20 : 30;
      const gridOpacity = 0.02 + (isActive.current ? 0.02 : 0);
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
      ctx.lineWidth = 0.5;
      
      // Horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Draw mouse indicator
      drawMouseIndicator();
      
      // Draw organization progress indicator
      drawOrganizationIndicator();
      
      // Update mouse interaction
      const mouseX = mousePositionRef.current.x;
      const mouseY = mousePositionRef.current.y;
      
      // Update node positions and hover effects
      nodes.forEach(node => {
        // Calculate distance to mouse
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluenceRadius = isMobile ? 100 : 150;
        
        // Update hover glow based on mouse proximity
        if (distance < mouseInfluenceRadius) {
          // Smoothly increase hover glow
          node.hoverGlow = Math.min(isMobile ? 7 : 10, node.hoverGlow + 0.5);
          
          // Make node "processing" when mouse is very close
          if (distance < (isMobile ? 40 : 60) && !node.processing) {
            node.processing = true;
            
            // Ripple effect from this node to connected nodes
            setTimeout(() => {
              node.connections.forEach(connIdx => {
                const connectedNode = nodes[connIdx];
                connectedNode.processing = true;
                
                // Animate connected node
                gsap.to(connectedNode, {
                  pulseMagnitude: connectedNode.pulseMagnitude * 1.5,
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1
                });
              });
            }, 150);
          }
          
          // Apply slight mouse attraction based on order progress
          if (isActive.current) {
            // In active state, nodes are attracted to mouse based on order progress
            const attractionFactor = 0.0004 * (1 - node.orderProgress * 0.5);
            node.vx += dx * attractionFactor;
            node.vy += dy * attractionFactor;
          } else {
            // In chaotic state, mouse slightly influences nodes
            node.vx += dx * 0.0002;
            node.vy += dy * 0.0002;
          }
        } else {
          // Gradually decrease hover glow when mouse moves away
          node.hoverGlow = Math.max(0, node.hoverGlow - 0.3);
        }
        
        if (isActive.current) {
          // Move toward target positions based on order progress
          const tx = node.targetX - node.x;
          const ty = node.targetY - node.y;
          
          // Apply spring physics with increasing strength as order progress increases
          const springStrength = node.interactionStrength * (0.5 + node.orderProgress * 1.5);
          node.vx += tx * springStrength;
          node.vy += ty * springStrength;
        } else {
          // More controlled random movement when not organized
          node.vx += (Math.random() - 0.5) * 0.2;
          node.vy += (Math.random() - 0.5) * 0.2;
          
          // Boundary check
          const margin = node.size * 2;
          if (node.x < margin || node.x > width - margin) {
            node.vx *= -0.8; // Bounce with some damping
          }
          if (node.y < margin || node.y > height - margin) {
            node.vy *= -0.8; // Bounce with some damping
          }
        }
        
        // Apply velocity with damping
        const dampingFactor = isActive.current ? 0.9 : 0.95; // More damping when active
        node.vx *= dampingFactor;
        node.vy *= dampingFactor;
        node.x += node.vx;
        node.y += node.vy;
        
        // Keep within boundaries
        node.x = Math.max(node.size, Math.min(width - node.size, node.x));
        node.y = Math.max(node.size, Math.min(height - node.size, node.y));
      });
      
      // Draw connections
      drawConnections(time);
      
      // Draw nodes on top
      nodes.forEach(node => drawNode(node, time));
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isMobile]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full min-h-[300px] ${className} cursor-pointer`}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Status text in upper left corner */}
      <div className="absolute top-5 left-5 z-10">
        <AnimatePresence mode="wait">
          {!isActive.current ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <motion.div 
                className="text-white font-bold text-lg sm:text-xl px-4 py-2 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-gray-600/30"
                initial={{ x: 0 }}
                animate={{ 
                  x: [0, 3, -3, 3, 0],
                  rotate: [0, 0.5, -0.5, 0.5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                <span className="text-gray-400">Sin</span>{" "}
                <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Operaciones Digitales
                </span>
                
                {/* Chaotic floating particles */}
                <motion.div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gray-500 rounded-full"
                  animate={{ 
                    y: [0, -10, 5, -5, 0],
                    x: [0, 5, -5, 10, 0],
                    opacity: [0.8, 0.4, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-gray-600 rounded-full"
                  animate={{ 
                    y: [0, 5, -5, 10, 0],
                    x: [0, -5, 5, -10, 0],
                    opacity: [0.7, 0.3, 0.7]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute -bottom-1 right-1/3 w-1 h-1 bg-gray-500 rounded-full"
                  animate={{ 
                    y: [0, 8, -3, 6, 0],
                    x: [0, 5, -8, 3, 0],
                    opacity: [0.6, 0.2, 0.6]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <motion.div 
                className="text-white font-bold text-lg sm:text-xl px-4 py-2 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-gray-700/40"
                animate={{ 
                  boxShadow: ['0 0 0 rgba(103, 232, 249, 0)', '0 0 10px rgba(103, 232, 249, 0.3)', '0 0 0 rgba(103, 232, 249, 0)']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                <span className="text-gray-300">Con</span>{" "}
                <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Operaciones Digitales
                </span>
                
                {/* Organized animated elements */}
                <motion.div
                  className="absolute -right-2 top-0 bottom-0 w-0.5 h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent"
                  animate={{ 
                    opacity: [0, 1, 0],
                    height: ['0%', '100%', '0%']
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <motion.div
                  className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                  animate={{ 
                    opacity: [0, 1, 0],
                    width: ['0%', '100%', '0%']
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-0 right-0 w-2 h-2 bg-gray-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {instructionVisible && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="inline-block text-gray-300 text-sm bg-gray-900/60 px-4 py-2 rounded-full animate-pulse shadow-lg">
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Mueve el mouse sobre el diagrama para organizar el flujo
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAnimation;