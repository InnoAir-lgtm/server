const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');
const { cadastrarEmpresa } = require('./controllers/CadastrarEmp');
const { cadastrarUsuario } = require('./controllers/CadastrarUser')
const { cadastrarPapeis } = require('./controllers/CadastrarPapeis');
const { cadastrarPermissoes } = require('./controllers/CadastrarPermis');
require('dotenv').config();
app.use(express.json());

// CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Chave e conexão BD
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// Endpoint para cadastrar empresa via API - 1
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

// Endpoint para cadastrar papeis via API - 2
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

// Endpoint cadastar permissao - 3
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

// Endpoint para cadastrar usuário via API - 4
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


// Endpoint para listar os papéis
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

// Endpoint para listar permissões associadas a um papel
// Endpoint para listar permissões associadas a um papel
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




// Endepoint login - 5
app.post('/login-master', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usr_email', email)
            .eq('usr_senha', senha);
        if (error) {
            throw error;
        }

        if (usuarios.length === 0) {
            return res.status(403).json({ message: 'Credenciais incorretas.' });
        }
        const usuario = usuarios[0];

        if (usuario.usr_perfil === 'Master' || usuario.usr_perfil === 'Administrador') {
            return res.status(200).json({
                message: 'Login bem-sucedido!',
                user: { email: usuario.usr_email, perfil: usuario.usr_perfil },
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
