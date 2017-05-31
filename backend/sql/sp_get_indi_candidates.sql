USE c9;
DROP PROCEDURE IF EXISTS sp_get_indi_candidates;
DELIMITER //
create procedure sp_get_indi_candidates ()

BEGIN
    -- create view !! instead 

     -- we want all applicants and defendends who are not associated witha case.
     drop table if exists P;
     CREATE TEMPORARY TABLE P
         select * from Party where id not in (select party_id from party_matter);
         
--    drop table if exists P2;
--    CREATE TEMPORARY TABLE P2 select * from P;
    
        select  p.id
                ,p.financial_role
                ,pi.salutation
                ,pi.first_name as first_name
                ,pi.middle_name as middle_name
                ,pi.last_name as last_name
                ,pi.relative_name
                ,pi.relative_type
                ,ia.line1
                ,ia.line2
                ,ia.city
                ,ia.state
                ,ia.pincode
                ,ia.address_name
            from party_type_individual pi
                inner join  P p on p.id = pi.party_id
                inner join  IndividualsAddresses ia on pi.address_id = ia.address_id
            where p.group_type = 'I';

END ; //
DELIMITER ;
