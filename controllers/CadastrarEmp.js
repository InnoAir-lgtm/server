async function cadastrarEmpresa(dados, supabase) {
    if (!supabase) {
        throw new Error('Supabase não está configurado.');
    }

    const { data, error } = await supabase
        .from('empresas')
        .insert([{
            emp_cnpj: dados.cnpj,
            emp_nome: dados.nome,
            emp_grupo: dados.grupo,
            emp_bdservidor: dados.bdservidor,
            emp_bdusuario: dados.bdusuario,
            emp_bdsenha: dados.bdsenha,
            emp_bdschema: dados.bdschema,
        }]);

    if (error) {
        console.error('Erro ao cadastrar empresa:', error.message);
        return { success: false, error };
    }

    console.log('Empresa cadastrada com sucesso:', data);
    return { success: true, data };
}

module.exports = { cadastrarEmpresa };
