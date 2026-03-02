import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('categories')
export class CategoryController {
    constructor(private service: CategoryService) { }

    @Get()
    async findAll() {
        return this.service.getAllCategories();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.getCategoryById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN' as any)
    @Post()
    async create(@Body() dto: CreateCategoryDto) {
        return this.service.createCategory(dto.name);
    }
}
