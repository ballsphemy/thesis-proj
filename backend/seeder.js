import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModels.js";
import Order from "./models/orderModel.js"
import connectDB from "./config/db.js";
dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany(); 
        await Product.deleteMany(); 
        await User.deleteMany(); 
        const createdUser = await User.insertMany(users);
        const adminUser = createdUser[0]._id;

        const sampleProduct = products.map((product) => {
            return {...product, user: adminUser };
        })
        console.log('Sample products:', sampleProduct);
        await Product.insertMany(sampleProduct);
        console.log('Data Imported')
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany(); 
        await Product.deleteMany(); 
        await User.deleteMany(); 
        console.log('Data destroyed')
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if(process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}