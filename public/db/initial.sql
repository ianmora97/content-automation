-- --------------------------------------
-- drop tables if exists
-- --------------------------------------

DROP TABLE IF EXISTS config;
DROP TABLE IF EXISTS cosyConfig;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS maco;
DROP TABLE IF EXISTS deployment;
DROP TABLE IF EXISTS ticket_d;
DROP TABLE IF EXISTS ticket_l;

-- --------------------------------------
-- create config table
-- --------------------------------------
CREATE TABLE config (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   c_email text NOT NULL,
   c_token text NOT NULL,
   fav_view text NOT NULL,
   p_year text NOT NULL
);

-- --------------------------------------
-- create cosyConfig table
-- --------------------------------------
CREATE TABLE cosyConfig (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   domain text NOT NULL,
   ubyo_start text NOT NULL,
   ubyo_options text NOT NULL,
   ubyo_modelList text NOT NULL,
   ubyo_specs text NOT NULL
);

-- --------------------------------------
-- create region table
-- --------------------------------------
CREATE TABLE `region` (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name text NOT NULL,
   description text NOT NULL
);
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
);

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

-- --------------------------------------
-- create table property_tech
-- --------------------------------------
CREATE TABLE property_tech (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	name	TEXT NOT NULL,
	key	TEXT NOT NULL UNIQUE
);

CREATE VIEW v_prop as
SELECT 
property_tech.id as id,
property_tech.key as key,
property_tech.name as name,
property_tech.level as level
from property_tech 
ORDER BY property_tech.name ASC;

-- --------------------------------------
-- insert engine keys
-- --------------------------------------
INSERT INTO property_tech (name,key,level) VALUES('engine','engineType',2),
('engine','displacement',2),
('engine','engineHorsePower',2),
('engine','engineHorsePowerMinRPM',2),
('engine','engineHorsePowerMaxRPM',2),
('engine','engineTorque',2),
('engine','engineTorqueMinRPM',2),
('engine','engineTorqueMaxRPM',2),
('engine','compressionRatio',2);

insert into property_tech (name,key,level) values
('engine','eMotorType',2),
('engine','eMotorTorque',2),
('engine','combinedHorsePower',2),
('engine','combinedHorsePower',2),
('engine','batteryType',2),
('engine','batteryCapacity',2);

insert into property_tech (name,key,level) values 
('transmission.automatic','transmissionType',3),
('transmission.automatic','gearRatioOne',3),
('transmission.automatic','gearRatioTwo',3),
('transmission.automatic','gearRatioThree',3),
('transmission.automatic','gearRatioFour',3),
('transmission.automatic','gearRatioFive',3),
('transmission.automatic','gearRatioSix',3),
('transmission.automatic','gearRatioSeven',3),
('transmission.automatic','gearRatioEight',3),
('transmission.automatic','gearRatioReverse',3),
('transmission.automatic','finalDriveRatio',3);

insert into property_tech (name,key,level) values
('performance','acceleration',2),
('performance','topSpeedOne',2),
('performance','topSpeedTwo',2);

insert into property_tech (name,key,level) values
('fuelConsumption','mpgCombined',2),
('fuelConsumption','mpgCity',2),
('fuelConsumption','mpgHighway',2),
('fuelConsumption','tankCapacity',2);

insert into property_tech (name,key,level) values
('wheelsAndTires','tireType',2),
('wheelsAndTires','wheelDimensionsFront',2),
('wheelsAndTires','wheelDimensionsRear',2),
('wheelsAndTires','tireDimensionsFront',2),
('wheelsAndTires','tireDimensionsRear',2);

insert into property_tech (name,key,level) values
('exterior','length',2),
('exterior','width',2),
('exterior','height',2),
('exterior','curbWeight',2),
('exterior','weightDistributionFront',2),
('exterior','weightDistributionRear',2)
('exterior','payload',2);

insert into property_tech (name,key,level) values
('interior','headroomFront',2),
('interior','legroomFront',2),
('interior','legroomRear',2),
('interior','shoulderRoomFront',2),
('interior','shoulderRoomRear',2),
('interior','cargoCapacity',2);


-- --------------------------------------
-- create table template
-- --------------------------------------
CREATE TABLE template (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	description TEXT
);

insert into template (name,description) values
('SAV','X Models'),
('SEDAN','Series and M Models');

-- --------------------------------------
-- create table templates_techspecs
-- --------------------------------------
CREATE TABLE templates_techspecs (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	nacode TEXT NOT NULL UNIQUE,
	template INTEGER NOT NULL,
	FOREIGN KEY("template") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

create VIEW v_variations as
SELECT 
templates_techspecs.id as id,
templates_techspecs.nacode as nacode,
template.name as name
FROM templates_techspecs
INNER JOIN template
on templates_techspecs.template = template.id;

INSERT INTO templates_techspecs (nacode,template) VALUES
('22SP',1),
('22XZ',1),
('22XV',1),
('22XO',1),
('22XG',1),
('22XK',1),
('22XL',1),
('22XM',1),
('22SJ',1),
('22SO',1),
('21XZ',1),
('21XV',1),
('21XY',1),
('21XX',1),
('21XU',1),
('21XR',1),
('21XO',1),
('21XN',1),
('21XK',1),
('21XM',1),
('21XL',1),
('21XG',1),
('21XE',1),
('21XB',1),
('21XA',1),
('21SJ',1),
('21SO',1),
('21SP',1),
('22XE',1),
('22XQ',1),
('22XD',1),
('22SA',1),
('22SL',1),
('22SQ',1),
('22XR',1);


insert into templates_techspecs (nacode,template) values
('22TQ',2),
('22TP',2),
('22TN',2),
('21TP',2),
('224X',2),
('224V',2),
('224R',2),
('224H',2),
('224G',2),
('224E',2),
('224D',2),
('224B',2),
('223Z',2),
('223W',2),
('223Q',2),
('223O',2),
('222V',2),
('222U',2),
('222T',2),
('214X',2),
('214K',2),
('224J',2),
('212V',2),
('212Q',2),
('212M',2),
('212K',2),
('212J',2),
('212F',2),
('212E',2),
('212C',2),
('212B',2),
('22DC',2),
('222B',2),
('222K',2);

