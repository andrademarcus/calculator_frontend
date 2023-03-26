import React from 'react'
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserRecords from './UserRecords'


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const mockStore = configureMockStore([thunk]);

const mockedOnChange = jest.fn();

describe('UserRecords Test', () => {

    const store = mockStore({
        auth: true,
        message: ''
      });


    test("page load successful", async () => {

        const component = render(
            <Provider store={store}>
                <UserRecords />
            </Provider>
        );
        
        const tree = component.toJSON;

        expect(tree).toMatchSnapshot();

    });


});
