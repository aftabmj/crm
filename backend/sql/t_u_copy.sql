-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


USE c9;--BANK-main-branch <-> ADDRESS
alter table  lookup_banks add constraint fk_main_br_address_id foreign key (main_office_address_id) references BankAddresses(address_id);

alter table lookup_banks add column main_office_address_id  int;

create table party_matter (
  id int not null auto_increment primary key,
  party_id int, 
  matter_id int,
  party_matter_side ENUM('A','D'),  
  foreign key (party_id) references Party(id),
  foreign key (matter_id) references Matter(id)
);


create table Matter (
id int not null auto_increment primary key,
sr_no varchar(20),
case_id varchar (10),
case_name varchar(100),
status_id int not null, 
date_filed datetime,
create_date datetime,
foreign key (status_id ) references lookup_matter_statuses(id)
);
-- TODO history_id,

create table lookup_matter_statuses (
	id int not null auto_increment primary key,
	status varchar(40),
	description varchar(200)
);
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


--------------------------

--"insert into party" should check this :
-- is there any other matter with the same party details :
--  - address_line1 ,matter side, financial role, group_type
-- if so don't insert.
--check :
--   select 

-- the same party could be an applicant in another case 

--TODO  LastModifiedDate
create table Party (
  id int not null auto_increment primary key,
  financial_role ENUM ('L','B','G'),
  group_type  ENUM ('I','B','S','P','U','V')
);

alter table  Party modify group_type enum('I','B','S','P','U','V');

--alter table party_type_non_individual drop  foreign key  fk_party_id ;
--------------------


create table party_type_individual (
   pgt_id int not null auto_increment primary key,
	address_id int,
   	first_name varchar(100),
	middle_name varchar(100),
	last_name varchar(100),
	spouse_name varchar(150),
   father_name varchar(150) ,
  foreign key (address_id) references IndividualsAddresses(address_id)
);
alter table party_type_individual add column party_id int ;
alter table  party_type_individual add constraint fk_indv_party_id foreign key (party_id) references Party(id);

--insert into NonIndividualsAddresses (line1,line2,city,state,pincode) values ('Venkatakrishna Rd, O-Block','Trustpakkam, Raja Annamalai Puram','Chennai','Tamil Nadu','600004');

create table party_type_non_individual (
	pgt_id int not null auto_increment primary key,
	non_individual_type_id tinyint,
      non_individual_address_id int,
	rep_first_name varchar(100),
	rep_middle_name varchar(100),
	rep_last_name varchar(100)
);

alter table  party_type_non_individual add constraint fk_non_indiv_type_id foreign key (non_individual_type_id) references lookup_non_individual_party_types(type_id);

alter table  party_type_non_individual add constraint fk_non_indiv_address_id foreign key (non_individual_address_id) references NonIndividualsAddresses(address_id);

--TODO Change the non_individual_address_id to address id.
--I think i have to drop the FK first !!

--link to party table 

alter table party_type_non_individual add column party_id int ;
alter table  party_type_non_individual add constraint fk_party_id foreign key (party_id) references Party(id);



--------------

create table lookup_non_individual_party_types (type_id  tinyint not null auto_increment primary key,   type_name varchar(25) not null,   rep_title varchar(50));

insert into lookup_non_individual_party_types (type_name,rep_title) values ('B', 'Branch Manager');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('B', 'Chief Manager');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('B', 'Assistant General Manager');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('S', 'Sole Proprietor');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('S', 'Sole Proprietorice');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('P', 'Partner');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('P', 'Managing Partner');

insert into lookup_non_individual_party_types (type_name,rep_title) values ('V', 'Director');
				 -- ([private)

insert into lookup_non_individual_party_types (type_name,rep_title) values ('V','Managing Director');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('U','Chairman');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('U', 'Director');
insert into lookup_non_individual_party_types (type_name,rep_title) values ('U', 'Managing Director');



--Individuals_Address
create table IndividualsAddresses (address_id int not null auto_increment primary key,   line1 varchar(100) not null,   line2 varchar(100),   city varchar(30) not null,   state varchar(30),   pincode varchar (10) );

NonIndividual_Address
create table NonIndividualsAddresses (
address_id int not null auto_increment primary key,   
line1 varchar(100) not null,   
line2 varchar(100),   
city varchar(30) not null,   
state varchar(30),   
pincode varchar (10) );



======================================================
====================================================

--------------------------------------------------------------


insert into Addresses (line1,line2,city,state,pincode) values
('Venkatakrishna Rd, O-Block','Trustpakkam, Raja Annamalai Puram',
'Chennai','Tamil Nadu','600004');

insert into Addresses (line1,line2,city,state,pincode) values ('Amrita Institue of Computer Technolgy','134 Arcot Road Virugambakkam','Chennai','Tamil Nadu','600093');

insert into Addresses (line1,line2,city,state,pincode) values ('A-101 Iii Avenue','Anna Nagar','Chennai','Tamil Nadu','600102');

insert into Addresses (line1,line2,city,state,pincode) values ('No.19/43 Ground Floor','Taylors Road Kilpauk','Chennai','Tamil Nadu','600010');

insert into Addresses (line1,line2,city,state,pincode) values ('No:34 Csm Plaza','Venkata Krishna Road - Mandavelli','Chennai','Tamil Nadu','600028');

insert into Addresses (line1,line2,city,state,pincode) values ('No.163 Om Sakthi Towers','Mount Road Anna Salai','Chennai','Tamil Nadu','600002');

insert into Addresses (line1,line2,city,state,pincode) values ('S.N.Mission School 2/64 Easwaran Koil Street','West Mambalam','Chennai','Tamil Nadu','600033');

insert into Addresses (line1,line2,city,state,pincode) values ('33 Kannadasan Salai','Venkatnarayana Road - T.Nagar','Chennai','Tamil Nadu','600017');

insert into Addresses (line1,line2,city,state,pincode) values ('No. 12 First Main Road','Baby Nagar Velachery','Chennai','Tamil Nadu','600042');

insert into Addresses (line1,line2,city,state,pincode) values ('MGR Adarsh Matriculation School - 11th block','Kannadasan Salai -Mugappair East - JJ Nagar','Chennai','Tamil Nadu','600037');

insert into Addresses (line1,line2,city,state,pincode) values ('Sri Gowtham New No.5 Old No.3','1st Avenue Ashok Nagar','Chennai','Tamil Nadu','600083');

insert into Addresses (line1,line2,city,state,pincode) values('109 Thambu Chetty Street','George Town','Chennai','Tamil Nadu','600001');
------------------------------------------------------------------


create table Branches
(
  branch_id int not null auto_increment,
  branch_name varchar (75),
  address_id int, --not null necessary if it is a Composite PK and also an FK ?
  bank_name varchar(50), 

  primary key (branch_id, address_id), --one to one relationship with address
  -- add bank_name to this composite key ?
  
  foreign key (address_id) references Addresses(address_id),
  foreign key (bank_name) references lookup_bank_names(bank_name)
)type=InnoDB;

insert into Branches (branch_name,address_id,bank_name) values
  ('Trustpakkam',1,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('Amritha Institute Of Computer Tech. Chennai',2,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('Anna Nagar',3,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('Kilpauk Chennai',4,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('Mandavelli',5,'Dhanlaxmi Bank');
insert into Branches (branch_name,address_id,bank_name) values ('Mount Road',6,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('S.N.School & College West Mambalam',7,'Dhanlaxmi Bank');
insert into Branches (branch_name,address_id,bank_name) values ('T.Nagar',8,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('Velachery',9,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('MGR Adarsh Metriculation High School Chennai',10,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values ('Ashok Nagar Chennai',11,'Dhanlaxmi Bank');

insert into Branches (branch_name,address_id,bank_name) values  ('George Town P.B.No:1996',12,'Dhanlaxmi Bank');
  
