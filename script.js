// Simulación de base de datos en localStorage
const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
const comentariosAprobados = JSON.parse(localStorage.getItem('comentariosAprobados')) || [];
const adminPassword = 'Edwin2025!'; // Cambia esta contraseña

// Cargar galería en index.html
function cargarGaleria() {
    const galeria = document.getElementById('galeria-fotos');
    galeria.innerHTML = '';
    fotos.forEach(foto => {
        const div = document.createElement('div');
        div.className = 'foto-item';
        div.innerHTML = `
            <img src="${foto.src}" alt="${foto.titulo}">
            <h3>${foto.titulo}</h3>
            <p>${foto.descripcion}</p>
        `;
        galeria.appendChild(div);
    });
}

// Cargar comentarios aprobados en index.html
function cargarComentarios() {
    const lista = document.getElementById('lista-comentarios');
    lista.innerHTML = '';
    comentariosAprobados.forEach(c => {
        const div = document.createElement('div');
        div.innerHTML = `<p><strong>${c.nombre}</strong>: ${c.comentario}</p>`;
        lista.appendChild(div);
    });
}

// Enviar comentario desde index.html
document.getElementById('comentario-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const comentario = document.getElementById('comentario').value;
    comentarios.push({ nombre, comentario, aprobado: false });
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    alert('Comentario enviado, pendiente de aprobación.');
    e.target.reset();
});

// Login admin
function login() {
    const password = document.getElementById('admin-password').value;
    if (password === adminPassword) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        cargarFotosSubidas();
        cargarComentariosPendientes();
        cargarComentariosAprobados();
    } else {
        alert('Contraseña incorrecta');
    }
}

// Subir foto
function subirFoto() {
    const input = document.getElementById('foto-input');
    const titulo = document.getElementById('foto-titulo').value;
    const descripcion = document.getElementById('foto-descripcion').value;
    if (input.files[0] && titulo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fotos.push({ src: e.target.result, titulo, descripcion });
            localStorage.setItem('fotos', JSON.stringify(fotos));
            alert('Foto subida con éxito');
            input.value = '';
            document.getElementById('foto-titulo').value = '';
            document.getElementById('foto-descripcion').value = '';
            cargarFotosSubidas();
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        alert('Por favor, selecciona una foto y añade un título.');
    }
}

// Cargar fotos subidas en admin.html
function cargarFotosSubidas() {
    const lista = document.getElementById('fotos-subidas');
    lista.innerHTML = '';
    fotos.forEach((foto, index) => {
        const div = document.createElement('div');
        div.className = 'foto-item';
        div.innerHTML = `
            <img src="${foto.src}" alt="${foto.titulo}">
            <h3>${foto.titulo}</h3>
            <p>${foto.descripcion}</p>
            <button onclick="eliminarFoto(${index})" class="btn-eliminar">Eliminar</button>
        `;
        lista.appendChild(div);
    });
}

// Eliminar foto
function eliminarFoto(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        fotos.splice(index, 1);
        localStorage.setItem('fotos', JSON.stringify(fotos));
        cargarFotosSubidas();
    }
}

// Cargar comentarios pendientes en admin.html
function cargarComentariosPendientes() {
    const lista = document.getElementById('comentarios-pendientes');
    lista.innerHTML = '';
    comentarios.filter(c => !c.aprobado).forEach((c, index) => {
        const div = document.createElement('div');
        div.className = 'comentario-item';
        div.innerHTML = `
            <p><strong>${c.nombre}</strong>: ${c.comentario}</p>
            <button onclick="aprobarComentario(${index})">Aprobar</button>
            <button onclick="eliminarComentarioPendiente(${index})" class="btn-eliminar">Eliminar</button>
        `;
        lista.appendChild(div);
    });
}

// Aprobar comentario
function aprobarComentario(index) {
    comentarios[index].aprobado = true;
    comentariosAprobados.push(comentarios[index]);
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    localStorage.setItem('comentariosAprobados', JSON.stringify(comentariosAprobados));
    cargarComentariosPendientes();
    cargarComentariosAprobados();
}

// Eliminar comentario pendiente
function eliminarComentarioPendiente(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        comentarios.splice(index, 1);
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
        cargarComentariosPendientes();
    }
}

// Cargar comentarios aprobados en admin.html
function cargarComentariosAprobados() {
    const lista = document.getElementById('comentarios-aprobados');
    lista.innerHTML = '';
    comentariosAprobados.forEach((c, index) => {
        const div = document.createElement('div');
        div.className = 'comentario-item';
        div.innerHTML = `
            <p><strong>${c.nombre}</strong>: ${c.comentario}</p>
            <button onclick="eliminarComentarioAprobado(${index})" class="btn-eliminar">Eliminar</button>
        `;
        lista.appendChild(div);
    });
}

// Eliminar comentario aprobado
function eliminarComentarioAprobado(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        comentariosAprobados.splice(index, 1);
        const comentarioIndex = comentarios.findIndex(c => c.aprobado && c.nombre === comentariosAprobados[index]?.nombre && c.comentario === comentariosAprobados[index]?.comentario);
        if (comentarioIndex !== -1) {
            comentarios.splice(comentarioIndex, 1);
        }
        localStorage.setItem('comentariosAprobados', JSON.stringify(comentariosAprobados));
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
        cargarComentariosAprobados();
    }
}

// Cargar galería y comentarios al iniciar
if (document.getElementById('galeria-fotos')) {
    cargarGaleria();
    cargarComentarios();
}
