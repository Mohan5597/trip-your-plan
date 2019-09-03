import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import App from './App';
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import {setUser} from './actions/user'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/lib/css/_datepicker.css';



const store=configureStore()

store.subscribe(() =>{
    console.log(store.getState())
})

//write code to handle page reload
if(localStorage.getItem('userAuth')){
    axios.get('http://localhost:3005/user/profile',{
    headers:{
        'x-auth':localStorage.getItem('userAuth')
    }
})
.then(response =>{

    store.dispatch(setUser(response.data))
})

}

const jsx=(
    <Provider store={store}>
        <App/>
    </Provider>
)


ReactDOM.render(jsx, document.getElementById('root'))