document.addEventListener('DOMContentLoaded', function() {
  const toggleButtons = document.querySelectorAll('.table-contents-item'); // Todos los items de la tabla de contenidos
  const allContents = document.querySelectorAll('.table-contents-list'); // Todas las listas dentro de los items
  const headings = document.querySelectorAll('.article-content h2'); // Todos los h2 dentro de .article-content
  let lastOpenedIndex = 0; // Seguimiento del último ítem abierto

  // Función para expandir el ítem cuyo enlace coincide con el h2 en la sección article-content
  function expandMatchingItem() {
    headings.forEach((heading) => {
      const headingText = heading.innerText.trim(); // Obtener el texto del h2 actual

      // Iterar sobre las listas de cada ítem de la tabla de contenidos
      allContents.forEach((content, index) => {
        const listItems = content.querySelectorAll('.table-contents-list-item div'); // Obtener los textos de cada enlace

        listItems.forEach((item) => {
          const itemText = item.innerText.trim(); // Obtener el texto del enlace

          // Si el texto del h2 coincide con algún enlace dentro de una lista, expandir el ítem
          if (headingText === itemText) {
            const parentWrapper = content.closest('.table-contents-item-wrapper'); // Obtener el wrapper del ítem
            const contentToOpen = parentWrapper.querySelector('.table-contents-list');
            
            // Abrir el ítem correspondiente si coincide
            if (!contentToOpen.classList.contains('is-open')) {
              contentToOpen.classList.add('is-open');
              lastOpenedIndex = index;

              // Mover el handler a la posición correcta
              moveHandler(index);
            }
          }
        });
      });
    });
  }

  // Función para mover el handler basado en el índice del ítem
  function moveHandler(index) {
    const handler = document.querySelector('.g-handler'); // El handler que se mueve solo en desktop
    const handlerHeight = 3.5; // Tamaño fijo del handler en rem
    const translateY = handlerHeight * index; // Multiplica 3.5rem por el índice del ítem
    handler.style.transform = `translateY(${translateY}rem)`; // Mueve el handler
  }

  // Comportamiento en Desktop: manejar acordeón y handler
  function setupDesktopBehavior() {
    toggleButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
        const content = button.parentElement.querySelector('.table-contents-list');

        // Si el ítem ya está abierto, no hacer nada (no cerrarlo)
        if (content.classList.contains('is-open') && lastOpenedIndex === index) {
          moveHandler(index);
          return; // Salimos para que no cierre el ítem
        }

        // Cerrar el ítem anterior si no es el mismo que se está clicando
        if (lastOpenedIndex !== -1 && lastOpenedIndex !== index) {
          allContents[lastOpenedIndex].classList.remove('is-open'); // Cierra el ítem anterior
        }

        // Abrir el nuevo ítem
        content.classList.add('is-open');

        // Guardar el índice del ítem actualmente abierto
        lastOpenedIndex = index;

        // Mover el handler basado en la posición del ítem clicado
        moveHandler(index);
      });
    });

    // Ejecutar la función para expandir el ítem que coincide con el h2
    expandMatchingItem();
  }

  // Comportamiento en Mobile: no hacer nada porque el componente está oculto
  function setupMobileBehavior() {
    // No necesitamos hacer nada aquí ya que el componente está oculto en mobile
  }

  // Verificar si es mobile o desktop y aplicar el comportamiento adecuado
  function setupBehavior() {
    if (window.innerWidth <= 990) {
      setupMobileBehavior();
    } else {
      setupDesktopBehavior();
    }
  }

  window.addEventListener('resize', setupBehavior); // Detectar cambios de tamaño de pantalla
  setupBehavior(); // Inicializar comportamiento al cargar la página
});