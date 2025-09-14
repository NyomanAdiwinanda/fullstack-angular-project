db = db.getSiblingDB("imageapi");

db.createUser({
	user: "apiuser",
	pwd: "apipassword",
	roles: [
		{
			role: "readWrite",
			db: "imageapi",
		},
	],
});

db.createCollection("images");

print("Database and user created successfully");
