import React from 'react'
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from './Login'


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const mockStore = configureMockStore([thunk]);

const mockedOnChange = jest.fn();

describe('Login Test', () => {

    const store = mockStore({
        auth: true,
        message: ''
      });

    test("page load successful", async () => {

        const component = render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
        
        const tree = component.toJSON;

        expect(tree).toMatchSnapshot();

    });

    test("valid username format and invalid password format", async () => {

        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
        
        const container = screen.getAllByTestId('login')[0];
        const input = screen.getByRole("textbox", { name: /username/i });
        const loginButton = screen.getAllByRole('button', { name: /login/i })[0];
        const alerts = container.getElementsByClassName('alert');

        fireEvent.change(input, { target: { value: 'test@email.com' } });
        fireEvent.click(loginButton);

        expect(alerts.length).toBe(1);

    });

    test("valid username and password format", async () => {

        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
        
        const container = screen.getAllByTestId('login')[0];
        const inputUsername = screen.getByRole("textbox", { name: /username/i });
        const inputPassword = screen.getByTestId("password");
        const loginButton = screen.getAllByRole('button', { name: /login/i })[0];
        const alerts = container.getElementsByClassName('alert');

        fireEvent.change(inputUsername, { target: { value: 'test@email.com' } });
        fireEvent.change(inputPassword, { target: { value: 'kshdgahsd' } });
        fireEvent.click(loginButton);

        expect(alerts.length).toBe(0);

    });

    test("invalid username format and blank password", async () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
        const container = screen.getAllByTestId('login')[0];
        const input = screen.getByRole("textbox", { name: /username/i });
        const loginButton = screen.getAllByRole('button', { name: /login/i })[0];
        const alerts = container.getElementsByClassName('alert');

        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(loginButton);

        expect(alerts.length).toBe(2);

    });

    test("username should be empty initially", async () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
        const input = screen.getByRole("textbox", { name: /username/i });
        expect(input.value).toContain("");

      });

      test("password should be empty initially", async () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
        const input = screen.getByTestId("password");
        expect(input.value).toContain("");

      });

});
