const SAVE_KEY = "vidaDeAhorrosSaveV1";

const screens = {
  start: document.getElementById("startScreen"),
  creator: document.getElementById("creatorScreen"),
  game: document.getElementById("gameScreen"),
  result: document.getElementById("resultScreen")
};

let state = null;
let jobOffers = [];
let currentMiniGame = null;

const educationProfiles = {
  secundaria: { label: "Secundaria", cash: 1300, debt: 0, education: 28, skill: 24, reputation: 28 },
  tecnico: { label: "Tecnico", cash: 1050, debt: 400, education: 42, skill: 38, reputation: 34 },
  universidad: { label: "Universidad", cash: 760, debt: 1600, education: 60, skill: 48, reputation: 42 },
  posgrado: { label: "Posgrado", cash: 540, debt: 3100, education: 76, skill: 58, reputation: 50 }
};

const lifestyleProfiles = {
  ahorrador: { label: "Ahorrador", cash: 550, expenseMod: .82, happiness: -5, stress: 2, reputation: -1 },
  equilibrado: { label: "Equilibrado", cash: 260, expenseMod: 1, happiness: 2, stress: 0, reputation: 1 },
  gastador: { label: "Gastador", cash: 80, expenseMod: 1.26, happiness: 10, stress: -2, reputation: 3 }
};

const jobs = [
  { id: "cashier", title: "Cajero de minimercado", tier: "Basico", salary: 850, hours: "8 h", stress: 28, benefits: "Descuento en comida", layoffRisk: .08, growth: .05, minEducation: 0, minSkill: 0 },
  { id: "delivery", title: "Repartidor urbano", tier: "Basico", salary: 980, hours: "Flexible", stress: 35, benefits: "Propinas ocasionales", layoffRisk: .1, growth: .04, minEducation: 0, minSkill: 8 },
  { id: "assistant", title: "Asistente administrativo", tier: "Basico", salary: 1200, hours: "9 a 5", stress: 26, benefits: "Seguro parcial", layoffRisk: .07, growth: .08, minEducation: 25, minSkill: 18 },
  { id: "sales", title: "Asesor comercial", tier: "Medio", salary: 1550, hours: "9 h", stress: 42, benefits: "Comisiones", layoffRisk: .11, growth: .13, minEducation: 34, minSkill: 30 },
  { id: "technician", title: "Tecnico de soporte", tier: "Medio", salary: 1900, hours: "Turnos", stress: 38, benefits: "Cursos internos", layoffRisk: .08, growth: .16, minEducation: 43, minSkill: 42 },
  { id: "designer", title: "Disenador junior", tier: "Medio", salary: 2200, hours: "Hibrido", stress: 36, benefits: "Laptop laboral", layoffRisk: .09, growth: .18, minEducation: 48, minSkill: 50 },
  { id: "analyst", title: "Analista financiero", tier: "Avanzado", salary: 3200, hours: "Oficina", stress: 50, benefits: "Bono anual", layoffRisk: .08, growth: .19, minEducation: 61, minSkill: 58 },
  { id: "developer", title: "Desarrollador web", tier: "Avanzado", salary: 4100, hours: "Remoto", stress: 48, benefits: "Acciones ficticias", layoffRisk: .07, growth: .22, minEducation: 58, minSkill: 66 },
  { id: "manager", title: "Gerente de operaciones", tier: "Avanzado", salary: 5600, hours: "Alta demanda", stress: 66, benefits: "Seguro completo", layoffRisk: .1, growth: .2, minEducation: 72, minSkill: 70 },
  { id: "director", title: "Director de estrategia", tier: "Elite", salary: 7600, hours: "Variable", stress: 74, benefits: "Bono grande", layoffRisk: .08, growth: .16, minEducation: 84, minSkill: 82 }
];

const marketItems = [
  { id: "phone", title: "Celular confiable", price: 420, desc: "Mejora tu reputacion y acceso a oportunidades.", repeat: false, effect: { reputation: 4, happiness: 2 } },
  { id: "laptop", title: "Laptop de trabajo", price: 950, desc: "Estudiar y mejorar habilidades se vuelve mas efectivo.", repeat: false, effect: { skill: 5, education: 3 } },
  { id: "bike", title: "Bicicleta", price: 360, desc: "Reduce transporte mensual y mejora salud.", repeat: false, effect: { health: 5 } },
  { id: "car", title: "Carro usado", price: 4200, desc: "Abre trabajos lejanos, pero sube gastos de mantenimiento.", repeat: false, effect: { reputation: 6, stress: -2 } },
  { id: "insurance", title: "Seguro medico", price: 620, desc: "Reduce el impacto de emergencias medicas.", repeat: false, effect: { health: 6, stress: -4 } },
  { id: "course", title: "Curso certificado", price: 740, desc: "Sube educacion y habilidad para mejores trabajos.", repeat: true, effect: { education: 9, skill: 6, stress: 4 } },
  { id: "clothes", title: "Ropa profesional", price: 310, desc: "Mejora entrevistas y reputacion.", repeat: true, effect: { reputation: 5, happiness: 3 } },
  { id: "furniture", title: "Muebles comodos", price: 780, desc: "Aumenta felicidad y baja estres en casa.", repeat: false, effect: { happiness: 8, stress: -5 } },
  { id: "tools", title: "Herramientas para emprender", price: 1250, desc: "Aumenta ingresos secundarios.", repeat: false, effect: { skill: 5, sideIncome: 95 } },
  { id: "house", title: "Casa propia", price: 8500, desc: "Pagas entrada, recibes una hipoteca y eliminas renta.", repeat: false, financeDebt: 36000, assetValue: 45000, effect: { happiness: 12, stress: -8 } }
];

const investmentTypes = [
  { id: "savings", title: "Cuenta de ahorro", risk: "Bajo", min: 100, range: [.001, .006], desc: "Crecimiento lento, casi sin sustos." },
  { id: "stocks", title: "Bolsa ficticia", risk: "Medio", min: 250, range: [-.045, .075], desc: "Puede bajar, pero suele crecer a largo plazo." },
  { id: "business", title: "Negocio pequeno", risk: "Medio alto", min: 500, range: [-.08, .12], desc: "Sube reputacion y puede crear flujo de caja." },
  { id: "crypto", title: "Criptomoneda ficticia", risk: "Alto", min: 150, range: [-.22, .26], desc: "Muy volatil. Diversifica o sufre." },
  { id: "realestate", title: "Bienes raices", risk: "Medio", min: 1500, range: [-.025, .055], desc: "Requiere capital, pero estabiliza patrimonio." }
];

const goals = [
  { id: "save1000", title: "Ahorrar $1,000", desc: "Ten $1,000 en ahorro separado.", reward: 150, check: () => state.savings >= 1000 },
  { id: "betterjob", title: "Mejor trabajo", desc: "Consigue un empleo de salario $2,000 o mas.", reward: 250, check: () => state.job && state.job.salary >= 2000 },
  { id: "debtfree", title: "Cero deudas", desc: "Paga todas tus deudas.", reward: 300, check: () => state.debt <= 0 && state.month > 2 },
  { id: "net10k", title: "Patrimonio $10,000", desc: "Llega a $10,000 de patrimonio total.", reward: 500, check: () => calculateNetWorth() >= 10000 },
  { id: "survive24", title: "Sobrevivir 24 meses", desc: "Completa 24 meses sin caer.", reward: 1000, check: () => state.month >= 24 },
  { id: "house", title: "Casa sin deuda", desc: "Compra casa y elimina todas las deudas.", reward: 1500, check: () => owns("house") && state.debt <= 0 },
  { id: "freedom", title: "Libertad financiera", desc: "Ingresos pasivos cubren tus gastos.", reward: 2500, check: () => calculatePassiveIncome() >= calculateExpenses().total && calculateNetWorth() >= 25000 }
];

const events = [
  {
    title: "Emergencia medica",
    text: "Una visita inesperada al medico puso a prueba tu presupuesto.",
    chance: .9,
    apply() {
      const insured = owns("insurance");
      const cost = insured ? 110 : 620;
      state.cash -= cost;
      adjustStats({ health: insured ? -2 : -10, stress: insured ? 4 : 12 });
      addHistory("Evento", `Emergencia medica: -${money(cost)}${insured ? " con seguro" : ""}.`);
    }
  },
  {
    title: "Bono laboral",
    text: "Tu desempeno fue notado y recibiste un bono.",
    chance: .75,
    condition: () => !!state.job,
    apply() {
      const bonus = Math.round(state.job.salary * random(.18, .45));
      state.cash += bonus;
      adjustStats({ happiness: 6, reputation: 3 });
      addHistory("Evento", `Bono laboral: +${money(bonus)}.`);
    }
  },
  {
    title: "Aumento de renta",
    text: "El propietario subio la renta mensual.",
    chance: .7,
    condition: () => !owns("house"),
    apply() {
      state.rent += 55;
      adjustStats({ stress: 6, happiness: -3 });
      addHistory("Evento", "La renta subio $55 al mes.");
    }
  },
  {
    title: "Robo pequeno",
    text: "Perdiste dinero por descuidar tus cosas.",
    chance: .85,
    apply() {
      const loss = Math.min(state.cash, Math.round(random(80, 260)));
      state.cash -= loss;
      adjustStats({ stress: 8, happiness: -4 });
      addHistory("Evento", `Robo pequeno: -${money(loss)}.`);
    }
  },
  {
    title: "Crisis economica",
    text: "El mercado se movio feo y algunas inversiones bajaron.",
    chance: .55,
    apply() {
      state.investments.forEach(inv => {
        inv.value = Math.max(0, Math.round(inv.value * random(.88, .97)));
      });
      adjustStats({ stress: 9 });
      addHistory("Evento", "Crisis economica: tus inversiones bajaron temporalmente.");
    }
  },
  {
    title: "Oportunidad laboral",
    text: "Un conocido te aviso de nuevas ofertas de empleo.",
    chance: .8,
    apply() {
      jobOffers = generateJobOffers();
      adjustStats({ reputation: 2, happiness: 2 });
      addHistory("Evento", "Llegaron nuevas ofertas laborales.");
    }
  },
  {
    title: "Ingreso sorpresa",
    text: "Recibiste un pago que no esperabas.",
    chance: .9,
    apply() {
      const amount = Math.round(random(120, 650));
      state.cash += amount;
      adjustStats({ happiness: 5 });
      addHistory("Evento", `Ingreso sorpresa: +${money(amount)}.`);
    }
  },
  {
    title: "Reparacion del carro",
    text: "El carro pidio mantenimiento.",
    chance: .75,
    condition: () => owns("car"),
    apply() {
      const cost = Math.round(random(220, 780));
      state.cash -= cost;
      adjustStats({ stress: 8 });
      addHistory("Evento", `Reparacion del carro: -${money(cost)}.`);
    }
  },
  {
    title: "Descuento inteligente",
    text: "Encontraste una forma de bajar gastos este mes.",
    chance: .85,
    apply() {
      state.cash += 160;
      adjustStats({ happiness: 3, reputation: 1 });
      addHistory("Evento", "Descuento especial: ahorraste $160.");
    }
  },
  {
    title: "Riesgo de despido",
    text: "Tu empresa recorto personal.",
    chance: .5,
    condition: () => !!state.job,
    apply() {
      const risk = state.job.layoffRisk + state.stats.stress / 500;
      if (Math.random() < risk) {
        addHistory("Trabajo", `Perdiste tu empleo como ${state.job.title}.`);
        state.job = null;
        adjustStats({ stress: 16, happiness: -12 });
      } else {
        addHistory("Trabajo", "Sobreviviste a un recorte de personal.");
        adjustStats({ stress: 6 });
      }
    }
  }
];

const miniGames = [
  {
    title: "Presupuesto rapido",
    question: "Ganas $1,000 al mes. Cual presupuesto es mas sano?",
    options: [
      { text: "50% necesidades, 30% deseos, 20% ahorro", correct: true, reward: { education: 4, savings: 80 }, explain: "Buen balance: cubres vida, disfrutas y ahorras." },
      { text: "90% deseos y luego veo que pasa", correct: false, penalty: { stress: 8, cash: -90 }, explain: "Eso deja poca defensa ante emergencias." },
      { text: "Todo a inversiones de alto riesgo", correct: false, penalty: { stress: 5, cash: -70 }, explain: "Invertir sin liquidez puede salir caro." }
    ]
  },
  {
    title: "Necesidad o deseo",
    question: "Estas corto de dinero. Que compra es una necesidad real?",
    options: [
      { text: "Comida basica de la semana", correct: true, reward: { health: 4, education: 2 }, explain: "Primero va lo esencial." },
      { text: "Audifonos premium nuevos", correct: false, penalty: { cash: -120, happiness: 3 }, explain: "Puede esperar si el presupuesto esta apretado." },
      { text: "Cena cara para impresionar", correct: false, penalty: { cash: -160, stress: 6 }, explain: "La reputacion no deberia financiarse con deuda." }
    ]
  },
  {
    title: "Trivia financiera",
    question: "Que significa diversificar?",
    options: [
      { text: "Repartir dinero en varias opciones para reducir riesgo", correct: true, reward: { education: 5, reputation: 2 }, explain: "Exacto. No todo en una sola canasta." },
      { text: "Comprar solo lo que subio ayer", correct: false, penalty: { education: -1, cash: -60 }, explain: "Eso es perseguir ruido." },
      { text: "Pedir mas prestamos para invertir", correct: false, penalty: { debt: 140, stress: 8 }, explain: "Apalancarse sin plan aumenta peligro." }
    ]
  },
  {
    title: "Reto de ahorro",
    question: "Te sobran $300. Que opcion fortalece mas tu futuro?",
    options: [
      { text: "Guardar $200 y usar $100 para ocio", correct: true, reward: { savings: 200, happiness: 2 }, explain: "Ahorras sin castigar demasiado tu felicidad." },
      { text: "Gastar todo porque fue un mes duro", correct: false, penalty: { cash: -220, happiness: 7 }, explain: "Disfrutas hoy, pero quedas fragil." },
      { text: "Meter todo a cripto sin fondo de emergencia", correct: false, penalty: { cash: -120, stress: 7 }, explain: "Riesgo alto sin colchon." }
    ]
  },
  {
    title: "Gasto invisible",
    question: "Cual gasto conviene revisar primero?",
    options: [
      { text: "Suscripciones que no usas", correct: true, reward: { cash: 120, education: 3 }, explain: "Pequenos gastos repetidos pesan mucho." },
      { text: "Medicinas necesarias", correct: false, penalty: { health: -8, stress: 5 }, explain: "Recortar salud puede costar mas." },
      { text: "Comida basica", correct: false, penalty: { health: -6, happiness: -4 }, explain: "Hay que optimizar, no eliminar lo esencial." }
    ]
  }
];

const lifeActions = [
  {
    id: "budget",
    title: "Armar presupuesto 50/30/20",
    desc: "Reduce tus gastos del siguiente cierre mensual y mejora educacion financiera.",
    run() {
      state.buffs.expenseCut += .08;
      adjustStats({ education: 3, stress: -2 });
      addHistory("Decision", "Creaste un presupuesto. Gastos del mes reducidos.");
    }
  },
  {
    id: "save",
    title: "Ahorrar agresivamente",
    desc: "Mueve parte de tu dinero a ahorro. Buen futuro, menos diversion hoy.",
    run() {
      const amount = Math.max(80, Math.min(state.cash, Math.round(state.cash * .18)));
      state.cash -= amount;
      state.savings += amount;
      adjustStats({ happiness: -4, stress: -1 });
      addHistory("Decision", `Ahorraste ${money(amount)}.`);
    }
  },
  {
    id: "study",
    title: "Estudiar por la noche",
    desc: "Cuesta dinero y energia, pero abre mejores trabajos.",
    run() {
      const cost = owns("laptop") ? 170 : 260;
      if (!pay(cost)) return;
      adjustStats({ education: owns("laptop") ? 7 : 5, skill: 4, stress: 5 });
      addHistory("Decision", `Estudiaste y pagaste ${money(cost)}.`);
    }
  },
  {
    id: "overtime",
    title: "Trabajar horas extra",
    desc: "Ganas mas dinero, pero sube el estres y baja la salud.",
    condition: () => !!state.job,
    run() {
      const extra = Math.round(state.job.salary * .16);
      state.cash += extra;
      adjustStats({ stress: 10, health: -4, happiness: -2 });
      addHistory("Decision", `Horas extra: +${money(extra)}.`);
    }
  },
  {
    id: "friends",
    title: "Salir con amigos",
    desc: "Aumenta felicidad y reputacion, pero gasta dinero.",
    run() {
      if (!pay(120)) return;
      adjustStats({ happiness: 12, reputation: 5, stress: -3 });
      addHistory("Decision", "Saliste con amigos: -$120.");
    }
  },
  {
    id: "health",
    title: "Cuidar salud",
    desc: "Medicina preventiva: menos riesgo, menos estres.",
    run() {
      if (!pay(130)) return;
      adjustStats({ health: 14, stress: -8, happiness: 2 });
      addHistory("Decision", "Invertiste en salud: -$130.");
    }
  },
  {
    id: "skills",
    title: "Mejorar habilidades",
    desc: "Practica enfocada para crecer laboralmente.",
    run() {
      const cost = owns("laptop") ? 120 : 220;
      if (!pay(cost)) return;
      adjustStats({ skill: owns("laptop") ? 8 : 6, reputation: 2, stress: 3 });
      addHistory("Decision", `Mejoraste habilidades: -${money(cost)}.`);
    }
  },
  {
    id: "sidebusiness",
    title: "Emprender pequeno",
    desc: "Prueba un negocio de fin de semana. Puede crear ingresos pasivos.",
    run() {
      if (!pay(250)) return;
      const chance = .42 + state.stats.skill / 260 + (owns("tools") ? .14 : 0);
      if (Math.random() < chance) {
        const gain = Math.round(random(45, 130));
        state.sideIncome += gain;
        adjustStats({ reputation: 5, happiness: 5, stress: 4 });
        addHistory("Emprendimiento", `Tu negocio funciono: +${money(gain)} al mes.`);
      } else {
        adjustStats({ stress: 8, education: 2 });
        addHistory("Emprendimiento", "El intento no despego, pero aprendiste.");
      }
    }
  },
  {
    id: "debtplan",
    title: "Pagar deuda extra",
    desc: "Reduce deuda y libera tu futuro financiero.",
    condition: () => state.debt > 0,
    run() {
      const amount = Math.min(state.debt, Math.max(80, Math.round(state.cash * .28)));
      if (!pay(amount)) return;
      state.debt -= amount;
      adjustStats({ stress: -6, reputation: 2 });
      addHistory("Deuda", `Pago extra de deuda: ${money(amount)}.`);
    }
  },
  {
    id: "negotiate",
    title: "Negociar salario",
    desc: "Usa reputacion y habilidad para pedir aumento.",
    condition: () => !!state.job,
    run() {
      const chance = .22 + state.stats.reputation / 260 + state.stats.skill / 320 - state.stats.stress / 400;
      if (Math.random() < chance) {
        const raise = Math.round(state.job.salary * random(.05, .12));
        state.job.salary += raise;
        adjustStats({ happiness: 7, reputation: 3, stress: 3 });
        addHistory("Trabajo", `Negociaste aumento: +${money(raise)} mensuales.`);
      } else {
        adjustStats({ stress: 5, reputation: -1 });
        addHistory("Trabajo", "No lograste aumento esta vez.");
      }
    }
  }
];

document.getElementById("startBtn").addEventListener("click", () => showScreen("creator"));
document.getElementById("backToStartBtn").addEventListener("click", () => showScreen("start"));
document.getElementById("continueBtn").addEventListener("click", loadGame);
document.getElementById("saveBtn").addEventListener("click", saveGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("playAgainBtn").addEventListener("click", resetGame);
document.getElementById("advanceMonthBtn").addEventListener("click", advanceMonth);
document.getElementById("newJobOffersBtn").addEventListener("click", () => {
  jobOffers = generateJobOffers();
  addHistory("Trabajo", "Buscaste nuevas ofertas.");
  renderAll();
});

document.getElementById("creatorForm").addEventListener("submit", (event) => {
  event.preventDefault();
  createNewLife();
});

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action], [data-job], [data-buy], [data-invest], [data-mini]");
  if (!button || !state) return;

  if (button.dataset.action) useLifeAction(button.dataset.action);
  if (button.dataset.job) acceptJob(Number(button.dataset.job));
  if (button.dataset.buy) buyItem(button.dataset.buy);
  if (button.dataset.invest) invest(button.dataset.invest, Number(button.dataset.amount));
  if (button.dataset.mini) answerMiniGame(Number(button.dataset.mini));
});

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === tabId));
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === tabId));
}

function createNewLife() {
  const name = document.getElementById("playerName").value.trim() || "Jugador";
  const age = Number(document.getElementById("playerAge").value) || 22;
  const educationKey = document.getElementById("educationSelect").value;
  const lifestyleKey = document.getElementById("lifestyleSelect").value;
  const edu = educationProfiles[educationKey];
  const life = lifestyleProfiles[lifestyleKey];

  state = {
    name,
    age,
    month: 1,
    cash: edu.cash + life.cash,
    savings: 0,
    debt: edu.debt,
    rent: 520,
    lifestyle: lifestyleKey,
    educationKey,
    job: null,
    sideIncome: 0,
    inventory: [],
    assets: [],
    investments: [],
    completedGoals: [],
    usedActions: [],
    miniPlayed: false,
    stressStreak: 0,
    buffs: { expenseCut: 0, incomeBoost: 0 },
    stats: {
      happiness: clamp(58 + life.happiness, 0, 100),
      health: 76,
      stress: clamp(24 + life.stress, 0, 100),
      education: edu.education,
      skill: edu.skill,
      reputation: clamp(edu.reputation + life.reputation, 0, 100)
    },
    history: []
  };

  addHistory("Inicio", `${name} empezo con ${educationProfiles[educationKey].label} y estilo ${lifestyleProfiles[lifestyleKey].label}.`);
  jobOffers = generateJobOffers();
  currentMiniGame = makeMiniGame();
  showScreen("game");
  switchTab("work");
  renderAll();
  saveGame();
}

function generateJobOffers() {
  const score = state.stats.education + state.stats.skill * .55 + state.stats.reputation * .25;
  const eligible = jobs.filter(job => {
    const hasEducation = state.stats.education + 8 >= job.minEducation;
    const hasSkill = state.stats.skill + 10 >= job.minSkill;
    const tierStretch = score >= job.minEducation + job.minSkill * .55 - 10;
    return hasEducation && hasSkill && tierStretch;
  });

  const pool = eligible.length ? eligible : jobs.slice(0, 3);
  const shuffled = [...pool].sort(() => Math.random() - .5);
  return shuffled.slice(0, 3).map(job => ({ ...job, salary: Math.round(job.salary * random(.92, 1.12)) }));
}

function acceptJob(index) {
  const offer = jobOffers[index];
  if (!offer) return;

  state.job = { ...offer };
  adjustStats({ happiness: 5, stress: 3, reputation: 2 });
  addHistory("Trabajo", `Aceptaste empleo: ${offer.title} por ${money(offer.salary)} al mes.`);
  jobOffers = generateJobOffers();
  switchTab("life");
  renderAll();
  saveGame();
}

function useLifeAction(actionId) {
  const action = lifeActions.find(item => item.id === actionId);
  if (!action || state.usedActions.includes(actionId)) return;
  if (action.condition && !action.condition()) return;

  action.run();
  state.usedActions.push(actionId);
  checkGoals();
  if (checkEndConditions()) return;
  renderAll();
  saveGame();
}

function buyItem(itemId) {
  const item = marketItems.find(entry => entry.id === itemId);
  if (!item) return;
  if (!item.repeat && owns(item.id)) return;
  if (!pay(item.price)) return;

  if (!item.repeat) {
    state.inventory.push(item.id);
  }

  if (item.financeDebt) {
    state.debt += item.financeDebt;
  }

  if (item.assetValue) {
    state.assets.push({ id: item.id, title: item.title, value: item.assetValue });
  }

  applyMarketEffect(item.effect || {});
  addHistory("Mercado", `Compraste ${item.title} por ${money(item.price)}.`);
  checkGoals();
  renderAll();
  saveGame();
}

function invest(typeId, amount) {
  const type = investmentTypes.find(item => item.id === typeId);
  if (!type || amount < type.min) return;
  if (!pay(amount)) return;

  let holding = state.investments.find(inv => inv.type === typeId);
  if (!holding) {
    holding = { type: typeId, value: 0, invested: 0 };
    state.investments.push(holding);
  }

  holding.value += amount;
  holding.invested += amount;

  if (typeId === "business") {
    adjustStats({ reputation: 2, stress: 2 });
  }

  addHistory("Inversion", `Invertiste ${money(amount)} en ${type.title}.`);
  renderAll();
  saveGame();
}

function answerMiniGame(index) {
  if (!currentMiniGame || state.miniPlayed) return;
  const option = currentMiniGame.options[index];
  if (!option) return;

  const resultBox = document.createElement("div");
  resultBox.className = "mini-result";

  if (option.correct) {
    applyMiniReward(option.reward || {});
    resultBox.textContent = `Correcto. ${option.explain}`;
    addHistory("Minijuego", `Ganaste el reto: ${currentMiniGame.title}.`);
  } else {
    applyMiniPenalty(option.penalty || {});
    resultBox.textContent = `Casi. ${option.explain}`;
    addHistory("Minijuego", `Fallaste el reto: ${currentMiniGame.title}.`);
  }

  state.miniPlayed = true;
  checkGoals();
  if (checkEndConditions()) return;
  renderMiniGame(resultBox.outerHTML);
  renderSidebar();
  renderMoney();
  saveGame();
}

function advanceMonth() {
  if (!state) return;

  const income = calculateIncome();
  const expenses = calculateExpenses();
  const investmentSummary = updateInvestments();

  state.cash += income.total;
  state.cash -= expenses.total;

  if (state.debt > 0) {
    const interest = Math.round(state.debt * .012);
    state.debt += interest;
    const payment = Math.min(state.debt, expenses.debtPayment);
    state.debt -= payment;
  }

  state.month += 1;
  if (state.month % 12 === 1 && state.month > 1) {
    state.age += 1;
  }

  adjustStats({
    happiness: state.cash > 1000 ? 1 : -3,
    health: -1,
    stress: state.job ? Math.round(state.job.stress / 14) : 5,
    education: .5
  });

  maybePromote();
  const event = triggerRandomEvent();

  state.usedActions = [];
  state.miniPlayed = false;
  state.buffs = { expenseCut: 0, incomeBoost: 0 };
  currentMiniGame = makeMiniGame();

  addHistory(
    "Mes",
    `Mes ${state.month - 1}: ingresos ${money(income.total)}, gastos ${money(expenses.total)}, inversiones ${investmentSummary}.`
  );

  if (event) {
    document.getElementById("eventText").textContent = `${event.title}: ${event.text}`;
  }

  checkGoals();
  if (checkEndConditions()) return;
  renderAll();
  saveGame();
}

function calculateIncome() {
  const salary = state.job ? state.job.salary : 0;
  const side = state.sideIncome;
  const boost = Math.round((salary + side) * state.buffs.incomeBoost);
  return { salary, side, boost, total: salary + side + boost };
}

function calculateExpenses() {
  const lifestyle = lifestyleProfiles[state.lifestyle];
  const rent = owns("house") ? 0 : state.rent;
  const food = 285;
  const lifestyleCost = state.lifestyle === "ahorrador" ? 125 : state.lifestyle === "gastador" ? 390 : 220;
  const transport = owns("car") ? 230 : owns("bike") ? 32 : 86;
  const insurance = owns("insurance") ? 85 : 0;
  const houseCare = owns("house") ? 180 : 0;
  const debtPayment = state.debt > 0 ? Math.max(60, Math.round(state.debt * .035)) : 0;
  const raw = rent + food + lifestyleCost + transport + insurance + houseCare + debtPayment;
  const discount = Math.min(.22, state.buffs.expenseCut);
  const total = Math.round(raw * lifestyle.expenseMod * (1 - discount));

  return { rent, food, lifestyleCost, transport, insurance, houseCare, debtPayment, total };
}

function calculateNetWorth() {
  const assetValue = state.assets.reduce((sum, item) => sum + item.value, 0);
  const investments = state.investments.reduce((sum, inv) => sum + inv.value, 0);
  return Math.round(state.cash + state.savings + assetValue + investments - state.debt);
}

function calculatePassiveIncome() {
  const investmentBase = state.investments.reduce((sum, inv) => {
    const type = investmentTypes.find(item => item.id === inv.type);
    const average = type ? (type.range[0] + type.range[1]) / 2 : 0;
    return sum + Math.max(0, inv.value * average);
  }, 0);

  return Math.round(state.sideIncome + investmentBase);
}

function updateInvestments() {
  if (!state.investments.length) return "sin cambios";

  let totalChange = 0;
  state.investments.forEach(inv => {
    const type = investmentTypes.find(item => item.id === inv.type);
    if (!type) return;
    const educationBonus = state.stats.education > 70 && type.id !== "crypto" ? .006 : 0;
    const rate = random(type.range[0], type.range[1]) + educationBonus;
    const before = inv.value;
    inv.value = Math.max(0, Math.round(inv.value * (1 + rate)));
    totalChange += inv.value - before;

    if (type.id === "business" && Math.random() < .16) {
      const extra = Math.round(random(20, 75));
      state.sideIncome += extra;
      addHistory("Inversion", `Tu negocio aumento ingresos pasivos en ${money(extra)}.`);
    }
  });

  return `${totalChange >= 0 ? "+" : ""}${money(totalChange)}`;
}

function triggerRandomEvent() {
  const possible = events.filter(event => (!event.condition || event.condition()) && Math.random() < event.chance);
  if (!possible.length) return null;

  const event = possible[Math.floor(Math.random() * possible.length)];
  event.apply();
  return event;
}

function maybePromote() {
  if (!state.job) return;

  const chance = state.job.growth + state.stats.skill / 650 + state.stats.reputation / 850 - state.stats.stress / 900;
  if (Math.random() < chance) {
    const raise = Math.round(state.job.salary * random(.04, .1));
    state.job.salary += raise;
    adjustStats({ happiness: 5, reputation: 4, stress: 2 });
    addHistory("Trabajo", `Creciste en tu empleo: +${money(raise)} mensuales.`);
  }

  if (Math.random() < state.job.layoffRisk / 5) {
    addHistory("Trabajo", "Tu empleo se siente inestable este mes.");
    adjustStats({ stress: 5 });
  }
}

function checkGoals() {
  goals.forEach(goal => {
    if (state.completedGoals.includes(goal.id)) return;
    if (goal.check()) {
      state.completedGoals.push(goal.id);
      state.cash += goal.reward;
      adjustStats({ happiness: 6, reputation: 5, stress: -4 });
      addHistory("Meta", `${goal.title} completada. Recompensa: ${money(goal.reward)}.`);
    }
  });
}

function checkEndConditions() {
  if (!state) return false;

  if (state.stats.stress >= 95) state.stressStreak += 1;
  else state.stressStreak = 0;

  if (state.cash < 0) {
    endGame(false, "Te quedaste sin dinero. En Vida de Ahorros, el flujo de caja manda.");
    return true;
  }

  if (state.stats.health <= 0) {
    endGame(false, "Tu salud llego a cero. La vida financiera tambien necesita energia.");
    return true;
  }

  if (state.stressStreak >= 3) {
    endGame(false, "El estres estuvo al maximo por demasiados meses.");
    return true;
  }

  if (state.debt > 30000 && calculateNetWorth() < 0) {
    endGame(false, "La deuda crecio demasiado y tu patrimonio quedo negativo.");
    return true;
  }

  if (calculateNetWorth() >= 50000) {
    endGame(true, "Alcanzaste un patrimonio alto y tu vida financiera quedo solida.");
    return true;
  }

  if (owns("house") && state.debt <= 0) {
    endGame(true, "Compraste casa y eliminaste tus deudas. Eso es una victoria enorme.");
    return true;
  }

  if (state.month >= 24 && calculateNetWorth() >= 10000 && state.stats.health > 35) {
    endGame(true, "Sobreviviste 24 meses con buen patrimonio y salud suficiente.");
    return true;
  }

  if (calculatePassiveIncome() >= calculateExpenses().total && calculateNetWorth() >= 25000) {
    endGame(true, "Tus ingresos pasivos cubren tus gastos. Lograste libertad financiera.");
    return true;
  }

  return false;
}

function endGame(won, text) {
  state.finished = true;
  const resultTitle = document.getElementById("resultTitle");
  const resultLabel = document.getElementById("resultLabel");
  const resultText = document.getElementById("resultText");
  const resultStats = document.getElementById("resultStats");

  resultLabel.textContent = won ? "victoria" : "derrota";
  resultTitle.textContent = won ? "Vida financiera lograda" : "Partida terminada";
  resultText.textContent = text;
  resultStats.innerHTML = `
    <span>Mes ${state.month}</span>
    <span>${money(calculateNetWorth())} patrimonio</span>
    <span>${money(state.cash)} dinero</span>
    <span>${money(state.debt)} deuda</span>
  `;

  localStorage.removeItem(SAVE_KEY);
  showScreen("result");
}

function renderAll() {
  if (!state) return;
  renderHeader();
  renderMoney();
  renderSidebar();
  renderLife();
  renderJobs();
  renderMarket();
  renderInvestments();
  renderMiniGame();
  renderHistory();
  updateContinueButton();
}

function renderHeader() {
  document.getElementById("lifeSubtitle").textContent = `mes ${state.month} · edad ${state.age}`;
  document.getElementById("playerTitle").textContent = `${state.name}, ${educationProfiles[state.educationKey].label}`;
  document.getElementById("playerNameLabel").textContent = state.name;
  document.getElementById("avatarInitial").textContent = state.name[0].toUpperCase();
  document.getElementById("jobBadge").textContent = state.job ? state.job.title : "Sin trabajo";
}

function renderMoney() {
  const income = calculateIncome();
  const expenses = calculateExpenses();
  const netWorth = calculateNetWorth();

  document.getElementById("cashValue").textContent = money(state.cash);
  document.getElementById("incomeValue").textContent = money(income.total);
  document.getElementById("expensesValue").textContent = money(expenses.total);
  document.getElementById("debtValue").textContent = money(state.debt);
  document.getElementById("netWorthValue").textContent = money(netWorth);
  document.getElementById("monthBadge").textContent = `Mes ${state.month}`;
  document.getElementById("debtHint").textContent = state.debt > 8000 ? "alta" : state.debt > 0 ? "activa" : "sin deuda";
}

function renderSidebar() {
  const stats = [
    ["Felicidad", "happiness", false],
    ["Salud", "health", false],
    ["Estres", "stress", true],
    ["Educacion", "education", false],
    ["Habilidad", "skill", false],
    ["Reputacion", "reputation", false],
    ["Ahorro", "savings", false],
    ["Deuda", "debt", true]
  ];

  document.getElementById("statBars").innerHTML = stats.map(([label, key, inverse]) => {
    const value = key === "savings"
      ? Math.min(100, state.savings / 20)
      : key === "debt"
        ? Math.min(100, state.debt / 180)
        : state.stats[key];
    const danger = inverse ? value > 70 : value < 30;
    const warn = inverse ? value > 45 : value < 55;
    return `
      <div class="stat-row">
        <div class="stat-label"><span>${label}</span><span>${Math.round(value)}%</span></div>
        <div class="bar-track">
          <div class="bar-fill ${danger ? "danger" : warn ? "warn" : ""}" style="width:${clamp(value, 0, 100)}%"></div>
        </div>
      </div>
    `;
  }).join("");

  const tiles = ["Pago", "Evento", "Trabajo", "Ahorro", "Mercado", "Estudio", "Salud", "Amigos", "Inversion", "Deuda", "Meta", "Cierre"];
  const active = (state.month - 1) % tiles.length;
  document.getElementById("lifeBoard").innerHTML = tiles.map((tile, index) => `
    <div class="board-tile ${index === active ? "active" : ""}">${tile}</div>
  `).join("");

  document.getElementById("goalsList").innerHTML = goals.map(goal => {
    const done = state.completedGoals.includes(goal.id);
    return `
      <div class="goal-item ${done ? "done" : ""}">
        <strong>${done ? "OK " : ""}${goal.title}</strong>
        <small>${goal.desc}${done ? " · completada" : ""}</small>
      </div>
    `;
  }).join("");
}

function renderLife() {
  document.getElementById("monthTitle").textContent = `Mes ${state.month}: decisiones de vida`;
  if (!document.getElementById("eventText").textContent.trim()) {
    document.getElementById("eventText").textContent = "Toma decisiones y avanza al siguiente mes.";
  }

  document.getElementById("actionList").innerHTML = lifeActions
    .filter(action => !action.condition || action.condition())
    .map(action => {
      const used = state.usedActions.includes(action.id);
      return `
        <article class="game-card">
          <div>
            <h4>${action.title}</h4>
            <p>${action.desc}</p>
            <div class="tag-row">
              <span class="tag">${used ? "usada este mes" : "decision mensual"}</span>
            </div>
          </div>
          <div class="card-actions">
            <button data-action="${action.id}" ${used ? "disabled" : ""}>Elegir</button>
          </div>
        </article>
      `;
    }).join("");
}

function renderJobs() {
  if (!jobOffers.length) jobOffers = generateJobOffers();

  document.getElementById("jobOffers").innerHTML = jobOffers.map((job, index) => `
    <article class="game-card">
      <div>
        <h4>${job.title}</h4>
        <p>${job.tier} · ${job.hours} · Beneficio: ${job.benefits}</p>
        <div class="tag-row">
          <span class="tag">Salario ${money(job.salary)}</span>
          <span class="tag">Estres ${job.stress}/100</span>
          <span class="tag">Despido ${Math.round(job.layoffRisk * 100)}%</span>
          <span class="tag">Crecimiento ${Math.round(job.growth * 100)}%</span>
        </div>
      </div>
      <div class="card-actions">
        <button data-job="${index}">Aceptar</button>
      </div>
    </article>
  `).join("");
}

function renderMarket() {
  document.getElementById("marketItems").innerHTML = marketItems.map(item => {
    const owned = owns(item.id);
    const totalPrice = item.financeDebt ? `${money(item.price)} entrada + ${money(item.financeDebt)} deuda` : money(item.price);
    return `
      <article class="game-card">
        <div>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <div class="tag-row">
            <span class="tag">${totalPrice}</span>
            <span class="tag">${owned && !item.repeat ? "comprado" : item.repeat ? "repetible" : "unico"}</span>
          </div>
        </div>
        <div class="card-actions">
          <button data-buy="${item.id}" ${owned && !item.repeat ? "disabled" : ""}>Comprar</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderInvestments() {
  document.getElementById("investmentItems").innerHTML = investmentTypes.map(type => {
    const amounts = [type.min, type.min * 3, type.min * 8];
    return `
      <article class="game-card">
        <div>
          <h4>${type.title}</h4>
          <p>${type.desc}</p>
          <div class="tag-row">
            <span class="tag">Riesgo ${type.risk}</span>
            <span class="tag">Min ${money(type.min)}</span>
            <span class="tag">${Math.round(type.range[0] * 100)}% a ${Math.round(type.range[1] * 100)}% mensual</span>
          </div>
        </div>
        <div class="card-actions">
          ${amounts.map(amount => `<button data-invest="${type.id}" data-amount="${amount}">${money(amount)}</button>`).join("")}
        </div>
      </article>
    `;
  }).join("");

  document.getElementById("portfolioList").innerHTML = state.investments.length
    ? state.investments.map(inv => {
      const type = investmentTypes.find(item => item.id === inv.type);
      const profit = inv.value - inv.invested;
      return `
        <div class="portfolio-item">
          <strong>${type ? type.title : inv.type}: ${money(inv.value)}</strong>
          <small>Invertido ${money(inv.invested)} · resultado ${profit >= 0 ? "+" : ""}${money(profit)}</small>
        </div>
      `;
    }).join("")
    : `<div class="portfolio-item"><strong>Sin inversiones</strong><small>Empieza con poco y aprende el riesgo.</small></div>`;
}

function renderMiniGame(extraHtml = "") {
  if (!currentMiniGame) currentMiniGame = makeMiniGame();
  const disabled = state && state.miniPlayed;
  document.getElementById("miniGameCard").innerHTML = `
    <p class="eyebrow">reto financiero del mes</p>
    <h3>${currentMiniGame.title}</h3>
    <p>${currentMiniGame.question}</p>
    <div class="mini-options">
      ${currentMiniGame.options.map((option, index) => `
        <button data-mini="${index}" ${disabled ? "disabled" : ""}>${option.text}</button>
      `).join("")}
    </div>
    ${extraHtml || (disabled ? `<div class="mini-result">Ya jugaste el reto de este mes. Avanza un mes para desbloquear otro.</div>` : "")}
  `;
}

function renderHistory() {
  const inventoryHtml = state.inventory.length || state.assets.length || state.savings > 0
    ? [
      state.savings > 0 ? `<div class="asset-item"><strong>Ahorro separado: ${money(state.savings)}</strong><small>Fondo para metas y emergencias.</small></div>` : "",
      ...state.inventory.map(id => {
        const item = marketItems.find(entry => entry.id === id);
        return `<div class="asset-item"><strong>${item ? item.title : id}</strong><small>Compra activa en tu vida.</small></div>`;
      }),
      ...state.assets.map(asset => `<div class="asset-item"><strong>${asset.title}: ${money(asset.value)}</strong><small>Activo incluido en patrimonio.</small></div>`)
    ].join("")
    : `<div class="asset-item"><strong>Sin activos</strong><small>Compra herramientas o invierte para crecer.</small></div>`;

  document.getElementById("assetList").innerHTML = inventoryHtml;
  document.getElementById("historyList").innerHTML = state.history.slice(0, 26).map(item => `
    <div class="history-item">
      <strong>${item.type}</strong>
      <small>Mes ${item.month}: ${item.text}</small>
    </div>
  `).join("");
}

function makeMiniGame() {
  const game = miniGames[Math.floor(Math.random() * miniGames.length)];
  return {
    ...game,
    options: [...game.options].sort(() => Math.random() - .5)
  };
}

function applyMiniReward(reward) {
  if (reward.cash) state.cash += reward.cash;
  if (reward.savings) state.savings += reward.savings;
  if (reward.debt) state.debt += reward.debt;
  adjustStats(reward);
}

function applyMiniPenalty(penalty) {
  if (penalty.cash) state.cash += penalty.cash;
  if (penalty.debt) state.debt += penalty.debt;
  adjustStats(penalty);
  checkEndConditions();
}

function applyMarketEffect(effect) {
  if (effect.sideIncome) state.sideIncome += effect.sideIncome;
  adjustStats(effect);
}

function adjustStats(changes) {
  Object.entries(changes).forEach(([key, value]) => {
    if (["cash", "savings", "debt", "sideIncome"].includes(key)) return;
    if (state.stats[key] === undefined) return;
    state.stats[key] = clamp(state.stats[key] + value, 0, 100);
  });
}

function pay(amount) {
  if (amount <= 0) return true;
  if (state.cash < amount) {
    addHistory("Alerta", `No tienes suficiente dinero para pagar ${money(amount)}.`);
    return false;
  }
  state.cash -= amount;
  return true;
}

function owns(itemId) {
  return state && state.inventory.includes(itemId);
}

function addHistory(type, text) {
  if (!state) return;
  state.history.unshift({ month: state.month, type, text });
  state.history = state.history.slice(0, 80);
}

function saveGame() {
  if (!state) return;
  const payload = { state, jobOffers, currentMiniGame };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  updateContinueButton();
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;

  try {
    const payload = JSON.parse(raw);
    state = payload.state;
    jobOffers = payload.jobOffers || generateJobOffers();
    currentMiniGame = payload.currentMiniGame || makeMiniGame();
    showScreen("game");
    switchTab("life");
    renderAll();
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    updateContinueButton();
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state = null;
  jobOffers = [];
  currentMiniGame = null;
  document.getElementById("creatorForm").reset();
  document.getElementById("eventText").textContent = "Toma decisiones y avanza al siguiente mes.";
  updateContinueButton();
  showScreen("start");
}

function updateContinueButton() {
  document.getElementById("continueBtn").disabled = !localStorage.getItem(SAVE_KEY);
}

function money(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

updateContinueButton();
