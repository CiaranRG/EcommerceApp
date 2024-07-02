import db from "./databaseConnection.js";

const categoriesDB = [
    {
        name: 'sweatshirts'
    },
    {
        name: 'shoes'
    },
    {
        name: 'joggers'
    },
    {
        name: 'tops'
    },
    {
        name: 'shorts'
    },
    {
        name: 'hats'
    },
]

const seedCategories = async () => {
    console.log('Starting to seed categories...');
    // Wiping and restarting the database , we add cascade since our category table will be foreign keys for other tables
    await db.query('TRUNCATE category RESTART IDENTITY CASCADE')
    console.log('Categories table truncated.');
    try {
        // Looping the array to seed the database 
        for (let category of categoriesDB) {
            console.log(`Inserting category: ${category.name}`);
            await db.query('INSERT INTO category (name) VALUES ($1)', [category.name])
        }
        console.log('Finished inserting categories.');
    } catch (error) {
        console.log('Error Occurred', error)
    }

}

// Call function then end the database connection
seedCategories().then(() => {
    db.end()
}).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
})

