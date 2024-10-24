document.addEventListener('DOMContentLoaded', function() {
  const toggleButtons = document.querySelectorAll('.table-contents-item');
  const allContents = document.querySelectorAll('.table-contents-list');
  const handler = document.querySelector('.g-handler'); // El handler que se mueve solo en desktop
  const handlerHeight = 3.5; // Tamaño fijo del handler en rem
  let lastOpenedIndex = 0; // Seguimiento del último ítem abierto

  // Función para mover el handler basado en el índice del ítem
  function moveHandler(index) {
    const translateY = handlerHeight * index; // Multiplica 3.5rem por el índice del ítem
    handler.style.transform = `translateY(${translateY}rem)`; // Mueve el handler
  }

  // Función para activar el ítem basado en su índice (solo en desktop)
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
  }

  // Comportamiento en Mobile: No hacer nada, ya que el componente está oculto
  function setupMobileBehavior() {
    // Aquí no necesitamos hacer nada ya que el componente está oculto en mobile.
  }

  // Verificar si es mobile o desktop y aplicar el comportamiento adecuado
  function setupBehavior() {
    if (window.innerWidth <= 990) {
      setupMobileBehavior(); // Para pantallas móviles, no hacer nada
    } else {
      setupDesktopBehavior(); // Para pantallas de escritorio, activar la lógica
    }
  }

  window.addEventListener('resize', setupBehavior); // Detectar cambios de tamaño de pantalla
  setupBehavior(); // Inicializar comportamiento al cargar la página
});