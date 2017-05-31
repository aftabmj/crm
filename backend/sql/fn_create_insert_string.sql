DELIMITER //

USE c9 //
DROP FUNCTION IF EXISTS fn_create_insert_string //

CREATE FUNCTION fn_create_insert_string (ids varchar(255), party_type varchar(15)) 
returns  varchar(255)
BEGIN
    DECLARE a INT Default 0 ;
    DECLARE str VARCHAR(5);
    DECLARE result varchar(255);
    
        if LOCATE(",",ids) < 1 then
            SET result = "("+ids+",'"+party_type +"',"+matter_id+")";
        else 
            simple_loop: LOOP
                 SET a=a+1;
                 SET str = SPLIT_STR(ids,",",a);
                 IF str='' THEN
                    LEAVE simple_loop;
                 END IF;
                 SET result = result +"(" + str + ", '"+party_type+ "', " + matter_id+")," ;
           END LOOP simple_loop;
        
        end if;  
        return result;
END 
//
DELIMITER;

  -- remove comma at the end !!!!!
          