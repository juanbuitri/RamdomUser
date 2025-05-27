export default async function mostrarHome() {
  const app = document.getElementById("app");
  app.innerHTML = `<h2>Usuarios aleatorios</h2><p>Cargando...</p>`;

  try {
    // Llamada a la API para traer 10 usuarios
    const res = await fetch("https://randomuser.me/api/?results=10&nat=us");
    const data = await res.json();

    const usuarios = data.results;

    // Construir el HTML para la lista de usuarios
    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">`;

    usuarios.forEach((usuario) => {
      html += `
        <div style="border: 1px solid #ccc; padding: 10px; border-radius: 8px; text-align: center;">
          <img src="${usuario.picture.medium}" alt="Foto de ${usuario.name.first}" style="border-radius: 50%; margin-bottom: 10px;" />
          <h3>${usuario.name.title} ${usuario.name.first} ${usuario.name.last}</h3>
          <p>Email: ${usuario.email}</p>
          <p>Teléfono: ${usuario.phone}</p>
          <p>Ciudad: ${usuario.location.city}, ${usuario.location.state}</p>
        </div>
      `;
    });

    html += "</div>";

    app.innerHTML = html;

  } catch (error) {
    app.innerHTML = `<p>Error cargando usuarios: ${error.message}</p>`;
  }
}
