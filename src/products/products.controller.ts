import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    type: Product 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token required' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Product name already exists' 
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products retrieved successfully',
    type: [Product]
  })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'category', description: 'Product category' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products by category retrieved successfully',
    type: [Product]
  })
  async findByCategory(@Param('category') category: string): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }

  @Get('in-stock')
  @ApiOperation({ summary: 'Get products in stock' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products in stock retrieved successfully',
    type: [Product]
  })
  async findInStock(): Promise<Product[]> {
    return this.productsService.findInStock();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product retrieved successfully',
    type: Product
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product updated successfully',
    type: Product
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token required' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Product name already exists' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ 
    status: 204, 
    description: 'Product deleted successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token required' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found' 
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
