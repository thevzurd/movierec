import *  as types from "../actions/types";

const INITIAL_STATE = {};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.ADD_RECOMMENDATION:
            var key = Object.keys(action.payload)[0];
            var value = Object.values(action.payload)[0];
            // js objects are immutable and hence cannot directly 
            // change a redux state object and expect it to flow to all 
            // connected components
            return {
                ...state,
                [key]: value,
            };
        case types.RESET_RECOMMENDATION:
            return INITIAL_STATE;
        default:
            return state;
    }
};