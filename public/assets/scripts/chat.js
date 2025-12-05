// T17 - Lucero Pipa: Chat con plantillas y puntos de encuentro
const STORAGE_KEY = "minka-chat-thread";

const threads = [
  {
    id: "th-001",
    user: "Lucía P.",
    item: "Bicicleta urbana vintage",
    location: "Miraflores",
    rating: 4.8,
    distanceKm: 4,
    muted: false,
    messages: [
      { from: "them", text: "¡Hola! ¿Sigue disponible?", time: "09:10" },
      { from: "me", text: "Sí, sigue disponible.", time: "09:11" },
    ],
  },
  {
    id: "th-002",
    user: "Carlos R.",
    item: "Mesa de centro reciclada",
    location: "Barranco",
    rating: 4.2,
    distanceKm: 6,
    muted: false,
    messages: [
      { from: "them", text: "¿Podemos vernos sábado?", time: "10:05" },
    ],
  },
];

const templates = [
  "¿En qué distrito estás?",
  "Propongo vernos el sábado a las 10am",
  "Confirmado, nos vemos ahí",
  "Lo siento, debo cancelar el encuentro",
];

const meetingPoints = [
  "Parque Kennedy, Miraflores",
  "Estación Metropolitano Benavides",
  "Plaza Barranco",
  "CC Larcomar (zona pública)",
];

const els = {
  list: document.getElementById("thread-list"),
  messages: document.getElementById("messages"),
  templateList: document.getElementById("template-list"),
  meetingList: document.getElementById("meeting-list"),
  composer: document.getElementById("composer"),
  composerInput: document.getElementById("composer-input"),
  convItem: document.getElementById("conv-item"),
  convUser: document.getElementById("conv-user"),
  convMeta: document.getElementById("conv-meta"),
  btnMute: document.getElementById("btn-mute"),
  btnReport: document.getElementById("btn-report"),
  btnRate: document.getElementById("btn-rate"),
};
