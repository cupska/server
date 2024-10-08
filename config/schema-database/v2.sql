-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public."user"
(
    id serial NOT NULL,
    fullname character varying(100) COLLATE pg_catalog."default" NOT NULL,
    image character varying(255) COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default",
    username character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default",
	ALTER TABLE public.user,
	createdAt TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta'),
	updatedAt TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta'),
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_username_key UNIQUE (username)
);

create table if not exists public."category" (
	id serial primary key,
	name VARCHAR(100) not null
);

Create table if not exists public."product" (
	id serial primary key,	
	name VARCHAR(100) not null,
	image varchar(255) ,
	sellPrice decimal default 0,
	buyPrice decimal default 0,
	categoryId serial,
	amount integer,
	createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta',
    updatedAt AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta',
	foreign key (categoryId) REFERENCES public."category"(id) 
);
END;