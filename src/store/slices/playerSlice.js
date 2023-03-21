import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import { domain } from "../../data/config";

export const fetchTopChart = createAsyncThunk("player/fetchTopChart", async (i, { dispatch, getState }) => {
    try {
            const response = await axios.get(`${domain}/index.php/api/topSong?page=${i}`);
            return response.data.data;
        
    } catch (error) {}
});


export const playerSlice = createSlice({
    name: "player",
    initialState: {
        open: false,
        playing: false,
        link: "",
        id: -1,
        name: "",
        categoryId: null,
        recentlyPlayed: [],
        topChart: [],
        currentAudioList: [],
        currentPlayingPosition: "home",
    },
    reducers: {
        play: (state) => {
            state.open = true;
        },

        toggle: (state, action) => {
            state.playing = action.payload;
        },
        closePlayer: (state) => {
            state.open = false;
            state.link = null;
            state.id = -1;
            state.playing = false;
        },
        updateCurrentAudioList: (state, action) => {
            state.currentAudioList = action.payload;
        },
        playNextOrPrevious: (state, action) => {
            let selectedList = [];
            let newArrayIndex = 0;

            if (state.currentPlayingPosition === "home" || "category" || "search" || "playlist") {
                selectedList = current(state).currentAudioList;
            }

            if (state.currentPlayingPosition === "recentlyPlayed") {
                selectedList = current(state).recentlyPlayed;
            }

            if (state.currentPlayingPosition === "topChart") {
                selectedList = current(state).topChart;
            }

            const currentArrayIndex = selectedList.findIndex((item) => item.id === current(state).id);

            if (action.payload === "next") newArrayIndex = currentArrayIndex + 1;
            if (action.payload === "previous") newArrayIndex = currentArrayIndex - 1;

            if (newArrayIndex < 0) newArrayIndex = 0;
            if (newArrayIndex >= selectedList.length) newArrayIndex = 0;
            const audio = selectedList[newArrayIndex];
            state.link = audio?.link;
            state.name = audio?.name;
            state.id = audio?.id;
            state.categoryId = audio?.categoryId || audio?.category_id;
        },
        changeURL: (state, action) => {
            state.link = action.payload.link;
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.categoryId = action.payload.categoryId;
            state.open = true;
            state.currentPlayingPosition = action.payload.currentPlayingPosition;

            if (state.recentlyPlayed.find((item) => item.id === action.payload.id)) return;

            //check the limit of the recently played
            if (state.recentlyPlayed.length === 40) {
                state.recentlyPlayed.splice(0, 1);
                state.recentlyPlayed.push({
                    link: action.payload.link,
                    name: action.payload.name,
                    id: action.payload.id,
                    image: action.payload.image,
                    categoryId: action.payload.categoryId,
                });
            } else {
                state.recentlyPlayed.push({
                    link: action.payload.link,
                    name: action.payload.name,
                    id: action.payload.id,
                    image: action.payload.image,
                    categoryId: action.payload.categoryId,
                });
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchTopChart.fulfilled, (state, action) => {
            state.topChart = action.payload;
        });
    },
    
});

export const { play, toggle, closePlayer, changeURL,updateCurrentAudioList, playNextOrPrevious } = playerSlice.actions;

export default playerSlice.reducer;