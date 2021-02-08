module.exports = function Database(IP, db_name)
{
    const mongo = require('mongodb');
    const ObjectId = mongo.ObjectID;
    const MongoClient = mongo.MongoClient;
    const passwordHash = require('password-hash');
    const url = 'mongodb://' + IP + '/';


    Database.prototype.createUser = (email, username, password) =>
    {
        MongoClient.connect(url, (err, client) => {
            const db = client.db(db_name);
            const users = db.collection('users');
            users.insertOne({"email": email, "username": username, "password": password, "prenom": "",
            "nom": "", "adresse": "", "ville": "", "pays": "", "code_postal": "", "about": ""});
            client.close();
        });
    }

    Database.prototype.getUserData = (uid) =>
    {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const users = db.collection('users');
                let data = await users.findOne({_id: new ObjectId(uid)})
                client.close();
                resolve(data);
            });
        });
    }

    
    Database.prototype.updateUser = (uid, username, prenom, nom, adresse, ville, pays, code_postal, about) =>
    {
        MongoClient.connect(url, (err, client) => {
            const db = client.db(db_name);
            const users = db.collection('users');
            users.updateOne({_id: new ObjectId(uid)}, { $set: {"username": username, "prenom": prenom,
            "nom": nom, "adresse": adresse, "ville": ville, "pays": pays, "code_postal": code_postal, "about": about}});
            client.close();
        });
    }

    Database.prototype.doesEmailExist = (mail) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const users = db.collection('users');
                let info = (await users.findOne({email: mail})) == null ? false : true;
                client.close();
                resolve(info);
            });
        });
    }

    Database.prototype.getUserID = (mail) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const users = db.collection('users');
                let info = await users.findOne({email: mail});
                client.close();
                resolve(info._id);
            });
        });
    }

    Database.prototype.doesUserExist = (uid) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const users = db.collection('users');
                let info = (await users.findOne({_id: new ObjectId(uid)}));
                let exist = info == null ? false : true;
                client.close();
                resolve(exist);
            });
        });
    }

    Database.prototype.isPasswordSame = (mail, password) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const users = db.collection('users');
                let info = await users.findOne({email: mail})
                let crypted_pass = info.password;
                client.close();
                resolve(passwordHash.verify(password, crypted_pass));
            });
        });
    }

    Database.prototype.getAllCountries = () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const data = db.collection('data');
                await data.find({Region: ''}, {projection:{_id: 0, Country_EN:1}}).toArray((err, result) => {
                    let array = [];
                    for(let i = 0; i < result.length; ++i)
                    {
                        let name = result[i].Country_EN;
                        array.push(name);
                    }
                    array.sort();
                    client.close();
                    resolve(array);
                });
            });
        });
    }

    Database.prototype.getInfectionsByContry = (country) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, async (err, client) => {
                const db = client.db(db_name);
                const data = db.collection('data');
                await data.find({Country_EN: country, Region: ''}, {projection:{_id: 0, Country_ES:0, Country_EN:0, Country_IT:0, Region:0}}).toArray((err, result) => {
                    client.close();
                    resolve(result);
                });
            });
        });
    }


}