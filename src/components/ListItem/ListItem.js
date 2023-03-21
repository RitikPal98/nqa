import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, IconButton, Paper } from "@material-ui/core";
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
import PauseCircleOutlineRoundedIcon from "@material-ui/icons/PauseCircleOutlineRounded";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import LinkIcon from "@material-ui/icons/Link";
import parse from "html-react-parser";
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@material-ui/icons/Close";

import { ActionList, Image } from "../../components";
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

export default function ListItem({ data, currentPlayingPosition, children }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { downloadingIds } = useSelector((state) => state.download);
  const { id: currentPlayingId, playing } = useSelector(
    (state) => state.player
  );

  const { id, name, link, image, categoryId, category_id, highlightName } =
    data;

  const handlePlay = () => {
    dispatch(
      changeURL({
        name: name,
        link: link,
        id: id,
        image: image,
        categoryId: categoryId || category_id,
        currentPlayingPosition: currentPlayingPosition,
      })
    );
  };
  const togglePlay = () => {
    const player = document.getElementsByTagName("audio")[0];

    if (player) {
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
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

  // useEffect(() => {
  //   if (link.slice(-3) === "mp4") {
  //     setFileType("video/mp4");
  //   } else {
  //     setFileType("audio/mp3");
  //   }
  // }, []);

  // download notification toast  ##########################
  let toastId = React.useRef(id);

  const dismiss = () => toast.dismiss(toastId.current);

  return (
    <Paper variant="outlined" className={classes.mainContainer} style={{ backgruondColor: 'red' }}>
      <Image src={image} className={classes.image} />
      <Box
        px={1}
        py={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width={'100%'}
      >
          <Box display="flex" justifyContent="center" alignItems="center">
            {/* {id === currentPlayingId && ( */}
            <IconButton onClick={id === currentPlayingId ? togglePlay : handlePlay} size="small">
              {(playing && id === currentPlayingId) ? (
                <PauseCircleOutlineRoundedIcon
                  fontSize="large"
                  style={{ color: "#179992" }}
                />
              ) : (
                <PlayCircleOutlineIcon
                  fontSize="large"
                  style={{ color: "#179992" }}
                />
              )}
            </IconButton>
            {/* )} */}

            <Box
              onClick={handlePlay}
              className={classes.title}
              textAlign="left"
              fontWeight="fontWeightMedium"
              fontSize="subtitle2.fontSize"
              ml={1}
              pr={1}
            >
              {highlightName ? parse(highlightName) : name}
            </Box>
          </Box>

        <ActionList data={data} currentPlayingPosition={currentPlayingPosition} children={children} />
      </Box>
      <ToastContainer autoClose={1000} className="notification-container-copied" />
    </Paper>
  );
}
