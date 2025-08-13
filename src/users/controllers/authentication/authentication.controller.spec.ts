import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from '../../../auth/auth.service';
import { UsersService } from '../../users.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { id: 'user-uuid-123', email: 'test@example.com' };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto.email, registerDto.password);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { access_token: 'jwt-token' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMyProfile', () => {
    it('should return current user profile', async () => {
      const mockRequest = {
        user: { sub: 'user-uuid-123' }
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getMyProfile(mockRequest);

      expect(usersService.findById).toHaveBeenCalledWith('user-uuid-123');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      });
    });
  });

  describe('updateMyProfile', () => {
    it('should update current user profile', async () => {
      const mockRequest = {
        user: { sub: 'user-uuid-123' }
      };
      const updateProfileDto = { email: 'newemail@example.com' };
      const updatedUser = { ...mockUser, email: 'newemail@example.com' };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateMyProfile(mockRequest, updateProfileDto);

      expect(usersService.updateProfile).toHaveBeenCalledWith('user-uuid-123', updateProfileDto);
      expect(result).toEqual({
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      });
    });
  });
});
