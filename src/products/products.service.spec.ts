import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    category: 'Electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
      };

      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should throw ConflictException when product name already exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 99.99,
      };

      const error = new Error('Duplicate entry');
      error.code = 'ER_DUP_ENTRY';

      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(createProductDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all products ordered by creation date', async () => {
      const products = [mockProduct];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        price: 149.99,
        stock: 20,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };

      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);

      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      const updateProductDto: UpdateProductDto = { price: 149.99 };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when updating with duplicate name', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Duplicate Name' };

      const error = new Error('Duplicate entry');
      error.code = 'ER_DUP_ENTRY';

      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.update(1, updateProductDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.remove.mockResolvedValue(mockProduct);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const products = [mockProduct];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findByCategory('Electronics');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { category: 'Electronics' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(products);
    });
  });

  describe('findInStock', () => {
    it('should return products in stock', async () => {
      const products = [mockProduct];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findInStock();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { stock: MoreThan(0) },
        order: { stock: 'ASC' },
      });
      expect(result).toEqual(products);
    });
  });
});
