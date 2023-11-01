// Referências aos elementos HTML
const clientNameInput = document.getElementById("clientName");
const clientEmailInput = document.getElementById("clientEmail");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productWidthInput = document.getElementById("productWidth");
const productLengthInput = document.getElementById("productLength");
const productQuantityInput = document.getElementById("productQuantity");
const productList = document.getElementById("productList");
const addProductButton = document.getElementById("addProduct");
const generatePDFButton = document.getElementById("cmd");
const emissorSelect = document.getElementById("emissorSelect");

// Array para armazenar os produtos
const products = [];

addProductButton.addEventListener("click", () => {
  const productName = productNameInput.value;
  const productWidth = productWidthInput.value;
  const productLength = productLengthInput.value;
  const productQuantity = productQuantityInput.value;
  const productPrice = parseFloat(productPriceInput.value);

  if (
    productName &&
    productWidth &&
    productLength &&
    productQuantity &&
    !isNaN(productPrice) &&
    productPrice > 0
  ) {
    // Adiciona o produto ao array
    products.push({
      name: productName,
      width: productWidth,
      length: productLength,
      quantity: productQuantity,
      price: productPrice,
    });

    // Atualiza a lista de produtos
    const li = document.createElement("li");
    li.textContent = `Nome do produto: ${productName} - Largura: ${productWidth}cm, Comprimento: ${productLength}cm, Quantidade: ${productQuantity}, Vlr. Unitário: R$ ${productPrice.toFixed(
      2
    )}`;
    productList.appendChild(li);

    // Limpa os campos de entrada
    productNameInput.value = "";
    productWidthInput.value = "";
    productLengthInput.value = "";
    productQuantityInput.value = "";
    productPriceInput.value = "";
  }
});

generatePDFButton.addEventListener("click", () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Calcula a posição da borda externa com margem de 5% no centro da página
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 5;

  const outerBorderWidth = pageWidth * (1 - margin / 100);
  const outerBorderHeight = pageHeight * (1 - margin / 100);
  const outerBorderX = (pageWidth - outerBorderWidth) / 2;
  const outerBorderY = (pageHeight - outerBorderHeight) / 2;

  doc.rect(
    outerBorderX,
    outerBorderY,
    outerBorderWidth,
    outerBorderHeight,
    "S"
  );

  const rectX = outerBorderX;
  const rectY = outerBorderY;
  const rectWidth = outerBorderWidth;
  const rectHeight = 30;

  doc.rect(rectX, rectY, rectWidth, rectHeight, "S");

  const dividerY = rectY + rectHeight + 50;
  doc.setLineWidth(0.5);
  doc.line(rectX, dividerY, rectX + rectWidth, dividerY);

  // Informações do Emissor
  const emissorSelect = document.getElementById("emissorSelect");
  const selectedEmissor =
    emissorSelect.options[emissorSelect.selectedIndex].text;

  // Adicione as informações específicas do emissor
  let emissorSpecificInfo = "";

  if (selectedEmissor === "Império da Limpeza") {
    emissorSpecificInfo = `
      RAZÃO SOCIAL: Império produtos de Limpeza LTDA
      CNPJ: 31.554.099/0001-05
      INSCRIÇÃO ESTADUAL: 258839287
      ENDEREÇO: Rua Caçador, N°192 - São Vicente - Itajaí
    `;
  } else if (selectedEmissor === "Kapforte") {
    emissorSpecificInfo = `
      RAZÃO SOCIAL: KAPFORTE TAPETES PERSONALIZADOS LTDA
      CNPJ: 34.363.529/0001-91
      INSCRIÇÃO ESTADUAL: 123456789
      ENDEREÇO: R. Paraíba, 83 - Cordeiros, Itajaí - SC, 88310-460
    `;
  } else if (selectedEmissor === "Emissor 3") {
    emissorSpecificInfo = `
      RAZÃO SOCIAL: Emissor 3 LTDA
      CNPJ: 11.111.111/0001-11
      INSCRIÇÃO ESTADUAL: 987654321
      ENDEREÇO: Rua Teste, N°321 - Cidade Teste
    `;
  }

  // Posicione as informações do emissor no topo do retângulo e alinhe à esquerda
  const textX = rectX + 5; // Alinhe à esquerda
  const textY = rectY + 7; // Ajuste o espaçamento do topo conforme necessário

  doc.setFontSize(12);
  doc.text(emissorSpecificInfo, textX, textY, {
    lineHeight: 18,
  });

  // Adicione as informações do cliente dentro do retângulo
  const customerInfoY = rectY + rectHeight + 5;

  // Recupere todas as informações do cliente
  const clientName = document.getElementById("clientName").value;
  const clientEmail = document.getElementById("clientEmail").value;
  const orcamentoCode = document.getElementById("orcamentoCode").value;
  const cpfCnpj = document.getElementById("cpfCnpj").value;
  const endereco = document.getElementById("endereco").value;
  const bairro = document.getElementById("bairro").value;
  const cep = document.getElementById("cep").value;
  const consultor = document.getElementById("consultor").value;

  // Crie uma string com todas as informações do cliente
  const clientInfo = `
      Nome do Cliente: ${clientName}
      E-mail do Cliente: ${clientEmail}
      Código do Orçamento: ${orcamentoCode}
      CPF / CNPJ: ${cpfCnpj}
      Endereço: ${endereco}
      Bairro: ${bairro}
      CEP: ${cep}
      Consultor: ${consultor}
    `;

  // Adicione as informações do cliente no PDF com espaçamento entre linhas
  doc.setFontSize(12);
  doc.text(clientInfo, rectX + 5, customerInfoY, { lineHeight: 8 });

  // Adicione produtos ao PDF
  addProductsToPDF(doc, outerBorderX, rectY + rectHeight + 50);

  // Calcule a soma dos valores totais dos produtos
  const totalValue = products.reduce((total, product) => {
    const productTotal = product.price * product.quantity;
    return total + productTotal;
  }, 0);

  // Adicione o texto "Valor total do orçamento" e o valor total ao PDF
  const totalText = `Valor total do orçamento: R$ ${totalValue.toFixed(2)}`;
  const totalY = pageHeight - 20; // Ajuste a posição vertical conforme necessário
  doc.setFontSize(12);
  doc.text(totalText, pageWidth / 2, totalY, { align: "center" });

  // Salve o PDF
  doc.save("orcamento.pdf");
});

function addProductsToPDF(doc, startX, startY) {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const marginTop = pageHeight * 0.05;
  startY += marginTop;
  let contentHeight = 0;

  const tableHeader = [
    "Item",
    "Largura (cm)",
    "Comprimento (cm)",
    "Quantidade",
    "Valor Unitário (R$)",
    "Valor Total (R$)",
  ];
  const columnWidths = [20, 25, 35, 30, 40, 40];

  // Calcule a largura total da tabela
  const tableWidth = columnWidths.reduce((a, b) => a + b, 0);

  // Centralize a tabela horizontalmente na página
  startX = (pageWidth - tableWidth) / 2;

  doc.setFontSize(10);
  doc.setLineHeightFactor(1.2);

  // Adicione o título centralizado acima da tabela
  doc.setFontSize(18);
  doc.text("Dados do Orçamento", pageWidth / 2, startY + 10, {
    align: "center",
  });
  doc.setFontSize(10);

  // Adicionar bordas entre o cabeçalho e o corpo da tabela
  startY += 25; // Aumente o espaço entre o título e o cabeçalho da tabela
  contentHeight += 2;
  for (let i = 0; i < tableHeader.length; i++) {
    doc.rect(startX, startY, columnWidths[i], 18);
    doc.text(tableHeader[i], startX + columnWidths[i] / 2, startY + 10, {
      align: "center",
    });
    startX += columnWidths[i];
  }

  startY += 18;
  contentHeight += 18;

  // Adicionar bordas ao redor do conteúdo da tabela
  for (const product of products) {
    startX = (pageWidth - tableWidth) / 2;
    const rowData = [
      product.name,
      product.width,
      product.length,
      product.quantity,
      `R$ ${product.price.toFixed(2)}`,
      `R$ ${(product.price * product.quantity).toFixed(2)}`, // Adicione o valor total do item
    ];

    for (let i = 0; i < rowData.length; i++) {
      doc.rect(startX, startY, columnWidths[i], 18);
      doc.text(rowData[i], startX + columnWidths[i] / 2, startY + 10, {
        align: "center",
      });
      startX += columnWidths[i];
    }

    startY += 18;
    contentHeight += 18;

    if (startY + 18 > pageHeight) {
      doc.addPage();
      startY = marginTop;
      contentHeight = 0;
    }
  }
}
