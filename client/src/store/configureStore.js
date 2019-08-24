import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import userReducer from '../reducers/user'
import checklistReducer from '../reducers/checklist'
import formErrorReducer from '../reducers/formError';

const configureStore=() =>{
    const store=createStore(combineReducers({
        user:userReducer,
        errors: formErrorReducer,
        checklist:checklistReducer
    }),applyMiddleware(thunk))
    return store
}
export default configureStore