# API DOC

Your API server is running at: **http://localhost:3000**

## 🧪 **Test Endpoints**

### 1. **Health Check** ✅

Test if your server is running:

**Request:**

```
Method: GET
URL: http://localhost:3000/health
```

**Expected Response:**

```json
{
	"success": true,
	"message": "Server is running",
	"timestamp": "2025-09-13T...",
	"environment": "development"
}
```

---

### 2. **Upload Image** 📤

Upload an image file:

**Request:**

```
Method: POST
URL: http://localhost:3000/api/images/upload
```

**Headers:**

- Content-Type: `multipart/form-data` (Postman sets this automatically)

**Body (form-data):**

- Key: `image` | Type: File | Value: [Select an image file]
- Key: `title` | Type: Text | Value: "My Custom Image Title" (optional - defaults to original filename)
- Key: `description` | Type: Text | Value: "My test image" (optional)
- Key: `tags` | Type: Text | Value: "test,postman,upload" (optional)

**Expected Response:**

```json
{
	"success": true,
	"message": "Image uploaded successfully",
	"data": {
		"id": "...",
		"title": "My Custom Image Title",
		"filename": "1726185736123-abc123.jpg",
		"originalName": "test-image.jpg",
		"mimeType": "image/jpeg",
		"size": 245760,
		"s3Key": "images/1726185736123-abc123.jpg",
		"s3Url": "https://nyoman-angular-app-image-bucket.s3.ap-southeast-3.amazonaws.com/images/1726185736123-abc123.jpg",
		"uploadDate": "2025-09-13T...",
		"metadata": {
			"description": "My test image",
			"tags": ["test", "postman", "upload"]
		}
	}
}
```

---

### 3. **Get All Images** 📋

Retrieve all uploaded images:

**Request:**

```
Method: GET
URL: http://localhost:3000/api/images
```

**Optional Query Parameters:**

- `page=1` (pagination)
- `limit=10` (items per page)
- `mimeType=image/jpeg` (filter by type)
- `tags=test,postman` (filter by tags)

**Example with filters:**

```
http://localhost:3000/api/images?page=1&limit=5&tags=test
```

**Expected Response:**

```json
{
    "success": true,
    "message": "Images retrieved successfully",
    "data": [
        {
            "id": "...",
            "filename": "...",
            "originalName": "...",
            "url": "https://...",
            "uploadDate": "...",
            ...
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
    }
}
```

---

### 4. **Get Single Image** 🖼️

Get details of a specific image:

**Request:**

```
Method: GET
URL: http://localhost:3000/api/images/{IMAGE_ID}
```

Replace `{IMAGE_ID}` with the actual ID from upload response.

---

### 5. **Update Image Metadata** ✏️

Update image description and tags:

**Request:**

```
Method: PATCH
URL: http://localhost:3000/api/images/{IMAGE_ID}
```

**Headers:**

- Content-Type: `application/json`

**Body (raw JSON):**

```json
{
	"title": "Updated Image Title",
	"description": "Updated description",
	"tags": ["updated", "postman", "test"]
}
```

---

### 6. **Delete Image** 🗑️

Delete an image:

**Request:**

```
Method: DELETE
URL: http://localhost:3000/api/images/{IMAGE_ID}
```

**Expected Response:**

```json
{
	"success": true,
	"message": "Image deleted successfully"
}
```

---

## 🚨 **Common Issues & Solutions**

### Issue: "CORS Error"

**Solution:** Make sure your server is running and CORS_ORIGIN is set correctly.

### Issue: "File upload failed"

**Solutions:**

1. Check AWS credentials in `.env`
2. Verify S3 bucket exists and has correct permissions
3. Ensure file is an image (JPEG, PNG, GIF, WebP)
4. Check file size (max 5MB)

### Issue: "MongoDB connection error"

**Solution:** Make sure MongoDB is running: `docker-compose up -d`

### Issue: "Invalid resource" in S3

**Solution:** Double-check your S3 bucket name in `.env` matches exactly.

---

## ✅ **Step-by-Step Testing**

1. **Start with Health Check** - verify server is running
2. **Upload an Image** - test the main functionality
3. **Get All Images** - verify the image was saved
4. **Click the image URL** - verify it opens in browser
5. **Update Metadata** - test PATCH endpoint
6. **Delete Image** - test cleanup

Your API is ready for testing! 🚀
