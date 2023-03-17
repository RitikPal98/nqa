import { Box, Button, Container, IconButton, TextField, useMediaQuery, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from '@material-ui/icons/Create';
import Pagination from "@material-ui/lab/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "swiper/components/pagination/pagination.min.css";
import "swiper/swiper.min.css";
import { Image, ListItem } from "../../components";
import { getCategoryByNameAndSubCategoryNames } from "../../db/services";
import { useData } from "../../hooks/useData";
import { changeFav } from "../../store/slices/favoriteSlice";
import { toast } from "react-toastify";
import CloseRounded from '@material-ui/icons/CloseRounded';
import { updateCurrentAudioList } from "../../store/slices/playerSlice";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "#f7f7f7",
        minHeight: `calc(100vh - 120px)`,
        padding: theme.spacing(5, 0, 10, 0),
    },

    image: {
        width: "70%",
        borderRadius: 1000,

        [theme.breakpoints.down("sm")]: {
            width: 100,
            marginRight: theme.spacing(5),
        },
    },

    categoryContainer: {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        [theme.breakpoints.down("sm")]: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            height: 100,
            alignItems: "center",
        },
    },
}));

const normalizeCategoryName = (name) => {
    return name?.replace(/-/g, ' ').replace('%26', '&').replace('%2B', '+');
};

export default function PlaylistDetail() {
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    const { state: {item, index} } = useLocation();
    const [playlistItems, setPlaylistItems] = useState(item[Object.keys(item)] ?? [])
    const [playlistName, setPlaylistName] = useState(Object.keys(item))
    const [editable, setEditable] = useState(false)
    const theme = useTheme();
    const [categoryDetails, setCategoryDetails] = useState(null);
    const categoryId = categoryDetails?.id;


    const { offlineMode } = useSelector((state) => state.download);
    const { playing } = useSelector((state) => state.player);

    const matches = useMediaQuery(theme.breakpoints.down("xs"));

    const { loading, totalPages, currentPage, audioList, changePage } = useData({
        offlineMode,
        categoryId,
        shouldSearch: !!categoryDetails,
    });

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateCurrentAudioList(playlistItems))
    }, [playlistItems])

    const handleChangePage = (_, page) => {
        changePage(page);
    };

    const handleRemove = (index) => {
        const localData = JSON.parse(localStorage.getItem('playlist'))
        const currentIndex = localData.findIndex(item => item[Object.keys(item)]);
        const updatedArray = playlistItems.filter(play => play.id !== playlistItems[index].id)
        localData[currentIndex] = {[playlistName]: updatedArray}
        localStorage.setItem('playlist', JSON.stringify(localData))
        setPlaylistItems(updatedArray);
        toast('Audio removed...')
    }

    const showPagination = !loading && audioList.length > 0 && totalPages > 1;

    useEffect(() => {
        window?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    function handleEdit() {
        setEditable(pre => !pre)
    }
    
    function handleSave () {
        const localData = JSON.parse(localStorage.getItem('playlist'))
        if (localData.find(audio => audio[playlistName])) {
        handleEdit()
        return toast('Name already exists!')
        }
        localData[index] = {[playlistName]: playlistItems}
        localStorage.setItem('playlist', JSON.stringify(localData))
        toast('Playlist updated')
        handleEdit()
    }

    function handleDelete () {
        const localData = JSON.parse(localStorage.getItem('playlist'))
        localData.splice(index, 1);
        localStorage.setItem('playlist', JSON.stringify(localData))
        toast('Playlist deleted')
        history.goBack()
    }

    return (
        <div style={playing ? { paddingBottom: 150 } : { paddingBottom: 50 }} className={classes.root}>
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper variant="outlined" className={classes.categoryContainer}>
                            <Image className={classes.image} src={categoryDetails?.image} alt="cover_image" />
                            {!editable ? <Box
                                textAlign="center"
                                className={classes.title}
                                my={3}
                                fontSize="h6.fontSize"
                                fontWeight="fontWeightBold"
                            >
                                {playlistName}
                            </Box> : <TextField value={playlistName} label={'Playlist Name'} onChange={(e) => setPlaylistName(e.target.value)} />}
                            {editable ? 
                            <Box>
                            <Button onClick={handleSave} color="primary">Save</Button>
                            <Button onClick={handleDelete} color="secondary">Delete</Button>

                            </Box>
                            : <IconButton onClick={handleEdit} size="small">
                                <CreateIcon />
                            </IconButton>}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {playlistItems.map((item, key) => {
                            return (
                                <ListItem currentPlayingPosition="playlist" key={item.id} data={item} 
                                children={
                                        <Button variant="contained" onClick={(e) => handleRemove(key)} color="secondary">
                                            <CloseRounded/>
                                        </Button>
                                }/>                             
                            )
                        })}

                        {showPagination && (
                            <Box py={2} display="flex" justifyContent="flex-end">
                                <Pagination
                                    onChange={handleChangePage}
                                    size={matches ? "small" : "large"}
                                    page={currentPage}
                                    count={totalPages}
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}