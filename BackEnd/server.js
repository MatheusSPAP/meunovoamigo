const http = require("http");
const url = require("url");
const { testConnection, createTables } = require("./src/db/dbConfig");

const usuarioRoutes = require("./src/routes/usuarioRoutes");
const animalRoutes = require("./src/routes/animalRoutes");
const statusRoutes = require("./src/routes/statusRoutes");
const eventoRoutes = require("./src/routes/eventoRoutes");
const postagemRoutes = require("./src/routes/postagemRoutes");
const comentarioRoutes = require("./src/routes/comentarioRoutes");

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
        } else if (path.startsWith("/api/postagens")) {
            await postagemRoutes.handleRequest(mockReq, mockRes);
        } else if (path.startsWith("/api/comentarios")) {
            await comentarioRoutes.handleRequest(mockReq, mockRes);
        } else if (path === "/api/health") {
            sendJSON(res, 200, { status: "OK", message: "API funcionando!" });
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
            console.log("   GET    /api/animais - Listar animais");
            console.log("   POST   /api/animais - Criar animal");
            console.log("   GET    /api/status - Listar status");
            console.log("   GET    /api/eventos - Listar eventos");
            console.log("   GET    /api/postagens - Listar postagens");
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


