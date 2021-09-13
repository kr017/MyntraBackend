var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const ProductController = require("../controller/product");

// router.all("/api/*", userAuthenticated, userExists);
// router.post("/api/addNotes", NoteController.addNote);
// router.post("/api/notes", NoteController.getUserNotes);
// router.post("/api/user_note", NoteController.getUserNote);
// router.put("/api/updateNote", NoteController.updateNote);
// router.post("/api/archieveNote", NoteController.archiveNote);
// router.post("/api/deleteNote", NoteController.deleteNote);
// router.get("/api/trashNotes", NoteController.getTrashNotes);
// router.post("/api/restoreNote", NoteController.restoreNote);

router.post("/shop", ProductController.getAllProducts);
router.get("/shop/:id", ProductController.getProductDetails);

module.exports = router;
