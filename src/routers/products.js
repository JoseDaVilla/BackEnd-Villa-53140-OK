import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../dao/controllers/mongoProductManager.js";


const router = Router();

router.get("/", auth(["admin", "user", "premium"]), getProducts);
router.get("/:pid", auth(["admin", "user", "premium"]), getProductById);
router.post("/", auth(["admin", "premium"]), addProduct);
router.put("/:pid", auth(["admin", "premium"]), updateProduct);
router.delete("/:pid", auth(["admin", "premium"]), deleteProduct);

export default router;
