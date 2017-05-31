 USE c9;
DROP PROCEDURE IF EXISTS sp_create_facility;
DELIMITER //
create procedure sp_create_facility (in sanction_letter_no varchar(25)
, in sanction_date Date
, in availed_date Date
, in account_no varchar(25)
, in amount float(9,2)
, in purpose varchar(150)
, in loan_type_id int
, in matter_id int
, out loan_id int
)
    
-- set @loan_id=1;   CALL sp_create_facility ('12345','2015-03-02','64322','500033.20','Simply',1,42,14, @loan_id); select @loan_id;
   
   
BEGIN
declare facility_id int default 0;
declare sanctioned_to_party_id int default 0;
    START TRANSACTION;
    
    set sanctioned_to_party_id = 
        (select pm.party_id from party_matter pm 
            inner join Party p on p.id=pm.party_id   
        where pm.matter_id=matter_id 
            and p.case_side='D' 
            and p.financial_role='B');

    insert into Facility(matter_id,borrower_id) values (matter_id,sanctioned_to_party_id);
    SET facility_id = LAST_INSERT_ID();
    
    insert into Loan (sanction_letter_no, availed_date,sanction_date
                     ,account_no,amount,purpose,facility_id
                     ,loan_type_id,sanctioned_to) values
        
        (sanction_letter_no,sanction_date,availed_date,account_no,amount,purpose
        , facility_id,loan_type_id,sanctioned_to_party_id);
    
    SET loan_id = LAST_INSERT_ID();

COMMIT;
END ; //
DELIMITER ;

-- --------------------------------------

DROP PROCEDURE IF EXISTS sp_create_repayterms_for_loan;
DELIMITER //
create procedure sp_create_repayterms_for_loan (
in loan_id int
, in num_of_installments int 
, in period varchar(15)   -- ENUM ('Monthly', 'Quarterly', 'Semi-Annually', 'Annually'),
, in installment_amount float
, in moratorium_duration_months int 
, in repayments_start_date Date)

BEGIN
declare facility_id int default 0;

    START TRANSACTION;
        insert into LoanRepaymentTerms 
            (loan_id,num_of_installments,period,installment_amount,moratorium_duration_months,repayments_start_date) values
            (loan_id,num_of_installments,period,installment_amount,moratorium_duration_months,repayments_start_date);
    COMMIT;

END ; //
DELIMITER ;
