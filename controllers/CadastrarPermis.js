function gerarChavePermissao(descricao) {
    return descricao
        .toLowerCase() 
        .replace(/ /g, '_') 
        .replace(/[^\w_]/g, ''); 
}


async function cadastrarPermissoes(dados, supabase) {
    if (!supabase) {
        throw new Error('Supabase não configurado.');
    }

    const { descricao } = dados;

    if (!descricao) {
        return { success: false, error: 'A descrição é obrigatória.' };
    }

    const permissao = gerarChavePermissao(descricao);

    const { data, error } = await supabase
        .from('public.permissoes')
        .insert([{ per_permissao: permissao, per_descricao: descricao }]);

    if (error) {
        console.error('Erro ao cadastrar permissão:', error.message);
        return { success: false, error };
    }

    console.log('Permissão cadastrada com sucesso:', data);
    return { success: true, data };
}

module.exports = {
    cadastrarPermissoes,
};
