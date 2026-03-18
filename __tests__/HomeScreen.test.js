/**
 * HomeScreen.test.js — Pruebas unitarias de la pantalla principal
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../src/i18n/LanguageProvider', () => ({
  useLang: () => ({ t: (k) => k, locale: 'es' }),
}));

jest.mock('../src/componentes/funciones', () => ({
  RelativeSize: (n) => n,
}));

jest.mock('../src/api/PersonFontSize', () => ({
  regular: 'System',
  bold: 'System',
  small: 12,
  normal: 14,
  large: 18,
}));

jest.mock('../src/componentes/FooterNav', () => {
  const { View } = require('react-native');
  return ({ navigation, usuario, active }) => (
    <View testID={`footer-nav-${active}`} />
  );
});

// ── Props de ejemplo ──────────────────────────────────────────────────────────

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
};

const mockRoute = {
  params: {
    user: { id: 42, nombre: 'Lucía', username: 'lucia123', token: 'tok_abc' },
  },
};

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('HomeScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renderiza sin lanzar excepciones (smoke test)', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    expect(() =>
      render(<HomeScreen navigation={mockNavigation} route={mockRoute} />)
    ).not.toThrow();
  });

  it('muestra el título de la app (home.title)', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByText('home.title')).toBeTruthy();
  });

  it('muestra el subtítulo (home.subtitle)', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByText('home.subtitle')).toBeTruthy();
  });

  it('muestra la tarjeta de Entrevista (home.interview)', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByText('home.interview')).toBeTruthy();
  });

  it('muestra la tarjeta de Materiales (home.materials)', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByText('home.materials')).toBeTruthy();
  });

  it('navega a Entrevista al presionar la tarjeta correspondiente', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    fireEvent.press(getByText('home.interview'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'Entrevista',
      { user: mockRoute.params.user }
    );
  });

  it('navega a Materiales al presionar la tarjeta correspondiente', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    fireEvent.press(getByText('home.materials'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'Materiales',
      { user: mockRoute.params.user }
    );
  });

  it('muestra FooterNav con active="home"', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    const { getByTestId } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByTestId('footer-nav-home')).toBeTruthy();
  });

  it('funciona sin user en route.params (no lanza undefined error)', () => {
    const HomeScreen = require('../src/screens/HomeScreen').default;
    expect(() =>
      render(
        <HomeScreen
          navigation={mockNavigation}
          route={{ params: {} }}
        />
      )
    ).not.toThrow();
  });
});
