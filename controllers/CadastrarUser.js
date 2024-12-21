async function cadastrarUsuario(dados, supabase) {
    if (!supabase) {
        throw new Error('SP NOT CONFIGURED')
    }

    const { data, error } = await supabase
        .from('usuarios')
        .insert([{
            usr_email: dados.email,
            usr_nome: dados.nome,
            usr_senha: dados.senha,
            usr_grupo: dados.grupo,
            usr_perfil: dados.perfil
        }])
    if (error) {
        console.error('Erro ao cadastrar Usuario:', error.message);
        return { success: false, error };
    }

    return { success: true, data };
}

module.exports = { cadastrarUsuario }



