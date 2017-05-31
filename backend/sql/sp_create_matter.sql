USE c9;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS create_matter $$

create procedure create_matter (in aid1 int, in aid2 int,in did1 int,in did2 int,in did3 int,in did4 int,
                                inout matter_id int)
proc_label:BEGIN
    declare existingMatterId int default 0;
    START TRANSACTION;

    SET existingMatterId = 
    (select pm1.matter_id from party_matter pm1   
        inner join party_matter pm2 on pm2.matter_id = pm1.matter_id
    where (
            (pm1.party_id in (did1,did2,did3,did4) and pm2.party_id in (aid1,aid2)) 
            OR
            (pm2.party_id in (did1,did2,did3,did4) and pm1.party_id in (aid1,aid2))
        )
    );

    if (existingMatterId = 0) then
        set matter_id = existingMatterId;
        LEAVE proc_label;
    end if;
    
    
    insert into Matter(status_id,create_date) values (1,NOW());
    SET matter_id  = LAST_INSERT_ID();

    -- for both applicant and defendant : create Party from PreMatterParty 
    
    insert into party_matter (party_id,matter_id) values (aid1,matter_id);
    if (aid2 != 0) then
        insert into party_matter (party_id,matter_id) values (aid2,matter_id);
    end if;

    insert into party_matter (party_id,matter_id) values (did1,matter_id);
    if (did2 = 0) then
        COMMIT;
        LEAVE proc_label;
    end if;

    insert into party_matter (party_id,matter_id) values (did2,matter_id);
    if (did3 = 0 ) then
        COMMIT;
        LEAVE proc_label;
    end if;

    insert into party_matter (party_id,matter_id) values (did3,matter_id);
    if (did4 = 0 ) then
        COMMIT;
        LEAVE proc_label;
    end if;

    insert into party_matter (party_id,matter_id) values (did4,matter_id);

    COMMIT;


END$$
DELIMITER ;

--    insert into party_matter(party_id,party_matter_side,matter_id)
--    select ptni.party_id , pcs.party_matter_side,  matter_id   
--    from party_type_non_individual ptni 
--            inner join PartyCreateSession pcs on pcs.party_id =ptni.party_id
--    where pcs.session_id = session_id;
    
--    insert into party_matter(party_id,party_matter_side,matter_id)
--    select pti.party_id , pcs.party_matter_side,  matter_id   
--    from party_type_individual pti 
--            inner join PartyCreateSession pcs on pcs.party_id =pti.party_id
--    where pcs.session_id = session_id;

    -- select into (max_pgt, party_bank_id) max(pgt_id), party_id from party_type_non_individual ;
    
    -- insert into party_matter(party_id,matter_id,party_matter_side) values
    -- (party_bank_id,matter_id,'A'); -- if OA , then bank is applicant, else ---!!
    
    -- for now assume only individual defendants
    -- select into (max_pgt, party_defendant_id) max(pgt_id), party_id from party_type_individual ;
    -- insert into party_matter(party_id,matter_id,party_matter_side) values
    -- (party_id,matter_id,'D'); -- if OA , then bank is applicant, else ---!!
    
    