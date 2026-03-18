// Re-exportar desde el nuevo módulo responsivo mejorado
export { 
  RelativeSize, 
  rs, 
  rSpace, 
  rFont, 
  rHeight, 
  getScreenInfo,
  responsiveValue,
  FontSizes,
  Spacing,
  minTouchSize,
  lineHeight,
  useResponsive 
} from '../utils/responsive';

/**
 * Reemplaza todas las ocurrencias de una palabra en un texto dado.
 * @param {string} texto - Texto original donde se realizará el reemplazo.
 * @param {string} buscar - Palabra o expresión a buscar en el texto.
 * @param {string} reemplazarPor - Valor por el que se reemplazará cada ocurrencia.
 * @returns {string} Texto con todas las ocurrencias reemplazadas, o cadena vacía si texto es falsy.
 */
export const reemplazarPalabra = (texto, buscar, reemplazarPor) => {
  if (!texto) return "";
  return texto.replace(new RegExp(buscar, "g"), reemplazarPor);
};

/**
 * Valida que una contraseña cumpla con los requisitos de seguridad.
 * Requiere mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.
 * @param {string} pass - Contraseña a validar.
 * @returns {boolean} true si la contraseña es segura, false si no cumple los requisitos.
 */
export const validarPasswordSegura = (pass) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:;#])[A-Za-z\d@$!%*?&.,:;#]{8,}$/;

  return regex.test(pass);
};


/**
 * Genera una cadena de fecha/hora en formato compacto sin separadores (aaaammddhhmmss).
 * Usada para nombres de archivos exportados.
 * @returns {string} Fecha y hora actual en formato 'aaaammddhhmmss'.
 */
export const getFechaFormato = () => {
  const fecha = new Date();

  const yy = String(fecha.getFullYear()); // últimos 2 dígitos
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const hh = String(fecha.getHours()).padStart(2, "0"); // 24h
  const nn = String(fecha.getMinutes()).padStart(2, "0"); 
  const ss = String(fecha.getSeconds()).padStart(2, "0"); 

  return `${yy}${mm}${dd}${hh}${nn}${ss}`;
};

/**
 * Genera una cadena de fecha/hora en formato legible (aaaa-mm-dd hh:mm:ss).
 * Usada para registrar fechas en la base de datos local.
 * @returns {string} Fecha y hora actual en formato 'aaaa-mm-dd hh:mm:ss'.
 */
export const getFechaRegistro = () => {
  const fecha = new Date();

  const yy = String(fecha.getFullYear()); // últimos 2 dígitos
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const hh = String(fecha.getHours()).padStart(2, "0"); // 24h
  const nn = String(fecha.getMinutes()).padStart(2, "0"); 
  const ss = String(fecha.getSeconds()).padStart(2, "0"); 

  return `${yy}-${mm}-${dd} ${hh}:${nn}:${ss}`;
};


/**
 * Verifica si una fecha de nacimiento corresponde a una persona mayor de 18 años.
 * @param {Date} fecha - Objeto Date con la fecha de nacimiento a evaluar.
 * @returns {boolean} true si la persona tiene 18 años o más, false si es menor.
 */
export const validarMayor18 = (fecha) => {
  const hoy = new Date();
  const fecha18 = new Date(
    hoy.getFullYear() - 18,
    hoy.getMonth(),
    hoy.getDate()
  );

  return fecha <= fecha18; 
};

export const validarMayorToYear = (fecha, year) => {
  // Si el año a validar es 0, null o undefined, no aplica restricción
  if (!year || !fecha) return true;
  
  const hoy = new Date();
  
  // Creamos la fecha de corte restando los años solicitados
  const fechaCorte = new Date(
    hoy.getFullYear() - year,
    hoy.getMonth(),
    hoy.getDate()
  );

  // Si la fecha de nacimiento es MENOR o IGUAL a la fecha de corte, 
  // significa que ya cumplió o superó esa edad.
  return fecha <= fechaCorte;
};

/**
 * Formatea un objeto Date como cadena de fecha en formato aaaa-mm-dd.
 * Usada para almacenar fechas de nacimiento en la base de datos.
 * @param {Date} fecha - Objeto Date a formatear.
 * @returns {string} Fecha en formato 'aaaa-mm-dd'.
 */
export const getFechaNacimiento = (fecha) => {

  const yy = String(fecha.getFullYear()); // últimos 2 dígitos
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");

  return `${yy}-${mm}-${dd}`;
};

/**
 * Calcula la edad en años a partir de una fecha de nacimiento.
 * @param {string} fechaNacimiento - Fecha de nacimiento en formato ISO (aaaa-mm-dd).
 * @returns {number} Edad en años completos a la fecha actual.
 */
export const calcularEdad = (fechaNacimiento)  => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  // Si aún no ha llegado el cumpleaños este año, restar 1
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};