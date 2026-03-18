# .maestro — Pruebas de UI Automatizadas (ModoSeguro)

Historias de usuario automatizadas con **Maestro CLI 2.3.0** para la app **ModoSeguro** (Expo / React Native).

---

## Estructura de archivos

```
.maestro/
├── flujo_principal.yaml        ← Orquestador: ejecuta TODOS los flujos en orden
├── flows/
│   ├── 01_bienvenida.yaml      ← WelcomeScreen + transición a Login
│   ├── 02_rol_icbf.yaml        ← Rol ICBF/Funcionario (rolId 3 o 4)
│   ├── 03_rol_agente.yaml      ← Rol Agente Educativo (rolId 5)
│   ├── 04_rol_admin.yaml       ← Rol Administrador/Superusuario (rolId 1 o 2)
│   └── 05_materiales.yaml      ← Recorrido exhaustivo de Materiales
└── helpers/
    ├── _login_action.yaml      ← Subflow reutilizable: login
    ├── _logout_action.yaml     ← Subflow reutilizable: cerrar sesión
    └── _recorrer_materiales.yaml ← Subflow: navegar por materiales
```

---

## Credenciales por rol (variables de entorno)

| Rol | rolId | Variable usuario | Variable contraseña |
|---|---|---|---|
| Administrador | 1 o 2 | `ADMIN_USER` | `ADMIN_PASS` |
| ICBF / Funcionario | 3 o 4 | `ICBF_USER` | `ICBF_PASS` |
| Agente Educativo | 5 | `AGENTE_USER` | `AGENTE_PASS` |

> **Nunca escribas contraseñas directamente en los YAML.** Siempre usa `-e` en la línea de comandos.

---

## Cómo ejecutar

### Flujo completo (todos los roles)
```bash
maestro test .maestro/flujo_principal.yaml \
  -e ADMIN_USER="admin@modoseguro.co"  \
  -e ADMIN_PASS="Admin@Seguro1"        \
  -e ICBF_USER="icbf@icbf.gov.co"     \
  -e ICBF_PASS="IcbfClave@2026"       \
  -e AGENTE_USER="agente@edu.gov.co"  \
  -e AGENTE_PASS="Agente@Edu1"
```

### Un solo flujo
```bash
# Solo bienvenida
maestro test .maestro/flows/01_bienvenida.yaml

# Solo rol ICBF
maestro test .maestro/flows/02_rol_icbf.yaml \
  -e ICBF_USER="correo@icbf.gov.co" -e ICBF_PASS="MiClave@2026"

# Solo rol Admin
maestro test .maestro/flows/04_rol_admin.yaml \
  -e ADMIN_USER="admin@modoseguro.co" -e ADMIN_PASS="Admin@Seguro1"
```

### Generar reporte JUnit (para CI/CD)
```bash
maestro test .maestro/flujo_principal.yaml \
  -e ICBF_USER="..." -e ICBF_PASS="..." \
  --format junit --output reporte_ui.xml
```

---

## Rerquisitos

- Maestro CLI 2.3.0 instalado en `C:\Users\Dracarys -Vector\maestro\bin\maestro.bat`
- Dispositivo conectado (emulador Android o S25 Ultra vía ADB)
- Metro bundler corriendo en puerto 8081: `npx expo start --port 8081 --clear`
- ADB: `$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe`

---

## Cobertura por flujo

| Flujo | Pantallas cubiertas | Verificaciones clave |
|---|---|---|
| `01_bienvenida.yaml` | WelcomeScreen, LoginScreen | Texto bienvenida, scroll, transición automática |
| `02_rol_icbf.yaml` | Login, Home, Entrevistas, Materiales, Resultados, Canales | Versiones 1/2/3 visibles, Versión 4 ausente |
| `03_rol_agente.yaml` | Login, Home, Entrevistas, Materiales, Resultados | Solo Versión 4 visible, 1/2/3 ausentes |
| `04_rol_admin.yaml` | Login, Home, Entrevistas (all), Materiales, Listado, Resultados, Canales | Todas las versiones visibles, todos los módulos |
| `05_materiales.yaml` | MaterialesConsulta, MaterialUno, MaterialDos, MaterialRutaAtencion, MaterialesSeis | 4 tarjetas activas, 2 ocultas verificadas |

---

## Restricciones de roles (lógica del código)

```
EntrevistaScreen — canShow(rolesPermitidos):
  retorna true si: rolesPermitidos.includes(rolId) ó rolId === 1 ó rolId === 2

Tipo 1 (Madres/padres)      canShow([3, 4]) → visible para rolId 1,2,3,4
Tipo 2 (Niños/adolescentes) canShow([3, 4]) → visible para rolId 1,2,3,4
Tipo 3 (Funcionarios)       canShow([3, 4]) → visible para rolId 1,2,3,4
Tipo 4 (Agentes/cuidadores) canShow([5])    → visible para rolId 1,2,5
```

---

## Screenshots generados

Maestro guarda capturas automáticamente en `~/.maestro/tests/<timestamp>/`. Cada `takeScreenshot` crea un archivo PNG nombrado según el paso del flujo.
