USE c9;
DROP PROCEDURE IF EXISTS sp_get_applicant_for_matter;
DELIMITER //
create procedure sp_get_applicant_for_matter (in matter_id int)
BEGIN
   select 
     lk_bnk.bank_name as bank
    , nia.address_name as branch_name
    , lk_ni.rep_title
    , nia.line1
    , nia.line2
    , concat (nia.city,' - ' ,nia.pincode) as city_zip
    , b.line1 as mo_line1
    , b.line2 as mo_line2
    , b.city as mo_city
    , b.state as  mo_state
    , b.pincode as mo_pincode
    , b.address_name as mo_address_name
   from party_matter pm
        inner join Party p on pm.party_id = p.id
        inner join party_type_non_individual ptni on ptni.party_id = p.id
        inner join NonIndividualsAddresses nia on nia.address_id = ptni.non_individual_address_id
        inner join lookup_non_individual_party_types lk_ni on lk_ni.type_id = ptni.non_individual_type_id
        inner join lookup_banks lk_bnk on lk_bnk.main_office_address_id = ptni.main_office_address_id
        inner join BankAddresses b on b.address_id= ptni.main_office_address_id  
         
   where pm.matter_id = matter_id and p.case_side = 'A';
    
    
END ; //
DELIMITER ;
