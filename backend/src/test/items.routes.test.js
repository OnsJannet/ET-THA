const request = require('supertest');
const express = require('express');

// Mock fs before importing router
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

const fs = require('fs');
const itemsRouter = require('../routes/items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

describe('Items Routes', () => {
  const mockItems = [
    { id: 1, name: 'Item 1', price: 10.99 },
    { id: 2, name: 'Test Item', price: 20.5 },
    { id: 3, name: 'Another Item', price: 15.75 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/items → returns all items', async () => {
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));

    const res = await request(app).get('/api/items');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItems);
  });

  it('GET /api/items → filters by search query', async () => {
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));

    const res = await request(app).get('/api/items?q=Test');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 2, name: 'Test Item', price: 20.5 }]);
  });

  it('GET /api/items → limits results', async () => {
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));

    const res = await request(app).get('/api/items?limit=2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItems.slice(0, 2));
  });

  it('GET /api/items → returns [] when file not found', async () => {
    const error = new Error('File not found');
    error.code = 'ENOENT';
    fs.promises.readFile.mockRejectedValue(error);

    const res = await request(app).get('/api/items');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /api/items/:id → returns item by ID', async () => {
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));

    const res = await request(app).get('/api/items/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItems[0]);
  });

  it('GET /api/items/:id → 404 if not found', async () => {
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));

    const res = await request(app).get('/api/items/999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/items → creates new item', async () => {
    fs.promises.readFile.mockResolvedValue(JSON.stringify(mockItems));
    fs.promises.writeFile.mockResolvedValue();

    const newItem = { name: 'New Item', price: 25.99 };

    const res = await request(app).post('/api/items').send(newItem);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newItem);
    expect(res.body).toHaveProperty('id');
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });
});
