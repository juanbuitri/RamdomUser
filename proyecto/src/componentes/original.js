import { auth, db } from '../firebaseConfig.js';
import { doc, getDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

export default async function mostrarOriginal() {
  const app = document.getElementById("app");
  app.innerHTML = `<h2>Usuarios aleatorios (con acciones Guardar y Borrar)</h2><p>Cargando...</p>`;

  try {
    const user = auth.currentUser;
    if (!user) {
      app.innerHTML = `<p>Debes iniciar sesión para usar esta función.</p>`;
      return;
    }

    // Referencia al documento del usuario
    const userDocRef = doc(db, 'usuarios', user.uid);

    // Función para mostrar totales
    function mostrarTotales(ganados = 0, perdidos = 0) {
      const totalesHtml = `
        <div style="margin-bottom: 20px;">
          <strong>Ganados:</strong> <span id="total-ganados">${ganados}</span> |
          <strong>Perdidos:</strong> <span id="total-perdidos">${perdidos}</span>
        </div>
      `;
      // Insertar o actualizar el contenedor de totales arriba del contenido
      const existingTotales = document.getElementById("totales-container");
      if (existingTotales) {
        existingTotales.innerHTML = totalesHtml;
      } else {
        const div = document.createElement("div");
        div.id = "totales-container";
        div.innerHTML = totalesHtml;
        app.prepend(div);
      }
    }

    // Obtener los datos actuales del usuario y mostrar totales
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      mostrarTotales(data.ganados, data.perdidos);
    } else {
      // Si no existe el doc, inicializar con 0
      mostrarTotales(0, 0);
    }

    // Escuchar cambios en tiempo real para actualizar totales
    onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        mostrarTotales(data.ganados, data.perdidos);
      }
    });

    // Ahora traer y mostrar usuarios de la API
    const res = await fetch("https://randomuser.me/api/?results=10&nat=us");
    const data = await res.json();
    const usuarios = data.results;

    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">`;

    usuarios.forEach((usuario, index) => {
      html += `
        <div style="border: 1px solid #ccc; padding: 10px; border-radius: 8px; text-align: center;">
          <img src="${usuario.picture.medium}" alt="Foto de ${usuario.name.first}" style="border-radius: 50%; margin-bottom: 10px;" />
          <h3>${usuario.name.title} ${usuario.name.first} ${usuario.name.last}</h3>
          <p>Email: ${usuario.email}</p>
          <p>Teléfono: ${usuario.phone}</p>
          <p>Ciudad: ${usuario.location.city}, ${usuario.location.state}</p>
          <button data-index="${index}" class="btn-guardar" style="margin-right: 5px; padding: 5px 10px;">Guardar</button>
          <button data-index="${index}" class="btn-borrar" style="padding: 5px 10px;">Borrar</button>
        </div>
      `;
    });

    html += "</div>";
    app.innerHTML += html; // Agregamos a lo que ya tenemos (totales)

    // Función para actualizar marcador en Firestore
    async function actualizarMarcador(tipo) {
      try {
        await updateDoc(userDocRef, {
          [tipo]: increment(1)
        });
        // No hace falta alertar porque se actualizan los totales en tiempo real
      } catch (error) {
        alert('Error actualizando marcador: ' + error.message);
      }
    }

    // Agregar eventos a botones
    const btnsGuardar = document.querySelectorAll(".btn-guardar");
    btnsGuardar.forEach(btn => {
      btn.addEventListener("click", () => actualizarMarcador('ganados'));
    });

    const btnsBorrar = document.querySelectorAll(".btn-borrar");
    btnsBorrar.forEach(btn => {
      btn.addEventListener("click", () => actualizarMarcador('perdidos'));
    });

  } catch (error) {
    app.innerHTML = `<p>Error cargando usuarios: ${error.message}</p>`;
  }
}
