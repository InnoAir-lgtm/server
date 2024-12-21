async function cadastrarEndereco(dados, supabase) {
    if (!supabase) {
        throw new Error('BD not configured')
    }

    const { data, error } = await supabase
        .schema('belaarte')
        .from('enderecos')
        .insert([
            {
                end_cep: dados.cep,
                end_logradouro: dados.logradouro,
                end_bairro: dados.bairro,
                end_cidade: dados.cidade,
                end_uf: dados.estado,
            }
        ]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };

};

module.exports = { cadastrarEndereco }