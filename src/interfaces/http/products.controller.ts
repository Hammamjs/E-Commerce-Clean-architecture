import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
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

    return new ProductResponseDto(product);
  }

  @Patch('increase-quantity/:id')
  async increaseProductQuantity(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.handleChange(id, updateProductDto.inStock!, 'increase');
  }

  @Patch('decrease-quantity/:id')
  async decreaseProductQuantity(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.handleChange(id, updateProductDto.inStock!, 'decrease');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.product.deleteProduct.execute(id);
    return new ProductResponseDto(product);
  }

  private async handleChange(
    id: string,
    quantity: number,
    action: 'increase' | 'decrease',
  ) {
    if (quantity === undefined || quantity <= 0)
      throw new BadRequestException('Quantity must be a positive number');
    const product =
      action === 'increase'
        ? await this.product.increaseStock.execute({
            productId: id,
            quantity,
          })
        : await this.product.decreaseStock.execute({
            productId: id,
            quantity,
          });

    return new ProductResponseDto(product);
  }
}
