var produtos = [];
var carrinho = [];


var salvo = localStorage.getItem("carrinho");
if (salvo) {
  carrinho = JSON.parse(salvo);
}


function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


function mostrarProdutos() {
  var container = document.getElementById("listaProdutos");
  container.innerHTML = "";

  for (var i = 0; i < produtos.length; i++) {
    var p = produtos[i];

    var card = document.createElement("div");
    card.className = "card-produto";

    card.innerHTML =
      "<img src='" + p.imagem + "' alt='" + p.nome + "' onerror=\"this.src='https://via.placeholder.com/300x200?text=Imagem'\">" +
      "<h3>" + p.nome + "</h3>" +
      "<p>" + p.descricao + "</p>" +
      "<p>R$ " + p.preco.toFixed(2).replace(".", ",") + "</p>" +
      "<button onclick='add(" + p.id + ")'>Adicionar</button>";

    container.appendChild(card);
  }
}


function add(id) {
  var produto = null;

  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) {
      produto = produtos[i];
    }
  }

  if (!produto) return;

  carrinho.push(produto);

  salvarCarrinho();
  atualizarCarrinho();
}



function atualizarCarrinho() {
  document.getElementById("contadorCarrinho").textContent = carrinho.length;
}


function mostrarCarrinho() {
  var div = document.getElementById("itensCarrinho");
  div.innerHTML = "";

  var total = 0;

  if (carrinho.length == 0) {
    document.getElementById("mensagemVazio").style.display = "block";
    document.getElementById("totalCarrinho").textContent = "0,00";
    return;
  }

  document.getElementById("mensagemVazio").style.display = "none";

  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];

    total = total + item.preco;

    var linha = document.createElement("div");

    linha.innerHTML =
      item.nome +
      " - R$ " + item.preco.toFixed(2).replace(".", ",") +
      " <button onclick='remover(" + i + ")'>X</button>";

    div.appendChild(linha);
  }

  document.getElementById("totalCarrinho").textContent =
    total.toFixed(2).replace(".", ",");
}


function remover(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
  mostrarCarrinho();
}


document.getElementById("btnAbrirCarrinho").onclick = function () {
  document.getElementById("carrinho").style.display = "block";
  mostrarCarrinho();
};

document.getElementById("btnFecharCarrinho").onclick = function () {
  document.getElementById("carrinho").style.display = "none";
};

document.getElementById("btnLimparCarrinho").onclick = function () {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  mostrarCarrinho();
};


fetch("./produtos.json")
  .then(function (res) {
    if (!res.ok) {
      throw new Error("Erro ao carregar JSON");
    }
    return res.json();
  })
  .then(function (dados) {
    produtos = dados;
    mostrarProdutos();
  });


atualizarCarrinho();