// Função para alternar entre páginas
function switchToRegister() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('registerPage').classList.add('active');
}

function switchToLogin() {
    document.getElementById('registerPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
}

// Função para alternar visibilidade da senha
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.nextElementSibling;
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar senha (mínimo 6 caracteres)
function isValidPassword(password) {
    return password.length >= 6;
}

// Função para mostrar mensagem de erro
function showError(inputElement, message) {
    // Remove erro anterior se existir
    const existingError = inputElement.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    inputElement.parentNode.appendChild(errorDiv);
    inputElement.style.borderColor = '#ef4444';
}

// Função para limpar erros
function clearError(inputElement) {
    const errorMessage = inputElement.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    inputElement.style.borderColor = '#ddd';
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    // Criar modal de sucesso
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
    `;
    
    modalContent.innerHTML = `
        <div style="color: #22c55e; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="margin-bottom: 1rem; color: #333;">${message}</h3>
        <button onclick="this.closest('.modal').remove()" style="
            background: #22c55e;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
        ">OK</button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Remover modal após 3 segundos
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 3000);
}

// Event listeners para os formulários
document.addEventListener('DOMContentLoaded', function() {
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const submitBtn = this.querySelector('.submit-btn');
        
        let isValid = true;
        
        // Limpar erros anteriores
        clearError(email);
        clearError(password);
        
        // Validar email
        if (!email.value.trim()) {
            showError(email, 'Email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Email inválido');
            isValid = false;
        }
        
        // Validar senha
        if (!password.value.trim()) {
            showError(password, 'Senha é obrigatória');
            isValid = false;
        }
        
        if (isValid) {
            // Simular loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'ENTRANDO...';
            
            // Simular requisição
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ENTRAR';
                showSuccess('Login realizado com sucesso!');
                
                // Limpar formulário
                loginForm.reset();
            }, 1500);
        }
    });
    
    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const city = document.getElementById('registerCity');
        const address = document.getElementById('registerAddress');
        const password = document.getElementById('registerPassword');
        const submitBtn = this.querySelector('.submit-btn');
        
        let isValid = true;
        
        // Limpar erros anteriores
        [name, email, city, address, password].forEach(clearError);
        
        // Validar nome
        if (!name.value.trim()) {
            showError(name, 'Nome é obrigatório');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError(name, 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        // Validar email
        if (!email.value.trim()) {
            showError(email, 'Email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Email inválido');
            isValid = false;
        }
        
        // Validar cidade
        if (!city.value.trim()) {
            showError(city, 'Cidade é obrigatória');
            isValid = false;
        }
        
        // Validar endereço
        if (!address.value.trim()) {
            showError(address, 'Endereço é obrigatório');
            isValid = false;
        }
        
        // Validar senha
        if (!password.value.trim()) {
            showError(password, 'Senha é obrigatória');
            isValid = false;
        } else if (!isValidPassword(password.value)) {
            showError(password, 'Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }
        
        if (isValid) {
            // Simular loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'CRIANDO CONTA...';
            
            // Simular requisição
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Continuar';
                showSuccess('Conta criada com sucesso!');
                
                // Limpar formulário e voltar para login
                registerForm.reset();
                setTimeout(() => {
                    switchToLogin();
                }, 2000);
            }, 1500);
        }
    });
    
    // Limpar erros quando o usuário começar a digitar
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Adicionar efeitos de hover nos botões
    document.querySelectorAll('.submit-btn, .switch-link, .forgot-password').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Função para lidar com esqueceu senha
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordBtn = document.querySelector('.forgot-password');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function() {
            const email = prompt('Digite seu email para recuperação de senha:');
            if (email && isValidEmail(email)) {
                showSuccess('Email de recuperação enviado!');
            } else if (email) {
                alert('Email inválido. Tente novamente.');
            }
        });
    }
});

// Adicionar animações suaves
document.addEventListener('DOMContentLoaded', function() {
    // Animação de entrada para os elementos do formulário
    const animateElements = document.querySelectorAll('.form-container, .branding-section');
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

