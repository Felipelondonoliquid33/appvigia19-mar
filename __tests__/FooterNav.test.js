/**
 * FooterNav.test.js — Pruebas del componente de navegación inferior
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FooterNav from '../src/componentes/FooterNav';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('../src/i18n/LanguageProvider', () => ({
  useLang: () => ({ t: (k) => k, locale: 'es' }),
}));

jest.mock('../src/utils/responsive', () => ({
  useResponsive: () => ({
    rSpace: (n) => n,
    rFont: (n) => n,
    minTouchSize: (n) => n,
    screenInfo: { width: 390, height: 844, isSmall: false, isCompact: false, isLarge: false },
  }),
}));

// ── Props de ejemplo ──────────────────────────────────────────────────────────

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockUser = { id: 1, nombre: 'Test User', username: 'test' };

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('FooterNav', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renderiza sin lanzar excepciones (smoke test)', () => {
    expect(() =>
      render(
        <FooterNav
          navigation={mockNavigation}
          usuario={mockUser}
          active="home"
        />
      )
    ).not.toThrow();
  });

  it('muestra label de Inicio (footer.home)', () => {
    const { getByText } = render(
      <FooterNav navigation={mockNavigation} usuario={mockUser} active="home" />
    );
    expect(getByText('footer.home')).toBeTruthy();
  });

  it('muestra label de Entrevista (footer.interview)', () => {
    const { getByText } = render(
      <FooterNav navigation={mockNavigation} usuario={mockUser} active="home" />
    );
    expect(getByText('footer.interview')).toBeTruthy();
  });

  it('muestra label de Resultados (footer.results)', () => {
    const { getByText } = render(
      <FooterNav navigation={mockNavigation} usuario={mockUser} active="home" />
    );
    expect(getByText('footer.results')).toBeTruthy();
  });

  it('llama navigation.navigate al presionar Inicio', () => {
    const { getByText } = render(
      <FooterNav navigation={mockNavigation} usuario={mockUser} active="entrevista" />
    );
    fireEvent.press(getByText('footer.home'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', { user: mockUser });
  });

  it('llama navigation.navigate al presionar Entrevista (Listado)', () => {
    const { getByText } = render(
      <FooterNav navigation={mockNavigation} usuario={mockUser} active="home" />
    );
    fireEvent.press(getByText('footer.interview'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Listado', { user: mockUser });
  });

  it('respeta validarAccion — bloquea navegación si devuelve false', () => {
    const validarAccion = jest.fn(() => false);
    const { getByText } = render(
      <FooterNav
        navigation={mockNavigation}
        usuario={mockUser}
        active="home"
        validarAccion={validarAccion}
      />
    );
    fireEvent.press(getByText('footer.interview'));
    expect(validarAccion).toHaveBeenCalledWith('Listado');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('respeta validarAccion — permite navegación si devuelve true', () => {
    const validarAccion = jest.fn(() => true);
    const { getByText } = render(
      <FooterNav
        navigation={mockNavigation}
        usuario={mockUser}
        active="home"
        validarAccion={validarAccion}
      />
    );
    fireEvent.press(getByText('footer.interview'));
    expect(validarAccion).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Listado', { user: mockUser });
  });
});
