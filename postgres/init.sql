CREATE TABLE IF NOT EXISTS movies (id SERIAL NOT NULL, tconst TEXT CONSTRAINT tconst_pk PRIMARY KEY, averageRating NUMERIC NOT NULL, cluster SMALLINT NOT NULL);
COPY movies
    FROM '/var/lib/postgresql/csvs/predictions.csv' DELIMITER ',' CSV HEADER;