import React from 'react'
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Operations from './Operations'

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const mockStore = configureMockStore([thunk]);

const mockedOnChange = jest.fn();

describe('Operations Test', () => {


    test("page load successful", async () => {

        const store = mockStore({
            auth: true,
            message: ''
          });

        const component = render(
            <Provider store={store}>
                <Operations />
            </Provider>
        );
        
        const tree = component.toJSON;

        expect(tree).toMatchSnapshot();

    });


    test("values change", async () => {

        const store = mockStore({
            auth: true,
            message: ''
          });

        const component = render(
            <Provider store={store}>
                <Operations />
            </Provider>
        );
        
        const inputNumber1 = screen.getByTestId("number1")
        const inputNumber2 = screen.getByTestId("number2")
        const buttonInvoke = screen.getAllByRole('button', { name: /invoke/i })[0];

        fireEvent.change(inputNumber1, { target: { value: '1234' } });
        fireEvent.change(inputNumber2, { target: { value: '4321' } });
        fireEvent.click(buttonInvoke);

        expect(inputNumber1.value).toBe('1234');
        expect(inputNumber2.value).toBe('4321');

    });


});
