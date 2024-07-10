import { faker } from '@faker-js/faker';

export const generateMockProducts = () => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        const product = {
            _id: faker.string.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            stock: faker.number.int({ min: 0, max: 100 }),
            category: faker.commerce.department(),
            thumbnails: [faker.image.url()]
        };

        products.push(product);
    }

    return products;
};
