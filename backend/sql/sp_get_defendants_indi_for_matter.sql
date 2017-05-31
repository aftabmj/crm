USE c9;
DROP PROCEDURE IF EXISTS sp_get_defendants_indi_for_matter;
DELIMITER //
create procedure sp_get_defendants_indi_for_matter (in matter_id int)
BEGIN

   select p.financial_role
   , pti.salutation
   , concat(pti.first_name,pti.middle_name,pti.last_name) as def_name
    , pti.relative_name 
    , case 
        when pti.relative_type like 'father'
          then case 
                when pti.salutation like 'Mr.' then 'S/o'
                else 'D/o'
              end
        else  'W/o'
      end as relative_type
    , ia.line1
    , ia.line2
    , concat (ia.city,' - ' ,ia.pincode) as city_zip
   from party_matter pm
        inner join Party p on pm.party_id = p.id
        inner join party_type_individual pti on pti.party_id = p.id
        inner join IndividualsAddresses ia on ia.address_id = pti.address_id
   where pm.matter_id = matter_id and p.case_side = 'D';

END ; //
DELIMITER ;