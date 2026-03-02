import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
    constructor(private repository: CategoryRepository) { }

    async getAllCategories() {
        return this.repository.findAll();
    }

    async getCategoryById(id: string) {
        const category = await this.repository.findById(id);
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async createCategory(name: string) {
        const slug = name.toLowerCase().replace(/ /g, '-');
        return this.repository.create({ name, slug });
    }
}
