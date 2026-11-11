const flowDetails = {
  vendor: "Proveedor · reportado: el contacto fue validado con el número registrado y comunicó que recibió una alerta de sesión. Sus registros técnicos y la actividad real de esa cuenta todavía no están disponibles.",
  mailbox: "Buzón AP · verificado: la auditoría de correo registra una regla de reenvío externa a las 08:56. Falta determinar qué mensajes procesó, quién la creó y si hubo accesos o envíos.",
  thread: "Hilo de factura · por investigar: existe una solicitud de cambio de cuenta bancaria. Verifica cabeceras, remitente real, historial del hilo y cualquier modificación hecha en el ERP.",
  payments: "ERP / tesorería · verificado: hay dos instrucciones de pago pendientes y ninguna está aprobada ni liberada. El cambio de cuenta solicitado no aparece guardado.",
  extortion: "Correo de extorsión · verificado que el mensaje llegó; no verificado que los archivos se hayan copiado. Conserva el mensaje y analiza la afirmación sin abrir enlaces ni adjuntos en el entorno de producción."
};

document.querySelectorAll(".flow-node").forEach(node => {
  node.addEventListener("click", () => {
    const detail = document.querySelector("#flow-detail");
    detail.textContent = flowDetails[node.dataset.node];
    document.querySelectorAll(".flow-node").forEach(n => n.classList.remove("selected"));
    node.classList.add("selected");
  });
});

const timelineData = [
  {title:"0–10 min · Abrir registro, nombrar líder y canal común", body:"Recibe el aviso, asigna un número de caso, nombra a quien coordina y acuerda un canal seguro. Anota horas y fuentes; usa lenguaje provisional. No atribuyas el caso ni confirmes exfiltración todavía.", owner:"Líder de incidente + mesa de servicio / SOC"},
  {title:"10–20 min · Confirmar alcance y proteger pagos sensibles", body:"Correlaciona la auditoría del buzón con identidad y ERP. Pide a Tesorería, por el mecanismo autorizado, que pause las dos instrucciones pendientes mientras valida el cambio por un contacto ya registrado. Confirma estado de canales y cuentas.", owner:"SOC / TI + Tesorería + dueño de proceso"},
  {title:"20–35 min · Contener con autorización y preservar evidencia", body:"Preserva registros de identidad, correo y ERP; guarda el correo original y sus cabeceras. Si la evidencia lo justifica, revoca sesiones o tokens y elimina la regla externa después de conservar los datos necesarios. Aísla un endpoint solo si está implicado y existe autorización.", owner:"Seguridad / respuesta técnica + aprobador de negocio"},
  {title:"35–50 min · Evaluar datos, servicios y terceros", body:"Determina qué mensajes se reenviaron, si hubo lectura o salida, qué categorías de datos pueden estar implicadas, si cambiaron beneficiarios y si los pagos se liberaron. Coordina con el proveedor; distingue hallazgos de la afirmación extorsiva.", owner:"Seguridad + dueño de datos + proveedor + Legal/Privacidad"},
  {title:"50–60 min · Escalar, comunicar y fijar la próxima actualización", body:"Resume confirmado / reportado / desconocido. Escala a las áreas internas y responsables que correspondan; Legal/Privacidad evalúan obligaciones y canales aplicables. Define responsable, audiencia y hora de la siguiente actualización.", owner:"Líder de incidente + Legal/Privacidad + Comunicaciones"}
];
const timeDetail = document.querySelector("#time-detail");
function showTime(index) {
  document.querySelectorAll(".time-tab").forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
    tab.setAttribute("aria-selected", i === index ? "true" : "false");
  });
  const item = timelineData[index];
  timeDetail.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p><div class="time-owner"><b>Responsables sugeridos:</b> ${item.owner}</div>`;
}
document.querySelectorAll(".time-tab").forEach(tab => tab.addEventListener("click", () => showTime(Number(tab.dataset.time))));
showTime(0);

const fields = [
  {
    key:"what", title:"Qué ocurrió / hora", time:"0–10 min · apertura del registro", mode:"single",
    question:"¿Qué resumen inicial conserva la cronología y evita afirmar hechos aún no probados?",
    options:[
      {id:"premature", label:"Declarar ransomware y robo de datos confirmado", text:"A las 09:15 se confirma ransomware en el core y exfiltración de datos de socios; el proveedor fue el vector inicial.", correct:false},
      {id:"balanced", label:"Registrar hechos con hora y estado", text:"09:04: proveedor informa, tras validación por contacto registrado, que recibió una alerta de sesión; faltan sus logs. 09:08: llega solicitud de cambio bancario y el ERP muestra dos pagos pendientes sin aprobar ni liberar. 09:11: se recibe correo de extorsión que afirma copia de estados de cuenta; la afirmación no está verificada. 09:15: auditoría propia muestra regla externa en buzón AP creada a las 08:56; canales digitales siguen disponibles. Relación entre señales en investigación.", correct:true},
      {id:"dismiss", label:"Cerrar como correo sospechoso sin impacto", text:"El proveedor informó una alerta, pero no hay incidente. Se descarta el mensaje de extorsión y se mantiene el flujo normal de pagos.", correct:false}
    ],
    correctText:"09:04: proveedor informa, tras validación por contacto registrado, que recibió una alerta de sesión; faltan sus logs. 09:08: llega solicitud de cambio bancario y el ERP muestra dos pagos pendientes sin aprobar ni liberar. 09:11: se recibe correo de extorsión que afirma copia de estados de cuenta; la afirmación no está verificada. 09:15: auditoría propia muestra regla externa en buzón AP creada a las 08:56; canales digitales siguen disponibles. Relación entre señales en investigación.",
    feedback:"La auditoría propia confirma una acción no autorizada en el buzón y el ERP confirma pagos pendientes. El correo prueba que existe una amenaza, no que se haya producido una exfiltración. La llamada del proveedor es un reporte independiente, no reemplaza sus logs.",
    next:"Mantén separadas las marcas de tiempo del evento y la hora en que fue descubierto."
  },
  {
    key:"scope", title:"Servicio, activo y usuario", time:"0–10 min · delimitar el primer alcance", mode:"single",
    question:"¿Qué activos y procesos deben quedar en la ficha inicial sin declarar afectados servicios que siguen operativos?",
    options:[
      {id:"allcore", label:"Todos los sistemas y todos los socios", text:"Core bancario, banca digital, base de clientes y todos los pagos están comprometidos.", correct:false},
      {id:"scope", label:"Activos confirmados + alcance pendiente", text:"Correo corporativo: buzón del usuario de Cuentas por Pagar con regla externa. Proceso ERP/Tesorería: dos instrucciones a Suministros Sierra S.A. pendientes. Proveedor: buzón externo bajo revisión, aún sin registros técnicos. Canales digitales y sistema transaccional: operativos según el centro de operaciones; seguir monitorizando.", correct:true},
      {id:"vendoronly", label:"Solo el buzón del proveedor", text:"La cooperativa no tiene activos implicados; basta registrar el incidente del proveedor.", correct:false}
    ],
    correctText:"Activos confirmados: buzón corporativo del usuario de Cuentas por Pagar con regla externa; proceso ERP/Tesorería con dos pagos pendientes a Suministros Sierra S.A. En evaluación: buzón del proveedor, identidades y mensajes relacionados. Canales digitales y sistema transaccional aparecen operativos según el centro de operaciones.",
    feedback:"El ámbito inicial incluye lo observado en sistemas propios y separa el proveedor como tercero bajo investigación. La disponibilidad actual de canales no descarta riesgo de confidencialidad ni fraude financiero.",
    next:"Asigna un propietario de negocio a cada activo y servicio; deja claro quién validó su estado."
  },
  {
    key:"signals", title:"Señales verificadas", time:"10–20 min · corroborar fuentes", mode:"multi",
    question:"Selecciona solo hechos que puedan registrarse como verificados. Elige todos los correctos; algunos reportes y conclusiones no lo están.",
    options:[
      {id:"rule", label:"Auditoría de correo propio", text:"Registra una regla de reenvío externo en el buzón AP a las 08:56.", correct:true},
      {id:"payments", label:"ERP / Tesorería", text:"Muestra dos instrucciones pendientes, no aprobadas ni liberadas; no aparece guardado el cambio bancario solicitado.", correct:true},
      {id:"suppliercall", label:"Llamada del proveedor", text:"El contacto fue verificado por el número registrado y reportó una alerta de sesión. Sus logs técnicos aún no se reciben.", correct:true},
      {id:"emailreceived", label:"Correo de extorsión", text:"El mensaje fue recibido a las 09:11; su afirmación de que copió datos sigue sin corroborar.", correct:true},
      {id:"availability", label:"Estado de servicios", text:"El centro de operaciones reportó canales digitales y sistema transaccional disponibles a las 09:15.", correct:true},
      {id:"exfil", label:"Exfiltración confirmada", text:"La captura parcial del extorsionador demuestra que se descargaron estados de cuenta de socios.", correct:false},
      {id:"attribution", label:"Actor identificado", text:"La alerta del proveedor prueba que el mismo actor controló ambas cuentas.", correct:false}
    ],
    correctIds:["rule","payments","suppliercall","emailreceived","availability"],
    correctText:"Verificado: auditoría propia muestra la regla externa creada a las 08:56; ERP muestra dos pagos pendientes sin liberar ni cambio bancario guardado; el proveedor reportó por contacto verificado una alerta de sesión (sus logs no recibidos); el correo de extorsión llegó a las 09:11 (su contenido no prueba exfiltración); centro de operaciones reporta canales disponibles a las 09:15. No verificados: exfiltración y atribución a un actor común.",
    feedback:"Registra la recepción de un mensaje como hecho y su contenido como afirmación. La falta de logs del proveedor limita la verificación de su sesión; no confundas una correlación temporal con atribución.",
    next:"Mantén fuentes, hora y método de verificación para cada señal."
  },
  {
    key:"actions", title:"Acciones y responsables", time:"20–35 min · contener con autorización", mode:"single",
    question:"¿Qué paquete de acciones reduce riesgo y conserva evidencia sin detener servicios innecesariamente?",
    options:[
      {id:"controlled", label:"Acciones proporcionales, asignadas y registradas", text:"Líder de incidente abre bitácora y asigna responsables. Tesorería, mediante doble control y política aprobada, pausa las dos instrucciones mientras confirma con el proveedor por contacto registrado. Seguridad preserva auditorías y correo original; luego, con autorización, revoca sesiones/tokens y retira la regla. Aísla un equipo solo si está implicado. Legal/Privacidad evalúan los indicios de datos.", correct:true},
      {id:"wipe", label:"Borrar la cuenta y apagar toda la infraestructura", text:"Elimina el buzón, reinicia todos los servidores y cancela todos los pagos y canales para asegurar que no quede nada activo.", correct:false},
      {id:"wait", label:"Esperar a que el proveedor confirme antes de actuar", text:"No registrar el caso ni tocar pagos; esperar los logs externos y la siguiente comunicación del extorsionador.", correct:false}
    ],
    correctText:"Líder de incidente: abre caso y bitácora. Tesorería: pausa las dos instrucciones mediante doble control y política aprobada; confirma la cuenta por contacto previamente registrado. Seguridad: preserva auditoría, correo original, identidad y ERP; después, con autorización, revoca sesiones/tokens y elimina la regla. Aislamiento de endpoint solo si la evidencia lo vincula. Legal/Privacidad: evalúan datos y criterios de escalamiento.",
    feedback:"Contener pagos y accesos específicos reduce riesgo sin declarar comprometidos todos los servicios. Preserva la evidencia antes de acciones que borren o alteren registros; anota quién autorizó y ejecutó cada paso.",
    next:"La contención es una decisión coordinada con el dueño del servicio; registra cambios, hora y resultado."
  },
  {
    key:"impact", title:"Impacto / datos a evaluar", time:"35–50 min · delimitar alcance e impacto", mode:"single",
    question:"¿Qué plan de evaluación deja claro qué se conoce y qué falta para medir el impacto?",
    options:[
      {id:"declare", label:"Declarar una brecha de todos los socios", text:"El correo de extorsión basta para concluir que todos los estados de cuenta fueron copiados.", correct:false},
      {id:"evaluate", label:"Priorizar pagos, buzón, datos y disponibilidad", text:"Confirmar importe, beneficiario y estado de los dos pagos; revisar sesiones y mensajes procesados por la regla, accesos, descargas y destinos; identificar categorías de datos y personas potencialmente afectadas; confirmar disponibilidad de correo, ERP y canales; pedir datos técnicos al proveedor. Mantener exfiltración y alcance como no determinados hasta corroborar.", correct:true},
      {id:"reputation", label:"Evaluar solo reputación y continuidad", text:"No revisar datos ni ERP hasta conocer la identidad del extorsionador.", correct:false}
    ],
    correctText:"Evaluar: estado/beneficiario/importe de las dos transferencias; sesiones y actividad del buzón; mensajes reenviados, leídos o descargados; datos y personas potencialmente afectadas; integridad de ERP y correo; disponibilidad de servicios; y señales del proveedor. Exfiltración, alcance y actor quedan no determinados hasta contar con evidencia.",
    feedback:"La amenaza de extorsión obliga a investigar, pero no acredita por sí sola la salida de datos. El impacto financiero y la exposición de información son preguntas paralelas, con responsables distintos.",
    next:"El próximo informe debe actualizar el alcance con fuentes y nivel de confianza, no repetir la hipótesis como hecho."
  },
  {
    key:"questions", title:"Preguntas y próxima actualización", time:"50–60 min · escalar y comunicar", mode:"single",
    question:"¿Qué preguntas y compromiso de actualización ayudan a cerrar la primera hora con control?",
    options:[
      {id:"finalclaim", label:"Enviar una conclusión pública inmediata", text:"Afirmar que hubo robo de datos por el proveedor y cerrar la investigación; no hace falta fijar otro punto de control.", correct:false},
      {id:"nextupdate", label:"Dejar incógnitas, dueño y hora de actualización", text:"¿Qué mensajes procesó la regla y hubo lectura, descarga o envío externo? ¿Qué cuentas/sesiones quedaron activas? ¿Cambió algún beneficiario o se liberó un pago? ¿Qué datos/servicios/personas están implicados? ¿Qué logs puede aportar el proveedor? Líder de incidente consolida a las 10:00 UTC−05:00; Legal/Privacidad define canales aplicables; comunicar solo a audiencias autorizadas y distinguir confirmado, reportado y pendiente.", correct:true},
      {id:"close", label:"Cerrar al recuperar los pagos", text:"Si Tesorería pausa las transferencias, el caso se cierra sin revisar buzón, datos o terceros.", correct:false}
    ],
    correctText:"Preguntas abiertas: mensajes afectados por la regla; accesos/descargas/envíos; identidades y sesiones; cambios de beneficiario y pago; datos/personas/servicios implicados; registros del proveedor y relación entre señales. Responsable: líder de incidente. Próxima actualización: 10:00 UTC−05:00. Legal/Privacidad evalúa notificaciones y audiencias según política y normativa aplicable.",
    feedback:"Un punto de actualización con responsable y hora mantiene coordinación. Evita declarar una brecha o atribuir el incidente hasta validar alcance; tampoco cierres el caso solo porque los pagos se pausaron.",
    next:"El registro inicial es provisional y debe actualizarse cuando cambie la evidencia."
  }
];

const exercisePanel = document.querySelector("#exercise-panel");
const answerFeedback = document.querySelector("#answer-feedback");
const continueButton = document.querySelector("#continue-exercise");
const restartButton = document.querySelector("#restart-exercise");
const progressFill = document.querySelector("#progress-fill");
const progressCount = document.querySelector("#progress-count");
const stepKicker = document.querySelector("#step-kicker");
const scoreKicker = document.querySelector("#score-kicker");
let current = 0;
let selection = fields.map(() => fields[current]?.mode === "multi" ? [] : null);
let responses = [];
let score = 0;
let evaluated = false;

function selectedIds() {
  if (fields[current].mode === "multi") return [...exercisePanel.querySelectorAll("input:checked")].map(input => input.value);
  return [exercisePanel.querySelector("input:checked")?.value].filter(Boolean);
}
function updateControls() {
  const selected = selectedIds();
  continueButton.disabled = selected.length === 0;
  exercisePanel.querySelectorAll(".answer-option").forEach(label => {
    const input = label.querySelector("input");
    label.classList.toggle("selected", input.checked);
  });
}
function renderField() {
  evaluated = false;
  answerFeedback.hidden = true;
  answerFeedback.className = "answer-feedback";
  continueButton.disabled = true;
  continueButton.textContent = "Selecciona una opción";
  const field = fields[current];
  stepKicker.textContent = `CAMPO ${current + 1} DE ${fields.length}`;
  progressCount.textContent = `${responses.length} / ${fields.length}`;
  scoreKicker.textContent = `${score} acierto${score === 1 ? "" : "s"}`;
  progressFill.style.width = `${Math.round((responses.length / fields.length) * 100)}%`;
  const inputType = field.mode === "multi" ? "checkbox" : "radio";
  const saved = selection[current];
  const optionMarkup = field.options.map(option => {
    const isSelected = field.mode === "multi" ? (saved || []).includes(option.id) : saved === option.id;
    return `<label class="answer-option ${isSelected ? "selected" : ""}" data-option="${option.id}"><input type="${inputType}" name="field-${current}" value="${option.id}" ${isSelected ? "checked" : ""}><span class="option-copy"><b>${option.label}</b>${option.text}</span></label>`;
  }).join("");
  exercisePanel.innerHTML = `
    <div class="field-meta"><span class="field-time">${field.time}</span><span class="field-index">REGISTRO INICIAL · SIMULACIÓN</span></div>
    <h3>${field.title}</h3>
    <p class="field-question">${field.question}</p>
    <div class="option-list ${field.mode === "multi" ? "multi" : ""}">${optionMarkup}</div>`;
  exercisePanel.querySelectorAll("input").forEach(input => input.addEventListener("change", () => {
    if (field.mode === "multi") selection[current] = selectedIds();
    else selection[current] = input.value;
    updateControls();
  }));
  updateControls();
}
function exactSet(a, b) {
  const aa = [...a].sort(); const bb = [...b].sort();
  return aa.length === bb.length && aa.every((value, index) => value === bb[index]);
}
function evaluateField() {
  const field = fields[current];
  const chosen = selectedIds();
  let correct;
  if (field.mode === "multi") correct = exactSet(chosen, field.correctIds);
  else correct = chosen[0] === field.options.find(option => option.correct).id;
  responses[current] = { correct, chosen };
  if (correct) score++;
  evaluated = true;
  exercisePanel.querySelectorAll(".answer-option").forEach(label => {
    const option = field.options.find(item => item.id === label.dataset.option);
    label.classList.remove("correct-option", "wrong-option");
    if (option.correct) label.classList.add("correct-option");
    else if (chosen.includes(option.id)) label.classList.add("wrong-option");
    label.querySelector("input").disabled = true;
  });
  answerFeedback.hidden = false;
  answerFeedback.className = `answer-feedback ${correct ? "correct" : "incorrect"}`;
  answerFeedback.innerHTML = `<div class="feedback-title">${correct ? "✓ Correcto: decisión sustentada." : "↻ Revisa el criterio antes de avanzar."}</div><p>${field.feedback}</p><p class="feedback-next"><b>En el registro:</b> ${field.correctText}</p>`;
  scoreKicker.textContent = `${score} acierto${score === 1 ? "" : "s"}`;
  continueButton.disabled = false;
  continueButton.textContent = current === fields.length - 1 ? "Generar registro inicial →" : "Siguiente campo →";
  continueButton.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function makeReport() {
  const section = document.querySelector("#registro-final");
  const report = document.querySelector("#report-body");
  const imageOrder = [0, 1, 2, 4, 3, 5];
  report.replaceChildren();
  imageOrder.forEach(index => {
    const field = fields[index];
    const card = document.createElement("div"); card.className = "report-field";
    const label = document.createElement("label"); label.textContent = field.title;
    const note = document.createElement("small"); note.textContent = "Borrador editable · hora local simulada UTC−05:00";
    const area = document.createElement("textarea"); area.setAttribute("aria-label", field.title); area.value = field.correctText;
    card.append(label, note, area); report.append(card);
  });
  section.hidden = false;
  progressCount.textContent = `${fields.length} / ${fields.length}`;
  progressFill.style.width = "100%";
  exercisePanel.innerHTML = `<div class="field-meta"><span class="field-time">60 min</span><span class="field-index">EJERCICIO COMPLETADO</span></div><h3>Has completado el registro inicial.</h3><p class="field-question">Puntaje: ${score} de ${fields.length}. Revisa los campos generados, edítalos si quieres y copia o descarga el borrador.</p>`;
  answerFeedback.hidden = true;
  continueButton.disabled = true;
  continueButton.textContent = "Registro generado";
  section.scrollIntoView({behavior:"smooth",block:"start"});
}
continueButton.addEventListener("click", () => {
  if (!evaluated) return evaluateField();
  if (current < fields.length - 1) {
    current++;
    renderField();
    document.querySelector(".exercise-wrap").scrollIntoView({behavior:"smooth",block:"start"});
  } else makeReport();
});
restartButton.addEventListener("click", () => {
  current = 0; responses = []; score = 0; evaluated = false;
  selection = fields.map(field => field.mode === "multi" ? [] : null);
  document.querySelector("#registro-final").hidden = true;
  continueButton.disabled = true;
  renderField();
  document.querySelector("#ejercicio").scrollIntoView({behavior:"smooth",block:"start"});
});
function reportText() {
  const order = [0,1,2,4,3,5];
  return `REGISTRO INICIAL DE INCIDENTE · BORRADOR PROVISIONAL\nCooperativa Sierra Azul (ficticia) · Hora local simulada: UTC−05:00\nFecha: martes (simulación) · Responsable: por asignar\n\n` + order.map(index => `${fields[index].title.toUpperCase()}\n${document.querySelectorAll(".report-field textarea")[order.indexOf(index)].value.trim()}`).join("\n\n") + `\n\nNota: material didáctico. Aplicar el procedimiento, responsables, canales y criterios aprobados por la organización.`;
}
document.querySelector("#copy-report").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try { await navigator.clipboard.writeText(reportText()); status.textContent = "Registro copiado."; }
  catch { status.textContent = "No se pudo copiar automáticamente; selecciona el texto de los campos."; }
});
document.querySelector("#download-report").addEventListener("click", () => {
  const blob = new Blob([reportText()], {type:"text/plain;charset=utf-8"});
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "registro-inicial-cooperativa-simulacion.txt"; link.click();
  URL.revokeObjectURL(link.href);
});
renderField();
