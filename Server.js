const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');
const { cadastrarEmpresa } = require('./controllers/CadastrarEmp');
const { cadastrarUsuario } = require('./controllers/CadastrarUser')
const { cadastrarPapeis } = require('./controllers/CadastrarPapeis');
const { cadastrarPermissoes } = require('./controllers/CadastrarPermis');
const { cadastrarPessoa } = require('./controllers/CadastrarTipoP')
const { cadastrarPessoaC } = require('./controllers/CadastrarPessoa')
const { cadastrarEndereco } = require('./controllers/CadastrarEnder')

require('dotenv').config();
app.use(express.json());


const corsOptions = {
    origin: [
        'http://localhost:5173', // Desenvolvimento local
        'https://innoair-github-io-nktw.vercel.app', // Produção no Vercel
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.options('*', cors(corsOptions)); // Configuração para pré-solicitações (OPTIONS)
app.use(cors(corsOptions));


// Chave e conexão BD
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


app.post('/cadastrar-empresa', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarEmpresa(dados, supabase);
        if (result) {
            return res.status(201).json({ message: 'Empresa cadastrada com sucesso!', data: result });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar empresa.' });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


app.post('/cadastrar-papeis', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPapeis(dados, supabase);
        if (result) {
            return res.status(201).json({ message: 'Papel cadastrada com sucesso!', data: result });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar Papel.' });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
})


app.post('/cadastrar-permissoes', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPermissoes(dados, supabase);
        if (result.success) {
            return res.status(201).json({ message: 'Permissão cadastrada com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar permissão.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/cadastrar-endereco', async (req, res) => {
    try {
        const result = await cadastrarEndereco(req.body, supabase);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro ao cadastrar endereço.' });
    }
});

app.post('/cadastrar-pessoa', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPessoaC(dados, supabase);

        console.log(dados);

        if (result.success) {
            return res.status(201).json({
                message: 'Pessoa cadastrada com sucesso!',
                data: result.data,
            });
        } else {
            return res.status(400).json({
                message: 'Erro ao cadastrar pessoa.',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({
            message: 'Erro interno do servidor.',
        });
    }
});


app.post('/cadastrar-usuario', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarUsuario(dados, supabase);
        if (result.success) {
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar usuário.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/cadastrar-tipo-pessoa', async (req, res) => {
    try {
        const dados = req.body;
        const result = await cadastrarPessoa(dados, supabase);

        if (result.success) {
            return res.status(201).json({ message: 'Tipo de pessoa cadastrado com sucesso!', data: result.data });
        } else {
            return res.status(400).json({ message: 'Erro ao cadastrar tipo de pessoa.', error: result.error });
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/associar-papel-empresa', async (req, res) => {
    try {
        const { usr_id, pap_id, emp_cnpj } = req.body;
        if (!usr_id || !pap_id || !emp_cnpj) {
            return res.status(400).json({ message: 'Usuário, papel e empresa são obrigatórios.' });
        }
        const { error } = await supabase
            .from('pap_usr_emp')
            .insert([{ usr_id, pap_id, emp_cnpj }]);
        if (error) throw error;
        res.status(201).json({ message: 'Papel e empresa associados com sucesso!' });

    } catch (error) {
        console.error('Erro ao associar papel e empresa:', error.message);
        res.status(500).json({ message: 'Erro ao associar papel e empresa.' });
    }
});


app.post('/associar-endereco', async (req, res) => {
    try {
        const { pes_id, epe_numero, epe_complemento, epe_tipo, end_cep, epe_latitude, epe_longitude } = req.body;

        if (!pes_id || !epe_tipo || !end_cep) {
            return res.status(400).json({ message: 'Os campos pes_id, epe_tipo e end_cep são obrigatórios.' });
        }

        const { error } = await supabase
            .schema('belaarte')
            .from('endereco_pessoa')
            .insert([{
                pes_id,
                epe_numero,
                epe_complemento,
                epe_tipo,
                end_cep,
                epe_latitude,
                epe_longitude
            }]);

        if (error) throw error;

        res.status(201).json({ message: 'Endereço associado com sucesso!' });

    } catch (error) {
        console.error('Erro ao associar endereço à pessoa:', error.message);
        res.status(500).json({ message: 'Erro ao associar endereço à pessoa.' });
    }
});

app.post('/associar-contato-pessoa', async (req, res) => {
    try {
        const { ctt_contato, ctt_tipo, pes_id, ctt_numero_email } = req.body;

        if (!pes_id) {
            return res.status(400).json({ message: 'Os campos devem ser preenchidos' });
        }

        const { data, error } = await supabase
            .schema('belaarte')
            .from('contatos')
            .insert([
                {
                    ctt_contato,
                    ctt_tipo,
                    pes_id,
                    ctt_numero_email,
                },
            ]);

        if (error) throw error;

        res.status(201).json({ message: 'Contato associado com sucesso', data });
    } catch (error) {
        console.error('Erro ao associar contato a pessoa:', error.message);
        res.status(500).json({ message: 'Erro ao associar contato a pessoa' });
    }
});

app.get('/listar-endereco', async (req, res) => {
    try {
        const { pes_id } = req.query;

        if (!pes_id) {
            return res.status(400).json({ message: 'O campo pes_id é obrigatório.' });
        }

        const { data, error } = await supabase
            .schema('belaarte')
            .from('endereco_pessoa')
            .select('*')
            .eq('pes_id', pes_id);

        if (error) throw error;

        res.status(200).json({ data });

    } catch (error) {
        console.error('Erro ao listar endereços:', error.message);
        res.status(500).json({ message: 'Erro ao listar endereços.' });
    }
});

app.get('/listar-contatos-pessoa', async (req, res) => {
    try {
        const { pes_id } = req.query
        if (!pes_id) {
            return res.status(400).json({ message: 'O campo pes_id e obrigatorio' })
        }

        const { data, error } = await supabase
            .schema('belaarte')
            .from('contatos')
            .select('*')
            .eq('pes_id', pes_id)

        if (error) throw error

        res.status(200).json({ data })
    } catch (error) {
        console.log('Erro ao listar contatos', error.message)
        res.status(500).json({ message: 'erro ao listar Contatos' })
    }
})

app.get('/listar-tipos-pessoa', async (req, res) => {
    try {
        const { data, error } = await supabase
            .schema('belaarte')
            .from('tipo_pessoa')
            .select('*');

        if (error) throw error;
        res.status(200).json({ data })
    } catch (error) {
        console.log('Erro ao listar Tipos', error.message)
        res.status(500).json({ message: 'Erro ao listar Tipos' })
    }
})

app.post("/cadastrar-tipo-pessoa", async (req, res) => {
    const { pes_id, tpp_id } = req.body;

    try {
        await db.query("INSERT INTO pessoas_tipo (pes_id, tpp_id) VALUES ($1, $2)", [pes_id, tpp_id]);
        res.status(200).json({ message: "Cadastro na tabela pessoas_tipo realizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao inserir na tabela pessoas_tipo:", error);
        res.status(500).json({ message: "Erro ao cadastrar na tabela pessoas_tipo." });
    }
});

app.post('/atualizar-associacoes', async (req, res) => {
    const { usr_id, papeis, empresas } = req.body;

    try {
        const { error: deleteError } = await supabase
            .from('pap_usr_emp')
            .delete()
            .eq('usr_id', usr_id);

        if (deleteError) throw deleteError;

        const newAssociations = [];
        papeis.forEach((pap_id) => {
            empresas.forEach((emp_cnpj) => {
                newAssociations.push({ usr_id, pap_id, emp_cnpj });
            });
        });
        if (newAssociations.length > 0) {
            const { error: insertError } = await supabase
                .from('pap_usr_emp')
                .insert(newAssociations);

            if (insertError) throw insertError;
        }

        res.status(200).json({ message: 'Associações atualizadas com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar associações:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar associações.' });
    }
});

app.post('/associar-permissao', async (req, res) => {
    try {
        const { papel_id, permissao_id } = req.body;

        if (!papel_id || !permissao_id) {
            return res.status(400).json({ message: 'Papel e permissão são obrigatórios.' });
        }
        const { error } = await supabase
            .from('papel_permissao')
            .insert({ papel_id, permissao_id });
        if (error) throw error;

        res.status(201).json({ message: 'Permissão associada com sucesso!' });
    } catch (error) {
        console.error('Erro ao associar permissão:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// GET
app.get('/lista-empresas', async (req, res) => {
    try {
        const { data, error } = await supabase.from('empresas').select('emp_nome, emp_cnpj')
        if (error) {
            throw error
        }
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar emrpesas', error.message)
        res.status(500).json({ message: 'Error ao listar empresas' })
    }
})

app.get('/listar-endereco-pessoa', async (req, res) => {
    try {
        const { data, error } = await supabase.schema('belaarte').from('endereco_pessoa').select('*')
        if (error) {
            throw error
        }
        res.status(200).json(data)
    } catch (error) {
        console.error('error ao listar endereco pessoa')
        res.status(500).json({ message: 'Error ao listar endereco pessoa' })
    }
})

app.get('/listar-papeis', async (req, res) => {
    try {
        const { data, error } = await supabase.from('papeis').select('pap_papel, pap_id');
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar papéis:', error.message);
        res.status(500).json({ message: 'Erro ao listar papéis.' });
    }
});

app.get('/pessoas', async (req, res) => {
    try {
        const { data, error } = await supabase.schema('belaarte').from('pessoas').select('*')
        if (error) throw error
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar permissoes', error.message)
        res.status(500).json({ message: 'Erro ao listar permissões' })
    }
})

app.get('/listar-permissoes', async (req, res) => {
    try {
        const { data, error } = await supabase.from('permissoes').select('per_id, per_descricao')
        if (error) throw error
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar permissoes', error.message)
        res.status(500).json({ message: 'Erro ao listar permissões' })
    }
})



app.get('/listar-usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase.from('usuarios').select('*')
        if (error) throw error
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar usuarios', error.message)
        res.status(500).json({ message: 'Erro ao listar usuarios' })
    }
})

app.get('/permissoes-por-papel/:papelId', async (req, res) => {
    const { papelId } = req.params;
    try {
        const { data, error } = await supabase
            .from('papel_permissao')
            .select('permissao_id')
            .eq('papel_id', papelId);

        if (error) throw error;

        res.status(200).json(data.map((item) => item.permissao_id));
    } catch (error) {
        console.error('Erro ao buscar permissões do papel:', error.message);
        res.status(500).json({ message: 'Erro ao buscar permissões do papel.' });
    }
});

app.get('/listar-usuarios-sch', async (req, res) => {
    try {
        const empresaCnpj = req.query.cnpj;
        if (!empresaCnpj) {
            return res.status(400).json({ message: 'CNPJ da empresa não fornecido.' });
        }

        const { data: empresaData, error: empresaError } = await supabase
            .from('empresas')
            .select('emp_bdschema')
            .eq('emp_cnpj', empresaCnpj)
            .single();

        if (empresaError || !empresaData) {
            return res.status(400).json({ message: 'Empresa não encontrada.' });
        }

        const schema = empresaData.emp_bdschema;
        const { data, error } = await supabase
            .schema(schema)
            .from('tipo_pessoa')
            .select('tpp_descricao, tpp_classificacao ');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar usuários:', error.message);
        res.status(500).json({ message: 'Erro ao listar usuários.' });
    }
});


// Endpoint para listar associações de papéis e empresas de um usuário
app.get('/listar-associacoes/:usr_id', async (req, res) => {
    const { usr_id } = req.params;
    try {
        const { data, error } = await supabase
            .from('pap_usr_emp')
            .select('pap_id, emp_cnpj, empresas(emp_nome)')
            .eq('usr_id', usr_id);
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar associações:', error.message);
        res.status(500).json({ message: 'Erro ao listar associações.' });
    }
});

app.get('/listar-associacoes-uep', async (req, res) => {
    try {
        const { data, erro } = await supabase
            .from('pap_usr_emp')
            .select('*')
        if (erro) throw error;

        res.status(200).json(data)
    } catch (error) {
        console.error('Erro ao listar associações:', error.message);
        res.status(500).json({ message: 'Erro ao listar associações.' });
    }
})




app.delete('/remover-permissao', async (req, res) => {
    try {
        const { papel_id, permissao_id } = req.body;

        if (!papel_id || !permissao_id) {
            return res.status(400).json({ message: 'Papel e permissão são obrigatórios.' });
        }

        const { error } = await supabase
            .from('papel_permissao')
            .delete()
            .eq('papel_id', papel_id)
            .eq('permissao_id', permissao_id);

        if (error) throw error;

        res.status(200).json({ message: 'Permissão removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover permissão:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});



app.post('/login-master', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('usr_id, usr_email, usr_senha, usr_perfil, usr_grupo')
            .eq('usr_email', email)
            .eq('usr_senha', senha);
        if (error) {
            throw error;
        }

        if (usuarios.length === 0) {
            return res.status(403).json({ message: 'Credenciais incorretas.' });
        }

        const usuario = usuarios[0];

        if (usuario.usr_perfil === 'Master' || usuario.usr_perfil === 'Administrador' || usuario.usr_perfil === 'Operador') {
            return res.status(200).json({
                message: 'Login bem-sucedido!',
                user: {
                    email: usuario.usr_email,
                    perfil: usuario.usr_perfil,
                    grupo: usuario.usr_grupo,
                    id: usuario.usr_id
                },
            });
        } else {
            return res.status(403).json({ message: 'Acesso negado: perfil não autorizado.' });
        }
    } catch (error) {
        console.error('Erro ao autenticar:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
