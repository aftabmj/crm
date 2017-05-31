USE c9;
DROP PROCEDURE IF EXISTS sp_add_applicant;
DELIMITER //
create procedure sp_add_applicant (in bank_id int,
in branch_addr_id int ,in rep_title varchar(50), in session_id varchar(100),out applicant_id int)

BEGIN
declare applicant_financial_role char(1);
declare applicant_group_type char(1);
declare ni_party_type_id tinyint(4);
declare main_office_address_id int DEFAULT 0;
declare org_name varchar(50);
declare nonIdvAddrssId int default 0;
declare orig_rows int default 0;
declare new_rows int default 0;

START TRANSACTION;
set applicant_financial_role ='L';
set applicant_group_type ='B';
select concat ( " Bank Id : " , bank_id);
select concat ( " rep _titel : ", rep_title);
select concat ('going to insert into NonIndividualsAddresses: branch_addr_id :' , branch_addr_id);

insert into NonIndividualsAddresses (address_name,line1,line2,city,state,pincode) select br.branch_name,line1,line2,city,state,pincode from BankAddresses B  inner join Branches br on br.address_id = B.address_id where B.address_id = branch_addr_id;


set nonIdvAddrssId = LAST_INSERT_ID();
select concat ('last inserted ID : nonIdvAddrssId :' , nonIdvAddrssId);
 
select lu_ni_ptypes.type_id into ni_party_type_id from lookup_non_individual_party_types lu_ni_ptypes  where lu_ni_ptypes.type_name=applicant_group_type and lu_ni_ptypes.rep_title = rep_title;
select concat ('ni_party_type_id :' , ni_party_type_id);

select lu_bnk.main_office_address_id, lu_bnk.bank_name into  main_office_address_id,org_name  from lookup_banks lu_bnk where lu_bnk.bank_id = bank_id; select concat ('main office address id ', main_office_address_id, org_name);

insert into Party(financial_role,group_type,case_side) values (applicant_financial_role,applicant_group_type,'A');

set applicant_id = LAST_INSERT_ID();
SELECT concat('party ID :  ', applicant_id );

insert into party_type_non_individual (non_individual_type_id, non_individual_address_id, main_office_address_id,  party_id,org_name) values (ni_party_type_id , nonIdvAddrssId, main_office_address_id, applicant_id,org_name);

COMMIT;

END ; //
DELIMITER ;
