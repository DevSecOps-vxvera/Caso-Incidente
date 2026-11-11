# Publicar en GitHub Pages desde Mac

## 1. Crear un repositorio

En GitHub, crea un repositorio nuevo. Para mantenerlo público, selecciona **Public**. No inicialices el repo con README, licencia ni `.gitignore`.

## 2. Subir la carpeta desde Terminal

Ajusta la ruta si guardaste la carpeta en otro lugar:

```bash
cd "$HOME/Documents/ChatGPT/VxV Clases/caso-primera-hora"
git init -b main
git add index.html styles.css app.js README.md PUBLICAR_GITHUB_MAC.md
git commit -m "Publica ejercicio guiado de respuesta a incidentes"
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Reemplaza `USUARIO` y `REPOSITORIO` con los valores de tu cuenta. Si Git pide autenticación, autoriza GitHub en el navegador o usa GitHub CLI (`gh auth login`).

## 3. Activar Pages

En el repositorio, abre **Settings → Pages**. En **Build and deployment**, selecciona **Deploy from a branch**; elige `main` y la carpeta `/(root)`, y pulsa **Save**.

Cuando termine el despliegue, GitHub mostrará la dirección pública en esa misma pantalla. Para actualizar el sitio después de editarlo:

```bash
git add .
git commit -m "Actualiza el ejercicio"
git push
```

GitHub Pages puede tardar unos minutos en publicar la primera versión.
