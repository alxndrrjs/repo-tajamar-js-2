document.addEventListener("DOMContentLoaded", function() {
    const calendar = document.getElementById("calendar");
    const hoursDiv = document.getElementById("hours");
    const hourList = document.getElementById("hourList");
    const mesaSelection = document.getElementById("mesaSelection");
    const comensalesSection = document.getElementById("comensalesSection");
    const formSection = document.getElementById("formSection");
    const numComensales = document.getElementById("numComensales");
    const errorMensaje = document.getElementById("errorMensaje");
    const availableHours = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];
    let reserva = {};
    
    // Obtener el mes y el año actual
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // Mes en formato 01, 02, etc.
    const currentYear = today.getFullYear();

    // Crear el calendario con la fecha completa
    for (let i = 1; i <= 30; i++) {
        let day = document.createElement("div");
        day.classList.add("day");
        day.textContent = i;
        day.addEventListener("click", function() {
            document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
            day.classList.add("selected");

            // Guardar la fecha en formato "DD-MM-YYYY"
            reserva.fecha = `${String(i).padStart(2, "0")}-${currentMonth}-${currentYear}`;
            showHours();
        });
        calendar.appendChild(day);
    }
    
    function showHours() {
        hourList.innerHTML = "";
        availableHours.forEach(hour => {
            let btn = document.createElement("button");
            btn.classList.add("button");
            btn.textContent = hour;
            btn.onclick = () => {
                document.querySelectorAll(".button").forEach(b => b.classList.remove("selected-hour"));
                btn.classList.add("selected-hour");
                reserva.hora = hour;
                mesaSelection.style.display = "block";
            };
            hourList.appendChild(btn);
        });
        hoursDiv.style.display = "block";
    }
    
    document.querySelectorAll(".mesa").forEach(mesa => {
        mesa.addEventListener("click", function() {
            document.querySelectorAll(".mesa").forEach(m => m.classList.remove("selected"));
            mesa.classList.add("selected");
            reserva.mesa = mesa.textContent;
            comensalesSection.style.display = "block";
        });
    });
    
    window.validarComensales = function() {
        let capacidad = parseInt(document.querySelector(".mesa.selected").dataset.capacidad);
        let num = parseInt(numComensales.value);
        if ((capacidad === 2 && num > 2) || (capacidad === 4 && (num < 3 || num > 4))) {
            errorMensaje.style.display = "block";
            formSection.style.display = "none";
        } else {
            errorMensaje.style.display = "none";
            reserva.comensales = num;
            formSection.style.display = "block";
        }
    }
    
    window.confirmarReserva = function() {
        let reservas = JSON.parse(localStorage.getItem("reservas")) || []; // Recupera las reservas existentes
    
        let nuevaReserva = {
            fecha: reserva.fecha,
            hora: reserva.hora,
            mesa: reserva.mesa,
            comensales: reserva.comensales,
            nombre: document.getElementById("nombre").value,
            correo: document.getElementById("correo").value,
            telefono: document.getElementById("telefono").value
        };
    
        reservas.push(nuevaReserva); // Agrega la nueva reserva al array
        localStorage.setItem("reservas", JSON.stringify(reservas)); // Guarda el array actualizado
    
        alert("Reserva confirmada! Datos almacenados.");
    };
    
});

// Admin
document.addEventListener("DOMContentLoaded", function() {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || []; // Cargar como array
    const reservasTable = document.getElementById("reservasTable");

    function renderReservas() {
        reservasTable.innerHTML = "";
        if (reservas.length === 0) {
            reservasTable.innerHTML = "<tr><td colspan='8'>No hay reservas registradas.</td></tr>";
            return;
        }

        reservas.forEach((reserva, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${reserva.fecha}</td>
                <td>${reserva.hora}</td>
                <td>${reserva.mesa}</td>
                <td>${reserva.comensales}</td>
                <td>${reserva.nombre}</td>
                <td>${reserva.correo}</td>
                <td>${reserva.telefono}</td>
                <td><button class="button" onclick="eliminarReserva(${index})">Eliminar</button></td>
            `;
            reservasTable.appendChild(row);
        });
    }

    window.eliminarReserva = function(index) {
        reservas.splice(index, 1);
        localStorage.setItem("reservas", JSON.stringify(reservas)); // Guardar después de eliminar
        renderReservas();
    };

    renderReservas();
});
