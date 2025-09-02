const request = require('supertest');
const express = require('express');

// Mock fs before importing router
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    stat: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn()
  }
}));

const fs = require('fs');
const statsRouter = require('../routes/stats');

const app = express();
app.use('/api/stats', statsRouter);

describe('Stats Routes', () => {
  const mockItems = [
    { id: 1, name: 'Item 1', price: 10 },
    { id: 2, name: 'Item 2', price: 20 },
    { id: 3, name: 'Item 3', price: 30 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/stats → returns total and average', async () => {
    fs.promises.access.mockResolvedValue();
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));
    fs.promises.stat.mockResolvedValue({ mtimeMs: 123 });

    const res = await request(app).get('/api/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      total: 3,
      averagePrice: 20
    });
  });


  it('POST /api/stats/clear-cache → clears cache', async () => {
    const res = await request(app).post('/api/stats/clear-cache');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'cache cleared' });
  });

  it('GET /api/stats/health → healthy if file exists', async () => {
    fs.promises.access.mockResolvedValue();

    const res = await request(app).get('/api/stats/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.dataFileExists).toBe(true);
  });

  it('GET /api/stats/health → unhealthy if file missing', async () => {
    fs.promises.access.mockRejectedValue(new Error('no file'));

    const res = await request(app).get('/api/stats/health');

    expect(res.status).toBe(500);
    expect(res.body.status).toBe('unhealthy');
    expect(res.body.dataFileExists).toBe(false);
  });
});
