// products.js - Product catalog with color variants
const PRODUCTS = [
    // T-Shirts - Each with 5 color variants
    {
        id: 'ts1',
        title: 'Classic Round Neck Tee',
        category: 'tshirt',
        neck: 'round',
        basePrice: 299,
        description: 'Comfortable cotton blend, perfect for daily wear',
        colors: {
            red: { price: 299, img: 'assets/products/tshirt/red-tshirt.png' },
            green: { price: 299, img: 'assets/products/tshirt/green-tshirt.png' },
            blue: { price: 299, img: 'assets/products/tshirt/blue-tshirt.png' },
            black: { price: 299, img: 'assets/products/tshirt/black-tshirt.png' },
            white: { price: 299, img: 'assets/products/tshirt/white-tshirt.png' }
        }
    },
    
    {
        id: 'ts3',
        title: 'V-Neck Slim Fit',
        category: 'tshirt',
        neck: 'v',
        basePrice: 349,
        description: 'Stylish V-neck design with slim fit cut',
        colors: {
            red: { price: 349, img: 'assets/products/tshirt/vneck-red-tshirt.png' },
            green: { price: 349, img: 'assets/products/tshirt/vneck-green-tshirt.png' },
            blue: { price: 349, img: 'assets/products/tshirt/vneck-blue-tshirt.png' },
            black: { price: 349, img: 'assets/products/tshirt/vneck-black-tshirt.png' },
            white: { price: 349, img: 'assets/products/tshirt/vneck-white-tshirt.png' }
        }
    },
    
    // Hoodies - Each with 5 color variants
    {
        id: 'hd1',
        title: 'Classic Pullover Hoodie',
        category: 'hoodie',
        neck: 'hood',
        basePrice: 799,
        description: 'Warm and comfortable pullover hoodie',
        colors: {
            red: { price: 799, img: 'assets/products/hoodie/red-hoodie.png' },
            green: { price: 799, img: 'assets/products/hoodie/green-hoodie.png' },
            blue: { price: 799, img: 'assets/products/hoodie/blue-hoodie.png' },
            black: { price: 799, img: 'assets/products/hoodie/black-hoodie.png' },
            white: { price: 799, img: 'assets/products/hoodie/white-hoodie.png' }
        }
    },
    {
        id: 'hd2',
        title: 'Zip-Up Hoodie',
        category: 'hoodie',
        neck: 'hood',
        basePrice: 899,
        description: 'Full zip hoodie with front pockets',
        colors: {
            red: { price: 899, img: 'assets/products/hoodie/zip-red-hoodie.png' },
            green: { price: 899, img: 'assets/products/hoodie/zip-green-hoodie.png' },
            blue: { price: 899, img: 'assets/products/hoodie/zip-blue-hoodie.png' },
            black: { price: 899, img: 'assets/products/hoodie/zip-black-hoodie.png' },
            white: { price: 899, img: 'assets/products/hoodie/zip-white-hoodie.png' }
        }
    },

    // Full Sleeve - Each with 5 color variants
    {
        id: 'fs1',
        title: 'Long Sleeve Cotton Tee',
        category: 'fullsleeve',
        neck: 'round',
        basePrice: 449,
        description: '100% cotton long sleeve t-shirt',
        colors: {
            red: { price: 449, img: 'assets/products/fullsleeve/red-fullsleeve.png' },
            green: { price: 449, img: 'assets/products/fullsleeve/green-fullsleeve.png' },
            blue: { price: 449, img: 'assets/products/fullsleeve/blue-fullsleeve.png' },
            black: { price: 449, img: 'assets/products/fullsleeve/black-fullsleeve.png' },
            white: { price: 449, img: 'assets/products/fullsleeve/white-fullsleeve.png' }
        }
    },
    {
        id: 'fs3',
        title: 'Henley Full Sleeve',
        category: 'fullsleeve',
        neck: 'henley',
        basePrice: 529,
        description: 'Classic henley style with button placket',
        colors: {
            red: { price: 529, img: 'assets/products/fullsleeve/henley-red-fullsleeve.png' },
            green: { price: 529, img: 'assets/products/fullsleeve/henley-green-fullsleeve.png' },
            blue: { price: 529, img: 'assets/products/fullsleeve/henley-blue-fullsleeve.png' },
            black: { price: 529, img: 'assets/products/fullsleeve/henley-black-fullsleeve.png' },
            white: { price: 529, img: 'assets/products/fullsleeve/henley-white-fullsleeve.png' }
        }
    }
];

// Make products available globally
window.JD_PRODUCTS = PRODUCTS;