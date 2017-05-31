USE c9;
DROP PROCEDURE IF EXISTS sp_get_defendants_nonindi_for_matter;
DELIMITER //
create procedure sp_get_defendants_nonindi_for_matter (in matter_id int)
BEGIN

   select p.id, p.financial_role 
     , nia.address_name as company_name
     , case lk_ni.type_name 
        when 'S' then 'Sole Proprietorship'
        when 'P' then 'Partnership'
        when 'V' then 'Private Limited Company'
        when 'U' then 'Public Limited Company'
        else 'Bank' END as company_type
    , ptni.rep_name
    , nia.line1
    , nia.line2
    , concat (nia.city,' - ' ,nia.pincode) as city_zip
   from party_matter pm
        inner join Party p on pm.party_id = p.id
        inner join party_type_non_individual ptni on ptni.party_id = p.id
        inner join lookup_non_individual_party_types lk_ni on lk_ni.type_id = ptni.non_individual_type_id
        inner join NonIndividualsAddresses nia on nia.address_id = ptni.non_individual_address_id
   where pm.matter_id = matter_id and p.case_side = 'D';

END ; //
DELIMITER ;