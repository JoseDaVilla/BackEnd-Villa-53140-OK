import { productModel } from "../dao/models/products.js";

class ProductRepository {
    async getProducts({ limit = 10, page = 1, sort, query = {} }) {
        page = page == 0 ? 1 : page;
        page = Number(page);
        limit = Number(limit);

        const skip = (page - 1) * limit;
        const sortOrder = { 'asc': -1, 'desc': 1 };
        sort = sortOrder[sort] || null;

        if (typeof query === 'string') {
            try {
                query = JSON.parse(decodeURIComponent(query));
            } catch (err) {
                console.error('Error al analizar la query', err);
                throw new Error('Formato incorrecto de query');
            }
        }

        const queryProducts = productModel.find(query).limit(limit).skip(skip).lean();

        if (sort !== null) {
            queryProducts.sort({ price: sort });
        }

        const [products, totalDocs] = await Promise.all([
            queryProducts,
            productModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        return {
            totalDocs,
            totalPages,
            page,
            hasNextPage,
            hasPrevPage,
            prevPage,
            nextPage,
            limit,
            query: JSON.stringify(query),
            payload: products,
            prevLink: '',
            nextLink: '',
        };
    }

    // ? Ejemplo de get con filtros: http://localhost:3000/api/products?query={"category":"Camisetas"}&limit=10&page=1&sort=asc

    async getProductById(pid) {
        try {
            return await productModel.findById(pid).lean();
        } catch (error) {
            console.log("getProductById => ", error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            return await productModel.create(productData);
        } catch (error) {
            console.log("addProduct => ", error);
            throw error;
        }
    }

    async updateProduct(pid, updateData) {
        try {
            return await productModel.findByIdAndUpdate(pid, { ...updateData }, { new: true }).lean();
        } catch (error) {
            console.log("updateProduct => ", error);
            throw error;
        }
    }

    async deleteProduct(pid) {
        try {
            return await productModel.findByIdAndDelete(pid).lean();
        } catch (error) {
            console.log("deleteProduct => ", error);
            throw error;
        }
    }
}

export default new ProductRepository();