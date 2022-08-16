const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const conexao = mysql.createConnection ({
    host: '172.17.0.1',
    port: '6520',
    user: 'root',
    password: '123@senac',
    database: 'bancoloja'
});
conexao.connect((erro)=>{
    if(erro){
        return console.error(`não conectou ->  ${erro}`);
    }
    console.log(`banco de dados online -> ${conexao.threadId}`);
})

app.get(`/usuarios/listar`,(req,res)=>{
    conexao.query("select * from usuario",(erro,dados)=>{
        if(erro)return res.status(500).send({output: `erro -> ${erro}`});
        res.status(200).send({output:dados})
    })
});

app.post("/usuarios/cadastro",(req,res)=>{
    if (
        req.body.nomeusuario == "" || 
        req.body.senha == "" || 
        req.body.email == "" || 
        req.body.nomecompleto == "" || 
        req.body.cpf == "" || 
        req.body.foto == "" 
        ){
            return res.status(400).send({output: "você deve digitar todos os dados"});
        } 
        conexao.query("insert into usuario set ?",req.body,(erro, data)=>{
            if (erro) return res.status(500).send({output:`erro ao tentar cadastrar: ${erro}`})
            res.status(201).send({output:`usuario cadastrado`,dados:data})
        }
)})

app.post ("/usuarios/login", (req, res)=>{
    if (req.body.usuario == "" ||
        req.body.senha == "" ){
        return res.status(400).
        send({output:`você deve inserir todos os dados`});
    }
    conexao.query (
        "select * from usuario where nomeusuario=? and senha=?",
        [req.body.nomeusuario,req.body.senha],
        (error,data)=>{
            if(error) return res.status(500).
            send({output:`erro ao tentar logar -> ${error}`})
            res.status(200).send({output:`logado`, dados:data});
        }
        );
});
app.put("/usuarios/atualizar/:id",(req, res)=>{
    conexao.query("update usuario set ? where id = ?", [req.body, req.body.params.id],(error,data)=>{
        if (error)
        return res.status(500).
        send({output:`erro ao tentar atualizar -> ${error}`,
    });
    res.status(200).send({output:`atualizado`, dados: data});
})
})


app.listen("3000", ()=>console.log("Servidor online"))
