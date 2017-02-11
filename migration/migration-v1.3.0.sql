-- database format changes indicated per version number applicable


-- v1.3.0
-- increased maximum length of task.name throughout the application
alter table task modify name varchar(1000);