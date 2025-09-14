import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
	try {
		const mongoUri =
			process.env.MONGODB_URI || "mongodb://apiuser:apipassword@localhost:27017/imageapi?authSource=imageapi";

		await mongoose.connect(mongoUri);
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

mongoose.connection.on("connected", () => {
	console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", error => {
	console.error("Mongoose connection error:", error);
});

mongoose.connection.on("disconnected", () => {
	console.log("Mongoose disconnected from MongoDB");
});

process.on("SIGINT", async () => {
	await mongoose.connection.close();
	console.log("MongoDB connection closed through app termination");
	process.exit(0);
});

export default connectDB;
