import { NextRequest, NextResponse } from 'next/server';
import { middleware } from './middleware';

describe('Auth Middleware', () => {
  let mockRequest: Partial<NextRequest>;
  const mockRedirect = jest.spyOn(NextResponse, 'redirect');
  const mockNext = jest.spyOn(NextResponse, 'next');

  beforeEach(() => {
    mockRequest = {
      cookies: {
        has: jest.fn(),
      },
      nextUrl: {
        pathname: '',
        href: 'http://localhost:3000',
      },
      url: 'http://localhost:3000',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when accessing protected route without auth', () => {
    (mockRequest.cookies.has as jest.Mock).mockReturnValue(false);
    mockRequest.nextUrl.pathname = '/dashboard';

    middleware(mockRequest as NextRequest);

    expect(mockRedirect).toHaveBeenCalledWith(expect.stringContaining('/login'));
  });

  it('redirects to dashboard when accessing login page while authenticated', () => {
    (mockRequest.cookies.has as jest.Mock).mockReturnValue(true);
    mockRequest.nextUrl.pathname = '/login';

    middleware(mockRequest as NextRequest);

    expect(mockRedirect).toHaveBeenCalledWith(expect.stringContaining('/dashboard'));
  });

  it('allows access to protected routes when authenticated', () => {
    (mockRequest.cookies.has as jest.Mock).mockReturnValue(true);
    mockRequest.nextUrl.pathname = '/dashboard';

    middleware(mockRequest as NextRequest);

    expect(mockNext).toHaveBeenCalled();
  });

  it('allows access to public routes without auth', () => {
    (mockRequest.cookies.has as jest.Mock).mockReturnValue(false);
    mockRequest.nextUrl.pathname = '/';

    middleware(mockRequest as NextRequest);

    expect(mockNext).toHaveBeenCalled();
  });
});