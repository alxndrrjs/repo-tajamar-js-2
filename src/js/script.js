// #region Global Vars
// Variables globales
let fechaSeleccionada, horaSeleccionada, mesaSeleccionada, numComensales;

// #region Calendar config
$(function () {
  // Configuración del calendario
  $("#calendario").datepicker({
    inline: true,
    dateFormat: "yy-mm-dd",
    onSelect: function (dateText) {
      fechaSeleccionada = dateText;
      mostrarHorarios(fechaSeleccionada);
    },
  });

  // #region renderHorarios
  // Función para mostrar horarios disponibles
  function mostrarHorarios(fecha) {
    // MostrarTitulo de la seccion horarios disponibles
    const horaTopText = document.querySelector(".hora_top_text");
    const mostrarHoraTitle = () => {
      horaTopText.classList.remove("hidden");
    };
    mostrarHoraTitle();

    $("#horarios_disponibles").removeClass("hidden");

    const horariosDisponibles = [
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
    ];
    const reservas = JSON.parse(localStorage.getItem("reservas")) || {};

    $("#horarios").html("");
    horariosDisponibles.forEach((hora) => {
      const clave = `${fecha} ${hora}`;
      const btn = $('<button class="horario">')
        .text(hora)
        .prop("disabled", reservas[clave]) // Deshabilita los horarios ocupados
        .addClass(reservas[clave] ? "horario-reservado" : "")
        .click(function () {
          horaSeleccionada = hora;
          $('.horario').removeClass("selected")
          $(this).addClass("selected")
          // $("#horarios_disponibles").hide();
          mostrarMesas();
        });


      const svgIcon = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.25 6V9.75H12" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      btn.prepend(svgIcon)

      $("#horarios").append(btn);
    });


  }

  // #region renderTables
  // Función para mostrar las mesas disponibles
  function mostrarMesas() {
    const mesas = [
      { id: 1, capacidad: 2 },
      { id: 2, capacidad: 2 },
      { id: 3, capacidad: 4 },
      { id: 4, capacidad: 4 },
    ];

    //
    const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
    $("#mesasDisponibles").html("");

    // Mostrar seccion mesas
    const mesasContainer = document.querySelector(".mesas_container");
    const mostrarMesasContainer = () => {
      mesasContainer.classList.remove("hidden");
    };
    mostrarMesasContainer();


    mesas.forEach((mesa) => {
      const clave = `${fechaSeleccionada} ${horaSeleccionada} mesa ${mesa.id}`;
      const mesaBtn = $('<div class="mesa">')
        .text(`Mesa ${mesa.id}`)
        .addClass(reservas[clave] ? "mesa-ocupada" : "")
        .click(function () {
          // Si la mesa ya está ocupada (reservada), no hacer nada
          if (reservas[clave]) {
            alert("Esta mesa ya está reservada.");
            return; // Sale de la función sin hacer nada
          }

          mesaSeleccionada = mesa.id;
          $("#mesasDisponibles .mesa").removeClass("selected");
          $(this).addClass("selected");
          $("#numComensales").prop("disabled", false);
          $("#siguienteMesa").removeClass("hidden");

          // Mostrar seccion Comensales
          const comensalesContainer = document.querySelector(".comensales_container");
          const mostrarCoemensalesContainer = () => {
            comensalesContainer.classList.remove("hidden");
          };
          mostrarCoemensalesContainer();
        });

      $("#mesasDisponibles").append(mesaBtn);
    });

    // $("#seccion1").hide();
    $("#seccion2").removeClass("hidden");
  }

  // #region Comensales
  // Validación de comensales
  $("#numComensales").on("input", function () {
    const num = $(this).val();
    if ((mesaSeleccionada === 1 || mesaSeleccionada === 2) && num > 2) {
      alert("Número de comensales no válido para esta mesa");
      $(this).val("");
      $("#siguienteMesa").addClass("hidden");
    } else if ((mesaSeleccionada === 3 || mesaSeleccionada === 4) && num > 4) {
      alert("Número de comensales no válido para esta mesa");
      $(this).val("");
      $("#siguienteMesa").addClass("hidden");
    } else {
      $("#siguienteMesa").removeClass("hidden");
    }
  });

  // #region saveData
  // Función para almacenar los datos y avanzar
  $("#siguienteMesa").click(function () {
    numComensales = $("#numComensales").val();
    $("#seccion2").hide();
    $("#seccion3").removeClass("hidden");
  });

  // #region FinishReserve
  // Finalizar reserva
  $("#formReserva").submit(function (e) {
    e.preventDefault();

    const nombre = $("#nombre").val();
    const email = $("#email").val();
    const telefono = $("#telefono").val();

    const reserva = {
      fechaHora: `${fechaSeleccionada} ${horaSeleccionada}`,
      mesa: mesaSeleccionada,
      numComensales,
      nombre,
      email,
      telefono,
    };

    const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
    reservas[
      `${fechaSeleccionada} ${horaSeleccionada} mesa ${mesaSeleccionada}`
    ] = reserva;
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("Reserva realizada con éxito");
    $("#seccion3").hide();
    $("#seccion1").removeClass("hidden");
    $('#horarios_disponibles').hide()
    $("#formReserva")[0].reset();
    mesaSeleccionada = null;
  });
});

// =================================================================================================================================

// Función para cargar las reservas desde localStorage

// document.addEventListener("DOMContentLoaded", function () {
//     const calendar = document.getElementById("calendar");
//     const hourList = document.getElementById("hourList");
//     const mesaSelection = document.getElementById("mesaSelection");
//     const comensalesSection = document.getElementById("comensalesSection");
//     const formSection = document.getElementById("formSection");
//     const numComensales = document.getElementById("numComensales");
//     const errorMensaje = document.getElementById("errorMensaje");
//     const availableHours = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];
//     let reserva = {};

//     const today = new Date();
//     const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
//     const currentYear = today.getFullYear();

//     // Generar el calendario
//     if (!calendar.hasChildNodes()) {
//         for (let i = 1; i <= 30; i++) {
//             let day = document.createElement("div");
//             day.classList.add("day");
//             day.textContent = i;
//             day.addEventListener("click", function () {
//                 document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
//                 day.classList.add("selected");
//                 reserva.fecha = `${String(i).padStart(2, "0")}-${currentMonth}-${currentYear}`;
//                 showHours();
//             });
//             calendar.appendChild(day);
//         }
//     }

//     function showHours() {
//         hourList.innerHTML = "";
//         availableHours.forEach(hour => {
//             let btn = document.createElement("button");
//             btn.classList.add("button");
//             btn.textContent = hour;
//             btn.onclick = () => {
//                 document.querySelectorAll(".button").forEach(b => b.classList.remove("selected-hour"));
//                 btn.classList.add("selected-hour");
//                 reserva.hora = hour;
//                 mesaSelection.style.display = "block";
//                 checkOccupiedTables();
//             };
//             hourList.appendChild(btn);
//         });
//         document.getElementById("hours").style.display = "block";
//     }

//     function checkOccupiedTables() {
//         const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
//         const ocupadas = reservas.filter(res => res.fecha === reserva.fecha && res.hora === reserva.hora);
//         document.querySelectorAll(".mesa").forEach(mesa => {
//             let mesaId = mesa.id;
//             if (ocupadas.some(res => res.mesaId === mesaId)) {
//                 mesa.classList.add("ocupada");
//                 mesa.disabled = true;
//             } else {
//                 mesa.classList.remove("ocupada");
//                 mesa.disabled = false;
//             }
//         });
//     }

//     document.querySelectorAll(".mesa").forEach(mesa => {
//         mesa.addEventListener("click", function () {
//             if (mesa.disabled) return;
//             document.querySelectorAll(".mesa").forEach(m => m.classList.remove("selected"));
//             mesa.classList.add("selected");
//             reserva.mesaId = mesa.id;
//             reserva.mesa = mesa.textContent;
//             comensalesSection.style.display = "block";
//         });
//     });

//     window.validarComensales = function () {
//         let capacidad = parseInt(document.querySelector(".mesa.selected").dataset.capacidad);
//         let num = parseInt(numComensales.value);
//         if ((capacidad === 2 && num > 2) || (capacidad === 4 && (num < 3 || num > 4))) {
//             errorMensaje.style.display = "block";
//             formSection.style.display = "none";
//         } else {
//             errorMensaje.style.display = "none";
//             reserva.comensales = num;
//             formSection.style.display = "block";
//         }
//     }

//     window.confirmarReserva = function () {
//         let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
//         let nuevaReserva = {
//             fecha: reserva.fecha,
//             hora: reserva.hora,
//             mesaId: reserva.mesaId,
//             mesa: reserva.mesa,
//             comensales: reserva.comensales,
//             nombre: document.getElementById("nombre").value,
//             correo: document.getElementById("correo").value,
//             telefono: document.getElementById("telefono").value
//         };

//         reservas.push(nuevaReserva);
//         localStorage.setItem("reservas", JSON.stringify(reservas));
//         alert("Reserva confirmada! Datos almacenados.");
//         resetForm();
//     };

//     function resetForm() {
//         document.querySelectorAll(".mesa").forEach(m => m.classList.remove("selected"));
//         reserva = {};
//         numComensales.value = '';
//         comensalesSection.style.display = "none";
//         formSection.style.display = "none";
//         document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
//         document.querySelectorAll(".button").forEach(b => b.classList.remove("selected-hour"));
//     }

//     let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
//     const reservasTable = document.getElementById("reservasTable");
//     const fechaFiltro = document.getElementById("fechaFiltro");

//     if (fechaFiltro) {
//         fechaFiltro.addEventListener("change", filtrarReservas);
//     }

//     function obtenerFechasUnicas() {
//         const fechas = reservas.map(reserva => reserva.fecha);
//         return [...new Set(fechas)];
//     }

//     function llenarSelectFechas() {
//         const fechasUnicas = obtenerFechasUnicas();
//         fechaFiltro.innerHTML = "<option value='todas'>Todas</option>";
//         fechasUnicas.forEach(fecha => {
//             let option = document.createElement("option");
//             option.value = fecha;
//             option.textContent = fecha;
//             fechaFiltro.appendChild(option);
//         });
//     }

//     function renderReservas(reservasFiltradas) {
//         reservasTable.innerHTML = "";
//         if (reservasFiltradas.length === 0) {
//             reservasTable.innerHTML = "<tr><td colspan='8'>No hay reservas registradas.</td></tr>";
//             return;
//         }

//         reservasFiltradas.forEach((reserva, index) => {
//             let row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${reserva.fecha}</td>
//                 <td>${reserva.hora}</td>
//                 <td>${reserva.mesa}</td>
//                 <td>${reserva.comensales}</td>
//                 <td>${reserva.nombre}</td>
//                 <td>${reserva.correo}</td>
//                 <td>${reserva.telefono}</td>
//                 <td>
//                     <button class="button" onclick="eliminarReserva(${index})">Eliminar</button>
//                     <button class="button" onclick="modificarReserva(${index})">Modificar</button>
//                 </td>
//             `;
//             reservasTable.appendChild(row);
//         });
//     }

//     function filtrarReservas() {
//         const fechaSeleccionada = fechaFiltro.value;
//         if (fechaSeleccionada === "todas") {
//             renderReservas(reservas);
//         } else {
//             const reservasFiltradas = reservas.filter(reserva => reserva.fecha === fechaSeleccionada);
//             renderReservas(reservasFiltradas);
//         }
//     }

//     window.eliminarReserva = function (index) {
//         reservas.splice(index, 1);
//         localStorage.setItem("reservas", JSON.stringify(reservas));
//         renderReservas(reservas);
//         llenarSelectFechas();
//     };

//     window.modificarReserva = function (index) {
//         const reservaAModificar = reservas[index];
//         // Aquí puedes hacer lo necesario para modificar la reserva
//     };

//     llenarSelectFechas();
//     renderReservas(reservas);
// });
