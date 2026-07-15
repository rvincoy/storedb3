const jwt = require('jsonwebtoken');
const { signToken, requireJWT, requireRole } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe('signToken', () => {
  test('produces a JWT that carries the user id, name, email, and role', () => {
    const token = signToken({ _id: 'abc123', UserName: 'jdoe', email: 'j@example.com', Role: 'admin' });
    const decoded = jwt.verify(token, JWT_SECRET);

    expect(decoded.id).toBe('abc123');
    expect(decoded.UserName).toBe('jdoe');
    expect(decoded.email).toBe('j@example.com');
    expect(decoded.Role).toBe('admin');
  });
});

describe('requireJWT', () => {
  test('rejects a request with no Authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    requireJWT(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a header that is not a Bearer token', () => {
    const req = { headers: { authorization: 'Basic somevalue' } };
    const res = mockRes();
    const next = jest.fn();

    requireJWT(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an invalid/expired token', () => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' } };
    const res = mockRes();
    const next = jest.fn();

    requireJWT(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts a valid token and attaches the decoded payload to req.user', () => {
    const token = signToken({ _id: 'abc123', UserName: 'jdoe', email: 'j@example.com', Role: 'staff' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    requireJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('abc123');
    expect(req.user.Role).toBe('staff');
  });
});

describe('requireRole', () => {
  test('rejects when req.user is missing (requireJWT did not run)', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a role not in the allow-list', () => {
    const req = { user: { Role: 'staff' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows a role in the allow-list', () => {
    const req = { user: { Role: 'admin' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin', 'staff')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBeNull();
  });
});
