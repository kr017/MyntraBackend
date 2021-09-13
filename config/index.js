require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  connectionString: process.env.DB_CONNECTION,
  secret: process.env.SECRET,
};

// CLOUD=cloudinary.config({
// cloud_name: 'dq0qx65vj',
// api_key: '222199168174116',
// api_secret: 'AyIbjlHk9I_RaPt_arGv1zz9zog'
// });
