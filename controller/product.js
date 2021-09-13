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
      // search.isActive = 1;
      // if (req.body.isArchieved || req.body.isArchieved === false) {
      //   search.isArchieved = req.body.isArchieved;
      // }
      if (req.body.section) {
        search.section = req.body.section;
      }
      if (req.body.category) {
        search.category = req.body.category;
      }
      if (req.body.brand) {
        search.brand = req.body.brand;
      }
      if (req.body.color) {
        search.color = req.body.color;
      }
      // if (req.body.search) {
      //   search = {
      //     ...search,
      //     $or: [
      //       { color: { $regex: req.body.search, $options: "i" } },
      //       { title: { $regex: req.body.search, $options: "i" } },
      //       { description: { $regex: req.body.search, $options: "i" } },
      //     ],
      //   };
      // }

      // if (req.body.pin || req.body.pin === false) {
      //   search.isPinned = req.body.pin;
      // }

      // let totalRecords = await Note.count();
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
      console.log(productId);
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

  /**
   * get particular note details.
   * @param {note_id} req
   */
  // getUserNote: async (req, res) => {
  //   try {
  //     if (!req.body.note_id) {
  //       throw { message: "Note id is required." };
  //     }
  //     let userNote = await Note.findById(req.body.note_id);

  //     res.json({
  //       status: "success",
  //       message: "User Note",
  //       data: userNote,
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       message: (err && err.message) || "Failed to find note",
  //     });
  //   }
  // },

  // updateNote: async (req, res) => {
  //   try {
  //     if (!req.body._id) {
  //       throw { message: "Note id is required." };
  //     }

  //     let userNote = await Note.findById(req.body._id);

  //     let updatedNote = await Note.findByIdAndUpdate(
  //       req.body._id,
  //       {
  //         title: req.body.title ? req.body.title : userNote.title,
  //         description: req.body.description
  //           ? req.body.description
  //           : userNote.description,
  //         color: req.body.color ? req.body.color : userNote.color,
  //         isPinned: req.body.isPinned ? true : false,
  //         tag: req.body.tag ? req.body.tag : userNote.tag,
  //         last_modified: moment().unix() * 1000,
  //       },
  //       { new: true }
  //     );

  //     res.json({
  //       status: "success",
  //       message: "Note updated successfully",
  //       data: updatedNote,
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       message: (err && err.message) || "Note update failed",
  //     });
  //   }
  // },

  // archiveNote: async (req, res) => {
  //   try {
  //     if (!req.body.note_id) {
  //       throw { message: "Note id is required." };
  //     }

  //     let archiveNote = await Note.findByIdAndUpdate(req.body.note_id, {
  //       isArchieved: 1,
  //     });
  //     res.json({
  //       status: "success",
  //       message: "Note archieved successfully",
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       message: (error && error.message) || "Note update failed",
  //     });
  //   }
  // },

  // deleteNote: async (req, res) => {
  //   try {
  //     if (!req.body.note_id) {
  //       throw { message: "Note id is required." };
  //     }

  //     let deleteNote = await Note.findByIdAndUpdate(req.body.note_id, {
  //       isActive: 0,
  //     });
  //     res.json({
  //       status: "success",
  //       message: "Note deleted successfully",
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       message: (error && error.message) || "Note update failed",
  //     });
  //   }
  // },

  // getTrashNotes: async (req, res) => {
  //   try {
  //     let notes = await Note.find({ isActive: 0 });

  //     res.json({
  //       status: "success",
  //       message: "deleted notes",
  //       data: notes,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       message: (error && error.message) || "Note update failed",
  //     });
  //   }
  // },

  // restoreNote: async (req, res) => {
  //   try {
  //     let notes = await Note.findByIdAndUpdate(
  //       req.body.note_id,
  //       { isActive: 1 },
  //       {
  //         new: true,
  //       }
  //     );

  //     res.json({
  //       status: "success",
  //       message: "deleted notes",
  //       data: notes,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       message: (error && error.message) || "Note update failed",
  //     });
  //   }
  // },
};
