require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  connectionString: process.env.DB_CONNECTION,
  secret: process.env.SECRET,
  rzp_secret: process.env.RZP_SECRET,
  rzp_key: process.env.RZP_KEY,
};

// CLOUD=cloudinary.config({
// cloud_name: 'dq0qx65vj',
// api_key: '222199168174116',
// api_secret: 'AyIbjlHk9I_RaPt_arGv1zz9zog'
// });
