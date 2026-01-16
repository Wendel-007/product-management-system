require("dotenv").config();
const {
	initDatabase,
	closeDatabase,
} = require("../config/database");
const User = require("../models/User");

async function initDefaultUser() {
	try {
		// Load environment variables
		const username = process.env.DEFAULT_ADMIN_USERNAME;
		const password = process.env.DEFAULT_ADMIN_PASSWORD;

		if (!username || !password) {
			console.error(
				"❌ Error: DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in .env file"
			);
			process.exit(1);
		}

		await initDatabase();

		// Check if user already exists
		const existingUser = await User.findByUsername(username);

		if (!existingUser) {
			// Create default user as admin
			const defaultUser = await User.create(username, password, "admin");
			console.log("✅ Default admin user created:");
			console.log(`   Username: ${username}`);
			console.log(`   Type: admin`);
			console.log("   Password: ***");
			console.log(
				"\n⚠️  IMPORTANT: Change the default password in production!"
			);
		} else {
			console.log("ℹ️  Default user already exists");
			// Update existing user to admin if not already
			if (existingUser.type !== "admin") {
				try {
					await User.update(username, { type: "admin" });
					console.log("✅ User type updated to admin");
				} catch (error) {
					console.error("Error updating user type:", error);
				}
			}
		}

		await closeDatabase();
		process.exit(0);
	} catch (error) {
		console.error("❌ Error initializing user:", error);
		process.exit(1);
	}
}

initDefaultUser();
