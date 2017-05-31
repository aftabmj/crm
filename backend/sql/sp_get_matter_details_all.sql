USE c9;
DROP PROCEDURE IF EXISTS sp_get_matter_details_all;
DELIMITER //
create procedure sp_get_matter_details_all (in matter_id int)

BEGIN

    select IFNULL(m.case_id,m.sr_no) as sr_oa_num
          , m.oa_date
          , m.filed_on_date
          , lk_ms.status
    from Matter m
      inner join lookup_matter_statuses lk_ms on lk_ms.id=m.status_id
    where m.id = matter_id;
    
END ; //
DELIMITER ;