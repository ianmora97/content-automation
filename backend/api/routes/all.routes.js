const config = require("../controllers/config.controller");
// const users = require("../controllers/users.controller");

const router = require("express").Router();

// ?@route GET /api/v1/get/config
// TODO: get basic config from DB
router.get("/api/v1/get/config", config.getConfig);

module.exports = router;