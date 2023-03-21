/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import { DownalodNotification, Backdrop, DesktopDropdownMenu, MobileDropdownMenu } from "../../components";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { downloadAudioList } from "../../store/slices/downloadSlice";
import ArchiveIcon from "@material-ui/icons/Archive";
import { version } from "../../data/config";
import { changeSubCatsVisible } from "../../store/slices/favoriteSlice";
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    display: "block",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    //marginRight: theme.spacing(2),
  },

  toolbar1: {
    minHeight: 60,
    [theme.breakpoints.up("md")]: {
      backgroundColor: theme.palette.primary.dark,
    },

    maxWidth: "100%",
  },
  toolbar2: {
    minHeight: 40,
    //maxWidth: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    textTransform: "none",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "16ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },

  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },

  rightMenu: {
    padding: theme.spacing(2),
    width: 300,
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  let history = useHistory();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isRightMenuOpen = Boolean(anchorEl);

  const { audioListDownloadProgress, audioListDownaloding, downloadingIds } = useSelector(
    (state) => state.download
  );

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    dispatch(
      changeSubCatsVisible(
        {
          subCatsVisible: false
        }
      )
    )
    history.push(`/search?${e.target.value}`);
  };

  const handleHomeButtom = () => {
    dispatch(
      changeSubCatsVisible(
        {
          subCatsVisible: false
        }
      )
    )
    history.push("/");
  };

  const handleOffline = async () => {
    if (localStorage.getItem("offline_mode") && localStorage.getItem("offline_mode") === 'true') return;
    dispatch(downloadAudioList());
  };

  const handleOnSelect = () => {
    setOpen((state) => !state);
  };

  useEffect(() => {
    handleOffline()
  }, [])

  // useEffect(() => {
  //     const getStatus = async () => {
  //         offlineAPI
  //             .getAudioCount()
  //             .then((res) => {
  //                 if (res > 0) dispatch(updateOfflineStatus(true));
  //             })
  //             .catch((e) => console.log(e));
  //     };
  //     getStatus();
  // }, []);

  const toggleMobileMenu = () => {
    setOpen((state) => !state);
  };

  useEffect(() => {
    if (open) {
      document.getElementById("app-main-content").style.display = " none";
    } else {
      document.getElementById("app-main-content").style.display = " unset";
    }
  }, [open]);
  return (
    <div className={classes.grow}>
      <Backdrop
        open={audioListDownaloding}
        progress={audioListDownloadProgress}
        message="Downloading data to enable offline search, please wait"
      />
      <AppBar style={{ boxShadow: "none" }} position="sticky">
        <Toolbar className={classes.toolbar1}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.sectionDesktop}>
            <Button onClick={handleHomeButtom} className={classes.title} color="inherit">
              NurulQuran
            </Button>
          </div>

          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={handleSearch}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div>
            <IconButton aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
              <ArchiveIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              className={classes.rightMenu}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              open={isRightMenuOpen}
              onClose={handleClose}
            >
              {/* <MenuItem button={false}>
                <Box dispatch="flex" justifyContent="center" alignItems="center">
                  Offline mode
                  <Switch color="primary" onClick={handleOffline} checked={offlineMode} />
                </Box>
              </MenuItem> */}
              <MenuItem onClick={() => {
                history.push("/favorites")
                handleClose()
              }} button={true}> Favorites </MenuItem>
              <MenuItem onClick={() => {
                history.push("/playlist")
                handleClose()
              }} button={true}> Playlist </MenuItem>
              <MenuItem button={false}>v{version}</MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                dispatch(downloadAudioList());
              }} button={true}>Update</MenuItem>
            </Menu>
          </div>

          {downloadingIds.length > 0 && <DownalodNotification />}
        </Toolbar>

        <Toolbar className={classes.toolbar2}>
          <DesktopDropdownMenu />
        </Toolbar>
      </AppBar>

      <MobileDropdownMenu open={open} onSelect={handleOnSelect} />
    </div>
  );
}
