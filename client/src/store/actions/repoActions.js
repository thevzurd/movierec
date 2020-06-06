import * as types from "./types";

/// Fetch video info with videoID
export const fetchVideos = (videos) => {
    return {
        type: types.FETCH_VIDEOS,
        payload: videos,
    };
};

/// Add Video
export const addVideo = (video) => {
    return {
        type: types.ADD_VIDEO,
        payload: video,
    };
};

/// Remove Video
export const removeVideo = (videoID) => {
    return {
        type: types.REMOVE_VIDEO,
        payload: videoID,
    };
};

/// Add FavouriteVideo
export const addFavouriteVideo = (video) => {
    return {
        type: types.ADD_FAVVIDEO,
        payload: video,
    };
};

/// Remove FavouriteVideo
export const removeFavouriteVideo = (videoID) => {
    return {
        type: types.REMOVE_FAVVIDEO,
        payload: videoID,
    };
};

/// Reset FavouriteVideo
export const resetFavouriteVideo = () => {
    return {
        type: types.RESET_FAVVIDEO,
    };
};

/// Reset FavouriteVideo
export const resetVideo = () => {
    return {
        type: types.RESET_VIDEO,
    };
};

/// Add Recommendations
export const addRecommendations = (video) => {
    return {
        type: types.ADD_RECOMMENDATION,
        payload: video,
    };
};

/// Reset Recommendations
export const resetRecommendations = () => {
    return {
        type: types.RESET_RECOMMENDATION
    };
};