import { Router } from "express";
const router = Router();
router.post("/", (req, res) => {
  res.status(501).json({ error: "not implemented" });
});
router.get("/", (req, res) => {
  res.status(501).json({ error: "not implemented" });
});
router.get("/:id", (req, res) => {
  // or only id
  const { id } = req.params;
  res.status(501).json({ error: "not implemented: " + id });
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `not implemented : ${id}` });
});
router.post("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `not implemented : ${id}` });
});
export default router;
