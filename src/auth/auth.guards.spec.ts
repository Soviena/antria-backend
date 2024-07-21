import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import MitraOnlyId, { AuthGuard, MitraOnly, OwnerOnly, AdminOnly } from './auth.guards';
import { jwtConstants } from './constants';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if token is valid', async () => {
      const mockRequest = { headers: { authorization: 'Bearer validToken' } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;
      mockJwtService.verifyAsync.mockResolvedValue({ role: 'karyawan', isOwner: true, admin: false });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual({ role: 'karyawan', isOwner: true, admin: false });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockRequest = { headers: { authorization: 'Bearer invalidToken' } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      const mockRequest = { headers: {} };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });
  });
});

describe('MitraOnly Guard', () => {
  let guard: MitraOnly;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MitraOnly],
    }).compile();

    guard = module.get<MitraOnly>(MitraOnly);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if user role is karyawan', async () => {
      const mockRequest = { user: { role: 'karyawan' } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      expect(await guard.canActivate(mockContext)).toBe(true);
    });

    it('should return false if user role is not karyawan', async () => {
      const mockRequest = { user: { role: 'admin' } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      expect(await guard.canActivate(mockContext)).toBe(false);
    });
  });
});


describe('OwnerOnly Guard', () => {
  let guard: OwnerOnly;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerOnly],
    }).compile();

    guard = module.get<OwnerOnly>(OwnerOnly);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if user is an owner', async () => {
      const mockRequest = { user: { isOwner: true } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      expect(await guard.canActivate(mockContext)).toBe(true);
    });

    it('should return false if user is not an owner', async () => {
      const mockRequest = { user: { isOwner: false } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      expect(await guard.canActivate(mockContext)).toBe(false);
    });
  });
});

describe('AdminOnly Guard', () => {
  let guard: AdminOnly;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOnly],
    }).compile();

    guard = module.get<AdminOnly>(AdminOnly);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if user is an admin', async () => {
      const mockRequest = { user: { admin: true } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      expect(await guard.canActivate(mockContext)).toBe(true);
    });

    it('should return false if user is not an admin', async () => {
      const mockRequest = { user: { admin: false } };
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as unknown as ExecutionContext;

      expect(await guard.canActivate(mockContext)).toBe(false);
    });
  });
});

describe('MitraOnlyIdGuard', () => {
  let guard: CanActivate;
  let executionContext: ExecutionContext;

  beforeEach(() => {
    // Mock the ExecutionContext
    executionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { mitraId: 1 },
          params: { id: '1' },
        } as unknown as Request),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return true if user.mitraId matches the route parameter', async () => {
    // Arrange
    const MitraOnlyIdGuard = MitraOnlyId('id');
    guard = new MitraOnlyIdGuard();
    
    // Act
    const result = await guard.canActivate(executionContext);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false if user.mitraId does not match the route parameter', async () => {
    // Arrange
    (executionContext.switchToHttp().getRequest() as any).params.id = '2';
    const MitraOnlyIdGuard = MitraOnlyId('id');
    guard = new MitraOnlyIdGuard();
    
    // Act
    const result = await guard.canActivate(executionContext);

    // Assert
    expect(result).toBe(false);
  });
});
