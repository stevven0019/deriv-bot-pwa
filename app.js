<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Deriv Bot PWA</title>
  <link rel="manifest" href="./manifest.webmanifest" />
  <meta name="theme-color" content="#0b1021" />
  <link rel="icon" href="./icons/icon-192.png" sizes="192x192" />
  <link rel="apple-touch-icon" href="./icons/icon-192.png" />
  <style>
    body { font-family: sans-serif; background: #0b1021; color: #fff; padding: 1rem; }
    .grid { display: grid; gap: 1rem; }
    .g3 { grid-template-columns: repeat(3, 1fr); }
    .badge.buy { background: green; }
    .badge.sell { background: red; }
    .badge.neutral { background: gray; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #444; padding: 0.5rem; text-align: center; }
    .contrast { background: #222; color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; }
    .muted { font-size: 0.8rem; color: #aaa; }
  </style>
</head>
<body>

  <h1>📊 Deriv Bot PWA</h1>
  <p>Modo señales + scalping dinámico con TP/SL y cierre anticipado.</p>

  <!-- Modo de operación -->
  <article>
    <h4>Modo de operación</h4>
    <div class="grid g3">
      <div>
        <label>Modo
          <select id="modo_trade">
            <option value="normal" selected>Trading por señales</option>
            <option value="scalping">Scalping dinámico</option>
          </select>
        </label>
        <small class="muted">El modo scalping cierra contratos según TP/SL/tiempo y cambio de tendencia.</small>
      </div>
      <div>
        <strong>Modo actual:</strong>
        <div id="modo_activo">Trading por señales</div>
      </div>
    </div>

    <h5 style="margin-top: 0.75rem;">Parámetros de scalping</h5>
    <div class="grid g3">
      <div>
        <label>TP dinámico desde
          <input id="scalp_tp" type="number" step="0.01" value="0.25" />
        </label>
      </div>
      <div>
        <label>Stop Loss
          <input id="scalp_sl" type="number" step="0.01" value="-0.20" />
        </label>
      </div>
      <div>
        <label>Ventana cierre anticipado
          <div class="grid g3">
            <input id="scalp_exit_from" type="number" min="1" value="40" />
            <input id="scalp_exit_to" type="number" min="1" value="30" />
            <span style="align-self:center;">seg</span>
          </div>
        </label>
      </div>
    </div>
  </article>

  <!-- Contratos abiertos + limpieza -->
  <article>
    <h4>Contratos abiertos</h4>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Tipo</th><th>Símbolo</th><th>Entrada</th><th>Spot</th><th>P/L</th><th>Estado</th>
        </tr>
      </thead>
      <tbody id="contracts_tbl"></tbody>
    </table>
    <button id="btn_clear_contracts" class="contrast" style="margin-top: 0.75rem;">🗑️ Limpiar historial de contratos</button>
  </article>

  <!-- Señal actual -->
  <article>
    <h4>Señal actual</h4>
    <div id="elSignal">—</div>
  </article>

  <!-- Scripts -->
  <script src="./app.js"></script>
  <script>
    // Registro del Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").then((reg) => {
          console.log("SW registrado:", reg.scope);
          if (reg.waiting) reg.waiting.postMessage("SKIP_WAITING");
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                newWorker.postMessage("SKIP_WAITING");
              }
            });
          });
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
          });
        }).catch((err) => {
          console.error("Fallo al registrar SW:", err);
        });
      });
    }
  </script>
</body>
</html>
