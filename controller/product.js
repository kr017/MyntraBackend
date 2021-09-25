const Product = require("../models/product");
const moment = require("moment");
module.exports = {
  getAllProducts: async (req, res) => {
    try {
      let sort = {};
      if (req.body.order) {
        sort[req.body.field] = parseInt(req.body.order); //order=1  =>ASC
        // sort["title"]=1 //sorting by title in ASC order
      } else {
        sort.created_at = -1;
      }
      let search = {};

      if (req.body.categories && req.body.categories.length > 0) {
        search.category = { $in: [...req.body.categories] };
      }
      if (req.body.brands && req.body.brands.length > 0) {
        search.brand = { $in: [...req.body.brands] };
      }
      if (req.body.colors && req.body.colors.length > 0) {
        search.color = { $in: [...req.body.colors] };
      }

      if (req.body.search) {
        let regex = new RegExp(req.body.search, "i");
        search = {
          // section: req.body.section,
          $or: [
            {
              color: regex,
            },
            {
              brand: regex,
            },
            {
              category: regex,
            },
            { name: regex },
          ],
        };
      }

      if (req.body.section) {
        search.section = req.body.section;
      }
      console.log(search);
      let products = await Product.find(search)
        .collation({ locale: "en_US", strength: 1 }) //letter casing
        .sort(sort);

      res.json({
        status: "success",
        message: "all products",
        data: products,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
  getProductDetails: async (req, res) => {
    try {
      let productId = req.params.id;
      const product = await Product.findById({ _id: productId });

      if (product) {
        res.json({
          status: "success",
          data: product,
        });
      } else {
        res.status(404).json({
          message: (err && err.message) || "No product found",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },

  getFiltersList: async (req, res) => {
    try {
      let search = {};
      if (req.body.section) {
        search.section = req.body.section;
      }

      //categorieslist
      let categories = await Product.find(search).select("category");
      categories = categories.reduce((unique, o) => {
        if (!unique.some(obj => obj.category === o.category)) {
          unique.push(o.category);
        }
        return unique;
      }, []);
      categories = [...new Set(categories)];

      // brandlist
      let brands = await Product.find(search).select("brand");
      brands = brands.reduce((unique, o) => {
        if (!unique.some(obj => obj.brand === o.brand)) {
          unique.push(o.brand);
        }
        return unique;
      }, []);
      brands = [...new Set(brands)];

      // colorlist
      let colors = await Product.find(search).select("color");
      colors = colors.reduce((unique, o) => {
        if (!unique.some(obj => obj.color === o.color)) {
          unique.push(o.color);
        }
        return unique;
      }, []);
      colors = [...new Set(colors)];

      res.json({
        status: "success",
        message: "all products",
        data: {
          brands: brands,
          categories: categories,
          colors: colors,
        },
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
};
