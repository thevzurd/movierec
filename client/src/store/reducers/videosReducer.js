import *  as types from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.FETCH_VIDEOS:
            return action.payload;
        case types.ADD_VIDEO:
            var key = Object.keys(action.payload)[0];
            var value = Object.values(action.payload)[0];
            // js objects are immutable and hence cannot directly 
            // change a redux state object and expect it to flow to all 
            // connected components
            return {
                ...state,
                [key]: value,
            };
        case types.REMOVE_VIDEO:
            return _.omit(state, action.payload);
        case types.RESET_VIDEO:
            return INITIAL_STATE;
        default:
            return state;
    }
};