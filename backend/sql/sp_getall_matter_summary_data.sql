USE c9;
DROP PROCEDURE IF EXISTS sp_getall_matter_summary_data;
DELIMITER //
create procedure sp_getall_matter_summary_data ()

BEGIN

DROP TEMPORARY TABLE IF EXISTS def_pti;
create temporary table def_pti  as
  (select pti.party_id, concat(pti.first_name,' ',pti.last_name) as defendant_name
   from party_type_individual pti 
   where pti.first_name is not null);


DROP TEMPORARY TABLE IF EXISTS def_ptni;
create temporary table def_ptni as
	(select ptni.party_id , ptni.org_name as defendant_name 
	from party_type_non_individual ptni
	where ptni.org_name not like "0" and ptni.rep_name is not null);

DROP TEMPORARY TABLE IF EXISTS def_names;
create temporary table def_names  as
   select y.defendant_name, pm.matter_id 
   from party_matter pm
    inner join Party p on pm.party_id = p.id
    inner join (
         select dpti.party_id, dpti.defendant_name 
         from def_pti dpti   
       union
         select dptni.party_id, dptni.defendant_name 
          from def_ptni dptni 
      ) as y on y.party_id = p.id
      where p.financial_role='B' and p.case_side ='D' ; -- TODO if there are more than one borrowers use the is_main flag
	
--	select * from def_names;
	  

      select 
         dn.defendant_name as dname
	    , m.id 
        ,IFNULL(m.case_id, m.sr_no) as 'sr_oa_num'
        ,DATE_FORMAT(m.create_date,'%Y-%m-%d') as oa_date
      	   ,DATE_FORMAT( m.filed_on_date ,'%Y-%m-%d') as filed_date
      	   ,lb.bank_name as 'bank'
      	   ,na.address_name  as 'branch'
      	   ,ls.status
      from party_matter pm 
      	inner join Matter m on m.id = pm.matter_id
      	inner join lookup_matter_statuses ls on m.status_id = ls.id
         inner join party_type_non_individual ni on ni.party_id = pm.party_id
         inner join lookup_banks lb on ni.main_office_address_id = lb.main_office_address_id
         inner join NonIndividualsAddresses na on ni.non_individual_address_id = na.address_id
 	     inner join def_names dn on dn.matter_id =m.id;
 	

END ; //
DELIMITER ;

/*
select dn.defendant_name as dname
      , x.id
      , x.sr_oa_no as 'sr_oa_num'
	   , DATE_FORMAT(x.create_date,'%Y-%m-%d') as oa_date -- WATCH OUT !!!!!!!!!!!!!!
	   , DATE_FORMAT( date_filed ,'%Y-%m-%d') as filed_date
	   , x.status
	   , x.bank_name as 'bank'
	   , x.branch_name as 'branch'
from (
      select m.id 
        ,IFNULL(m.case_id, m.sr_no) as sr_oa_no 
        ,m.create_date
      	   ,m.date_filed
      	   ,lb.bank_name
      	   ,na.address_name as 'branch_name'
      	   ,ls.status
      from party_matter pm 
      	inner join Matter m on m.id = pm.matter_id
      	inner join lookup_matter_statuses ls on m.status_id = ls.id
         inner join party_type_non_individual ni on ni.party_id = pm.party_id
         inner join lookup_banks lb on ni.main_office_address_id = lb.main_office_address_id
         inner join NonIndividualsAddresses na on ni.non_individual_address_id = na.address_id
         	
   ) as x
 	inner join def_names dn on dn.matter_id =x.id;
 	
 	*/

