import { processQuery } from './mockAI';
import { ResponseMessage } from '../types';

describe('processQuery', () => {
  // Helper to get a chart response for iteration tests
  const getChartResponse = (): ResponseMessage =>
    processQuery('Show me sales over the last quarter');

  describe('sales patterns', () => {
    test('quarterly sales returns line chart', () => {
      const result = processQuery('Show me sales over the last quarter');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('line');
      expect(result.chart?.title).toContain('Quarterly');
    });

    test('monthly sales returns bar chart', () => {
      const result = processQuery('Show monthly revenue');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('bar');
      expect(result.chart?.xKey).toBe('month');
    });

    test('revenue trend triggers quarterly sales', () => {
      const result = processQuery('Show me the revenue trend');
      expect(result.chart?.type).toBe('line');
    });
  });

  describe('product patterns', () => {
    test('top selling products returns text', () => {
      const result = processQuery('What were our top selling products?');
      expect(result.type).toBe('text');
      expect(result.text).toContain('Smart Watch');
    });

    test('best products triggers same pattern', () => {
      const result = processQuery('Show me best products');
      expect(result.type).toBe('text');
    });
  });

  describe('explanatory patterns', () => {
    test('why sales dropped returns analysis', () => {
      const result = processQuery('Why did sales drop in Q3?');
      expect(result.type).toBe('text');
      expect(result.text).toContain('Q3');
      expect(result.text).toContain('Seasonal');
    });
  });

  describe('category patterns', () => {
    test('sales by category returns pie chart', () => {
      const result = processQuery('Show sales by category');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('pie');
    });
  });

  describe('customer patterns', () => {
    test('demographics returns bar chart', () => {
      const result = processQuery('What are customer demographics?');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('bar');
      expect(result.chart?.xKey).toBe('ageGroup');
    });

    test('satisfaction returns pie chart', () => {
      const result = processQuery('How satisfied are our customers?');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('pie');
    });
  });

  describe('inventory patterns', () => {
    test('inventory status returns text', () => {
      const result = processQuery('What is the inventory status?');
      expect(result.type).toBe('text');
      expect(result.text).toContain('Portable Charger');
    });
  });

  describe('analytics patterns', () => {
    test('conversion funnel returns funnel chart', () => {
      const result = processQuery('Show me the conversion funnel');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('funnel');
    });

    test('website traffic returns line chart', () => {
      const result = processQuery('Show website traffic trends');
      expect(result.type).toBe('mixed');
      expect(result.chart?.type).toBe('line');
      expect(result.chart?.xKey).toBe('date');
    });
  });

  describe('chart iteration', () => {
    test('convert to bar chart with previous response', () => {
      const prev = getChartResponse();
      const result = processQuery('Make it a bar chart', prev);
      expect(result.chart?.type).toBe('bar');
      expect(result.chart?.data).toEqual(prev.chart?.data);
    });

    test('convert to area chart with previous response', () => {
      const prev = getChartResponse();
      const result = processQuery('Show as area chart', prev);
      expect(result.chart?.type).toBe('area');
    });

    test('convert to bar chart without previous response returns text', () => {
      const result = processQuery('Make it a bar chart');
      expect(result.type).toBe('text');
      expect(result.text).toContain("don't see a previous chart");
    });

    test('convert to area chart without previous response returns text', () => {
      const result = processQuery('Convert to area chart');
      expect(result.type).toBe('text');
      expect(result.text).toContain("don't see a previous chart");
    });
  });

  describe('fallback', () => {
    test('unrecognized query returns fallback', () => {
      const result = processQuery('Tell me a joke');
      expect(result.type).toBe('text');
      expect(result.text).toContain("don't have a pre-configured response");
    });

    test('fallback includes suggestions', () => {
      const result = processQuery('random gibberish xyz');
      expect(result.text).toContain('Show me sales over the last quarter');
    });
  });

  describe('response structure', () => {
    test('every response has required fields', () => {
      const result = processQuery('Show sales by category');
      expect(result.id).toBeTruthy();
      expect(result.type).toBeTruthy();
      expect(result.explanation).toBeTruthy();
      expect(result.interpretation).toBeDefined();
      expect(result.interpretation.intent).toBeTruthy();
      expect(result.interpretation.entities).toBeInstanceOf(Array);
      expect(result.interpretation.dataSource).toBeTruthy();
      expect(result.interpretation.assumptions).toBeInstanceOf(Array);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    test('chart responses include chart data', () => {
      const result = processQuery('Show monthly revenue');
      expect(result.chart).toBeDefined();
      expect(result.chart?.data.length).toBeGreaterThan(0);
      expect(result.chart?.title).toBeTruthy();
    });
  });
});
