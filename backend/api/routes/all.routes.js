const config = require("../controllers/config.controller");
const nacodes = require("../controllers/nacodes.controller");

const router = require("express").Router();

// ?@route GET /api/v1/get/config
// TODO: get basic config from DB
router.get("/api/v1/get/config", config.getConfig);

// ?@route GET /api/v1/get/configPaths
// TODO: get paths config from DB
router.get("/api/v1/get/configPaths", config.getConfigPaths);

// ?@route POST /api/v1/set/jira
// TODO: get basic config from DB
router.post("/api/v1/set/jira", config.setConfigJira);

// ?@route GET /api/v1/get/nacodes
// TODO: get basic config from endpoint
router.get("/api/v1/get/nacodes", nacodes.getNACodes);

// ?@route GET /api/v1/get/cosy/info
// TODO: get basic config from endpoint
router.get("/api/v1/get/cosy/info", nacodes.getInfo);


module.exports = router;