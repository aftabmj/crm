-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

USE c9;
create table Party (
  id int not null auto_increment primary key,
  financial_role ENUM ('L','B','G') not null,
  group_type  ENUM ('I','B','S','P','U','V') not null,
  case_side ENUM ( 'A','D') not null,
  last_update_date timestamp ON UPDATE CURRENT_TIMESTAMP
);

create table lookup_matter_statuses (
	id int not null auto_increment primary key,
	status varchar(40),
	description varchar(200)
);

-- Todo add description
insert into lookup_matter_statuses(status) values
('pre-create'),
('created'), ('filed at court'), 
('sr. no. received'),
('rectification(s) completed'),
('case no. received'),
('summons sent'),
('posted before registrar'),
('R.S. received from defendant'),
('posted before PO/CP/Judge'),
('hearing date set'),
('PA filed'),
('scrutiny of PA by registrar'),
('hearing and enquiry complete'),
('marking of documents by PO'),
('posted for arguments'),
('orders issued'),
('case closed');



create table Matter (
id int not null auto_increment primary key,
sr_no varchar(20),
case_id varchar (10),
case_name varchar(100),
status_id int not null, 
filed_on_date datetime,
oa_date datetime,
create_date datetime,
foreign key (status_id ) references lookup_matter_statuses(id)
);

create table party_matter (
  id int not null auto_increment primary key,
  party_id int, 
  matter_id int,
  foreign key (party_id) references Party(id),
  foreign key (matter_id) references Matter(id)
);

create table Facility (						
  id int not null auto_increment primary key,
  matter_id int,
  borrower_id int,
  foreign key (matter_id) references Matter(id),
  foreign key (borrower_id) references Party (id)
);	
-- referencing party_matter would result in too many table scans...maybe ok with index

create table lookup_loan_types (
   type_id int not null auto_increment primary key,
   loan_type varchar(75)
);

insert into lookup_loan_types (loan_type) values 
('Term Loan'),
('Housing Loan'),
('Auto Loan'),
('Cash Credit');

create table Loan (
  id int not null auto_increment primary key,
  sanction_letter_no varchar(25),
  sanction_date Date not null,
  availed_date Date,
  account_no varchar(25),
  amount float (9,2) not null,
  purpose varchar(150),
  
  facility_id int,
  loan_type_id int,
  sanctioned_to int,
  foreign key (facility_id) references Facility(id), 
  foreign key (sanctioned_to) references Party(id),
  foreign key (loan_type_id) references lookup_loan_types (type_id)
);

-- ('Cash Credit'),('Overdraft'),
-- ('Term Loan - Housing'), ('Term Loan - Car'),('Term Loan - Machinery purchase'),
-- ('Term Loan - Truck'),('Term Loan - Education');

create table LoanRepaymentTerms (
 id int not null auto_increment primary key,
 num_of_installments int not null,
 period ENUM ('Monthly', 'Quarterly', 'Semi-Annually', 'Annually'),
 installment_amount float,
 moratorium_duration_months int, 
 repayments_start_date Date,
 loan_id int,
 foreign key (loan_id) references Loan(id)
);

-- to do add is_Active and active_since dates as repayment terms could be re-issued for a loan


-- tinyint didnt work ?! (for moratorium)


-- alter table Loan add constraint foreign key fk_loan_facility (facility_id) references Facility(id);

--  foreign key (repayment_id) references LoanRepaymentTerms (id) 
-- alter table Loan drop foreign key  Loan_ibfk_4;
--   repayment_id int,
-- alter table Loan drop column repayment_id;

-- create Mortgage ();
-- create facility_mortgage ();




-- created by client or AuthService (could be client based) after login ?
-- create table PartyCreateSession (
-- 	id int not null auto_increment primary key,
-- 	session_id varchar(100),  
-- 	party_id int not null,
-- 	party_matter_side enum('A','D'),
-- 	is_main boolean not null,
-- 	create_date timestamp DEFAULT CURRENT_TIMESTAMP
-- );


-- TODO history_id,

create table IndividualsAddresses (
 address_id int not null auto_increment primary key,
 line1 varchar(100) not null,  
 line2 varchar(100),  
 city varchar(30) not null,  
 state varchar(30),  
 pincode varchar (10) ,
 address_name varchar(150)
);


create table NonIndividualsAddresses (
	address_id int not null auto_increment primary key,   
	line1 varchar(100) not null,   
	line2 varchar(100),   
	city varchar(30) not null,   
	state varchar(30),   
	pincode varchar (10),
	address_name varchar(150)  
);


create table party_type_individual (
	pgt_id int not null auto_increment primary key,
	address_id int,
	party_id int not null,
	salutation enum ('Mr.', 'Mrs.'),
	first_name varchar(100),
	middle_name varchar(100),
	last_name varchar(100),
	relative_name varchar(150),
	relative_type enum('father','husband') ,
	occupation varchar(150),
	last_update_date timestamp ON UPDATE CURRENT_TIMESTAMP,
	foreign key (party_id) references Party(id),
	foreign key (address_id) references IndividualsAddresses(address_id)
);

-- insert into NonIndividualsAddresses (line1,line2,city,state,pincode) values ('Venkatakrishna Rd, O-Block','Trustpakkam, Raja Annamalai Puram','Chennai','Tamil Nadu','600004');
create table lookup_non_individual_party_types (
	type_id  tinyint not null auto_increment primary key,
	type_name varchar(5) not null, 
	rep_title varchar(50)
);

-- V : private, U: public Limited 
insert into lookup_non_individual_party_types (type_name,rep_title) values 
('B', 'Branch Manager'),('B', 'Chief Manager'),('B', 'Assistant General Manager'),('S', 'Sole Proprietor'),
('S', 'Sole Proprietorice'),('P', 'Partner'),('P', 'Managing Partner'),('V', 'Director'),
('V', 'Managing Director'),('U', 'Chairman'),('U', 'Director'),('U', 'Managing Director'),
('S', 'Sole Proprietor'),('S', 'Sole Proprietorice'),('P', 'Partner'),('P', 'Managing Partner'),
('V', 'Director'),('V', 'Managing Director'),('U', 'Chairman'),('U', 'Director'),('U', 'Managing Director');


create table party_type_non_individual (
	pgt_id int not null auto_increment primary key,
	party_id int not null,
	non_individual_type_id tinyint(4),
    non_individual_address_id int,
	rep_name varchar(150),
	last_update_date timestamp ON UPDATE CURRENT_TIMESTAMP,
 	org_name varchar(100),
  	main_office_address_id int ,
	foreign key (party_id) references Party(id),
	foreign key (non_individual_type_id) references lookup_non_individual_party_types(type_id),
	foreign key (non_individual_address_id) references NonIndividualsAddresses(address_id)
);

-- TODO change the non_individual address_id to address id


/* Insert Bank Branch Addresses  */
create table BankAddresses (
	address_id int not null auto_increment primary key,
	address_name varchar(150) default null,
	line1 varchar(100) not null,
	line2 varchar(100),
	city varchar(30) not null,
	state varchar(30), 
	pincode varchar (10)
);

insert into BankAddresses (line1,line2,city,state,pincode) values 
('Venkatakrishna Rd, O-Block','Trustpakkam, Raja Annamalai Puram','Chennai','Tamil Nadu','600004'),
('Amrita Institue of Computer Technolgy','134 Arcot Road Virugambakkam','Chennai','Tamil Nadu','600093'),
('A-101 Iii Avenue','Anna Nagar','Chennai','Tamil Nadu','600102'),
('No.19/43 Ground Floor','Taylors Road Kilpauk','Chennai','Tamil Nadu','600010'),
('No:34 Csm Plaza','Venkata Krishna Road - Mandavelli','Chennai','Tamil Nadu','600028'),
('No.163 Om Sakthi Towers','Mount Road Anna Salai','Chennai','Tamil Nadu','600002'),
('S.N.Mission School 2/64 Easwaran Koil Street','West Mambalam','Chennai','Tamil Nadu','600033'),
('33 Kannadasan Salai','Venkatnarayana Road - T.Nagar','Chennai','Tamil Nadu','600017'),
('No. 12 First Main Road','Baby Nagar Velachery','Chennai','Tamil Nadu','600042'),
('MGR Adarsh Matriculation School - 11th block','Kannadasan Salai -Mugappair East - JJ Nagar','Chennai','Tamil Nadu','600037'),
('Sri Gowtham New No.5 Old No.3','1st Avenue Ashok Nagar','Chennai','Tamil Nadu','600083'),
('109 Thambu Chetty Street','George Town','Chennai','Tamil Nadu','600001'),-- ------------------------------
('Anu Arcade No 1/  15Th Cross Street','Sastri Nagar  Adayar','Chennai','Tamil Nadu','600020'), 
('252 A Ttk Road','Alwarpet','Chennai','Tamil Nadu','600018'),
('119 Mth Road','Ambattur','Chennai','Tamil Nadu','600053'),
('44 15A Bypass Road','Ambur','Chennai','Tamil Nadu','635802'),
('248 Konnur High Road','Ayanavaram','Chennai','Tamil Nadu','600023'),
('Sjm House - 52 Nelson Manickam Road','Choolaimedu','Chennai','Tamil Nadu','600094'),
('Corporate Financial Services Branch','','Chennai','Tamil Nadu',''),
('E.C. Street Branch','3 Eraballu Chetty Street','Chennai','Tamil Nadu','600001'),
('52 Montieth Road','Egmore','Chennai','Tamil Nadu','600008'),
('P.B.No.5018','45 Moore Street','Chennai','Tamil Nadu','600001'),
('20 Dr.Natesan Road','K.K.Nagar','Chennai','Tamil Nadu','600083'),
('Kambar Salai Mogappair','','Chennai','Tamil Nadu',''),
('10 First Main Street','United India Colony Kodambakkam','Chennai','Tamil Nadu','600024'),
('1 Srinivasa Nagar','Kolathur','Chennai','Tamil Nadu','600099'),
('M.R.C.Nagar Branch','89 Santhome High Road','Chennai','Tamil Nadu','600028'),
('8 Vishwas Nagar','Maduravoyil','Chennai','Tamil Nadu','600095'),
('First Floor 74  Theagaraya Road','T Nagar','Chennai','Tamil Nadu','600017'),
('1 Club House Road','Anna Salai','Chennai','Tamil Nadu','600002'),
('101 Luz Church Road','Mylapore','Chennai','Tamil Nadu','600004'),
('Pb 3312','32 Nungambakkam High Road','Chennai','Tamil Nadu','600034'),
('Y-224 6Th Main Road','2 Avenue Anna Nagar','Chennai','Tamil Nadu','600040'),
('No 231  It Highway','Rajiv Gandhi Road Perungudi','Chennai','Tamil Nadu','600096'),
('80 Ritherdon Road','','Chennai','Tamil Nadu','600012'),
('Rajaji Road Branch','28 Rajaji Salai','Chennai','Tamil Nadu','600001'),
('6 Vgp Srinivasa Nagar','Madambakam Main Road Rajakilpakam','Chennai','Tamil Nadu',''),
('1&2 Girinagar','Ramavaram','Chennai','Tamil Nadu','600089'),
('15 Sringeri Mutt Road','R.K. Nagar','Chennai','Tamil Nadu','600028'),
('Door No 21 Ttk Road','Royapettai','Chennai','Tamil Nadu','600014'),
('Bldg. No. 60  East Kalmandapam Road','Royapuram','Chennai','Tamil Nadu','600013'),
('Shakthi Towers','766 Anna Salai','Chennai','Tamil Nadu','600002'),
('Siet.College Branch','K.B.Dasan Road Teynampet','Chennai','Tamil Nadu','600018'),
('4 9 21 A Sithalapakkam Ottyampakkam Main Road','Opp Panchayat Office Sithalapakkam','Chennai','Tamil Nadu','600126'),
('6 Devaraja Mudali Street','Sowcarpet','Chennai','Tamil Nadu','600003'),
('15 Gopalakrishna Street','T Nagar','Chennai','Tamil Nadu','600017'),
('3 Duraisamy Reddy Street','Tambaram','Chennai','Tamil Nadu','600045'),
('Plot 115  5Th East Street','Kamraj Nagar Tnhb Thiruvanmiur','Chennai','Tamil Nadu','600041'),
('Thomas Mount Branch','1/54-24 Shanmugam Colony Off Mount Poomle Rd','Chennai','Tamil Nadu','600016'),
('280 Triplicane High Road','Triplicane','Chennai','Tamil Nadu','600005'),
('Plot 372-373 Medavakkam Main Road','Ullagaram','Chennai','Tamil Nadu','600091'),
('32 Palani Andavar Koil St.','Vadapalani','Chennai','Tamil Nadu','600026'),
('140 Arcot Road','Valsaravakkam','Chennai','Tamil Nadu','600087'),
('Kushi No 141  Old No 48','Vellacherry Main Road','Chennai','Tamil Nadu','600042'),
('126  Poonamallee High Road','Velappanchavadi','Chennai','Tamil Nadu','600077'),
('Sri Sai Nagar 10 Kaliamman Koil Street','Virugambakkam','Chennai','Tamil Nadu','600092'),
('90 Arya Gowda Road','West Mambalam','Chennai','Tamil Nadu','600033'),
('665 T.H.Road','Tiruvottiyur','Chennai','Tamil Nadu','600019');

 insert into BankAddresses (address_name,line1,line2,city,state,pincode) values
('Head Office','Baroda and Corporate','Mandvi','Mumbai','Maharashtra',''),
('Baroda Corporate Centre','C-26,’G’ Block, Bandra Kurla Complex','Bandra (East)' ,'Mumbai','Maharashtra','400051');

-- ----------------------------------------------------------------

 CREATE TABLE lookup_banks (
	bank_id int(8) NOT NULL auto_increment primary key,
	bank_name varchar(50) NOT NULL DEFAULT '',
	main_office_address_id int(11) DEFAULT NULL,
	corporate_office_address_id int(11) DEFAULT NULL,
	FOREIGN KEY (main_office_address_id) REFERENCES BankAddresses (address_id),
	FOREIGN KEY (corporate_office_address_id) REFERENCES BankAddresses (address_id)
);

-- alter table lookup_banks add column corporate_office_address_id int(11) default null;
insert into lookup_banks (bank_name,main_office_address_id, corporate_office_address_id) values 
 ('Dhanlaxmi Bank' , 6, null), ('Bank of Baroda',59,60);

--  insert into BankAddresses (address_name,line1,line2,city,state,pincode) values
-- ('Baroda Corporate Centre','C-26,’G’ Block, Bandra Kurla Complex','Bandra (East)' ,'Mumbai','Maharashtra','400051');
-- update lookup_banks lb set lb.corporate_office_address_id=61 where lb.bank_id=1;


 
create table Branches -- rename to bank_branch_address
(
  branch_id int not null auto_increment,
  branch_name varchar (75),
  address_id int, 
  bank_id int(8), 
  primary key (branch_id, address_id), 
  foreign key (address_id) references BankAddresses(address_id),
  foreign key (bank_id) references lookup_banks(bank_id)
);
-- alter table Branches add constraint fk_bank_id foreign key (bank_id) references lookup_banks(bank_id);

-- Dhanlaxmi Bank
insert into Branches (branch_name,address_id,bank_id) values 
('Trustpakkam',1,3),('Amritha Institute Of Computer Tech. Chennai',2,3),
('Anna Nagar',3,3),('Kilpauk Chennai',4,3),
('Mandavelli',5,3),('Mount Road',6,3),
('S.N.School & College West Mambalam',7,3),('T.Nagar',8,3),
('Velachery',9,3),('MGR Adarsh Metriculation High School Chennai',10,3),
('Ashok Nagar Chennai',11,3),('George Town P.B.No:1996',12,3);
  
-- Bank of Baroda
insert into Branches (branch_name,address_id,bank_id) values 
('Adayar Chennai',14,4),('Alwarpet Branch',15,4),('Ambattur Branch',16,4),('Ambur',17,4),
('Aynavaram Chennai',18,4),('Choolaimedu Branch',19,4),('Corporate Financial Services Branch',20,4),
('E.C. Street Branch',21,4),('Egmore Branch',22,4),('Ibb Madras Branch',23,4),('K.K.Nagar Branch',24,4),
('Kambar Salai Mogappair',25,4),('Kodambakkam Tn',26,4),('Kolathur Branch',27,4),
('M.R.C.Nagar Branch',28,4),('Maduravoyil',29,4),('Mid Corporate Chennai',30,4),('Mount Road Branch',31,4),
('Mylapore Branch',32,4),('Nungambakkam Branch',33,4),('Pbb Annanaga Branch',34,4),
('Perungudi Chennai',35,4),('Purasawakkam Branch',36,4),('Rajaji Road Branch',37,4),
('Rajakilpakam Tamilnadu',38,4),('Ramavaram Branch',39,4),('Ramkrishn Ng Branch',40,4),
('Royapettai',41,4),('Royapuram Br. Chennai T.N.',42,4),('Service Branch. Chennai',43,4),
('Siet.College Branch',44,4),('Sithalapakkam',45,4),('Sowcarpet Branch',46,4),('T Nagar. Branch',47,4),
('Tambaram Branch',48,4),('Thiruvanmiyur Chennai',49,4),('Thomas Mount Branch',50,4),
('Tiruvateeswa Branch',51,4),('Ullagaram Chennai',52,4),('Vadapalani Branch',53,4),
('Valasaravakam Branch',54,4),('Velacherry Chennai',55,4),('Velappanchavadi Tamil Nadu',56,4),
('Virugambakkam',57,4),('West Mambala Branch',58,4),('Wimco Nagar Branch',59,4);

