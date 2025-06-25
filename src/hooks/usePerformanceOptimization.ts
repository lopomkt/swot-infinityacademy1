
import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  connectionSpeed: 'slow' | 'medium' | 'fast';
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export function usePerformanceOptimization() {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    connectionSpeed: 'medium',
    deviceType: 'desktop'
  });

  // Detect device type
  const detectDeviceType = useCallback((): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  // Detect connection speed
  const detectConnectionSpeed = useCallback((): 'slow' | 'medium' | 'fast' => {
    // @ts-ignore - Navigator connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return 'medium';
    
    const { effectiveType, downlink } = connection;
    
    if (effectiveType === '4g' && downlink > 5) return 'fast';
    if (effectiveType === '3g' || (effectiveType === '4g' && downlink <= 2)) return 'slow';
    return 'medium';
  }, []);

  // Measure render performance
  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      metricsRef.current.renderTime = renderTime;
      
      if (renderTime > 100) {
        console.warn(`⚠️ Slow render detected for ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      return renderTime;
    };
  }, []);

  // Get memory usage (if available)
  const getMemoryUsage = useCallback((): number => {
    // @ts-ignore - performance.memory is non-standard
    if (performance.memory) {
      // @ts-ignore
      return performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }, []);

  // Optimize based on device capabilities
  const getOptimizationConfig = useCallback(() => {
    const device = detectDeviceType();
    const speed = detectConnectionSpeed();
    const memory = getMemoryUsage();
    
    metricsRef.current = {
      renderTime: metricsRef.current.renderTime,
      memoryUsage: memory,
      connectionSpeed: speed,
      deviceType: device
    };

    // Return optimized configuration
    return {
      // Reduce animations on slow devices/connections
      enableAnimations: speed !== 'slow' && device !== 'mobile',
      
      // Lazy load on mobile or slow connections
      enableLazyLoading: device === 'mobile' || speed === 'slow',
      
      // Reduce image quality on slow connections
      imageQuality: speed === 'fast' ? 'high' : speed === 'medium' ? 'medium' : 'low',
      
      // Enable prefetching on fast connections
      enablePrefetch: speed === 'fast',
      
      // Adjust chunk sizes
      chunkSize: device === 'mobile' ? 'small' : speed === 'fast' ? 'large' : 'medium',
      
      // Performance recommendations
      recommendations: {
        shouldReduceAnimations: speed === 'slow',
        shouldOptimizeImages: memory > 100,
        shouldUseVirtualization: device === 'mobile',
        shouldEnableCache: true
      }
    };
  }, [detectDeviceType, detectConnectionSpeed, getMemoryUsage]);

  // Initialize performance monitoring
  useEffect(() => {
    const config = getOptimizationConfig();
    
    console.log('🚀 Performance optimization initialized:', {
      device: metricsRef.current.deviceType,
      connection: metricsRef.current.connectionSpeed,
      memory: `${metricsRef.current.memoryUsage.toFixed(1)}MB`,
      config
    });
  }, [getOptimizationConfig]);

  return {
    measureRenderTime,
    getOptimizationConfig,
    metrics: metricsRef.current
  };
}
