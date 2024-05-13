import { productModel } from "../dao/models/products.js";


export const getProductsService = async ({ limit = 10, page = 1, sort, query = {} }) => {
    try {

        page = page == 0 ? 1 : page;
        page = Number(page);
        limit = Number(limit)

        const skip = (page - 1) * (limit)
        const sortOrder = { 'asc': -1, 'desc': 1, }
        sort = sortOrder[sort] || null;


        // if (typeof query === 'string') {
        //     try {
        //         query = JSON.parse(decodeURIComponent(query));
        //     } catch (err) {
        //         console.error('Error al analizar la query', err);
        //         return res.status(400).json({ msg: 'Formato incorrecto de query' });
        //     }
        // }


        try {
            if (query)  
                query = JSON.parse(decodeURIComponent(query));
        } catch (error) {
            console.log("Unable to parse")
            query={}
        }


        const queryProducts = productModel.find(query).limit((limit)).skip(skip).lean()

        if (sort !== null)
            queryProducts.sort({ price: sort })

        const [products, totalDocs] = await Promise.all([queryProducts, productModel.countDocuments(query)])

        const totalPages = Math.ceil(totalDocs / (limit))
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
            query:JSON.stringify(query),
            payload: products,

            prevLink: '',
            nextLink: '',
        }

    } catch (error) {
        console.log('getProducts => ', error)
        throw error
    }
}

export const getProductByIdService = async (pid) => {
    try {
        return await productModel.find(pid);
    } catch (error) {
        console.log('getProductByIdService => ', error)
        throw error
    }
}

export const addProductService = async ({ title, description, price, thumbnails, code, stock, category, status,_id }) => {
    try {
        return await productModel.create({title, description, price, thumbnails, code, stock, category, status, _id})

    } catch (error) {
        console.log('addProductService => ', error)
        throw error
    }
}

export const updateProductService = async (pid, rest) => {
    try {
        return await productModel.findByIdAndUpdate(pid, { ...rest }, { new: true });

    } catch (error) {
        console.log('updateProductService => ', error)
        throw error
    }
}

export const deleteProductService = async (pid) => {
    try {

        return await productModel.findByIdAndDelete(pid);


    } catch (error) {
        console.log('deleteProductService => ', error)
        throw error
    }
}

