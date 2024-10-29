document.addEventListener('DOMContentLoaded', function() {
  const articleSections = document.querySelectorAll('.article-content-item'); // Cada sección que contiene h2 y h3
  const tableContentsWrapper = document.querySelector('.table-contents-wrapper'); // Contenedor de la tabla de contenidos
  const handler = document.querySelector('.g-handler'); // El handler dentro del contenedor
  const handlerHeight = 3.5; // Tamaño fijo del handler en rem
  const extraSpace = 192; // Offset superior para el desplazamiento

  // Remover el primer ítem (template) después del handler
  const firstContentItem = tableContentsWrapper.querySelector('.table-contents-item-wrapper');
  if (firstContentItem) {
    firstContentItem.remove();
  }

  // Crear la estructura de la tabla de contenidos con `h2` y `h3`
  articleSections.forEach((section, sectionIndex) => {
    const h2 = section.querySelector('h2'); // Obtener el h2 de la sección
    const h3s = section.querySelectorAll('h3'); // Obtener todos los h3 de la sección

    // Crear un wrapper para el h2 y sus h3
    const h2Wrapper = document.createElement('div');
    h2Wrapper.classList.add('table-contents-item-wrapper');

    // Crear el ítem de contenido para el h2
    const h2Item = document.createElement('div');
    h2Item.classList.add('table-contents-item');
    const h2Text = document.createElement('div');
    h2Text.classList.add('text-weight-semibold');
    h2Text.innerText = h2.innerText;
    h2Item.appendChild(h2Text);

    // Crear el contenedor de los subítems para los h3
    const h3Container = document.createElement('div');
    h3Container.classList.add('table-contents-list');

    // Expande el primer contenedor por defecto y agrega `is-active` al primer `table-contents-item`
    if (sectionIndex === 0) {
      h3Container.classList.add('is-open');
      h2Item.classList.add('is-active');
    }

    // Añadir cada h3 al contenedor de lista sin agregar la clase is-active
    h3s.forEach((h3) => {
      const h3ListItem = document.createElement('div');
      h3ListItem.classList.add('table-contents-list-item');
      const h3Text = document.createElement('div');
      h3Text.innerText = h3.innerText;
      h3ListItem.appendChild(h3Text); // Añadir el texto del h3 al ítem de la lista
      h3Container.appendChild(h3ListItem); // Añadir el ítem a la lista de h3s

      // Configurar el clic para desplazarse hacia el `h3` con el offset
      h3ListItem.addEventListener('click', function() {
        const elementPosition = h3.getBoundingClientRect().top + window.pageYOffset - extraSpace;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      });
    });

    // Añadir el ítem del h2 y el contenedor de h3s al wrapper del h2
    h2Wrapper.appendChild(h2Item);
    h2Wrapper.appendChild(h3Container);

    // Añadir el wrapper completo al contenedor principal de la tabla de contenidos
    tableContentsWrapper.appendChild(h2Wrapper);

    // Configurar el clic para el ítem de h2 para desplazarse hacia el h2 con el offset y mover el handler
    h2Item.addEventListener('click', function() {
      // Cerrar cualquier toggle abierto antes de abrir el nuevo
      document.querySelectorAll('.table-contents-list.is-open').forEach(container => {
        container.classList.remove('is-open');
      });

      // Mover el handler a la posición del `h2` correspondiente en múltiplos de 3.5rem
      const translateY = handlerHeight * sectionIndex;
      handler.style.transform = `translateY(${translateY}rem)`;

      // Desplazar hacia el `h2` con el offset
      const h2Position = h2.getBoundingClientRect().top + window.pageYOffset - extraSpace;
      window.scrollTo({
        top: h2Position,
        behavior: 'smooth'
      });

      // Verificar si la sección tiene `h3`s o no y expandir/colapsar el contenedor de h3s
      if (h3s.length > 0) {
        h3Container.classList.toggle('is-open');
      }

      // Remover `is-active` de todos los `table-contents-item` y agregarlo solo al clicado
      document.querySelectorAll('.table-contents-item.is-active').forEach(item => {
        item.classList.remove('is-active');
      });
      h2Item.classList.add('is-active');
    });
  });

  // Función para activar el `h2` más cercano al hacer scroll, mover el handler y aplicar `is-active` a `table-contents-item`
  function updateActiveH2OnScroll() {
    let closestSectionIndex = -1;
    let closestDistance = Infinity;

    articleSections.forEach((section, index) => {
      const h2 = section.querySelector('h2');
      const rect = h2.getBoundingClientRect();
      const distance = Math.abs(rect.top - extraSpace);

      // Verificar si el h2 está en el viewport con el offset aplicado
      if (rect.top <= extraSpace && distance < closestDistance) {
        closestDistance = distance;
        closestSectionIndex = index;
      }
    });

    if (closestSectionIndex !== -1) {
      // Mover el handler en incrementos exactos de 3.5rem según el índice del `h2` activo
      const translateY = handlerHeight * closestSectionIndex;
      handler.style.transform = `translateY(${translateY}rem)`;

      // Remover `is-active` de todos los `table-contents-item`
      document.querySelectorAll('.table-contents-item.is-active').forEach(item => {
        item.classList.remove('is-active');
      });

      // Aplicar `is-active` al `table-contents-item` correspondiente
      const activeTableItem = tableContentsWrapper.children[closestSectionIndex + 1]?.querySelector('.table-contents-item');
      if (activeTableItem) {
        activeTableItem.classList.add('is-active');
      }

      // Cerrar todos los contenedores `h3` y abrir el correspondiente al `h2` activo
      document.querySelectorAll('.table-contents-list.is-open').forEach(container => {
        container.classList.remove('is-open');
      });
      const activeH3Container = tableContentsWrapper.children[closestSectionIndex + 1]?.querySelector('.table-contents-list');
      if (activeH3Container) {
        activeH3Container.classList.add('is-open');
      }
    }
  }

  // Inicializar el primer `h2` como activo y mover el handler a su posición
  updateActiveH2OnScroll();

  // Agregar el evento de scroll solo para el `h2`
  window.addEventListener('scroll', updateActiveH2OnScroll);

  // Detección de cambios de tamaño de pantalla y configuración del comportamiento de scroll
  function setupBehavior() {
    if (isMobile()) {
      handler.style.display = 'none'; // Ocultar el handler en mobile
    } else {
      handler.style.display = ''; // Mostrar el handler en desktop
    }
  }

  // Verificar si es mobile
  function isMobile() {
    return window.innerWidth <= 990;
  }

  window.addEventListener('resize', setupBehavior); // Detectar cambios de tamaño de pantalla
  setupBehavior(); // Inicializar comportamiento al cargar la página
});
