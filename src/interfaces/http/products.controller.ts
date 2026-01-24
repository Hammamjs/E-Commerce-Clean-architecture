import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/productsDto/create-product.dto';
import { UpdateProductDto } from '../dto/productsDto/update-product.dto';
import { ProductsFacade } from 'src/application/use-cases/product/products.facade';
import { ProductResponseDto } from '../dto/productsDto/productResponseDto';
import { UpdateProductCommand } from 'src/application/command/product/update-product.command';

@Controller('products')
export class ProductsController {
  constructor(private readonly product: ProductsFacade) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.product.create.execute(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.product.findProducts.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.product.findProduct.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const command = new UpdateProductCommand(
      id,
      updateProductDto.name,
      updateProductDto.price,
      updateProductDto.inStock,
    );

    const product = await this.product.update.execute(command);

    if (!product)
      throw new NotFoundException("Product cannot be updated it doesn't exist");

    return new ProductResponseDto(product);
  }

  @Patch('increase-quantity/:id')
  async increaseProductQuantity(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.product.increaseStock.execute({
      productId: id,
      quantity: updateProductDto.quantity!,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.product.deleteProduct.execute(id);
    if (!product)
      throw new NotFoundException("Product doesn't exist operation failed");
    return new ProductResponseDto(product);
  }
}
