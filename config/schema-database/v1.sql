BEGIN;
CREATE TABLE IF NOT EXISTS public.user(
	id serial PRIMARY KEY,
	fullname varchar(100) not NULL,
	image varchar(255),
	role varchar(255),
	username varchar(100) UNIQUE NOT NULL,
	password VARCHAR(100)	
);

CREATE TABLE IF NOT EXISTS public.produk(
	id serial PRIMARY KEY,
	
)


END

