import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as offlineAPI from "../../db/services";
import { json } from "../../db/output"

export const downloadAudio = createAsyncThunk("download/audio", async ({ id, link }, { dispatch, signal }) => {
    const source = axios.CancelToken.source();
    signal.addEventListener("abort", () => {
        source.cancel();
    });

    const httpsLink = link.replace("http://", "https://");

    try {
        await axios({
            url: httpsLink,
            method: "get",
            onDownloadProgress: (progressEvent) => {
                let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch(downalodSlice.actions.updateDownloadProgress({ id, progress }));
            },
            cancelToken: source.token, // to cancel  donwalod from the download notificaiotn
        });
    } catch (error) { }
});

export const downloadAudioList = createAsyncThunk("downalod/audioList", async (_, { dispatch }) => {
    const getAudioListFromAllPages = async (page = 1) => {
        return json;
        /* const query = `${domain}/index.php/api/songView?page=${page}`;
        const response = await axios.get(query);
        const data = response.data;

        dispatch(downalodSlice.actions.updateAudioListDownloadProgress({ page, allpage: data?.allpage }));

        if (data.allpage > page) {
            return data.data.concat(await getAudioListFromAllPages(page + 1));
        } else {
            return data.data;
        }
        */
    };

    try {
        const res = await getAudioListFromAllPages();
        await offlineAPI.addAudio(res);
    } catch (error) { }
});

export const downalodSlice = createSlice({
    name: "player",
    initialState: {
        audioListDownloadProgress: 0,
        audioListDownaloding: false,
        downloadingQueue: [],
        cachelist: [],
        downloadingIds: [],
        offlineMode: false,
    },
    reducers: {
        updateOfflineStatus: (state, action) => {
            state.offlineMode = action.payload;
            localStorage.setItem("offline_mode", action.payload);
        },
        addToDowanloadingQueue: (state, action) => {
            state.downloadingQueue.push(action.payload);
            state.downloadingIds.push(action.payload.id);
            state.cachelist.push(action.payload);
        },

        updateDownloadProgress: (state, action) => {
            const downloadItem = state.downloadingQueue.find((item) => item.id === action.payload.id);
            downloadItem.progress = action.payload.progress;
        },

        updateAudioListDownloadProgress: (state, action) => {
            const percentage = (action.payload.page * 100) / action.payload.allpage;
            state.audioListDownloadProgress = Math.round(percentage);
        },
        changeCache: (state, action) => {
            if (state.cachelist.find((item) => item.id === action.payload.id)) {
                let a = state.cachelist.filter((item) => item.id !== action.payload.id)
                // console.log("!!!!!!!!!!!!!!!!!!!",a)
                state.cachelist = a
                return
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(downloadAudio.fulfilled, (state, action) => {
            state.downloadingQueue = state.downloadingQueue.filter((item) => item.id !== action.meta?.arg?.id);
            state.downloadingIds = state.downloadingIds.filter((item) => item !== action.meta?.arg?.id);
        });

        builder.addCase(downloadAudio.rejected, (state, action) => {
            state.downloadingQueue = state.downloadingQueue.filter((item) => item.id !== action.meta?.arg?.id);
            state.downloadingIds = state.downloadingIds.filter((item) => item !== action.meta?.arg?.id);
        });

        builder.addCase(downloadAudioList.pending, (state) => {
            state.audioListDownaloding = true;
        });

        builder.addCase(downloadAudioList.rejected, (state) => {
            state.audioListDownaloding = false;
            state.audioListDownloadProgress = 0;
        });

        builder.addCase(downloadAudioList.fulfilled, (state) => {
            state.audioListDownaloding = false;
            state.audioListDownloadProgress = 0;
            state.offlineMode = true;
            localStorage.setItem("offline_mode", true);
        });
    },
});

export const { addToDowanloadingQueue, updateOfflineStatus, changeCache } = downalodSlice.actions;

export default downalodSlice.reducer;