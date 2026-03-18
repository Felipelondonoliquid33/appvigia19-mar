/**
 * Sistema de Escalado Responsivo Mejorado v3
 * ----------------------------------------
 * Soluciona problemas de visualización en diferentes resoluciones Android.
 * 
 * Características:
 * - Soporte para pantallas grandes (tablets, S25 Ultra, etc.)
 * - Soporte mejorado para pantallas pequeñas y de baja densidad
 * - Hook useResponsive para estilos reactivos
 * - Límites mejorados para evitar textos cortados o ilegibles
 * - Considera fontScale del sistema Android
 * - Considera PixelRatio para ajustar en pantallas de baja densidad
 * - Tamaños mínimos absolutos para garantizar legibilidad
 * - Escalado proporcional mejorado
 * 
 * Uso:
 *   // Para funciones estáticas (valores calculados al momento)
 *   import { rs, rFont, rSpace } from '../utils/responsive';
 *   
 *   // Para componentes con estilos reactivos (recomendado)
 *   import { useResponsive } from '../utils/responsive';
 *   const { rFont, rSpace, screenInfo } = useResponsive();
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================
// CONFIGURACIÓN BASE
// ============================================

// Ancho base de diseño - reducido para mejor soporte de pantallas pequeñas
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Tamaños mínimos absolutos de fuente (en dp) para garantizar legibilidad
const MIN_FONT_SIZES = {
  tiny: 9,      // Mínimo absoluto para textos muy pequeños
  small: 10,    // Textos pequeños (footnotes, labels)
  normal: 11,   // Textos normales (body)
  medium: 12,   // Textos medianos
  large: 14,    // Títulos pequeños
  xlarge: 16,   // Títulos
};

// Rangos de pantalla para escalado inteligente
const SCREEN_RANGES = {
  veryCompact: { max: 320 },   // Pantallas muy pequeñas (Galaxy J series, etc.)
  compact: { min: 320, max: 360 },   // Pantallas pequeñas
  normal: { min: 360, max: 400 },    // Pantallas normales
  large: { min: 400, max: 480 },     // Pantallas grandes
  xlarge: { min: 480, max: 600 },    // Pantallas muy grandes (S25 Ultra ~480)
  tablet: { min: 600 }               // Tablets
};

// Límites de escalado ajustados para diferentes tamaños - MEJORADOS para pantallas pequeñas
const getScaleLimits = (screenWidth, pixelRatio) => {
  // Factor de compensación por densidad baja (PixelRatio < 2 = baja densidad)
  const densityBoost = pixelRatio < 2 ? 1.1 : (pixelRatio < 2.5 ? 1.05 : 1);
  
  if (screenWidth >= SCREEN_RANGES.tablet.min) {
    // Tablets: escalar más conservadoramente
    return {
      minFontScale: 0.95 * densityBoost,
      maxFontScale: 1.15,
      minSpaceScale: 0.85,
      maxSpaceScale: 1.3,
    };
  } else if (screenWidth >= SCREEN_RANGES.xlarge.min) {
    // Pantallas muy grandes como S25 Ultra
    return {
      minFontScale: 0.9 * densityBoost,
      maxFontScale: 1.15,
      minSpaceScale: 0.85,
      maxSpaceScale: 1.35,
    };
  } else if (screenWidth >= SCREEN_RANGES.large.min) {
    // Pantallas grandes
    return {
      minFontScale: 0.92 * densityBoost,
      maxFontScale: 1.2,
      minSpaceScale: 0.8,
      maxSpaceScale: 1.4,
    };
  } else if (screenWidth >= SCREEN_RANGES.normal.min) {
    // Pantallas normales (360-400)
    return {
      minFontScale: 0.95 * densityBoost,
      maxFontScale: 1.15,
      minSpaceScale: 0.85,
      maxSpaceScale: 1.3,
    };
  } else if (screenWidth >= SCREEN_RANGES.compact.min) {
    // Pantallas compactas (320-360) - MEJORADO: no reducir tanto las fuentes
    return {
      minFontScale: 0.92 * densityBoost,
      maxFontScale: 1.1,
      minSpaceScale: 0.8,
      maxSpaceScale: 1.2,
    };
  }
  // Pantallas muy pequeñas (<320) - MEJORADO: mantener fuentes legibles
  return {
    minFontScale: 0.9 * densityBoost,
    maxFontScale: 1.05,
    minSpaceScale: 0.75,
    maxSpaceScale: 1.15,
  };
};

// Factor de moderación para fuentes (menor = más conservador)
// AJUSTADO: En pantallas pequeñas, ser MÁS conservador (no reducir tanto)
const getFontModerationFactor = (screenWidth) => {
  if (screenWidth >= SCREEN_RANGES.tablet.min) return 0.35;
  if (screenWidth >= SCREEN_RANGES.xlarge.min) return 0.4;
  if (screenWidth >= SCREEN_RANGES.large.min) return 0.45;
  if (screenWidth >= SCREEN_RANGES.normal.min) return 0.5;
  // Pantallas pequeñas: ser más conservador para no reducir demasiado
  return 0.3;
};

// ============================================
// FUNCIONES DE ESCALADO
// ============================================

/**
 * Obtiene las dimensiones actuales de la pantalla
 */
const getScreenDimensions = () => {
  const { width, height, fontScale } = Dimensions.get('window');
  const pixelRatio = PixelRatio.get();
  // Fallback para dimensiones 0 (puede ocurrir en el primer render)
  const safeWidth = width > 0 ? width : BASE_WIDTH;
  const safeHeight = height > 0 ? height : BASE_HEIGHT;
  return {
    width: safeWidth,
    height: safeHeight,
    fontScale: fontScale || 1,
    pixelRatio: pixelRatio || 2,
    isSmallDevice: safeWidth < 360,
    isMediumDevice: safeWidth >= 360 && safeWidth < 400,
    isLargeDevice: safeWidth >= 400,
    isTablet: safeWidth >= 600,
  };
};

/**
 * Calcula el factor de escala base
 */
const getBaseScale = (width) => {
  const w = width || getScreenDimensions().width;
  return w / BASE_WIDTH;
};

/**
 * Escalado general (responsive size)
 * Usa para elementos que deben escalar proporcionalmente
 */
export const rs = (size) => {
  const { width } = getScreenDimensions();
  const scale = getBaseScale(width);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Escalado para espacios (padding, margin, etc.)
 * Escala completamente pero con límites dinámicos según pantalla
 */
export const rSpace = (size) => {
  const { width, pixelRatio } = getScreenDimensions();
  const scale = getBaseScale(width);
  const limits = getScaleLimits(width, pixelRatio);
  const clampedScale = Math.max(
    limits.minSpaceScale,
    Math.min(limits.maxSpaceScale, scale)
  );
  const newSize = size * clampedScale;
  // Asegurar un mínimo de 2dp para espacios muy pequeños
  return Math.round(Math.max(2, PixelRatio.roundToNearestPixel(newSize)));
};

/**
 * Escalado para fuentes (moderado + límites dinámicos + tamaños mínimos)
 * MEJORADO: Garantiza legibilidad en pantallas pequeñas y de baja densidad
 */
export const rFont = (size) => {
  const { width, fontScale, pixelRatio } = getScreenDimensions();
  const baseScale = getBaseScale(width);
  const limits = getScaleLimits(width, pixelRatio);
  const moderationFactor = getFontModerationFactor(width);
  
  // Escala moderada: solo aplica parte de la diferencia
  const moderatedScale = 1 + (baseScale - 1) * moderationFactor;
  
  // Aplicar límites dinámicos
  const clampedScale = Math.max(
    limits.minFontScale,
    Math.min(limits.maxFontScale, moderatedScale)
  );
  
  // Considerar fontScale del sistema (accesibilidad Android)
  // Pero limitar para evitar extremos
  const systemFontAdjustment = Math.max(0.9, Math.min(1.15, fontScale));
  
  // Calcular tamaño escalado
  let newSize = size * clampedScale * systemFontAdjustment;
  
  // Aplicar tamaño mínimo absoluto según el tamaño base solicitado
  // Esto garantiza que el texto siempre sea legible
  let minAbsolute;
  if (size <= 10) {
    minAbsolute = MIN_FONT_SIZES.tiny;
  } else if (size <= 12) {
    minAbsolute = MIN_FONT_SIZES.small;
  } else if (size <= 14) {
    minAbsolute = MIN_FONT_SIZES.normal;
  } else if (size <= 16) {
    minAbsolute = MIN_FONT_SIZES.medium;
  } else if (size <= 20) {
    minAbsolute = MIN_FONT_SIZES.large;
  } else {
    minAbsolute = MIN_FONT_SIZES.xlarge;
  }
  
  // Asegurar que nunca baje del mínimo absoluto
  newSize = Math.max(newSize, minAbsolute);
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Escalado vertical (basado en altura)
 * Útil para elementos que dependen del alto de pantalla
 */
export const rHeight = (size) => {
  const { height, width, pixelRatio } = getScreenDimensions();
  const scale = height / BASE_HEIGHT;
  const limits = getScaleLimits(width, pixelRatio);
  const clampedScale = Math.max(limits.minSpaceScale, Math.min(limits.maxSpaceScale, scale));
  const newSize = size * clampedScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Retorna información de la pantalla actual
 * Útil para condicionales de layout
 */
export const getScreenInfo = () => {
  const dims = getScreenDimensions();
  return {
    ...dims,
    baseScale: getBaseScale(dims.width),
    platform: Platform.OS,
    // Breakpoints útiles - ajustados para diferentes tamaños
    isVeryCompact: dims.width < 320,
    isCompact: dims.width >= 320 && dims.width < 360,
    isNormal: dims.width >= 360 && dims.width < 400,
    isExpanded: dims.width >= 400 && dims.width < 600,
    isTablet: dims.width >= 600,
    // Información de densidad
    isLowDensity: dims.pixelRatio < 2,
    isMediumDensity: dims.pixelRatio >= 2 && dims.pixelRatio < 3,
    isHighDensity: dims.pixelRatio >= 3,
    // Alias para compatibilidad
    isLarge: dims.width >= 400,
  };
};

/**
 * Devuelve un valor según el tamaño de pantalla
 * Uso: responsiveValue({ compact: 10, normal: 14, expanded: 18, tablet: 20 })
 */
export const responsiveValue = ({ compact, normal, expanded, tablet }) => {
  const info = getScreenInfo();
  if (info.isTablet && tablet !== undefined) return tablet;
  if (info.isExpanded || info.isTablet) return expanded;
  if (info.isCompact) return compact;
  return normal;
};

// ============================================
// HOOK REACTIVO PARA COMPONENTES
// ============================================

/**
 * Hook para obtener funciones de escalado reactivas
 * Se actualiza automáticamente con cambios de dimensiones
 * MEJORADO: Incluye tamaños mínimos y soporte para densidad
 * 
 * Uso:
 *   const { rFont, rSpace, screenInfo, styles } = useResponsive();
 */
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(() => getScreenDimensions());
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const pixelRatio = PixelRatio.get();
      setDimensions({
        width: window.width > 0 ? window.width : BASE_WIDTH,
        height: window.height > 0 ? window.height : BASE_HEIGHT,
        fontScale: window.fontScale || 1,
        pixelRatio: pixelRatio || 2,
        isSmallDevice: window.width < 360,
        isMediumDevice: window.width >= 360 && window.width < 400,
        isLargeDevice: window.width >= 400,
        isTablet: window.width >= 600,
      });
    });
    
    return () => subscription?.remove();
  }, []);
  
  const screenInfo = useMemo(() => ({
    ...dimensions,
    baseScale: getBaseScale(dimensions.width),
    platform: Platform.OS,
    isVeryCompact: dimensions.width < 320,
    isCompact: dimensions.width >= 320 && dimensions.width < 360,
    isNormal: dimensions.width >= 360 && dimensions.width < 400,
    isExpanded: dimensions.width >= 400 && dimensions.width < 600,
    isTablet: dimensions.width >= 600,
    isLowDensity: dimensions.pixelRatio < 2,
    isMediumDensity: dimensions.pixelRatio >= 2 && dimensions.pixelRatio < 3,
    isHighDensity: dimensions.pixelRatio >= 3,
    isLarge: dimensions.width >= 400,
  }), [dimensions]);
  
  const rFontDynamic = useCallback((size) => {
    const baseScale = getBaseScale(dimensions.width);
    const limits = getScaleLimits(dimensions.width, dimensions.pixelRatio);
    const moderationFactor = getFontModerationFactor(dimensions.width);
    const moderatedScale = 1 + (baseScale - 1) * moderationFactor;
    const clampedScale = Math.max(limits.minFontScale, Math.min(limits.maxFontScale, moderatedScale));
    const systemFontAdjustment = Math.max(0.9, Math.min(1.15, dimensions.fontScale));
    let newSize = size * clampedScale * systemFontAdjustment;
    
    // Aplicar tamaño mínimo absoluto
    let minAbsolute;
    if (size <= 10) {
      minAbsolute = MIN_FONT_SIZES.tiny;
    } else if (size <= 12) {
      minAbsolute = MIN_FONT_SIZES.small;
    } else if (size <= 14) {
      minAbsolute = MIN_FONT_SIZES.normal;
    } else if (size <= 16) {
      minAbsolute = MIN_FONT_SIZES.medium;
    } else if (size <= 20) {
      minAbsolute = MIN_FONT_SIZES.large;
    } else {
      minAbsolute = MIN_FONT_SIZES.xlarge;
    }
    newSize = Math.max(newSize, minAbsolute);
    
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }, [dimensions]);
  
  const rSpaceDynamic = useCallback((size) => {
    const scale = getBaseScale(dimensions.width);
    const limits = getScaleLimits(dimensions.width, dimensions.pixelRatio);
    const clampedScale = Math.max(limits.minSpaceScale, Math.min(limits.maxSpaceScale, scale));
    const newSize = size * clampedScale;
    return Math.round(Math.max(2, PixelRatio.roundToNearestPixel(newSize)));
  }, [dimensions]);
  
  const rsDynamic = useCallback((size) => {
    const scale = getBaseScale(dimensions.width);
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }, [dimensions]);
  
  const minTouchSizeDynamic = useCallback((size) => {
    const scaled = rsDynamic(size);
    return Math.max(scaled, 44);
  }, [rsDynamic]);
  
  return {
    rFont: rFontDynamic,
    rSpace: rSpaceDynamic,
    rs: rsDynamic,
    minTouchSize: minTouchSizeDynamic,
    screenInfo,
    dimensions,
  };
};

// ============================================
// TAMAÑOS DE FUENTE PREDEFINIDOS (RESPONSIVOS)
// ============================================

export const FontSizes = {
  xs: () => rFont(10),
  sm: () => rFont(12),
  md: () => rFont(14),
  lg: () => rFont(16),
  xl: () => rFont(18),
  xxl: () => rFont(22),
  title: () => rFont(24),
  hero: () => rFont(32),
};

// ============================================
// ESPACIADOS PREDEFINIDOS (RESPONSIVOS)  
// ============================================

export const Spacing = {
  xs: () => rSpace(4),
  sm: () => rSpace(8),
  md: () => rSpace(12),
  lg: () => rSpace(16),
  xl: () => rSpace(24),
  xxl: () => rSpace(32),
};

// ============================================
// COMPATIBILIDAD CON CÓDIGO EXISTENTE
// ============================================

/**
 * RelativeSize mejorado - reemplaza al anterior
 * CORREGIDO: No aplica mínimos de fuente a espaciados
 * Mantiene compatibilidad pero con mejor escalado
 */
export const RelativeSize = (size) => {
  // Para valores muy pequeños (1-5), son típicamente bordes/espacios pequeños
  // NO usar rFont ya que aplicaría mínimos de fuente incorrectamente
  if (size <= 5) {
    return rSpace(size);
  }
  // Para valores de fuentes típicos (6-24), usar rFont con mínimos
  if (size <= 24) {
    return rFont(size);
  }
  // Para valores mayores (padding, margin, heights), usar escalado de espacios
  return rSpace(size);
};

// ============================================
// UTILIDADES ADICIONALES
// ============================================

/**
 * Normaliza un valor para que no sea menor que un mínimo
 * Útil para asegurar que los elementos sean tocables (mínimo 44px)
 */
export const minTouchSize = (size) => {
  const scaled = rs(size);
  return Math.max(scaled, 44); // 44px es el mínimo recomendado por Android/iOS
};

/**
 * Calcula altura de línea proporcional al tamaño de fuente
 */
export const lineHeight = (fontSize) => {
  return Math.round(fontSize * 1.4);
};

// Export por defecto para facilitar importación
export default {
  rs,
  rSpace,
  rFont,
  rHeight,
  getScreenInfo,
  responsiveValue,
  FontSizes,
  Spacing,
  RelativeSize,
  minTouchSize,
  lineHeight,
  useResponsive,
};
