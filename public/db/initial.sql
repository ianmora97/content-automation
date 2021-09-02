-- --------------------------------------
-- drop tables if exists
-- --------------------------------------

DROP TABLE IF EXISTS `region`;
DROP TABLE IF EXISTS `maco`;
DROP TABLE IF EXISTS `deployment`;
DROP TABLE IF EXISTS `ticket_d`;
DROP TABLE IF EXISTS `ticket_l`;

-- --------------------------------------
-- create region tables
-- --------------------------------------
CREATE TABLE `region` (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name text NOT NULL,
   description text NOT NULL
)
-- --------------------------------------
-- insert region data
-- --------------------------------------
insert into region (name,description) values 
('central','Central Region'),
('east','Eastern Region'),
('west','Western Region'),
('south','Southern Region');

-- --------------------------------------
-- create maco tables
-- --------------------------------------
CREATE TABLE `maco` (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   region INTEGER NOT NULL,
   name text NOT NULL,
   code text NOT NULL UNIQUE,
   FOREIGN KEY (region) 
      REFERENCES region (id) 
         ON DELETE CASCADE 
         ON UPDATE NO ACTION
)

 -- --------------------------------------
 -- insert central maco data
 -- --------------------------------------
insert into maco (name,region,code) values
('Chicagoland & Northwest Indiana BMW Centers',1,'4001'),
('Milwaukee BMW Centers',1,'4010'),
('Minneapolis BMW Centers',1,'4006'),
('Pittsburgh BMW Centers',1,'4161'),
('Detroit BMW Centers',1,'4003'),
('St. Louis BMW Centers',1,'4007'),
('Cleveland / Akron BMW centers',1,'4002'),
('Dayton BMW Centers',1,'4015'),
('Cincinnati BMW Centers',1,'4008'),
('Central Ohio BMW Centers',1,'4012'),
('Indianapolis BMW Centers',1,'4004'),
('Kansas City BMW Centers',1,'4005');

-- --------------------------------------
-- insert east maco data
-- --------------------------------------
insert into maco (name,region,code) values
('Massachusetts',2,'4111'),
('Tristate',2,'4121'),
('Baltimore',2,'4152'),
('New Hampshire',2,'4115'),
('Washington DC',2,'4151'),
('Central Pennsylvania',2,'4142'),
('Delaware Valley',2,'41''41'),
('Rhode Island',2,'4112'),
('Norfolk',2,'4156'),
('North East',2,'4145'),
('Connecticut',2,'4113');

-- --------------------------------------
-- insert west maco data
-- --------------------------------------
insert into maco (name,region,code) values
('Southern California',3,'3203'),
('Hawaii',3,'3206'),
('San Diego County',3,'3207'),
('Central California',3,'3234'),
('Central Coast',3,'3235'),
('Bay Area',3,'3205'),
('Sacramento / Modesto',3,'3219'),
('Las Vegas',3,'3202'),
('Valley BMW Centers',3,'3209'),
('Santa Fe',3,'3236'),
('Utah',3,'3204'),
('PDX: Beaverton / Portland / Salem',3,'3210'),
('Colorado',3,'3208'),
('Puget Sound',3,'3215');

-- --------------------------------------
-- insert south maco data
-- --------------------------------------
insert into maco (name,region,code) values
('Dallas Fort Worth',4,'0449'),
('Houston',4,'0432'),
('Austin',4,'0434'),
('Atlanta',4,'0402'),
('Triangle',4,'0418'),
('South Florida',4,'0428'),
('Tampa Bay',4,'0422'),
('Charlotte',4,'0416'),
('Greensboro / Winston-Salem BMW Centers',4,'0415'),
('Central Florida',4,'0423'),
('Western Carolinas',4,'0414'),
('Southwest Florida BMW Centers',4,'0430'),
('Jacksonville',4,'0424'),
('Gainesville Ocala',4,'0454'),
('Hilton Head/ Savannah',4,'0451'),
('Gulf Coast',4,'0452');

-- --------------------------------------
-- create deployment table
-- --------------------------------------
CREATE TABLE `deployment` (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name text NOT NULL,
   model text
);

-- --------------------------------------
-- create ticket for deployments table
-- --------------------------------------
CREATE TABLE "ticket_d" (
	"id"	INTEGER,
	"deploy"	INTEGER NOT NULL,
	"code"	text NOT NULL UNIQUE,
	"priority"	TEXT,
	"release" text,
	FOREIGN KEY("deploy") REFERENCES "deployment"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- --------------------------------------
-- create ticket later save table
-- --------------------------------------
CREATE TABLE `ticket_l` (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   url text NOT NULL,
   code text NOT NULL UNIQUE,
   workflow text NOT NULL
);

-- --------------------------------------
-- DROP VIEWS
-- --------------------------------------
DROP VIEW IF EXISTS `v_tickets`;
DROP VIEW IF EXISTS `v_macos`;
DROP VIEW IF EXISTS `v_deployments`;

-- --------------------------------------
-- create view for deployments
-- --------------------------------------
CREATE VIEW `v_tickets` AS
SELECT 
   ticket_d.id as id,
   ticket_d.code as code,
   ticket_d.url as url,
   ticket_d.workflow as workflow,
   deployment.name as name
FROM ticket_d
JOIN deployment
   ON ticket_d.deploy = deployment.id;
      
-- --------------------------------------
-- create macos view
-- --------------------------------------
CREATE VIEW `v_macos` AS
SELECT
	maco.id as id,
	region.name as region_name,
	region.description as description,
	maco.name as name,
	maco.code as code
FROM
	maco
	INNER JOIN region on maco.region = region.id;


-- --------------------------------------
-- create deployments view
-- --------------------------------------
CREATE VIEW v_deployments as
SELECT
	deployment.id as id,
	deployment.name as name,
	deployment.model as model
FROM deployment
WHERE deployment.id IN (
	SELECT count(ticket_d.id) as cantidad
	FROM ticket_d
);