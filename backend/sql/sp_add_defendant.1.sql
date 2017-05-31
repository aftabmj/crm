USE c9;
DROP PROCEDURE IF EXISTS addIndividualDefendant;
DELIMITER //
create procedure addIndividualDefendant (financial_role char(1)
, first_name varchar(100), middle_name varchar(100), last_name varchar(100)
, spouse_name varchar(150), father_name varchar(150)
,in addr_name varchar(50),in line1 varchar(50),in line2  varchar(50),in city varchar(50)
,in state varchar(50),in pincode  varchar(50)
,in is_main boolean
,in session_id varchar(100)
,out defendant_id int)
BEGIN
-- declare party_id int default 0;
declare idvAddrssId int default 0;
declare group_type char(1) default 'I'; 

START TRANSACTION;

insert into IndividualsAddresses (address_name,line1,line2,city,state,pincode)
values (addr_name,line1,line2,city,state,pincode);

set idvAddrssId = LAST_INSERT_ID();
select concat ('last inserted ID : idvAddrssId :' , idvAddrssId);
 
insert into Party(financial_role,group_type) values (financial_role,group_type);

set defendant_id = LAST_INSERT_ID();
SELECT concat('party ID :  ', defendant_id );

insert into party_type_individual (address_id, party_id, first_name,middle_name,last_name,father_name,spouse_name)
values (idvAddrssId, defendant_id, first_name, middle_name, last_name, father_name  , spouse_name);

-- insert into PartyCreateSession (session_id,party_id,party_matter_side,is_main) values
-- (session_id,defendant_id,'D',is_main) ; 


COMMIT;
END ; //
DELIMITER ;
-- create date should be set automatically
