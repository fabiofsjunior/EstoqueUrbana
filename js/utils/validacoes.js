/**
 * ============================================================
 * VALIDAÇÕES E NORMALIZAÇÕES COMPARTILHADAS
 * ============================================================
 */

function normalizarStatus(status) {
  const texto = String(status ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

  if (texto.startsWith("PEND")) return "PENDENTE";
  if (texto.includes("SEPARADO") || texto.includes("ENVIO")) {
    return "SEPARADO PARA ENVIO";
  }
  if (texto.startsWith("FINAL") || texto.includes("FINALZD")) {
    return "FINALIZADO";
  }

  return texto;
}

function escapeHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validarQuantidade(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === "") {
    return { valido: false, mensagem: "Informe uma quantidade." };
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero <= 0) {
    return { valido: false, mensagem: "A quantidade deve ser maior que zero." };
  }

  return { valido: true, valor: numero };
}

function validarReferencia(valor, nome = "Referência") {
  if (valor === null || valor === undefined || String(valor).trim() === "") {
    return { valido: false, mensagem: `${nome} não informado.` };
  }

  return { valido: true, valor: String(valor).trim() };
}

function validarRespostaApi(resposta) {
  if (!resposta || typeof resposta !== "object" || Array.isArray(resposta)) {
    return { valido: false, mensagem: "Resposta inválida do servidor." };
  }

  if (resposta.sucesso !== true) {
    return {
      valido: false,
      mensagem: resposta.mensagem || "O servidor não confirmou a operação.",
    };
  }

  return { valido: true, resposta };
}
