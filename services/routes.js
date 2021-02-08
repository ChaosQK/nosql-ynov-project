module.exports = function(router, path, db) {

    const passwordHash = require('password-hash');
    const dateFormat = require('dateformat');
    const fs = require('fs');

    router.get('/', async (req, res) => {
        try {
            if(req.cookies['uid'] != undefined)
            {
                let doesUserExist = await db.doesUserExist(req.cookies['uid'])
                if(doesUserExist)
                {
                    res.sendFile(path.resolve(__dirname + '/../app/index-connected.html'));            
                }
                else
                    throw 'error';
            }
            else
                throw 'error';
        } catch(error) {
            res.sendFile(path.resolve(__dirname + '/../app/index.html'));            
        }
    });

    router.get('/logout/', (req, res) => {
        res.clearCookie('uid');
        res.redirect("/");
    });
      
    router.get('/login/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../app/login.html'));
    });

    router.get('/profile/', async (req, res) => {
        try {
            if(req.cookies['uid'] != undefined)
            {
                let doesUserExist = await db.doesUserExist(req.cookies['uid'])
                if(doesUserExist)
                {
                    res.sendFile(path.resolve(__dirname + '/../app/users.html'));
                }
                else
                    throw 'error';
            }
            else
                throw 'error';
        } catch(error) {
            res.redirect("/");     
        }
    });

    router.post('/profile', (req, res) => {
        let username = req.body.username;
        let prenom = req.body.prenom;
        let nom = req.body.nom;
        let adresse = req.body.adresse;
        let ville = req.body.ville;
        let pays = req.body.pays;
        let code_postal = req.body.code_postal;
        let about = req.body.about
        db.updateUser(req.cookies['uid'], username, prenom, nom, adresse, ville, pays, code_postal, about);
        res.redirect('/profile/');
    });

    router.post('/dataInfect/', async (req, res) => {
        let data = await db.getInfectionsByContry(req.body.country);
        let string = "date,infections\n";
        // 	
        for(let key in data[0])
        {
            let d = dateFormat(new Date(key), 'd-mmm-yy');
            string += d + "," + data[0][key] + "\n";
        }
        fs.writeFileSync(path.resolve(__dirname + "/../public/data/infections.csv"), string);
        res.json("{status: 200}");
    });

    router.post('/dataCountry/', async (req, res) => {
        let countries = await db.getAllCountries();
        let string_countries = countries.join(', ');
        res.send(string_countries);
    });

    router.post('/userCookie/', async (req, res) => {
        res.send(req.cookies['uid']);
    })

    router.post('/userData/', async (req, res) => {
        let data = await db.getUserData(req.body.uid);
        res.json(data);
    });

    router.post('/login/', async (req, res) => {

        let email = req.body['login-email'];
        let password = req.body['login-password'];

        try {
            if(await db.doesEmailExist(email))
            {
                if(await db.isPasswordSame(email, password))
                {
                    res.cookie('uid', await db.getUserID(email), {maxAge: 900000, httpOnly: true});
                    res.redirect("/");
                }
                else
                    throw 'error';
            }
            else
                throw 'error';
        } catch(error) {
            res.redirect("/login?error=1");
        }

    });

    router.get('/register/', async (req, res) => {
        try {
            if(req.cookies['uid'] != undefined)
            {
                let doesUserExist = await db.doesUserExist(req.cookies['uid'])
                if(doesUserExist)
                {
                    res.redirect("/");     
                }
                else
                    throw 'error';
            }
            else
                throw 'error';
        } catch(error) {
            res.sendFile(path.resolve(__dirname + '/../app/register.html'));
        }
    });

    router.post('/register/', async (req, res) => {
        let email = req.body['register-email'];
        let username = req.body['register-username'];
        let password = req.body['register-password'];
        let confirm = req.body['register-confirm'];

        let hashedPwd = passwordHash.generate(password);

        if(password != confirm)
            res.redirect("/register?error=1");
        else if(await db.doesEmailExist(email))
            res.redirect("/register?error=2");
        else
        {
            db.createUser(email, username, hashedPwd);
            res.redirect("/login?success=1");
        }
    });
};