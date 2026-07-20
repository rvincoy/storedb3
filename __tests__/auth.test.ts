import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { signToken, requireJWT, requireRole } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

function mockRes() {
  return {
    statusCode: null as number | null,
    body: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: any) {
      this.body = body;
      return this;
    },
  };
}

describe('signToken', () => {
  test('produces a JWT that carries the user id, name, email, and role', () => {
    const token = signToken({ _id: 'abc123', UserName: 'jdoe', email: 'j@example.com', Role: 'admin' });
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    expect(decoded.id).toBe('abc123');
    expect(decoded.UserName).toBe('jdoe');
    expect(decoded.email).toBe('j@example.com');
    expect(decoded.Role).toBe('admin');
  });
});

describe('requireJWT', () => {
  test('rejects a request with no Authorization header', () => {
    const req = { headers: {} } as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireJWT(req, res, next);

    expect((res as any).statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a header that is not a Bearer token', () => {
    const req = { headers: { authorization: 'Basic somevalue' } } as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireJWT(req, res, next);

    expect((res as any).statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an invalid/expired token', () => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' } } as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireJWT(req, res, next);

    expect((res as any).statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts a valid token and attaches the decoded payload to req.user', () => {
    const token = signToken({ _id: 'abc123', UserName: 'jdoe', email: 'j@example.com', Role: 'staff' });
    const req = { headers: { authorization: `Bearer ${token}` } } as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user!.id).toBe('abc123');
    expect(req.user!.Role).toBe('staff');
  });
});

describe('requireRole', () => {
  test('rejects when req.user is missing (requireJWT did not run)', () => {
    const req = {} as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireRole('admin')(req, res, next);

    expect((res as any).statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a role not in the allow-list', () => {
    const req = { user: { Role: 'staff' } } as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireRole('admin')(req, res, next);

    expect((res as any).statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows a role in the allow-list', () => {
    const req = { user: { Role: 'admin' } } as unknown as Request;
    const res = mockRes() as unknown as Response;
    const next = jest.fn() as NextFunction;

    requireRole('admin', 'staff')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((res as any).statusCode).toBeNull();
  });
});
