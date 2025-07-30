const http = require("http");
const url = require("url");
const { testConnection, createTables } = require("./src/db/dbConfig");

const usuarioRoutes = require("./src/routes/usuarioRoutes");
const animalRoutes = require("./src/routes/animalRoutes");
const statusRoutes = require("./src/routes/statusRoutes");
const eventoRoutes = require("./src/routes/eventoRoutes");
const publicacaoRoutes = require("./src/routes/publicacaoRoutes"); // Alterado de postagemRoutes
const comentarioRoutes = require("./src/routes/comentarioRoutes");
const tipoAnimalRoutes = require("./src/routes/tipoAnimalRoutes"); // Nova rota
const racaRoutes = require("./src/routes/racaRoutes"); // Nova rota
const midiaRoutes = require("./src/routes/midiaRoutes"); // Nova rota

const PORT = process.env.PORT || 3000;

function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

async function router(req, res) {
    setCorsHeaders(res);
    
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    const mockReq = {
        method,
        url: req.url,
        params: {},
        query: parsedUrl.query,
        body: {}
    };
    
    const mockRes = {
        json: (data) => sendJSON(res, 200, data),
        status: (code) => ({
            json: (data) => sendJSON(res, code, data)
        })
    };

    try {
        if (method === "POST" || method === "PUT") {
            mockReq.body = await parseBody(req);
        }

        const pathParts = path.split("/").filter(part => part);
        if (pathParts.length >= 3 && !isNaN(pathParts[2])) {
            mockReq.params.id = pathParts[2];
        }

        if (path.startsWith("/api/usuarios")) {
            await usuarioRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/animais")) {
            await animalRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/status")) {
            await statusRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/eventos")) {
            await eventoRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/publicacoes")) { // Alterado de postagens
            await publicacaoRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/comentarios")) {
            await comentarioRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/tipos-animais")) { // Nova rota
            await tipoAnimalRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/racas")) { // Nova rota
            await racaRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/midias")) { // Nova rota
            await midiaRoutes.handleRequest(mockReq, mockRes);
        } else if (path === "/api/health") {
            sendJSON(res, 200, { status: "OK", message: "API ouiouiouiofuncionando!" });
        } else {
            sendJSON(res, 404, { error: "Endpoint não encontrado" });
        }
    } catch (error) {
        console.error("Erro no servidor:", error);
        sendJSON(res, 500, { error: "Erro interno do servidor" });
    }
}

const server = http.createServer(router);

async function startServer() {
    try {
        const connected = await testConnection();
        if (!connected) {
            console.error("❌ Não foi possível conectar ao banco de dados");
            process.exit(1);
        }

        await createTables();

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log("📋 Endpoints disponíveis:");
            console.log("   GET    /api/health - Status da API");
            console.log("   GET    /api/usuarios - Listar usuários");
            console.log("   POST   /api/usuarios - Criar usuário");
            console.log("   GET    /api/usuarios/:id - Buscar usuário");
            console.log("   PUT    /api/usuarios/:id - Atualizar usuário");
            console.log("   DELETE /api/usuarios/:id - Deletar usuário");
            console.log("   POST   /api/usuarios/login - Login de usuário");
            console.log("   GET    /api/animais - Listar animais");
            console.log("   POST   /api/animais - Criar animal");
            console.log("   GET    /api/animais/:id - Buscar animal");
            console.log("   PUT    /api/animais/:id - Atualizar animal");
            console.log("   DELETE /api/animais/:id - Deletar animal");
            console.log("   GET    /api/animais/status/:status - Listar animais por status");
            console.log("   GET    /api/animais/tipo/:tipo - Listar animais por tipo");
            console.log("   GET    /api/animais/localizacao?latitude=&longitude=&radius= - Listar animais por localização");
            console.log("   GET    /api/status - Listar status");
            console.log("   POST   /api/status - Criar status");
            console.log("   GET    /api/status/:id - Buscar status");
            console.log("   PUT    /api/status/:id - Atualizar status");
            console.log("   DELETE /api/status/:id - Deletar status");
            console.log("   GET    /api/eventos - Listar eventos");
            console.log("   POST   /api/eventos - Criar evento");
            console.log("   GET    /api/eventos/:id - Buscar evento");
            console.log("   PUT    /api/eventos/:id - Atualizar evento");
            console.log("   DELETE /api/eventos/:id - Deletar evento");
            console.log("   GET    /api/eventos/usuario/:usuarioId - Listar eventos por usuário");
            console.log("   GET    /api/eventos/tipo/:tipo - Listar eventos por tipo");
            console.log("   GET    /api/eventos/proximos - Listar próximos eventos");
            console.log("   GET    /api/publicacoes - Listar publicações");
            console.log("   POST   /api/publicacoes - Criar publicação");
            console.log("   GET    /api/publicacoes/:id - Buscar publicação");
            console.log("   PUT    /api/publicacoes/:id - Atualizar publicação");
            console.log("   DELETE /api/publicacoes/:id - Deletar publicação");
            console.log("   GET    /api/publicacoes/usuario/:usuarioId - Listar publicações por usuário");
            console.log("   GET    /api/publicacoes/animal/:animalId - Listar publicações por animal");
            console.log("   GET    /api/comentarios/publicacao/:publicacaoId - Listar comentários por publicação");
            console.log("   POST   /api/comentarios - Criar comentário");
            console.log("   PUT    /api/comentarios/:id - Atualizar comentário");
            console.log("   DELETE /api/comentarios/:id - Deletar comentário");
            console.log("   GET    /api/comentarios/usuario/:usuarioId - Listar comentários por usuário");
            console.log("   GET    /api/tipos-animais - Listar tipos de animais");
            console.log("   POST   /api/tipos-animais - Criar tipo de animal");
            console.log("   GET    /api/tipos-animais/:id - Buscar tipo de animal");
            console.log("   PUT    /api/tipos-animais/:id - Atualizar tipo de animal");
            console.log("   DELETE /api/tipos-animais/:id - Deletar tipo de animal");
            console.log("   GET    /api/racas - Listar raças");
            console.log("   POST   /api/racas - Criar raça");
            console.log("   GET    /api/racas/:id - Buscar raça");
            console.log("   PUT    /api/racas/:id - Atualizar raça");
            console.log("   DELETE /api/racas/:id - Deletar raça");
            console.log("   GET    /api/racas/tipo/:tipoId - Listar raças por tipo");
            console.log("   GET    /api/midias - Listar mídias");
            console.log("   POST   /api/midias - Criar mídia");
            console.log("   GET    /api/midias/:id - Buscar mídia");
            console.log("   PUT    /api/midias/:id - Atualizar mídia");
            console.log("   DELETE /api/midias/:id - Deletar mídia");
            console.log("   GET    /api/midias/publicacao/:publicacaoId - Listar mídias por publicação");
            console.log("   DELETE /api/midias/publicacao/:publicacaoId - Deletar mídias por publicação");
        });
    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
}

process.on("SIGINT", () => {
    console.log("\n🛑 Encerrando servidor...");
    server.close(() => {
        console.log("✅ Servidor encerrado");
        process.exit(0);
    });
});

startServer();


