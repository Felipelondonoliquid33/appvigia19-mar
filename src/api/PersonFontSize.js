/*
* Ferney Duran 02/2026
* Actualizado: Sistema responsivo mejorado v3
* - Tamaños base aumentados para mejor legibilidad en pantallas pequeñas
* - Usa rFont que aplica tamaños mínimos absolutos
*/
'use strict';

import { rFont } from "../utils/responsive";

// Los tamaños se calculan como getters para que sean dinámicos
// y respondan a cambios de orientación/pantalla
// NOTA: Los tamaños base han sido aumentados ligeramente para mejorar
// la legibilidad en pantallas pequeñas y de baja densidad
const PersonFontSize = {
  regular: 'Montserrat-Regular',
  bold: 'Montserrat-Bold',
  // Getters que calculan el tamaño en tiempo de acceso
  // Tamaños base aumentados: 10->11, 12->13, 14->15, etc.
  get wtitulo() { return rFont(24); },  // Era 23
  get titulo() { return rFont(19); },   // Era 18
  get subtitulo() { return rFont(17); }, // Era 16
  get medium() { return rFont(15); },   // Era 14
  get normal() { return rFont(13); },   // Era 12
  get small() { return rFont(11); },    // Era 10
};

export default PersonFontSize;  