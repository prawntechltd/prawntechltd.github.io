// Word Roller
// Edit these lists to change the words that can come up.
const WORDS = {
  proper: ["Marie Curie","Paris","the Thames","Mount Everest","Sherlock Holmes","Tokyo","Cleopatra","the Sahara","Isaac Newton","Venus","Amelia Earhart","Wales","the Titanic","Leonardo da Vinci","Brazil","Big Ben","Jupiter","Queen Victoria","Lake Como","Mozart","Antarctica","Frida Kahlo","Edinburgh","the Amazon","Charles Darwin","Mars","Ada Lovelace","Venice","Beethoven","Iceland","Florence Nightingale","the Nile","Neptune","Shakespeare","Cairo","Rosa Parks","Stonehenge","Einstein","Canada","Boudicca"],
  verb: ["juggle","polish","borrow","paint","chase","whisper to","build","hide","tickle","launch","bake","inspect","carry","balance","rescue","sketch","wrap","shrink","decorate","follow","measure","toss","guard","stretch","collect","fix","squeeze","flip","deliver","sniff","catch","wash","teach","hug","fetch","crush","study","push","rattle","hatch"],
  adjective: ["velvety","enormous","sticky","ancient","sparkling","grumpy","wobbly","invisible","fluffy","rusty","gigantic","delicate","mysterious","soggy","golden","prickly","noisy","elegant","frozen","tiny","squeaky","bright orange","enchanted","crumpled","slimy","magnificent","lopsided","ordinary","musty","glittering","heavy","itchy","polka-dot","silent","upside-down","clumsy","transparent","wrinkly","electric","ice-cold"],
  object: ["teapot","umbrella","trumpet","pineapple","suitcase","telescope","sandwich","lighthouse","bicycle","kettle","wardrobe","parrot","saucepan","lantern","typewriter","cactus","treasure map","rubber duck","accordion","snow globe","wheelbarrow","hot-air balloon","sock","violin","crown","compass","pumpkin","envelope","toaster","feather","armchair","jellyfish","clock","doughnut","skateboard","kite","volcano","hat","microscope","igloo"]
};

const SLOTS = [
  { key: "proper",    pos: "Proper noun", q: "Who?" },
  { key: "verb",      pos: "Verb",        q: "Doing what?" },
  { key: "adjective", pos: "Adjective",   q: "Describing" },
  { key: "object",    pos: "Object",      q: "What?" }
];

const HISTORY_LENGTH = 8;

const state = { proper: "", verb: "", adjective: "", object: "" };
const locked = { proper: false, verb: false, adjective: false, object: false };
const history = [];

// Pick a random word, avoiding the one currently showing
function pick(key) {
  const list = WORDS[key];
  let w;
  do {
    w = list[Math.floor(Math.random() * list.length)];
  } while (list.length > 1 && w === state[key]);
  return w;
}

// Build the four tiles
const tilesEl = document.getElementById("tiles");
tilesEl.innerHTML = SLOTS.map(s => `
  <article class="tile" data-slot="${s.key}" id="tile-${s.key}">
    <div class="label"><span class="pos">${s.pos}</span><span class="q">${s.q}</span></div>
    <div class="word" id="word-${s.key}"></div>
    <div class="actions">
      <button class="mini" type="button" data-reroll="${s.key}">Reroll</button>
      <button class="mini" type="button" data-lock="${s.key}" aria-pressed="false">Lock</button>
    </div>
  </article>`).join("");

function renderWord(key) {
  const el = document.getElementById("word-" + key);
  el.textContent = state[key];
  el.classList.remove("pop");
  void el.offsetWidth; // restart the animation
  el.classList.add("pop");
}

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    list.appendChild(li);
  });
}

function record() {
  history.unshift([state.proper, state.verb, state.adjective, state.object].join("  ·  "));
  if (history.length > HISTORY_LENGTH) history.pop();
  renderHistory();
}

function rollAll() {
  SLOTS.forEach(({ key }) => {
    if (!locked[key]) {
      state[key] = pick(key);
      renderWord(key);
    }
  });
  record();
}

function reroll(key) {
  state[key] = pick(key);
  renderWord(key);
  record();
}

function toggleLock(button) {
  const key = button.dataset.lock;
  locked[key] = !locked[key];
  button.setAttribute("aria-pressed", String(locked[key]));
  button.textContent = locked[key] ? "Locked" : "Lock";
  document.getElementById("tile-" + key).classList.toggle("locked", locked[key]);
}

tilesEl.addEventListener("click", e => {
  const r = e.target.closest("[data-reroll]");
  if (r) return reroll(r.dataset.reroll);
  const l = e.target.closest("[data-lock]");
  if (l) toggleLock(l);
});

document.getElementById("roll").addEventListener("click", rollAll);

// Space bar rolls all (unless the visitor is typing or on a button)
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !e.target.closest("button, input, textarea, select")) {
    e.preventDefault();
    rollAll();
  }
});

rollAll();
