const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Inclui os dados do usuário no `req`
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = {
    authenticateUser
}