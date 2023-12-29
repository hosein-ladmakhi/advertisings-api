import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
  @Inject(CategoriesService)
  private readonly categoriesService: CategoriesService;

  @Get()
  findCategories(@Param() params: any) {
    return this.categoriesService.findCategories(params);
  }

  @Get(':id')
  findCategoryById(@Param('id') id: string) {
    return this.categoriesService.findCategoryById(id);
  }

  @Patch(':id')
  updateCategoryById(@Param('id') id: string, @Body() dto: UpdateCategoryDTO) {
    return this.categoriesService.updateCategories(id, dto);
  }

  @Delete(':id')
  deleteCategoryById(@Param('id') id: string) {
    return this.categoriesService.deleteCategories(id);
  }

  @Post()
  createCategory(@Body() dto: CreateCategoryDTO) {
    return this.categoriesService.createCategories(dto);
  }
}
