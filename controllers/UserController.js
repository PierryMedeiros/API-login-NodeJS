let User = require("../models/User");
let PasswordToken = require("../models/PasswordToken");
let jwt = require("jsonwebtoken");

let secret = "adsuasgdhjasgdhjdgahjsg12hj3eg12hj3g12hj3g12hj3g123";

let bcrypt = require("bcrypt");


class UserController {
    async index(req, res) {
        let users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res) {
        let id = req.params.id;
        let user = await User.findById(id);
        if (user == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200)
            res.json(user);
        }
    }

    async findByEmail(req, res) {
        let email = req.params.email; // ou req.query.email dependendo de como você está passando o email na requisição

        if (email == undefined || email == '' || email == ' ') {
            res.status(400);
            res.json({ err: "O e-mail é inválido!" });
            return;
        }

        let user = await User.findByEmail(email);

        if (user == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            console.log(user)
            res.json(user);
        }
    }

    async create(req, res) {
        let { email, username, password, fullName, role, abilityRules, avatar } = req.body;


        if (email == undefined || email == '' || email == ' ') {
            res.status(400);
            res.json({ err: "O e-mail é inválido!" })
            return;
        }

        let emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(406);
            res.json({ err: "O e-mail já está cadastrado!" })
            return;
        }


        await User.new(email, password, username, fullName, role, abilityRules, avatar);

        res.status(200);
        res.send("Tudo OK!");
    }

    async edit(req, res) {
        let { id, name, role, email } = req.body;
        let result = await User.update(id, email, name, role);
        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.send("Tudo OK!");
            } else {
                res.status(406);
                res.send(result.err)
            }
        } else {
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res) {
        let id = req.params.id;

        let result = await User.delete(id);

        if (result.status) {
            res.status(200);
            res.send("Tudo OK!");
        } else {
            res.status(406);
            res.send(result.err);
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email;
        let result = await PasswordToken.create(email);
        if (result.status) {
            res.status(200);
            res.send("" + result.token);
        } else {
            res.status(406)
            res.send(result.err);
        }
    }

    async changePassword(req, res) {
        let token = req.body.token;
        let password = req.body.password;
        let isTokenValid = await PasswordToken.validate(token);
        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        } else {
            res.status(406);
            res.send("Token inválido!");
        }
    }

    async login(req, res) {
        let { email, password } = req.body;

        let user = await User.findByEmail(email);

        if (user != undefined) {

            let resultado = await bcrypt.compare(password, user.password);

            if (resultado) {

                let token = jwt.sign({ email: user.email, role: user.role }, secret);

                res.status(200);
                res.json({ token: token });

            } else {
                res.status(406);
                res.json({ err: 'Senha incorreta' })
            }

        } else {
            res.status(406);
            res.json({ status: false, err: 'O usuário não existe!' });

        }
    }

}

module.exports = new UserController();