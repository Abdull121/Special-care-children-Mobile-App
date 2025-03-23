import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '../../app/index';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { within } from '@testing-library/react-native';


jest.mock('../../context/GlobalProvider', () => ({
  useGlobalContext: jest.fn(),
}));


jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  Redirect: jest.fn(() => null),
}));

describe('Index Screen', () => {
  test('shows loading indicator when loading is true', () => {
    useGlobalContext.mockReturnValue({ loading: true, isLogged: false });

    const { getByTestId } = render(<Index />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  test('redirects when user is logged in', () => {
    useGlobalContext.mockReturnValue({ loading: false, isLogged: true });

    const { UNSAFE_root } = render(<Index />);
    expect(within(UNSAFE_root).queryAllByText('*')).toHaveLength(0);
  });

  test('renders correctly when user is not logged in', () => {
    useGlobalContext.mockReturnValue({ loading: false, isLogged: false });

    const { getByText, getByTestId } = render(<Index />);
    
    expect(getByText('SPECIAL CARE')).toBeTruthy();
    expect(getByText(/Supporting children with special needs/i)).toBeTruthy();
    expect(getByTestId('get-started-button')).toBeTruthy();
  });

  test('navigates to login on button press', () => {
    useGlobalContext.mockReturnValue({ loading: false, isLogged: false });

    const { getByTestId } = render(<Index />);
    fireEvent.press(getByTestId('get-started-button'));

    expect(router.push).toHaveBeenCalledWith('/login');
  });

  test('matches snapshot', () => {
    useGlobalContext.mockReturnValue({ loading: false, isLogged: false });

    const tree = render(<Index />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
