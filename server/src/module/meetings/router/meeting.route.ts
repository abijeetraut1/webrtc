import express from "express";
const router = express.Router();
import {
	_create_meetings,
	_get_meeting_details,
} from "../controller/meeting.controller";
import { _auth_guard } from "../../../guard/auth.guard";

router.post("/", _auth_guard, _create_meetings);
router.get("/:id", _auth_guard, _get_meeting_details);

// router.get("/", );
// router.delete("/:id", );

export default router;