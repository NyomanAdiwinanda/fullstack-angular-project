import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

export const s3 = new AWS.S3();

export const S3_BUCKET = process.env.S3_BUCKET_NAME || "";

if (!S3_BUCKET) {
	console.warn("S3_BUCKET_NAME not configured. S3 operations will fail.");
}

export const generateS3Key = (originalName: string): string => {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	const extension = originalName.split(".").pop();
	return `images/${timestamp}-${randomString}.${extension}`;
};

export const uploadToS3 = async (
	buffer: Buffer,
	key: string,
	contentType: string
): Promise<AWS.S3.ManagedUpload.SendData> => {
	const params: AWS.S3.PutObjectRequest = {
		Bucket: S3_BUCKET,
		Key: key,
		Body: buffer,
		ContentType: contentType,
	};

	return s3.upload(params).promise();
};

export const getSignedUrl = (key: string, expiresIn: number = 3600): string => {
	return s3.getSignedUrl("getObject", {
		Bucket: S3_BUCKET,
		Key: key,
		Expires: expiresIn,
	});
};

export const deleteFromS3 = async (key: string): Promise<AWS.S3.DeleteObjectOutput> => {
	const params: AWS.S3.DeleteObjectRequest = {
		Bucket: S3_BUCKET,
		Key: key,
	};

	return s3.deleteObject(params).promise();
};
