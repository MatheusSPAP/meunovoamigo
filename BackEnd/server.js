const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuração do banco de dados
const { testConnection } = require('./src/db/dbConfig');

// Importar rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const statusRoutes = require('./src/routes/statusRoutes');
const animalRoutes = require('./src/routes/animalRoutes');
const postagemRoutes = require('./src/routes/postagemRoutes');
const comentarioRoutes = require('./src/routes/comentarioRoutes');
const eventoRoutes = require('./src/routes/eventoRoutes');
const interesseAdocaoRoutes = require('./src/routes/interesseAdocaoRoutes');
const tipoRoutes = require('./src/routes/tipoRoutes');
const tamanhoAnimalRoutes = require('./src/routes/tamanhoAnimalRoutes');
const comportamentoRoutes = require('./src/routes/comportamentoRoutes');
const midiaRoutes = require('./src/routes/midiaRoutes');
const racaRoutes = require('./src/routes/racaRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors({
    origin: '*', // Permitir todas as origens para desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// Middleware de log para desenvolvimento
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Adoção de Animais está funcionando!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Rota de health check
app.get('/health', async (req, res) => {
    try {
        const dbConnected = await testConnection();
        res.json({
            success: true,
            status: 'healthy',
            database: dbConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            database: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Configurar rotas da API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/animais', animalRoutes);
app.use('/api/postagens', postagemRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/interesses-adocao', interesseAdocaoRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/tamanhos', tamanhoAnimalRoutes);
app.use('/api/comportamentos', comportamentoRoutes);
app.use('/api/midias', midiaRoutes);
app.use('/api/racas', racaRoutes);
app.use('/api/conversations', conversationRoutes);

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

// Middleware de tratamento de erros globais
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});

// Inicializar servidor
async function startServer() {
    try {
        // Testar conexão com o banco de dados
        console.log('🔄 Testando conexão com o banco de dados...');
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Falha na conexão com o banco de dados. Verifique as configurações.');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, '0.0.0.0', () => {
            console.log('🚀 Servidor iniciado com sucesso!');
            console.log(`📡 Servidor rodando na porta ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Base: http://localhost:${PORT}/api`);
            console.log('');
            console.log('📋 Rotas disponíveis:');
            console.log('  - GET  /api/usuarios');
            console.log('  - POST /api/usuarios');
            console.log('  - POST /api/usuarios/login');
            console.log('  - GET  /api/animais');
            console.log('  - POST /api/animais');
            console.log('  - GET  /api/postagens');
            console.log('  - POST /api/postagens');
            console.log('  - GET  /api/eventos');
            console.log('  - POST /api/eventos');
            console.log('  - GET  /api/interesses-adocao');
            console.log('  - POST /api/interesses-adocao');
            console.log('  - E muitas outras...');
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de sinais de encerramento
process.on('SIGINT', () => {
    console.log('\n🛑 Recebido sinal de interrupção. Encerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Recebido sinal de término. Encerrando servidor...');
    process.exit(0);
});

// Iniciar aplicação
startServer();

module.exports = app;

