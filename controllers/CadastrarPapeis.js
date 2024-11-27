async function cadastrarPapeis(dados, supabase) {
    if (!supabase) {
        throw new Error('SP NOT CONFIGURED');
    }

    const { data, error } = await supabase
        .from('papeis')
        .insert([{
            pap_papel: dados.papel,
        }]);

    if (error) {
        console.error('Erro ao cadastrar papel:', error); 
        return { success: false, error };
    }

    console.log('Papel cadastrado com sucesso:', data);
    return { success: true, data };
}

module.exports = {
    cadastrarPapeis
}