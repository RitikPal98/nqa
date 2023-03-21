import React, { useCallback, useEffect, useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, IconButton, Paper, useMediaQuery } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { addToDowanloadingQueue } from "../../store/slices/downloadSlice";
import { changeURL } from "../../store/slices/playerSlice";
import { changeFav } from "../../store/slices/favoriteSlice";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import Facebook from "@material-ui/icons/Facebook";
import Twitter from "@material-ui/icons/Twitter";
import Email from "@material-ui/icons/Mail";
import Whatsapp from "@material-ui/icons/WhatsApp";
import DownloadIcon from "@material-ui/icons/GetApp";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/ShareOutlined";
import ListIcon from "@material-ui/icons/ListRounded";
import PauseCircleOutlineRoundedIcon from "@material-ui/icons/PauseCircleOutlineRounded";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import LinkIcon from "@material-ui/icons/Link";
import parse from "html-react-parser";
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@material-ui/icons/Close";


import { Image } from "../../components";
import DialogBox from "../DialogBox/DialogBox";
import { useMemo } from "react";
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    mainContainer: {
        display: "flex",
        marginBottom: theme.spacing(2),
        borderRadius: 10,
        overflow: "hidden",

        [theme.breakpoints.down("sm")]: {
            //padding: theme.spacing(3, 1, 3, 1),
        },

        [theme.breakpoints.up("sm")]: {
            //padding: theme.spacing(1, 1, 1, 1),
        },
    },
    title: {
        cursor: "pointer",
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            fontSize: 14,
        },

        [theme.breakpoints.up("sm")]: {
            fontSize: 16,
        },
    },

    buttonContianer: {
        height: 26,
        width: 26,
    },
    image: {
        height: 100,
        width: 100,
    },

    buttonOutline: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        border: "solid 0.1rem green",
        height: 15,
        width: 15,
        margin: theme.spacing(0, 1, 0, 1),
        padding: 0,
    },

    button: {
        height: 12,
        width: 12,
        color: "green",
    },
}));

export default function ActionList({ data, currentPlayingPosition, children }) {
    const dispatch = useDispatch();
    const [isDownloaded, setIsDownloaded] = useState(false);
    const { downloadingIds } = useSelector((state) => state.download);
    const { id: currentPlayingId, playing } = useSelector(
        (state) => state.player
    );

    const { id, name, link, image, categoryId, category_id } =
        data;

    const handleDownload = async () => {
        if (isDownloaded) {
            try {
                const cache = await caches.open("audio_cache");
                const res = await cache.delete(new Request(link));
                if (res) setIsDownloaded(false);
            } catch (error) { }
        } else {
            dispatch(
                addToDowanloadingQueue({
                    name: name,
                    id: id,
                    link: link,
                    image: image,
                    categoryId: categoryId || category_id,
                    currentPlayingPosition: currentPlayingPosition,
                    progress: 0,
                })
            );
        }
    };

    useEffect(() => {
        caches
            .match(new Request(link))
            .then((res) => {
                if (res) setIsDownloaded(true); //checking whether already downloaaded
            })
            .catch((e) => { });
    }, [downloadingIds, link]);

    //  favorite category related code
    const { favorite } = useSelector((state) => state.favorite);
    const [present, setPresent] = useState(false);
    const [display, setDisplay] = useState(false);
    const [playlist, setPlaylist] = useState(false);
    // const [fileType, setFileType] = useState("audio/mp3");
    const notify = (message) =>
        toast.success(message, {
            position: "bottom-left",
            autoClose: true,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    useEffect(() => {
        if (favorite.find((item) => item.id === id)) {
            setPresent(true);
        } else {
            setPresent(false);
        }
    }, [id, favorite]);

    // useEffect(() => {
    //   if (link.slice(-3) === "mp4") {
    //     setFileType("video/mp4");
    //   } else {
    //     setFileType("audio/mp3");
    //   }
    // }, []);

    // download notification toast  ##########################
    let toastId = React.useRef(id);
    const notifys = () =>
    (toastId.current = toast.loading("Downloading please wait...", {
        position: toast.POSITION.BOTTOM_LEFT,
        closeButton: CloseButton,
    }));
    const dismiss = () => toast.dismiss(toastId.current);
    const CloseButton = () => (
        <i className="material-icons" onClick={dismiss}>
            <CloseIcon />
        </i>
    );

    // Current blob size limit is around 500MB for browsers
    function forceDownload(blob, filename) {
        var a = document.createElement("a");
        a.download = filename;
        a.href = blob;
        // For Firefox https://stackoverflow.com/a/32226068
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast.update(toastId.current, {
            render: "Downloaded",
            type: "success",
            isLoading: false,
        });
        dismiss();
    }


    function downloadResource(url, filename) {
        notifys();
        if (!filename) filename = url.split("\\").pop().split("/").pop();
        filename = filename.replace(".", "  ")
        fetch(url, {
            headers: new Headers({
                Origin: window.location.origin,
            }),
            mode: "cors",
        })
            .then((response) => response.blob())
            .then((blob) => {
                let blobUrl = window.URL.createObjectURL(blob);
                forceDownload(blobUrl, filename);
            })
            .catch((e) => console.error(e));
    }

    function handleFavorite() {
        dispatch(
            changeFav({
                name: name,
                link: link,
                id: id,
                image: image,
                categoryId: categoryId || category_id,
                currentPlayingPosition: currentPlayingPosition,
            })
        );
    }

    const sm = useMediaQuery('(max-width:500px)')
    const w400 = useMediaQuery('(max-width:400px)')

    const handleClose = () => {
        setDisplay(false)
    }

    const handleDialog = useCallback(() => {
        setPlaylist(false);
    },[])

    const DialogBoxMemo = useMemo(() => <DialogBox open={playlist} handleClose={handleDialog} title={"Add Playlist"} data={data} />, [data, handleDialog, playlist])

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" gridGap={6} style={{ position: 'relative', marginTop: (sm && currentPlayingPosition !== 'player') ? '0px' : '' }}>
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
                        {
                            (!display) &&
                            <>
                                {currentPlayingPosition !== "player" && (
                                    <IconButton
                                        disabled={downloadingIds.includes(id)}
                                        onClick={handleDownload}
                                        size="small"
                                    >
                                        <CheckCircleIcon
                                            className="check-cache-icon"
                                            style={
                                                isDownloaded
                                                    ? { color: "rgb(16, 180, 102)" }
                                                    : { color: "gray" }
                                            }
                                        />
                                    </IconButton>
                                )}
                                <IconButton size="small">
                                    <a
                                        className="download-icon-container"
                                        data-tip="downloading"
                                        // href={`data:${fileType},` + link}
                                        // target="_blank"
                                        // download={name}
                                        onClick={() => {
                                            // notify("downloading")
                                            downloadResource(link, name);
                                        }}
                                    >
                                        <DownloadIcon style={{ color: currentPlayingPosition === "player" ? 'white' : '#777' }} />
                                    </a>
                                </IconButton>
                                <IconButton onClick={handleFavorite} size="small">
                                    <FavoriteBorderIcon
                                        style={
                                            present ? { color: "rgb(240,100,100)" } : { color: currentPlayingPosition === "player" ? "white" : "#777" }
                                        }
                                    />
                                </IconButton>
                                <IconButton
                                    onClick={() => setDisplay(true)}
                                    size="small"
                                >
                                    <ShareIcon style={{ color: currentPlayingPosition === "player" ? "white" : "#777" }} />
                                </IconButton>
                                <IconButton
                                    onClick={() => setPlaylist(true)}
                                    size="small"
                                >
                                    <ListIcon style={{ color: currentPlayingPosition === "player" ? "white" : "#777" }} />
                                </IconButton>
                            </>
                        }
                        {display && (
                            <div
                                className={`share-btn ${currentPlayingPosition !== 'player' ? '' : ''}`}
                            >
                                <IconButton
                                    data-tip="Copy the link"
                                    className="btn-link"
                                    onClick={(e) => {
                                        notify("Link has been copied");
                                        e.target.style.color = "rgb(29,161,245)";
                                        setTimeout(() => {
                                            e.target.style.color = "#777";
                                        }, 2000);
                                        navigator.clipboard.writeText(link);
                                    }}
                                    size="small"
                                >
                                    <ReactTooltip place="top" type="dark" effect="float" />
                                    <LinkIcon />
                                </IconButton>

                                <a
                                    data-tip="Share on Twitter"
                                    class="btn-twitter"
                                    href={`https://twitter.com/share?url=${link}&text=Assalamo alaykum. What do you think of this audio?`}
                                    // onClick={(e) => {
                                    //     window.open(
                                    //         "https://twitter.com/share?url=" +
                                    //         link +
                                    //         "&text=Assalamo alaykum. What do you think of this audio?",
                                    //         "Twitter",
                                    //         "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
                                    //     );
                                    //     return false;
                                    // }}
                                    target="_blank"
                                    title="Share on Twitter"
                                    style={{ color: (currentPlayingPosition === 'player' || !w400) ? 'white' : '#777' }}
                                >
                                    <ReactTooltip place="top" type="dark" effect="float" />
                                    <Twitter />
                                </a>
                                <a
                                    data-tip="Share on Facebook"
                                    class="btn-facebook"
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${link}`}
                                    // onClick={(e) => {
                                    //     window.open(
                                    //         "https://www.facebook.com/sharer/sharer.php?u=" + link,
                                    //         "",
                                    //         "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
                                    //     );
                                    //     return false;
                                    // }}
                                    target="_blank"
                                    title="Share on Facebook"
                                    style={{ color: (currentPlayingPosition === 'player' || !w400) ? 'white' : '#777' }}
                                >
                                    <ReactTooltip place="top" type="dark" effect="float" />
                                    <Facebook />
                                </a>
                                <a
                                    data-tip="Share on Whatsapp"
                                    class="btn-whatsapp"
                                    href={
                                        "https://api.whatsapp.com/send?text=Assalamo alaykum. What do you think of this audio?" +
                                        link
                                    }
                                    // onClick={(e) => {
                                    //     window.open(
                                    //         "https://api.whatsapp.com/send?text=Assalamo alaykum. What do you think of this audio? " +
                                    //         link,
                                    //         "",
                                    //         "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
                                    //     );
                                    //     return false;
                                    // }}
                                    target="_blank"
                                    title="Share on Whatsapp"
                                    style={{ color: (currentPlayingPosition === 'player' || !w400) ? 'white' : '#777' }}
                                >
                                    <ReactTooltip place="top" type="dark" effect="float" />
                                    <Whatsapp />
                                </a>

                                <a
                                    data-tip="Share on Email"
                                    className="btn-email"
                                    href={
                                        "mailto:?subject=Assalamo alaykum. What do you think of this audio?&body=" +
                                        link +
                                        "%0D%0A %0D%0A" +
                                        "More enlightening signs at " +
                                        "https://Listen.NurulQuran.com "
                                    }
                                    title="Share by Email"
                                    style={{ color: (currentPlayingPosition === 'player' || !w400) ? 'white' : '#777' }}
                                >
                                    <ReactTooltip place="top" type="dark" effect="float" />

                                    <Email />
                                </a>
                            </div>
                        )}
                    </div>
                </ClickAwayListener>
                {children}
            </Box>
            {/* <DialogBox open={playlist} handleClose={handleDialog} title={"Add Playlist"} data={data} /> */}
            {DialogBoxMemo}
            <ToastContainer autoClose={1000} className="notification-container-copied" />
        </>
    );
}
