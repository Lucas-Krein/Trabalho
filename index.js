console.log("Seja Bem-vindo, Lucas!")
//primeira coisa, sempre criar o package .json

//npm é uma bibliotec imensa para buscar as dependencias

//npm install --save mysql2
//npm install express mysql2

//npm init --> Criar o package .json (arquivo c/ infos do projeto)
//npm install -- save mysql2 - dependência p/conexão sql
//npm install express mysql2 - dependência p/conexão front, back

const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'estoque_prod'
});

connection.connect(function(err){
    if(err){
        console.error('Erro: ',err)
        return
    }
    console.log("Conexão estabelecida com sucesso!")
});

/*connection.query("INSERT INTO clientes (nome, idade, uf) VALUES (?, ?, ?)", function(err, result){
    if(!err){
        console.log("Dados inseridos com sucesso!")
    } else{
        console.log("Erro: Não foi possível inserir os dados", err)
    }
});

connection.query("SELECT*FROM clientes", function(err, rows, result){
    if(!err){
        console.log("Resultado: ", rows)
    } else{
        console.log("Erro: Não foi possível inserir os dados", err)
    }
});*/

app.get("/formulario", function(req, res){
    res.sendFile(__dirname + "/formulario.html")
});
app.post('/adicionar', (req, res) =>{
    const descricao = req.body.descricao;
    const quant_estoque = req.body.quant_estoque;
    const valor = req.body.valor;
    const peso = req.body.peso;
    const medida = req.body.medida;
    const localizacao_corredor = req.body.localizacao_corredor;
    const localizacao_pratelei = req.body.localizacao_pratelei;

    const values = [descricao, quant_estoque, valor, peso, medida, localizacao_corredor, localizacao_pratelei]
    const insert = "INSERT INTO produto(descricao, quant_estoque, valor, peso, medida, localizacao_corredor, localizacao_pratelei) VALUES (?, ?, ?, ?, ?, ?, ?)"

    app.use(express.static('public'));
    
    connection.query(insert, values, function(err, result){
        if (!err){
            console.log("Dados inseridos com sucesso!")
            res.send("Dados inseridos!")
        } else {
            console.log("Não foi possível inserir os dados: ", err);
            res.send("Erro!")
        }
    })
});
app.get('/listar', function(req, res){
    const selectAll = "select*from produto";
    connection.query(selectAll, function(err, rows){//sempre que usar o banco de dados, utlizar o connection.query
        if (!err){
            console.log("Dados inseridos com sucesso!")
            res.send(`
            <html>
                <head>
                    <title> Produtos Cadastrados </title>
                    <link rel="stylesheet" type="text/css" href="/estilo.css">
                    <link rel="icon" type="image/x-icon" href="logao.png">
                </head>
                <body>
                   <h2><div class="cabecalista">
                   <br>
                    <a href="http://localhost:8081/formulario"> Cadastrar Produtos</a href>
                    <a href="http://localhost:8081"> Home</a href>
                    </div></h2>
                    <table class="maislista">
                    <tr>
                    <th colspan ="9" style="background-color:red;  width: 40%; "align="center" height: 100px> Lista dos Produtos</th>
                    </tr>    
                    <tr>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center" border: 3px solid red> Descrição </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Quantidade em Estoque </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Valor </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Peso </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Medida </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Localização (corredor) </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Localização (prateleira) </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Editar </th>
                    <th colspan ="1" style="background-color:red;  width: 40%; "align="center"> Excluir </th>
                        </tr>
                        ${rows.map(row => ` 
                        <tr style=color:red>
                            <th colspan ="1" width: 40%; "align="center" >${row.descricao}</th>
                            <th colspan ="1" width: 40%; "align="center">${row.quant_estoque}</th>
                            <th colspan ="1" width: 40%; "align="center">${row.valor}</th>
                            <th colspan ="1" width: 40%; "align="center">${row.peso}</th>
                            <th colspan ="1" width: 40%; "align="center">${row.medida}</th>
                            <th colspan ="1" width: 40%; "align="center">${row.localizacao_corredor}</th>
                            <th colspan ="1" width: 40%; "align="center">${row.localizacao_pratelei}</th>
                            <th colspan ="1" width: 40%; "align="center"><a href = "/atualizar-form/${row.codigo}"> Editar </a></th>
                            <th colspan ="1" width: 40%; "align="center"><a href = "/deletar/${row.codigo}"> Deletar </a></th>
                        </tr>   
                        `).join('')}
                    </table>
                    <div>
                    <style>
                        body{
                            background-color: black;
                        }
                    </style>
                    </div> 
                </body>    
            </html>
            `);
        } else {
            console.log("Erro ao listar os dados!: ", err);
            res.send("Erro!")
        }
    })
});

app.get("/", function(req, res){
    res.send(`
    <html>
    <head>
        <title> Sistema de Cadastro de Produtos </title>
        <link rel="stylesheet" type="text/css" href="/estilo.css">
        <link rel="icon" type="image/x-icon" href="logo.png">
    </head>
    <body>
        <div class="cabecalhome">
            <h2>Área Logística (somente pessoal autorizado)</h2>
            <h2><p>
            <a href="http://localhost:8081/formulario"> Cadastrar Produtos</a href>
            <a href="http://localhost:8081/listar"> Lista</a href>
            </p></h2>
            <style>
                body{
                   
                    }
            </style>
        </div> 
        
        <div class="fundome">
            <h1 style=color:red align="center">Mister's Mercado</h1>
            <h1 style=color:red align="center">Confiança é nossa meta!</h1>
        </div>  
        
        <div class="baixoleta">
            <h1 style align="center">Confira nossos produtos.
            <br>
            <br>
            <h1 style align="center">Surpreenda-se com nossa qualidade.
        </div>

        <div class="maisbaixo">
            <h1 style=color:gold align="center">Desde 2023 entregando o melhor para você, cliente amigo!</h1>
        </div>
        </body>
        </html>
    `)
});
app.get("/deletar/:codigo", function(req,res){ //colocar /: é uma boa prática para informar ao express que o programa precisará do id
    const codigoDoProduto = req.params.codigo;

    const deleteProduto = "DELETE FROM produto WHERE codigo = ?";

    connection.query(deleteProduto, [codigoDoProduto], function(err, result){
        if(!err){
            console.log("Produto deletado!");
            res.redirect('/listar');
        }else{
            console.log("Erro ao deletar o produto: ", err);
        }
    })
});
app.get("/atualizar-form/:codigo", function(req, res){
    const codigoDoProduto = req.params.codigo;

    const selectProduto = "SELECT * FROM produto WHERE codigo = ?";

    connection.query(selectProduto, [codigoDoProduto], function(err, result){
        if(!err && result.length>0){
            const produto = result[0];

            res.send(`
            <html>
            <head>
                <title>Atualizar Cadastro</title>
            </head>
            <body>
                <h1> Atualizar Cadastro </h1>
                <form action="/atualizar/${codigoDoProduto}" method = "POST">
                    <label for="descricao">Descrição:</label>
                    <input type="text" id="descricao" name="descricao" value="${produto.descricao}" required><br>
                    
                    <label for="quant_estoque">Quantidade Estoque:</label>
                    <input type="text" id="quant_estoque" name="quant_estoque" value="${produto.quant_estoque}" required><br>
                    
                    <label for="valor">Valor:</label>
                    <input type="text" id="valor" name="valor" value="${produto.valor}" required><br>

                    <label for="peso">Peso do produto:</label>
                    <input type="text" id="peso" name="peso" value="${produto.peso}" required><br>

                    <label for="medida">Medida (1- Unidade), (2- Metro):</label>
                    <input type="text" id="medida" name="medida" value="${produto.medida}" required><br>

                    <label for="localizacao_corredor">Localização (corredor):</label>
                    <input type="text" id="localizacao_corredor" name="localizacao_corredor" value="${produto.localizacao_corredor}" required><br>

                    <label for="localizacao_pratelei">localização (prateleira):</label>
                    <input type="text" id="localizacao_pratelei" name="localizacao_pratelei" value="${produto.localizacao_pratelei}" required><br>

                    <input type="submit" value="Atualizar">
            </body>
            </html>
            `);
        } else{
            console.log("Erro ao obter dados do cliente: ", err);
        }
    });
});
app.post('/atualizar/:codigo', (req, res) =>{
    const codigo = req.params.codigo;
    const descricao = req.body.descricao;
    const quant_estoque = req.body.quant_estoque;
    const valor = req.body.valor;
    const peso = req.body.peso;
    const medida = req.body.medida;
    const localizacao_corredor = req.body.localizacao_corredor;
    const localizacao_pratelei = req.body.localizacao_pratelei;

    const updateQuery = "UPDATE produto SET descricao=?, quant_estoque=?, valor=?, peso=?, medida=?, localizacao_corredor=?, localizacao_pratelei=? WHERE codigo=?";

    connection.query(updateQuery, [descricao, quant_estoque, valor, peso, medida, localizacao_corredor, localizacao_pratelei, codigo], function(err, result){
        if(!err){
            console.log("Dados atualizados!");
            res.send("Dados atualizados!");
        } else{
            console.log("Erro ao atualizar dados: ", err);
        }
    })
});

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
});

