import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../dao/controllers/mongoProductManager.js";


const router = Router();

router.get("/", auth(["admin", "user"]), getProducts);
router.get("/:pid", auth(["admin", "user"]), getProductById);
router.post("/", auth(["admin"]), addProduct);
router.put("/:pid", auth(["admin"]), updateProduct);
router.delete("/:pid", auth(["admin"]), deleteProduct);

export default router;
