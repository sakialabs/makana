/**
 * Performance Monitor
 * 
 * Tracks API response times and provides performance metrics.
 * Target: < 200ms for p95 (95th percentile)
 */

interface PerformanceMetric {
  url: string;
  method: string;
  duration: number;
  timestamp: number;
  status: 'success' | 'error';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000; // Keep last 1000 metrics

  /**
   * Record API request performance
   */
  public recordRequest(
    url: string,
    method: string,
    duration: number,
    status: 'success' | 'error'
  ): void {
    const metric: PerformanceMetric = {
      url,
      method,
      duration,
      timestamp: Date.now(),
      status,
    };

    this.metrics.push(metric);

    // Keep only last MAX_METRICS entries
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    // Log slow requests (> 200ms)
    if (duration > 200) {
      console.warn(`Slow API request: ${method} ${url} took ${duration}ms`);
    }
  }

  /**
   * Get performance statistics
   */
  public getStats(): {
    totalRequests: number;
    successRate: number;
    averageDuration: number;
    p50: number;
    p95: number;
    p99: number;
    slowRequests: number;
  } {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        successRate: 0,
        averageDuration: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        slowRequests: 0,
      };
    }

    const successCount = this.metrics.filter(m => m.status === 'success').length;
    const durations = this.metrics.map(m => m.duration).sort((a, b) => a - b);
    const slowCount = this.metrics.filter(m => m.duration > 200).length;

    return {
      totalRequests: this.metrics.length,
      successRate: (successCount / this.metrics.length) * 100,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      p50: this.getPercentile(durations, 50),
      p95: this.getPercentile(durations, 95),
      p99: this.getPercentile(durations, 99),
      slowRequests: slowCount,
    };
  }

  /**
   * Get performance stats by endpoint
   */
  public getStatsByEndpoint(): Map<string, {
    count: number;
    averageDuration: number;
    p95: number;
  }> {
    const byEndpoint = new Map<string, PerformanceMetric[]>();

    // Group metrics by endpoint
    for (const metric of this.metrics) {
      const key = `${metric.method} ${metric.url}`;
      if (!byEndpoint.has(key)) {
        byEndpoint.set(key, []);
      }
      byEndpoint.get(key)!.push(metric);
    }

    // Calculate stats for each endpoint
    const stats = new Map<string, { count: number; averageDuration: number; p95: number }>();

    for (const [endpoint, metrics] of byEndpoint.entries()) {
      const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
      stats.set(endpoint, {
        count: metrics.length,
        averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
        p95: this.getPercentile(durations, 95),
      });
    }

    return stats;
  }

  /**
   * Calculate percentile from sorted array
   */
  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  public exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Utility to measure async function execution time
 */
export async function measurePerformance<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    if (duration > 200) {
      console.warn(`${label} took ${duration.toFixed(2)}ms (target: <200ms)`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`${label} failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
}

