USE c9;
DROP PROCEDURE IF EXISTS sp_add_indi_defendant;
DELIMITER //
create procedure sp_add_indi_defendant (financial_role char(1)
, first_name varchar(100), middle_name varchar(100), last_name varchar(100)
, relative_name varchar(150), relative_type varchar(10)
,in addr_name varchar(50),in line1 varchar(50),in line2  varchar(50),in city varchar(50)
,in state varchar(50),in pincode  varchar(50)
,in occupation varchar(150)
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
 
insert into Party(financial_role,group_type,case_side) values (financial_role,group_type,'D');

set defendant_id = LAST_INSERT_ID();
SELECT concat('party ID :  ', defendant_id );

insert into party_type_individual (address_id, party_id, first_name,middle_name,last_name,relative_name,relative_type,occupation)
values (idvAddrssId, defendant_id, first_name, middle_name, last_name, relative_name,relative_type,occupation);

-- insert into PartyCreateSession (session_id,party_id,party_matter_side,is_main) values
-- (session_id,defendant_id,'D',is_main) ; 


COMMIT;
END ; //
DELIMITER ;
-- create date should be set automatically
