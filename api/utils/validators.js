// Validation helper functions

// Validates if it's an integer
function isValidInteger(value) {
	if (value === undefined || value === null || value === "") {
		return false;
	}
	const num = parseInt(value);
	const floatNum = parseFloat(value);
	// Check if it's a positive integer and if the original value is not a float
	return (
		!isNaN(num) && num > 0 && Number.isInteger(floatNum) && num === floatNum
	);
}

// Validates if it's a non-null and non-empty string
function isValidString(value) {
	return (
		value !== undefined &&
		value !== null &&
		typeof value === "string" &&
		value.trim().length > 0
	);
}

// Validates email format
function isValidEmail(email) {
	if (!isValidString(email)) {
		return false;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email.trim());
}

// Validates if it's a number with two decimal places
function isValidDecimal(value) {
	if (value === undefined || value === null || value === "") {
		return false;
	}
	const num = parseFloat(value);
	if (isNaN(num) || num < 0) {
		return false;
	}
	// Check if it has at most 2 decimal places
	const decimalPlaces = (value.toString().split(".")[1] || "").length;
	return decimalPlaces <= 2;
}

// Validates route parameter ID
function validateIdParam(id, res) {
	if (!isValidInteger(id)) {
		res.status(400).json({ error: "ID must be a positive integer" });
		return null;
	}
	return parseInt(id);
}

module.exports = {
	isValidInteger,
	isValidString,
	isValidEmail,
	isValidDecimal,
	validateIdParam,
};
