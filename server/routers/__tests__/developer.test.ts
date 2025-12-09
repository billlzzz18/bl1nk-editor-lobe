import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

describe('Developer Router Utilities', () => {
  describe('API Key Generation', () => {
    it('should generate valid API keys with correct format', () => {
      const generateApiKey = () => {
        return `sk_${crypto.randomBytes(24).toString('hex')}`;
      };

      const key = generateApiKey();
      
      // Check format: sk_ prefix followed by 48 hex characters
      expect(key).toMatch(/^sk_[a-f0-9]{48}$/);
      expect(key.length).toBe(51); // 3 chars for 'sk_' + 48 hex chars
    });

    it('should generate unique API keys', () => {
      const generateApiKey = () => {
        return `sk_${crypto.randomBytes(24).toString('hex')}`;
      };

      const key1 = generateApiKey();
      const key2 = generateApiKey();
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('API Key Hashing', () => {
    it('should hash API keys with SHA-256', () => {
      const hashApiKey = (key: string) => {
        return crypto.createHash('sha256').update(key).digest('hex');
      };

      const key = 'sk_test_key_123';
      const hash = hashApiKey(key);
      
      // SHA-256 produces 64 hex characters
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
      expect(hash.length).toBe(64);
    });

    it('should produce consistent hashes for same input', () => {
      const hashApiKey = (key: string) => {
        return crypto.createHash('sha256').update(key).digest('hex');
      };

      const key = 'sk_test_key_123';
      const hash1 = hashApiKey(key);
      const hash2 = hashApiKey(key);
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hashApiKey = (key: string) => {
        return crypto.createHash('sha256').update(key).digest('hex');
      };

      const key1 = 'sk_test_key_123';
      const key2 = 'sk_test_key_456';
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should not be reversible (one-way hash)', () => {
      const hashApiKey = (key: string) => {
        return crypto.createHash('sha256').update(key).digest('hex');
      };

      const key = 'sk_secret_key_123';
      const hash = hashApiKey(key);
      
      // Hash should not contain the original key
      expect(hash).not.toContain(key);
      expect(hash).not.toContain('sk_');
    });
  });

  describe('UUID Generation', () => {
    it('should generate valid UUIDs', () => {
      const id = crypto.randomUUID();
      
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const id1 = crypto.randomUUID();
      const id2 = crypto.randomUUID();
      
      expect(id1).not.toBe(id2);
    });
  });

  describe('API Key Validation', () => {
    it('should validate API key format', () => {
      const isValidApiKey = (key: string) => {
        return /^sk_[a-f0-9]{48}$/.test(key);
      };

      expect(isValidApiKey('sk_' + 'a'.repeat(48))).toBe(true);
      expect(isValidApiKey('sk_' + 'f'.repeat(48))).toBe(true);
      expect(isValidApiKey('invalid_key')).toBe(false);
      expect(isValidApiKey('sk_short')).toBe(false);
    });

    it('should reject malformed API keys', () => {
      const isValidApiKey = (key: string) => {
        return /^sk_[a-f0-9]{48}$/.test(key);
      };

      expect(isValidApiKey('pk_' + 'a'.repeat(48))).toBe(false); // Wrong prefix
      expect(isValidApiKey('sk_' + 'g'.repeat(48))).toBe(false); // Invalid hex char
      expect(isValidApiKey('sk_' + 'a'.repeat(47))).toBe(false); // Too short
    });
  });
});
