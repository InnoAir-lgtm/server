const cadastrarPessoaC = async (dados, supabase) => {
    if (!supabase) {
        throw new Error('Conexão Supabase não foi inicializada.');
    }

    try {
        const { tipoPessoa, cpf, cnpj, rg, inscricaoEstadual, dataNascimento, nome, fantasia } = dados;

        const payload = {
            pes_rg: rg,
            pes_ie: inscricaoEstadual,
            pes_dn: dataNascimento,
            pes_nome: nome,
            pes_fantasia: fantasia,
            pes_fis_jur: tipoPessoa,
        };

        if (tipoPessoa === 'cpf') {
            payload.pes_cpf_cnpj = cpf;
        } else if (tipoPessoa === 'cnpj') {
            payload.pes_cpf_cnpj = cnpj;
        }

        const { data, error } = await supabase
            .schema('belaarte')
            .from('pessoas')
            .insert([payload])
            .select('pes_id')

        console.log('Dados recebidos:', payload);

        if (error) {
            console.error('Erro ao cadastrar pessoa:', error.message);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Erro inesperado no cadastro:', err.message);
        return { success: false, error: err.message };
    }
};

module.exports = { cadastrarPessoaC };
