document.addEventListener('DOMContentLoaded', function() {
  const toggleButtons = document.querySelectorAll('.table-contents-item');
  const allContents = document.querySelectorAll('.table-contents-list');
  const headings = document.querySelectorAll('.article-content h2'); // Obtener todos los h2 dentro de .article-content
  let lastOpenedIndex = 0; // Seguimiento del último ítem abierto
  let scrollActive = true; // Controlar si el scroll está activo o no
  let isScrollingByClick = false; // Flag para controlar si el scroll fue disparado por un clic
  let lastScrollTop = 0; // Posición previa para determinar dirección del scroll

  const itemHeightPx = 56;  // 3.5rem = 56px
  const extraSpace = 192;  // Offset superior de 192px tanto para desktop como mobile

  // Función para activar el ítem basado en su índice
  function setActiveItem(activeIndex) {
    toggleButtons.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  // Función para desactivar el manejo del scroll temporalmente
  function disableScrollHandling() {
    isScrollingByClick = true;
  }

  // Función para reactivar el manejo del scroll
  function enableScrollHandling() {
    setTimeout(() => {
      isScrollingByClick = false;
    }, 100);  // Pequeño retraso antes de reactivar el scroll
  }

  // Verificar si es mobile
  function isMobile() {
    return window.innerWidth <= 990;
  }

  // Comportamiento en Desktop: manejo del acordeón y handler
  function setupDesktopBehavior() {
    const handler = document.querySelector('.g-handler'); // El handler que se mueve solo en desktop
    const handlerHeight = 3.5; // Tamaño fijo del handler en rem

    // Función para mover el handler basado en el índice del ítem
    function moveHandler(index) {
      const translateY = handlerHeight * index; // Multiplica 3.5rem por el índice del ítem
      handler.style.transform = `translateY(${translateY}rem)`; // Mueve el handler
    }

    toggleButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
        const content = button.parentElement.querySelector('.table-contents-list');

        // Si el ítem ya está abierto, no hacer nada (no cerrarlo)
        if (content.classList.contains('is-open') && lastOpenedIndex === index) {
          moveHandler(index);

          const itemText = button.querySelector('.text-weight-semibold').innerText.trim(); // Obtener el texto dentro del item

          // Buscar el H2 cuyo texto coincide con el del ítem clicado
          headings.forEach(function(heading) {
            if (heading.innerText.trim() === itemText) {
              const offsetPosition = heading.getBoundingClientRect().top + window.pageYOffset - extraSpace;

              // Desplazarse suavemente hacia esa posición
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          });

          return; // Salimos para que no cierre el ítem
        }

        // Desactivar el scroll temporalmente mientras se abre/cierra el ítem
        scrollActive = false;

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

        // Desplazarse hacia el H2 correspondiente
        const itemText = button.querySelector('.text-weight-semibold').innerText.trim(); // Obtener el texto del ítem

        headings.forEach(function(heading) {
          if (heading.innerText.trim() === itemText) {
            const offsetPosition = heading.getBoundingClientRect().top + window.pageYOffset - extraSpace;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            setTimeout(function() {
              scrollActive = true;
            }, 500); // Reactivar el scroll después del desplazamiento
          }
        });
      });
    });

    // Manejar el scroll para abrir/cerrar ítems dinámicamente
    window.addEventListener('scroll', function() {
      if (!scrollActive) return; // Si el scroll está desactivado, no hacer nada

      let closestHeadingIndex = -1;
      let closestDistance = Infinity;

      headings.forEach(function(heading, index) {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - extraSpace);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestHeadingIndex = index;
        }
      });

      if (closestHeadingIndex !== -1) {
        allContents.forEach(function(content, index) {
          if (index === closestHeadingIndex) {
            content.classList.add('is-open');
            moveHandler(index);
          } else {
            content.classList.remove('is-open');
          }
        });
      }
    });
  }

  // Comportamiento en Mobile: Sin handler, solo scroll y activación de clase
  function setupMobileBehavior() {
    // Asegurarse de que el primer ítem en móvil tenga la clase 'is-active' al cargar
    if (toggleButtons.length > 0) {
      toggleButtons[0].classList.add('is-active');
    }

    toggleButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
        disableScrollHandling();

        const heading = headings[index];
        const elementPosition = heading.getBoundingClientRect().top + window.pageYOffset;

        // Hacer scroll con el offset ajustado (192px)
        window.scrollTo({
          top: elementPosition - extraSpace,
          behavior: 'smooth'
        });

        setActiveItem(index);  // Activar el ítem clicado

        enableScrollHandling();  // Reactivar el manejo del scroll después del clic
      });
    });

    window.addEventListener('scroll', function() {
      if (isScrollingByClick) return;  // Si el scroll fue disparado por clic, no hacer nada

      let currentIndex = -1;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingDown = scrollTop > lastScrollTop;
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evitar números negativos en el scroll

      headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        
        if (scrollingDown) {
          // Cuando vamos hacia abajo, activamos el ítem si la parte superior del heading está dentro del viewport
          if (rect.top - extraSpace <= 0 && rect.bottom > 0) {
            currentIndex = index;
          }
        } else {
          // Cuando vamos hacia arriba, activamos solo si el heading está completamente visible
          if (rect.top >= 0 && rect.top < window.innerHeight) {
            currentIndex = index;
          }
        }
      });

      // Activamos el ítem actual si es diferente del activo
      if (currentIndex !== -1 && !toggleButtons[currentIndex].classList.contains('is-active')) {
        setActiveItem(currentIndex);
      }
    });
  }

  // Verificar si es mobile o desktop y aplicar el comportamiento adecuado
  function setupBehavior() {
    if (isMobile()) {
      setupMobileBehavior();
    } else {
      setupDesktopBehavior();
    }
  }

  window.addEventListener('resize', setupBehavior); // Detectar cambios de tamaño de pantalla
  setupBehavior(); // Inicializar comportamiento al cargar la página
});