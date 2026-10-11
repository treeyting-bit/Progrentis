const lista = document.getElementById("lista");

async function mostrar() {
  const { personalizados = [] } = await chrome.storage.sync.get("personalizados");
  lista.innerHTML = "";
  for (const d of personalizados) {
    const li = document.createElement("li");
    li.textContent = d + " ";
    const quitar = document.createElement("button");
    quitar.textContent = "Quitar";
    quitar.onclick = async () => {
      if (!confirm("¿Seguro que quieres desbloquear " + d + "?")) return;
      await chrome.storage.sync.set({ personalizados: personalizados.filter((x) => x !== d) });
      mostrar();
    };
    li.appendChild(quitar);
    lista.appendChild(li);
  }
}

document.getElementById("form").onsubmit = async (e) => {
  e.preventDefault();
  const entrada = document.getElementById("dominio");
  let d = entrada.value.trim().toLowerCase();
  try { d = new URL(d.includes("://") ? d : "https://" + d).hostname; } catch { return; }
  d = d.replace(/^www\./, "");
  const { personalizados = [] } = await chrome.storage.sync.get("personalizados");
  if (!personalizados.includes(d)) personalizados.push(d);
  await chrome.storage.sync.set({ personalizados });
  entrada.value = "";
  mostrar();
};

mostrar();
