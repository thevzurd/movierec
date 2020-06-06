import { combineReducers } from "redux";

import videos from "./videosReducer";
import favvidoes from "./favVideoReducer";
import recommendations from "./recommendationReducer";

export default combineReducers({
    videos: videos,
    favvidoes: favvidoes,
    recommendations: recommendations,
});