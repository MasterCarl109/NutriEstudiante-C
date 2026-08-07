import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createRecord,
  listRecords,
  deleteRecord,
} from "../controllers/trackingController.js";

const router = Router();

router.use(requireAuth);
router.post("/", createRecord);
router.get("/", listRecords);
router.delete("/:id", deleteRecord);

export default router;
