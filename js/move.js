const pecas = [
    [
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [2, 2],
        [2, 2]
    ],
    [
        [3, 3, 3, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [4, 0, 0],
        [4, 4, 4],
        [0, 0, 0]
    ],
    [
        [0, 5, 0],
        [5, 5, 5],
        [0, 0, 0]
    ],
    [
        [0, 0, 6],
        [6, 6, 6],
        [0, 0, 0]
    ],
    
    
    [
        [7]
    ]
];

let larguraTabuleiro;
let alturaTabuleiro;
let tabuleiro = [];

let pecaAtual = obterPecaAleatoria();
let posicaoPecaAtualX;
let posicaoPecaAtualY = 0;

let pontuacao = 0;
let nivel = 1;
let intervaloDeQueda = 1000; // Milissegundos

//Define as peças que serão utilizadas no jogo
function obterPecaAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * pecas.length);
    return pecas[indiceAleatorio];
}

// Define o tamanho do tabuleiro
function definirTamanhoTabuleiro(largura, altura) {
    larguraTabuleiro = largura; 
    alturaTabuleiro = altura; 
    tabuleiro = Array.from(
        {
            length: altura
        }, () => Array(largura).fill(0)); // Cria um tabuleiro vazio, o fill(0) serve para preencher com zeros o tabuleiro
}

// Função para desenhar a peça atual no tabuleiro
function desenharPeca() {
    for (let i = 0; i < pecaAtual.length; i++) { // Percorre a peça atual
        for (let j = 0; j < pecaAtual[i].length; j++) {
            if (pecaAtual[i][j] !== 0) {
                tabuleiro[posicaoPecaAtualY + i][posicaoPecaAtualX + j] = pecaAtual[i][j]; // Desenha a peça atual no tabuleiro
            }
        }
    }
}

// Função para apagar a peça atual do tabuleiro
function apagarPeca() {
    for (let i = 0; i < pecaAtual.length; i++) {
        for (let j = 0; j < pecaAtual[i].length; j++) {
            if (pecaAtual[i][j] !== 0) {
                tabuleiro[posicaoPecaAtualY + i][posicaoPecaAtualX + j] = 0;
            }
        }
    }
}

// Função para mover a peça para baixo
function moverParaBaixo() {
    apagarPeca();
    posicaoPecaAtualY++;
    if (verificarColisao()) {
        posicaoPecaAtualY--;
        desenharPeca();
        obterPecaAleatoria();
    } else {
        desenharPeca();
    }
}

// Função para verificar se a peça colide
function verificarColisao() {
    for (let i = 0; i < pecaAtual.length; i++) {
        for (let j = 0; j < pecaAtual[i].length; j++) {
            if (pecaAtual[i][j] !== 0) {
                if (tabuleiro[posicaoPecaAtualY + i] && tabuleiro[posicaoPecaAtualY + i][posicaoPecaAtualX + j] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
} function limparLinhasCompletas() {
    let linhasCompletas = 0;
    for (let i = alturaTabuleiro - 1; i >= 0; i--) {
        if (tabuleiro[i].every(bloco => bloco !== 0)) {
            tabuleiro.splice(i, 1);
            tabuleiro.unshift(Array(larguraTabuleiro).fill(0));
            linhasCompletas++;
            pontuacao += 100;
        }
    }
    if (linhasCompletas > 0) {
        verificarNivel();
        atualizarIntervaloDeQueda();
    }
}

function verificarNivel() {
    if (pontuacao >= nivel * 1000) {
        nivel++;
        document.getElementById('nivel').innerText = nivel;
    }
}

function atualizarIntervaloDeQueda() {
    clearInterval(obterPecaAleatoria);// Limpa o intervalo de queda atual
    obterPecaAleatoria = setInterval(moverParaBaixo, intervaloDeQueda);
}

function iniciarJogo() {
    definirTamanhoTabuleiro(larguraTabuleiro, alturaTabuleiro);
    obterPecaAleatoria();
    renderizarTabuleiro();
    renderizarPecaAtual();
}

function verificarFimDeJogo() {
    if (tabuleiro[0].some(bloco => bloco !== 0)) {
        alert("Fim de Jogo! Sua pontuação foi: " + pontuacao);
        reiniciarJogo();
    }
}

function reiniciarJogo() {
    tabuleiro = Array.from({ length: alturaTabuleiro }, () => Array(larguraTabuleiro).fill(0));
    posicaoPecaAtualX = 0;
    posicaoPecaAtualY = 0;
    pontuacao = 0;
    nivel = 1;
    intervaloDeQueda = 1000;
    iniciarJogo();
}

function aumentarNivel() {
    nivel++;
    intervaloDeQueda -= 100; // Ajuste conforme necessário
}

function atualizarIntervaloDeQueda() {
    clearInterval(obterPecaAleatoria);
    obterPecaAleatoria = setInterval(moverParaBaixo, intervaloDeQueda);
}


function renderizarTabuleiro() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    for (let i = 0; i < alturaTabuleiro; i++) {
        for (let j = 0; j < larguraTabuleiro; j++) {
            const bloco = document.createElement('div');
            bloco.className = `bloco tipo-${tabuleiro[i][j]}`;
            container.appendChild(bloco);
        }
    }
}

function renderizarPecaAtual() {
    for (let i = 0; i < pecaAtual.length; i++) {
        for (let j = 0; j < pecaAtual[i].length; j++) {
            if (pecaAtual[i][j] !== 0) {
                const bloco = document.createElement('div');
                bloco.className = `bloco tipo-${pecaAtual[i][j]}`;
                bloco.style.top = `${(posicaoPecaAtualY + i) * 30}px`;
                bloco.style.left = `${(posicaoPecaAtualX + j) * 30}px`;
                document.getElementById('game-container').appendChild(bloco);
            }
        }
    }
}

// Adicione eventos de botão para permitir ao jogador escolher o tamanho do tabuleiro
document.getElementById('btn1020').addEventListener('click', function () {
    definirTamanhoTabuleiro(10, 20);
    posicaoPecaAtualX = 3;
    iniciarJogo();
    document.getElementById('popup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});

document.getElementById('btn2244').addEventListener('click', function () {
    definirTamanhoTabuleiro(22, 44);
    posicaoPecaAtualX = 6;
    iniciarJogo();
    document.getElementById('popup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});

document.getElementById('btn-start').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    iniciarJogo();
});

// Função para lidar com a pressão de teclas
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            moverEsquerda();
            break;
        case 'ArrowRight':
            moverDireita();
            break;
        case 'ArrowDown':
            moverParaBaixo();
            break;
        case 'ArrowUp':
            rotacionarPeca();
            break;
        case ' ':
            cairRapidamente();
            break;
        default:
            break;
    }
}

// Função para mover a peça para a esquerda
function moverEsquerda() {
    apagarPeca();
    posicaoPecaAtualX--;
    if (verificarColisao()) {
        posicaoPecaAtualX++;
        desenharPeca();
    } else {
        desenharPeca();
    }
}

// Função para mover a peça para a direita
function moverDireita() {
    apagarPeca();
    posicaoPecaAtualX++;
    if (verificarColisao()) {
        posicaoPecaAtualX--;
        desenharPeca();
    } else {
        desenharPeca();
    }
}


// Função para girar a peça
function rotacionarPeca() {
    const novaPeca = [];
    for (let i = 0; i < pecaAtual[0].length; i++) {
        novaPeca[i] = [];
        for (let j = 0; j < pecaAtual.length; j++) {
            novaPeca[i][j] = pecaAtual[pecaAtual.length - j - 1][i];
        }
    }


    apagarPeca();
    pecaAtual = novaPeca;
    if (verificarColisao()) {
        pecaAtual = pecaAnterior; // Reverte a rotação se houver colisão
    }
    desenharPeca();
}


// Variável para controlar se a barra de espaço está pressionada
let barraEspacoPressionada = false;

// Adicione um ouvinte de eventos para escutar as teclas pressionadas
document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        barraEspacoPressionada = true;
        cairRapidamente();
    } else if (event.key === 'ArrowDown') {
        moverParaBaixo();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === ' ') {
        barraEspacoPressionada = false;
    }
});

// Função para fazer a peça cair rapidamente
function cairRapidamente() {
    if (!verificarColisao()) {
        moverParaBaixo();
        if (barraEspacoPressionada) {
            setTimeout(cairRapidamente, 100);
        }
    }
}

// Exemplo de uso dos eventos de teclado (você precisa implementar os handlers)
document.addEventListener('keydown', handleTeclaPressionada);

// Implemente os handlers para as teclas (por exemplo, para a tecla de seta para baixo)
function handleTeclaPressionada(event) {
    if (event.key === 'ArrowDown') {
        moverParaBaixo();
    }
}

// Comece o jogo
iniciarJogo();
