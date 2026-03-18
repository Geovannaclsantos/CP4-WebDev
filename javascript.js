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

  var categoria = document.getElementById("filtroCategoria").value;
  var preco = document.getElementById("filtroPreco").value;

  var lista = [];

  for (var i = 0; i < produtos.length; i++) {
    if (categoria === "todos" || produtos[i].categoria === categoria) {
      lista.push(produtos[i]);
    }
  }

  if (preco === "menor") {
    lista.sort(function (a, b) {
      return a.preco - b.preco;
    });
  }

  if (preco === "maior") {
    lista.sort(function (a, b) {
      return b.preco - a.preco;
    });
  }

  for (var j = 0; j < lista.length; j++) {
    var p = lista[j];

    var card = document.createElement("div");
    card.className = "card-produto";

    card.innerHTML =
      "<img src='" + p.imagem + "' alt='" + p.nome + "' onerror=\"this.src='https://via.placeholder.com/300x200?text=Imagem'\">" +
      "<p><strong>" + p.categoria + "</strong></p>" +
      "<h3>" + p.nome + "</h3>" +
      "<p>" + p.descricao + "</p>" +
      "<p>R$ " + p.preco.toFixed(2).replace(".", ",") + "</p>" +
      "<button onclick='add(" + p.id + ")'>Adicionar</button>";

    container.appendChild(card);
  }

  document.getElementById("totalProdutos").textContent =
    lista.length + " produto(s)";
}

function add(id) {
  var produto = null;

  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) {
      produto = produtos[i];
    }
  }

  if (!produto) {
    alert("Produto não encontrado!");
    return;
  }

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

    total += item.preco;

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

document.getElementById("filtroCategoria").onchange = mostrarProdutos;
document.getElementById("filtroPreco").onchange = mostrarProdutos;

fetch("./produtos.json")
  .then(function (res) {
    if (!res.ok) throw new Error("Erro ao carregar JSON");
    return res.json();
  })
  .then(function (dados) {
    produtos = dados;
    mostrarProdutos();
  });

atualizarCarrinho();
