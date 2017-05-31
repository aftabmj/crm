USE c9;
DROP PROCEDURE IF EXISTS sp_get_nonindi_candidates;
DELIMITER //
create procedure sp_get_nonindi_candidates ()

BEGIN
    -- create view !! instead 
    --  also check if P is not empty

    -- if exists P then  
    --    CREATE TEMPORARY TABLE P2 select * from P;
    -- else 
        drop table if exists P2;
        CREATE TEMPORARY TABLE P2
        select * from Party where id not in (select party_id from party_matter);
    -- end if;
             
            select  p2.id                               -- WHAT ABOUT SIDE
                    , p2.financial_role as role
                    , p2.case_side
                    ,pi.org_name
                	,pi.rep_name
            	    ,lni.rep_title
                    ,nia.line1
                    ,nia.line2
                    ,nia.city
                    ,nia.state
                    ,nia.pincode
                    ,nia.address_name
                from party_type_non_individual pi
                    inner join  P2 p2 on p2.id = pi.party_id
                    inner join  NonIndividualsAddresses nia on pi.non_individual_address_id = nia.address_id
                    inner join  lookup_non_individual_party_types lni on lni.type_id = pi.non_individual_type_id
                where p2.group_type <> 'I';
        
    drop table if exists P1;
    drop table if exists P2;
    
END ; //
DELIMITER ;
