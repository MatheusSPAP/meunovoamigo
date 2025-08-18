// Função para alternar visibilidade da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Função para navegar para a tela de login
function showLogin() {
    window.location.href = 'login.html';
}

// Função para navegar para a tela de registro
function showRegister() {
    window.location.href = 'registro.html';
}

// Função para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar senha
function validatePassword(password) {
    return password.length >= 6;
}

// Função para mostrar mensagem
function showMessage(message, type = 'success') {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insere a mensagem antes do formulário
    const form = document.querySelector('.form');
    form.parentNode.insertBefore(messageDiv, form);

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Função para validar campo em tempo real
function validateField(input, validationFn, errorMessage) {
    const value = input.value.trim();
    const isValid = validationFn(value);
    
    if (value === '') {
        input.classList.remove('valid', 'invalid');
    } else if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
    
    return isValid || value === '';
}

// Função para adicionar loading ao botão
function setLoading(button, isLoading) {
    const form = button.closest('form');
    if (isLoading) {
        form.classList.add('loading');
        button.disabled = true;
    } else {
        form.classList.remove('loading');
        button.disabled = false;
    }
}

// Event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Validação em tempo real para formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const cidadeInput = document.getElementById('cidade');
        const enderecoInput = document.getElementById('endereco');
        const senhaInput = document.getElementById('senha');
        const confirmarSenhaInput = document.getElementById('confirmarSenha');

        // Validação do nome
        if (nomeInput) {
            nomeInput.addEventListener('input', function() {
                validateField(this, (value) => value.length >= 2, 'Nome deve ter pelo menos 2 caracteres');
            });
        }

        // Validação do email
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                validateField(this, validateEmail, 'Email inválido');
            });
        }

        // Validação da cidade
        if (cidadeInput) {
            cidadeInput.addEventListener('input', function() {
                validateField(this, (value) => value.length >= 2, 'Cidade deve ter pelo menos 2 caracteres');
            });
        }

        // Validação do endereço
        if (enderecoInput) {
            enderecoInput.addEventListener('input', function() {
                validateField(this, (value) => value.length >= 5, 'Endereço deve ter pelo menos 5 caracteres');
            });
        }

        // Validação da senha
        if (senhaInput) {
            senhaInput.addEventListener('input', function() {
                validateField(this, validatePassword, 'Senha deve ter pelo menos 6 caracteres');
                
                // Revalidar confirmação de senha se já foi preenchida
                if (confirmarSenhaInput && confirmarSenhaInput.value) {
                    validateField(confirmarSenhaInput, (value) => value === senhaInput.value, 'Senhas não coincidem');
                }
            });
        }

        // Validação da confirmação de senha
        if (confirmarSenhaInput) {
            confirmarSenhaInput.addEventListener('input', function() {
                validateField(this, (value) => value === senhaInput.value, 'Senhas não coincidem');
            });
        }

        // Submit do formulário de registro
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validações finais
            if (!data.nome || data.nome.length < 2) {
                showMessage('Nome deve ter pelo menos 2 caracteres', 'error');
                return;
            }
            
            if (!validateEmail(data.email)) {
                showMessage('Email inválido', 'error');
                return;
            }
            
            if (!data.cidade || data.cidade.length < 2) {
                showMessage('Cidade deve ter pelo menos 2 caracteres', 'error');
                return;
            }
            
            if (!data.endereco || data.endereco.length < 5) {
                showMessage('Endereço deve ter pelo menos 5 caracteres', 'error');
                return;
            }
            
            if (!validatePassword(data.senha)) {
                showMessage('Senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            
            if (data.senha !== data.confirmarSenha) {
                showMessage('Senhas não coincidem', 'error');
                return;
            }
            
            if (!document.getElementById('termos').checked) {
                showMessage('Você deve aceitar os Termos de Uso e Política de Privacidade', 'error');
                return;
            }

            // Simular envio para API
            const submitButton = this.querySelector('.btn-submit');
            setLoading(submitButton, true);
            
            try {
                // Simular delay da API
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Aqui você faria a chamada real para sua API
                // const response = await fetch('/api/usuarios', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         nome: data.nome,
                //         email: data.email,
                //         senha: data.senha,
                //         cidade: data.cidade,
                //         endereco: data.endereco
                //     })
                // });
                
                showMessage('Conta criada com sucesso! Redirecionando para o login...', 'success');
                
                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } catch (error) {
                showMessage('Erro ao criar conta. Tente novamente.', 'error');
            } finally {
                setLoading(submitButton, false);
            }
        });
    }

    // Validação em tempo real para formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = document.getElementById('loginEmail');
        const senhaInput = document.getElementById('loginSenha');

        // Validação do email
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                validateField(this, validateEmail, 'Email inválido');
            });
        }

        // Validação da senha
        if (senhaInput) {
            senhaInput.addEventListener('input', function() {
                validateField(this, validatePassword, 'Senha deve ter pelo menos 6 caracteres');
            });
        }

        // Submit do formulário de login
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validações finais
            if (!validateEmail(data.email)) {
                showMessage('Email inválido', 'error');
                return;
            }
            
            if (!validatePassword(data.senha)) {
                showMessage('Senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }

            // Simular envio para API
            const submitButton = this.querySelector('.btn-submit');
            setLoading(submitButton, true);
            
            try {
                // Simular delay da API
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Aqui você faria a chamada real para sua API de login
                // const response = await fetch('/api/login', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         email: data.email,
                //         senha: data.senha
                //     })
                // });
                
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                
                // Redirecionar para dashboard após 2 segundos
                setTimeout(() => {
                    // window.location.href = 'dashboard.html';
                    alert('Redirecionamento para o dashboard (implementar conforme necessário)');
                }, 2000);
                
            } catch (error) {
                showMessage('Email ou senha incorretos. Tente novamente.', 'error');
            } finally {
                setLoading(submitButton, false);
            }
        });
    }

    // Animação suave para os inputs quando focados
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Efeito de hover nos botões
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Função para salvar dados no localStorage (opcional)
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
}

// Função para recuperar dados do localStorage (opcional)
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao recuperar do localStorage:', error);
        return null;
    }
}

// Função para limpar formulário
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        // Remove classes de validação
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
    }
}

