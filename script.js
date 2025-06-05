// script.js

// Substitua pelas suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAL6uHWlUMaOtefScSkzsyi6FNNNnWrrLw",
  authDomain: "plantao-guaraspace.firebaseapp.com",
  databaseURL: "https://plantao-guaraspace-default-rtdb.firebaseio.com",
  projectId: "plantao-guaraspace",
  storageBucket: "plantao-guaraspace.firebasestorage.app",
  messagingSenderId: "578201866700",
  appId: "1:578201866700:web:1b3379c767741ad2c40d69"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const horariosPermitidos = {
  "Seg 14:00-16:30": 2,
  "Ter 8:00-10:00": 2,
  "Ter 10:00-12:00": 3,
  "Ter 14:00-16:30": 3,
  "Qua 14:00-16:30": 2,
  "Qui 8:00-10:00": 2,
  "Qui 10:00-12:00": 3,
  "Qui 14:00-16:30": 3
};

const form = document.getElementById("form-turno");
const selectHorario = document.getElementById("horario");
const nomeInput = document.getElementById("nome");
const setorInput = document.getElementById("setor");

// Atualiza opções disponíveis
function atualizarHorariosDisponiveis() {
  db.ref("inscricoes").once("value", (snapshot) => {
    const inscricoes = snapshot.val() || {};

    const contagem = {};
    Object.values(inscricoes).forEach((inscricao) => {
      contagem[inscricao.horario] = (contagem[inscricao.horario] || 0) + 1;
    });

    selectHorario.innerHTML = "";
    for (let horario in horariosPermitidos) {
      const ocupados = contagem[horario] || 0;
      const limite = horariosPermitidos[horario];

      const option = document.createElement("option");
      option.value = horario;
      option.textContent = `${horario} (${limite - ocupados} vaga${limite - ocupados === 1 ? "" : "s"} restantes)`;
      option.disabled = ocupados >= limite;
      selectHorario.appendChild(option);
    }
  });
}

// Envio do formulário
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const setor = setorInput.value.trim();
  const horario = selectHorario.value;

  if (!nome || !setor || !horario) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const novaInscricao = db.ref("inscricoes").push();
  novaInscricao.set({ nome, setor, horario }, (error) => {
    if (error) {
      alert("Erro ao salvar. Tente novamente.");
    } else {
      alert("Inscrição realizada com sucesso!");
      form.reset();
      atualizarHorariosDisponiveis();
    }
  });
});

// Inicializa ao abrir
atualizarHorariosDisponiveis();
