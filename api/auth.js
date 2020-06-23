const route = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation')

route.post('/register', async (req, res) => {
    // Validação antes de inserir o usuário
    const { error } = await registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Usuário existe
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send({msg: 'E-mail já cadastrado'});

    // Criptografia da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Criação de novo usuário
    const user = User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    
    try {
        const savedUser = await user.save();
        // res.send(savedUser);
        res.send({user: user._id});
    } catch (error) {
        console.log('deu erro');
        res.status(400).send({ error: error });
    }

});

route.post('/login', async (req, res) => {
    // Validação antes de inserir o usuário
    const { error } = await loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Usuário existe
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({msg: 'email ou password inválido'});

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send({msg: 'email ou password inválido'});

    // Criar token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token: token});

});

module.exports = route;