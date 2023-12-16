import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import "dotenv/config"

// export const sequelize = new Sequelize("sqlite::memory:");
const getDb = () => {
    if (process.env.NODE_ENV == "production") {
        return new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: "mysql"
        });
    } else {
        return new Sequelize({
            dialect: "sqlite",
            storage: "database.sqlite"
        });
    }
};

export const sequelize = getDb();

try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

const Album = sequelize.define("album", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    releaseDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
        allowNull: true
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    review: {
        type: DataTypes.STRING,
        allowNull:true
    }
}); 

const Artist = sequelize.define("artist", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}); 
const Tag = sequelize.define("tag", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}); 

const List = sequelize.define("list", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

Album.belongsToMany(Artist, {through: "Album_Artists"});
Album.belongsToMany(Tag, { through: "Album_Tags" });
Album.belongsToMany(List, { through: "Album_Lists" });

Artist.belongsToMany(Album, {through: "Album_Artists"});
Tag.belongsToMany(Album, { through: "Album_Tags" });
List.belongsToMany(Album, { through: "Album_Lists" });

sequelize.sync();

export {Album, Artist, Tag, List}