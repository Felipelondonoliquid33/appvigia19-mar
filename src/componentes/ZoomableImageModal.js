/**
 * ZoomableImageModal Component
 * ----------------------------
 * Muestra una imagen en un modal de pantalla completa con funcionalidad de zoom.
 * 
 * Props:
 *   - visible: boolean - controla si el modal está visible
 *   - imageSource: require() o {uri: string} - fuente de la imagen
 *   - onClose: function - callback cuando se cierra el modal
 * 
 * Uso:
 *   <ZoomableImageModal 
 *     visible={showModal} 
 *     imageSource={require('./image.png')}
 *     onClose={() => setShowModal(false)}
 *   />
 */

import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_DELAY = 300;

export default function ZoomableImageModal({ visible, imageSource, onClose }) {
  const [scale, setScale] = useState(1);
  const lastTapRef = useRef(0);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const resetZoom = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 5,
      }),
    ]).start();
    
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
    setScale(1);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detectado
      if (lastScale.current > 1) {
        // Si ya está con zoom, resetear
        resetZoom();
      } else {
        // Hacer zoom a 2.5x
        Animated.spring(scaleAnim, {
          toValue: 2.5,
          useNativeDriver: true,
          friction: 5,
        }).start();
        lastScale.current = 2.5;
        setScale(2.5);
      }
      lastTapRef.current = 0; // Resetear el tap
    } else {
      lastTapRef.current = now;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        handleDoubleTap();
      },
      
      onPanResponderMove: (evt, gestureState) => {
        if (lastScale.current > 1) {
          // Solo permitir pan cuando hay zoom
          const newX = lastTranslateX.current + gestureState.dx;
          const newY = lastTranslateY.current + gestureState.dy;
          
          // Limitar el pan según el nivel de zoom
          const maxTranslate = (lastScale.current - 1) * SCREEN_WIDTH / 2;
          const maxTranslateY = (lastScale.current - 1) * SCREEN_HEIGHT / 3;
          
          translateX.setValue(Math.max(-maxTranslate, Math.min(maxTranslate, newX)));
          translateY.setValue(Math.max(-maxTranslateY, Math.min(maxTranslateY, newY)));
        }
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        lastTranslateX.current = translateX._value || 0;
        lastTranslateY.current = translateY._value || 0;
      },
    })
  ).current;

  const handleClose = () => {
    resetZoom();
    onClose();
  };

  const zoomIn = () => {
    const newScale = Math.min(lastScale.current + 0.5, MAX_SCALE);
    Animated.spring(scaleAnim, {
      toValue: newScale,
      useNativeDriver: true,
      friction: 5,
    }).start();
    lastScale.current = newScale;
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(lastScale.current - 0.5, MIN_SCALE);
    Animated.spring(scaleAnim, {
      toValue: newScale,
      useNativeDriver: true,
      friction: 5,
    }).start();
    lastScale.current = newScale;
    setScale(newScale);
    
    // Si volvemos a escala 1, resetear posición
    if (newScale === 1) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 5,
      }).start();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 5,
      }).start();
      lastTranslateX.current = 0;
      lastTranslateY.current = 0;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar hidden />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header con controles */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.zoomControls}>
            <TouchableOpacity 
              style={[styles.zoomButton, scale <= MIN_SCALE && styles.zoomButtonDisabled]} 
              onPress={zoomOut}
              disabled={scale <= MIN_SCALE}
            >
              <Text style={styles.zoomText}>−</Text>
            </TouchableOpacity>
            
            <Text style={styles.zoomLevel}>{Math.round(scale * 100)}%</Text>
            
            <TouchableOpacity 
              style={[styles.zoomButton, scale >= MAX_SCALE && styles.zoomButtonDisabled]} 
              onPress={zoomIn}
              disabled={scale >= MAX_SCALE}
            >
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Imagen con zoom */}
        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Animated.Image
            source={imageSource}
            style={[
              styles.image,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateX: translateX },
                  { translateY: translateY },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </View>
        
        {/* Footer con instrucciones */}
        <View style={styles.footer}>
          <Text style={styles.instructions}>
            Doble toque para zoom • Arrastre para mover
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonDisabled: {
    opacity: 0.4,
  },
  zoomText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  zoomLevel: {
    color: '#fff',
    fontSize: 14,
    minWidth: 50,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  instructions: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
  },
});
