import {
  Client
} from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5556,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
  CREATE TABLE users
  (
    id serial PRIMARY KEY,
    name VARCHAR (30) NOT NULL,
    date TIMESTAMP DEFAULT now()
    );
    `);
  await client.query(
    `CREATE TABLE categories
  (
    id serial PRIMARY KEY,
    name VARCHAR (30) NOT NULL
    );`
  );
  await client.query(
    `CREATE TABLE authors
  (
    id serial PRIMARY KEY,
    name VARCHAR (30) NOT NULL
    );`
  );
  await client.query(
    `CREATE TABLE books
    (
      id serial PRIMARY KEY,
      title VARCHAR(30) NOT NULL,
      userid INTEGER NOT NULL,
      authorid INTEGER NOT NULL,
      categoryid INTEGER NOT NULL,
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (authorid) REFERENCES authors(id) ON DELETE CASCADE,
      FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE CASCADE
      );`
  );
  await client.query(
    `CREATE TABLE descriptions
    (
      id serial PRIMARY KEY,
      description VARCHAR (10000) NOT NULL,
      bookid INTEGER UNIQUE NOT NULL,
      FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
      );`
  );
  await client.query(
    `CREATE TABLE reviews
    (
      id serial PRIMARY KEY,
      message VARCHAR (10000) NOT NULL,
      userid INTEGER NOT NULL,
      bookid INTEGER NOT NULL,
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
      );`
  );


  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
  INSERT INTO users (name, date)
  VALUES ('Marry', '2022-07-07 23:54:01');
`);

  await client.query(`
  INSERT INTO categories (name)
  VALUES ('Horror');
`);

  await client.query(`
  INSERT INTO authors (name)
  VALUES ('Bram Stoker');
`);

  await client.query(`
  INSERT INTO books (title, userid, authorid, categoryid)
  VALUES ('Dracula', 1, 1, 1);
`);

  await client.query(`
  INSERT INTO descriptions (description, bookid)
  VALUES ('This book tells about struggling between Good and Evil, about endless war between science and supernatural, about power of money and weakness of human's flesh, and, of cource, about love and passion.', 1);
`);

  await client.query(`
  INSERT INTO reviews (message, userid, bookid)
  VALUES ('It's a timeless masterpiece of horror literature I can read over and over again. Actually, so I do, maybe, once a year.', 1, 1);
`);


  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
