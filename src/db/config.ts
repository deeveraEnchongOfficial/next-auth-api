/**
 * The function establishes a connection to a MongoDB database using Mongoose in a TypeScript
 * environment.
 */
import mongoose from "mongoose";


export default async function connection() {
    try {
        await mongoose.connect(process.env.MONGO ?? '')
        console.log('connection true')
    } catch (err) {
        console.log(err)
    }
}
