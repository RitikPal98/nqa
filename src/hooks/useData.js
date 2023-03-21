/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import * as offlineAPI from "../db/services";
import { useDispatch } from "react-redux";
import { updateCurrentAudioList } from "../store/slices/playerSlice";
import { domain } from "../data/config";

export const useData = (props = {}) => {
    const dispatch = useDispatch();

    const { offlineMode = false, searchText = undefined, categoryId = undefined, shouldSearch = true } = props;
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [audioList, setAudioList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchCurrentPage, setCategorySearchCurrentPage] = useState(1);
    const [categorySearchTotalPages, setCategorySearchTotalPages] = useState(1);

    const getAudioListOnline = async () => {
        if (!shouldSearch) {
            return;
        }

        setLoading(true);

        let link = `${domain}/index.php/api/songView?page=${currentPage}`;

        if (searchText) {
            link = `${domain}/index.php/api/nameSong?song=${searchText}&page=${currentPage}`;
        }

        if (categoryId) {
            link = `${domain}/index.php/api/songCategory?page=${currentPage}&categoryId=${categoryId}`;
        }

        axios
            .get(link)
            .then((res) => {
                setAudioList(res.data.data);
                setTotalPages(res.data.allpage);
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    };

    const getAudioListOffline = async () => {
        if (!shouldSearch) {
            return;
        }

        try {
            setLoading(true);

            if (searchText) {
                const res = await offlineAPI.getAudioByName(searchText, currentPage);
                setAudioList(res.data);
                setTotalPages(res.allpage);
            } else if (categoryId) {
                const res = await offlineAPI.getAudioByCategory(categoryId, currentPage);
                setAudioList(res.data);
                setTotalPages(res.allpage);
            } else {
                const res = await offlineAPI.getAudio(currentPage);
                setAudioList(res.data);
                setTotalPages(res.allpage);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const changePage = (page) => {
        setCurrentPage(page);
    };

    const changeCategorySearchPage = (page) => {
        setCategorySearchCurrentPage(page);
    };

    useEffect(() => {
        if (!offlineMode) {
            getAudioListOnline();
        } else {
            getAudioListOffline();
        }
    }, [currentPage, searchText, categoryId]);

    useEffect(() => {
        const getCategoryList = async () => {
            const res = offlineAPI.getCategoryByName(searchText, categorySearchCurrentPage);
            setCategoryList(res.data);
            setCategorySearchTotalPages(res.allpage);
        };

        if (searchText) {
            getCategoryList();
        }
    }, [categorySearchCurrentPage, searchText]);

    useEffect(() => {
        dispatch(updateCurrentAudioList(audioList));
    }, [audioList]);

    return {
        changePage,
        changeCategorySearchPage,
        currentPage,
        categorySearchCurrentPage,
        totalPages,
        categorySearchTotalPages,
        audioList,
        categoryList,
        loading,
    };
};
