USE c9;
DROP PROCEDURE IF EXISTS sp_add_nonindividual_defendant;
DELIMITER //
create procedure sp_add_nonindividual_defendant (financial_role char(1)
, rep_name varchar(150)
,in company_or_bankbranch_name varchar(50),in line1 varchar(50),in line2  varchar(50),in city varchar(50)
,in state varchar(50),in pincode  varchar(50)
, non_individual_type_id int
,out defendant_id int)
BEGIN

declare nIdvAddrssId int default 0;
declare groupType char(1);

START TRANSACTION;

insert into NonIndividualsAddresses (address_name,line1,line2,city,state,pincode)
values (company_or_bankbranch_name,line1,line2,city,state,pincode);

set nIdvAddrssId = LAST_INSERT_ID();
select concat ('last inserted ID : nIdvAddrssId :' , nIdvAddrssId);
 
-- get group_type from non_individual_type_id 
select  type_name into groupType from lookup_non_individual_party_types where type_id=non_individual_type_id;

insert into Party(financial_role,group_type,case_side) values (financial_role,groupType,'D');

set defendant_id = LAST_INSERT_ID();
SELECT concat('party ID :  ', defendant_id );

insert into party_type_non_individual (non_individual_address_id, party_id, non_individual_type_id, rep_name, org_name)
values (nIdvAddrssId, defendant_id, non_individual_type_id, rep_name,company_or_bankbranch_name);


COMMIT;
END ; //
DELIMITER ;
-- create date should be set automatically
