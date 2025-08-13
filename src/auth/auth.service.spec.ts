import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockUsersService = {
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 1, email, passwordHash: 'hashedPassword' };

      mockUsersService.register.mockResolvedValue(mockUser);

      const result = await service.register(email, password);

      expect(mockUsersService.register).toHaveBeenCalledWith(email, password);
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 1, email, passwordHash: 'hashedPassword' };
      const mockToken = 'jwt-token';

      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(email, password);

      expect(mockUsersService.validateUser).toHaveBeenCalledWith(email, password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        {
          secret: 'super_secret_change_me',
          expiresIn: '1d',
        }
      );
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});
