const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const POPULATE_NO_OF_USERS = 5;
const POPULATE_CONTACTS_OF_USERS = 20;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

async function checkTablesExist() {
    try {
        const tableData = await pool.query(`
            SELECT EXISTS (
                SELECT 1
                FROM   information_schema.tables
                WHERE  table_schema = 'public'
                AND    table_name IN ('User', 'Spam', 'Contacts')
            );
    `);
        return tableData.rows[0].exists;
    } catch (error) {
        console.error('Error checking tables:', error);
        return false;
    }
}

async function createTables() {
    try {
        console.log('Trying to create tables.');
        await pool.query(`
            CREATE TABLE "User" (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) UNIQUE NOT NULL,
                email VARCHAR(255),
                password_hash VARCHAR(255) NOT NULL
            );

            CREATE TABLE Spam (
                id SERIAL PRIMARY KEY,
                phone_number VARCHAR(20) NOT NULL,
                marked_by_user_id INT NOT NULL,
                FOREIGN KEY (marked_by_user_id) REFERENCES "User"(id)
            );

            CREATE TABLE Contacts (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone_number VARCHAR(20) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES "User"(id)
            );
    `);
        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

async function createGlobalView() {
    try {
        await onlanguagechange.query(`
            CREATE VIEW global_users AS
            SELECT u.id, u.name, u.phone_number, u.email, 'User' AS source, 
                (SELECT COUNT(DISTINCT marked_by_user_id) 
                    FROM "spam" s 
                    WHERE s.phone_number = u.phone_number) AS spam_count
            FROM "User" u
            UNION
            SELECT c.id, c.name, c.phone_number, c.email, 'contacts' AS source, 
                (SELECT COUNT(DISTINCT marked_by_user_id) 
                    FROM "spam" s 
                    WHERE s.phone_number = c.phone_number) AS spam_count
            FROM "contacts" c
            WHERE NOT EXISTS (
                SELECT 1
                FROM "User" u
                WHERE u.phone_number = c.phone_number
            );
        `)
        console.log('View created successfully.');
    } catch (error) {
        console.error('Error whle creating view: ', eror)
    }
}

async function generateUser() {
    try {
        const name = faker.person.fullName();
        const phoneNumber = '+' + Math.floor(Math.random() * 10**(Math.random() * (20-6) + 5)); // randomly generates a number of length ~6-20
        const email = faker.internet.email();
        const password = faker.internet.password();
        const passwordHash = await bcrypt.hash(password, 10);
        return {name, phoneNumber, email, passwordHash}
    } catch (error) {
        console.error('Error creating sample user:', error);
        throw error;
    }
}


async function createSampleUser() {
    try {
    var {name, phoneNumber, email, passwordHash} = await generateUser();
        const queryString = 'INSERT INTO "User" (name, phone_number, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [name, phoneNumber, email, passwordHash];
        const result = await pool.query(queryString, values);
        const userId = result.rows[0].id;
        console.log('Sample user created successfully.');
        return userId;
    } catch (error) {
        throw error;
    }
}

async function populateContacts(noOfContacts, userId) {
    try {
        for (let i = 0; i < noOfContacts; i++) {
            var {name, phoneNumber, email} = await generateUser();
            const queryString = 'INSERT INTO Contacts (user_id, name, phone_number, email) VALUES ($1, $2, $3, $4)';
            const values = [userId, name, phoneNumber, email];
            await pool.query(queryString, values);
        }
        console.log('Contacts populated successfully.');
    } catch (error) {
        console.error('Error populating Contacts:', error);
    }
}

async function populateUsers(noOfUsers) {
    try {
        for (let i = 0; i < noOfUsers; i++) {
            const sampleUserId = await createSampleUser();
            await populateContacts(POPULATE_CONTACTS_OF_USERS, sampleUserId);
        }
    } catch (error) {
        console.error('Erro while populating users', error)
    }
}

async function main() {
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
        console.log(`Tables do ${tablesExist ? '' : ' not'} exist`)
        await createTables();
        await createGlobalView();
    } else {
        console.log('Tables already exist. Skipping creation and population.');
    }
    await populateUsers(POPULATE_NO_OF_USERS);
    await pool.end();
}

main();