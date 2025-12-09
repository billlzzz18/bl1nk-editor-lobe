#!/usr/bin/env node

/**
 * Health Check Script for AI Development Studio
 * Checks the health of all services and reports status
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class HealthChecker {
  constructor() {
    this.services = [
      { name: 'Frontend', url: 'http://localhost:3000', expectedStatus: 200, critical: true },
      { name: 'Backend API', url: 'http://localhost:5000/health', expectedStatus: 200, critical: true },
      { name: 'WebSocket', url: 'http://localhost:3001/health', expectedStatus: 200, critical: true },
      { name: 'Integration', url: 'http://localhost:3002/health', expectedStatus: 200, critical: false },
      { name: 'PostgreSQL', type: 'postgres', critical: true },
      { name: 'Redis', type: 'redis', critical: true }
    ];
    
    this.results = {
      timestamp: new Date().toISOString(),
      services: [],
      summary: {
        total: 0,
        healthy: 0,
        unhealthy: 0,
        critical_unhealthy: 0
      }
    };
  }

  // HTTP health check
  async checkHTTP(service) {
    return new Promise((resolve) => {
      const url = new URL(service.url);
      const client = url.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        timeout: 5000,
        headers: {
          'User-Agent': 'AI-Dev-Studio-Health-Check/1.0'
        }
      };

      const req = client.request(options, (res) => {
        const isHealthy = res.statusCode === service.expectedStatus;
        resolve({
          name: service.name,
          status: isHealthy ? 'healthy' : 'unhealthy',
          statusCode: res.statusCode,
          responseTime: Date.now() - startTime,
          error: null,
          details: `HTTP ${res.statusCode}`
        });
      });

      const startTime = Date.now();
      
      req.on('error', (error) => {
        resolve({
          name: service.name,
          status: 'unhealthy',
          statusCode: null,
          responseTime: Date.now() - startTime,
          error: error.message,
          details: 'Connection failed'
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          name: service.name,
          status: 'unhealthy',
          statusCode: null,
          responseTime: 5000,
          error: 'Request timeout',
          details: 'Request timeout after 5 seconds'
        });
      });

      req.end();
    });
  }

  // PostgreSQL health check
  async checkPostgreSQL() {
    try {
      const { stdout } = await execPromise('docker exec ai_dev_postgres pg_isready -U ai_dev -d ai_dev_studio');
      const isHealthy = stdout.includes('accepting connections');
      
      return {
        name: 'PostgreSQL',
        status: isHealthy ? 'healthy' : 'unhealthy',
        statusCode: isHealthy ? 200 : 503,
        responseTime: 0,
        error: isHealthy ? null : 'Database not ready',
        details: isHealthy ? 'Accepting connections' : 'Database not accepting connections'
      };
    } catch (error) {
      return {
        name: 'PostgreSQL',
        status: 'unhealthy',
        statusCode: 503,
        responseTime: 0,
        error: error.message,
        details: 'Connection failed'
      };
    }
  }

  // Redis health check
  async checkRedis() {
    try {
      const { stdout } = await execPromise('docker exec ai_dev_redis redis-cli ping');
      const isHealthy = stdout.trim() === 'PONG';
      
      return {
        name: 'Redis',
        status: isHealthy ? 'healthy' : 'unhealthy',
        statusCode: isHealthy ? 200 : 503,
        responseTime: 0,
        error: isHealthy ? null : 'Redis not responding',
        details: isHealthy ? 'PONG response received' : 'No PONG response'
      };
    } catch (error) {
      return {
        name: 'Redis',
        status: 'unhealthy',
        statusCode: 503,
        responseTime: 0,
        error: error.message,
        details: 'Connection failed'
      };
    }
  }

  // Check specific service
  async checkService(service) {
    if (service.type === 'postgres') {
      return await this.checkPostgreSQL();
    } else if (service.type === 'redis') {
      return await this.checkRedis();
    } else {
      return await this.checkHTTP(service);
    }
  }

  // Run all health checks
  async runChecks() {
    console.log('🏥 Starting health check...\n');
    
    const checkPromises = this.services.map(service => this.checkService(service));
    const results = await Promise.all(checkPromises);
    
    this.results.services = results;
    
    // Calculate summary
    this.results.summary.total = results.length;
    this.results.summary.healthy = results.filter(r => r.status === 'healthy').length;
    this.results.summary.unhealthy = results.filter(r => r.status === 'unhealthy').length;
    this.results.summary.critical_unhealthy = results.filter(r => 
      r.status === 'unhealthy' && r.critical
    ).length;
    
    return this.results;
  }

  // Print results
  printResults() {
    console.log(`\n📊 Health Check Results (${this.results.timestamp})`);
    console.log('=' .repeat(60));
    
    let allHealthy = true;
    
    for (const result of this.results.services) {
      const icon = result.status === 'healthy' ? '✅' : '❌';
      const critical = result.critical ? ' (CRITICAL)' : '';
      
      console.log(`${icon} ${result.name}${critical}: ${result.status.toUpperCase()}`);
      console.log(`   Status: ${result.statusCode || 'N/A'}`);
      if (result.responseTime > 0) {
        console.log(`   Response Time: ${result.responseTime}ms`);
      }
      if (result.details) {
        console.log(`   Details: ${result.details}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
      
      if (result.status === 'unhealthy') {
        allHealthy = false;
      }
    }
    
    console.log('📈 Summary:');
    console.log(`   Total Services: ${this.results.summary.total}`);
    console.log(`   Healthy: ${this.results.summary.healthy}`);
    console.log(`   Unhealthy: ${this.results.summary.unhealthy}`);
    console.log(`   Critical Issues: ${this.results.summary.critical_unhealthy}`);
    
    if (allHealthy) {
      console.log('\n🎉 All services are healthy!');
      process.exit(0);
    } else if (this.results.summary.critical_unhealthy > 0) {
      console.log('\n⚠️  Critical services are down! Immediate attention required.');
      process.exit(2);
    } else {
      console.log('\n⚠️  Some non-critical services are down.');
      process.exit(1);
    }
  }

  // Export results to JSON
  exportJSON(filename = 'health-check-results.json') {
    const fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Results exported to ${filename}`);
  }
}

// Run if called directly
if (require.main === module) {
  const checker = new HealthChecker();
  
  checker.runChecks()
    .then(() => checker.printResults())
    .catch(error => {
      console.error('Health check failed:', error);
      process.exit(3);
    });
}

module.exports = HealthChecker;