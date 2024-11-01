const tbody = document.querySelector('tbody');
const splash = document.querySelector('.splash');
const contador = document.getElementById('contador');

function showSplash() {
  splash.style.display = 'flex';
}

function hideSplash() {
  splash.style.display = 'none';
}

async function loadUsuarios() {
  showSplash();
  try {
    const response = await fetch(`${API_BASE_URL}/read/UsuarioRead`);
    const usuarios = await response.json();
    tbody.innerHTML = '';

    usuarios.forEach((usuario) => {
      insertUsuario(usuario);
    });

    contador.textContent = `Total de usuários: ${usuarios.length}`;
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  } finally {
    hideSplash();
  }
}

async function addUsuarioAleatorio() {
  showSplash();
  try {
    await fetch(`${API_BASE_URL}/Usuario/usuarioAleatorio`, { method: 'POST' });
    loadUsuarios();
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error);
  } finally {
    hideSplash();
  }
}

function insertUsuario(usuario) {
  const tr = document.createElement('tr');
  const localizacao = usuario.localizacoes[0] || {};

  tr.innerHTML = `
    <td>${usuario.primeiroNome} ${usuario.ultimoNome}</td>
    <td>${usuario.email}</td>
    <td>${usuario.telefone}</td>
    <td>${localizacao.cidade || ''}</td>
    <td>${localizacao.pais || ''}</td>
    <td class="acao">
      <button onclick="editUsuario('${usuario.id}')"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteUsuario('${usuario.id}')"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

async function deleteUsuario(id) {
  showSplash();
  try {
    const response = await fetch(`${API_BASE_URL}/Usuario/${id}`, { method: 'DELETE' });

    if (response.ok) {
      loadUsuarios();
    } else {
      console.error("Erro ao excluir usuário:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
  } finally {
    hideSplash();
  }
}

async function editUsuario(id) {
  editingUserId = id;
  
  try {
    const response = await fetch(`${API_BASE_URL}/read/UsuarioRead/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar usuário");
    }
    editingUsuario = await response.json();

    document.getElementById('editPrimeiroNome').value = editingUsuario.primeiroNome;
    document.getElementById('editUltimoNome').value = editingUsuario.ultimoNome;
    document.getElementById('editEmail').value = editingUsuario.email;
    document.getElementById('editTelefone').value = editingUsuario.telefone;

    if (editingUsuario.localizacoes && editingUsuario.localizacoes.length > 0) {
      document.getElementById('editCidade').value = editingUsuario.localizacoes[0].cidade;
      document.getElementById('editPais').value = editingUsuario.localizacoes[0].pais;
    }

    document.getElementById('editModal').style.display = 'flex';
  } catch (error) {
    console.error("Erro ao carregar usuário para edição:", error);
  }
}

async function saveUser() {
  const primeiroNome = document.getElementById('editPrimeiroNome').value;
  const ultimoNome = document.getElementById('editUltimoNome').value;
  const email = document.getElementById('editEmail').value;
  const telefone = document.getElementById('editTelefone').value;
  const cidade = document.getElementById('editCidade').value;
  const pais = document.getElementById('editPais').value;
  const genero = document.getElementById('editGenero').value;

  const usuarioEditado = {
    id: editingUserId,
    primeiroNome,
    ultimoNome,
    email,
    telefone,
    genero,
    localizacoes: [
      { 
        idUsuario: editingUsuario.id,
        id: editingUsuario.localizacoes[0]?.id || null, 
        cidade,
        pais 
      }
    ]
  };

  showSplash();
  try {
    const response = await fetch(`${API_BASE_URL}/Usuario`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioEditado)
    });

    if (response.ok) {
      loadUsuarios();
      closeModal();
    } else {
      console.error("Erro ao salvar usuário:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  } finally {
    hideSplash();
  }
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

loadUsuarios();
