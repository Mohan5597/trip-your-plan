import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { removeUser } from '../../actions/user'


function Logout(props) {
    if (!_.isEmpty(props.user)) {
        localStorage.removeItem('userAuth')
        props.dispatch(removeUser())
    }
    return (
        <div>
            <p>You have Succesfully logged out</p>
        </div>
    )
}
const mapStatetoProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStatetoProps)(Logout)