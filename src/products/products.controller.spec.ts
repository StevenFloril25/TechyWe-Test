import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

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

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategory: jest.fn(),
    findInStock: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        stock: 5,
        category: 'Electronics',
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(productsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(productsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        price: 199.99,
        stock: 15,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(1, updateProductDto);

      expect(productsService.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(productsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const products = [mockProduct];
      mockProductsService.findByCategory.mockResolvedValue(products);

      const result = await controller.findByCategory('Electronics');

      expect(productsService.findByCategory).toHaveBeenCalledWith('Electronics');
      expect(result).toEqual(products);
    });
  });

  describe('findInStock', () => {
    it('should return products in stock', async () => {
      const products = [mockProduct];
      mockProductsService.findInStock.mockResolvedValue(products);

      const result = await controller.findInStock();

      expect(productsService.findInStock).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });
});
