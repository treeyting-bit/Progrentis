const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
  });

  const page = await browser.newPage();

  try {
    console.log('Accediendo a progrentis.com...');
    await page.goto('https://progrentis.com', { waitUntil: 'networkidle' });

    console.log('Esperando formulario de login...');
    await page.waitForSelector('input[type="text"], input[name*="user"], input[name*="username"]', { timeout: 5000 });

    // Buscar y llenar el campo de usuario
    const userInputs = await page.$$('input[type="text"]');
    if (userInputs.length > 0) {
      await userInputs[0].fill('tiy27.448');
      console.log('Usuario ingresado');
    }

    // Buscar y llenar el campo de contraseña
    const passInputs = await page.$$('input[type="password"]');
    if (passInputs.length > 0) {
      await passInputs[0].fill('1234tiyoli');
      console.log('Contraseña ingresada');
    }

    // Buscar y hacer click en el botón de login
    const loginButtons = await page.$$('button');
    if (loginButtons.length > 0) {
      await loginButtons[0].click();
      console.log('Formulario enviado');
    }

    // Esperar a que cargue la página después del login
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Obtener el contenido de la página
    const content = await page.content();
    console.log('Página cargada. Buscando tareas...');

    // Guardar screenshot
    await page.screenshot({ path: '/tmp/claude-0/-home-user-Progrentis/94b16f47-01ea-5b6b-b709-b3eba231b0fa/scratchpad/progrentis-screenshot.png' });
    console.log('Screenshot guardado');

    // Obtener toda la información de la página
    const pageTitle = await page.title();
    console.log('Título de la página:', pageTitle);

    // Buscar tareas
    const tasks = await page.$$eval('*', elements => {
      return elements
        .filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return text.includes('tarea') || text.includes('task') || text.includes('actividad');
        })
        .slice(0, 10)
        .map(el => el.textContent);
    });

    console.log('Tareas encontradas:', tasks);

    // Obtener el HTML de la página para análisis
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    // Buscar patrones de tareas
    const taskPattern = bodyHTML.match(/task|tarea|actividad|pendiente/gi);
    console.log('Menciones de tareas encontradas:', taskPattern?.length || 0);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
