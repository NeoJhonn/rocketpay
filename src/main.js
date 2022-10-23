import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "grey"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//security-code
const securityCode = document.getElementById("security-code")
//adicionando um padrão de mascara, código de segurança só vai aceitera números até 4 dígitos
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//Expiração
const validThru = document.getElementById("expiration-date")
const validThruPattern = {
  mask: "MM{/}YY", //data
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), //pega os dois ultimos dígitos do ano atual
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const validThruMasked = IMask(validThru, validThruPattern)

//Número do Cartão
const cardNumber = document.getElementById("card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, //regra --> começa com 4 mais 15 dígitos de 0 à 15/ expressão regular --> regex
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/, //regra --> tem que iniciar com 5 -próximo dígito entre 1 e 5 - próximo dígito entre 0 e 2 /ou/ vai iniciar com 22, próximo dígitoe entre 2 e 9, pode ter mais um dígito /ou/ inicia em 2, próximo dígito ente 3 e 7, próximo dígito entre 0 e 2 /ou/ por fim vai conte mais 12 dígitos de 0 a 12,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "") // pega tudo que não for número e troca por vazio
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex) //pega o número do cartão digitado e ver se da match com o regex(regra)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//Adicionar evento ao botão "Adicionar cartão"
const addButton = document.getElementById("add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado") //mostra uma dialog message
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() //não atualiza o form, assim você consegue ver a mensagem no console
})

//campo nome do titular
const cardHolder = document.getElementById("card-holder")
cardHolder.addEventListener("input", () => {
  //execulta ação quando vc digita algo no campo
  const ccHolder = document.querySelector(".cc-holder #nomeTitular")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value //if ternário= se não tiver nada digitado(lengh===0) seta "FULANO DA SILVA" , SENÃO = seta o que foi diditado
})

//campo código de segurança
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security #codigo-cvv")
  ccSecurity.innerText = code.length === 0 ? "123" : code //if ternário= se não for ditado um cógigo no campo setar o valor padrão "123", Senao setar o valor digitado
}

//campo número do cartão
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype //pegando o tipo de bandeira do cartão
  setCardType(cardType) //setando a bandeira do cartão de acordo com o número que foi digitado
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const cdNumber = document.getElementById("cardNumber")
  cdNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number //if ternário= se não for ditado um cógigo no campo setar o valor padrão "1234 5678 9012 3456", Senao setar o valor digitado
}

//campo Expiração
validThruMasked.on("accept", () => {
  updatevalidThru(validThruMasked.value)
})

function updatevalidThru(deadLine) {
  const valid = document.getElementById("dead-line")
  valid.innerText = deadLine.length === 0 ? "02/32" : deadLine //if ternário= se não for ditado um cógigo no campo setar o valor padrão "02/32", Senao setar o valor digitado
}
