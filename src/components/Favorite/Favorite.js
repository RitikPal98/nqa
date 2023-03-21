import { React, useState } from "react";
import "./Favorite.css";
import { Box, IconButton } from "@material-ui/core";
import Image from "../Image";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { changeURL } from "../../store/slices/playerSlice";
import { changeFav } from "../../store/slices/favoriteSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Pagination from "@material-ui/lab/Pagination";
import { navigateToCategory } from "../../helpers/navigateToCategory";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    borderRadius: 10,
    maxHeight: 400,
    overflowY: "scroll",

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(5),
    },

    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(3),
    },
  },

  itemContainer: {
    cursor: "pointer",
    display: "flex",
    width: "100%",
  },

  itemContainerCategory: {
    cursor: "pointer",
    display: "flex",
    width: "100%",
    backgroundColor: "#17999270",
  },

  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function Favorite() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { favorite } = useSelector((state) => state.favorite);
  const history = useHistory();
  const handlePlay = (name, link, id, image, categoryId) => {
    dispatch(
      changeURL({
        name,
        link,
        id,
        image,
        categoryId,
        currentPlayingPosition: "home",
      })
    );
  };
  const handleFavorite = (name, link, id, image, categoryId) => {
    dispatch(
      changeFav({
        name,
        link,
        id,
        image,
        categoryId,
        currentPlayingPosition: "home",
      })
    );
  };

  const showPagination = favorite.length > 0;
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [noOfPages] = useState(Math.ceil(favorite.length / itemsPerPage));

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="favorite-container">
      {favorite.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" my={10}>
          No favorite audios...
        </Box>
      )}
      {favorite
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .reverse()
        .map((item, key) => (
          <Box
            className={item.link === "category-link" ? classes.itemContainerCategory :classes.itemContainer}
            display="flex"
            alignItems="center"
            paddingTop={1}
            paddingBottom={1}
            key={key}
          >
            <Image src={item.image} className={classes.image} />

            <Box
              onClick={() => {
                if (item.link !== "category-link") {
                  return handlePlay(
                    item.name,
                    item.link,
                    item.id,
                    item.image,
                    item.categoryId
                  );
                }
              }}
              className="fav-name-container"
              marginLeft={2}
              fontWeight="fontWeightMedium"
              fontSize="body2.fontSize"
            >
              <p
                onClick={() => {
                  if (item.link === "category-link") {
                    navigateToCategory(item.id, history);
                  }
                }}
              >
                {" "}
                {item.name}
              </p>
            </Box>
            <IconButton
              onClick={() =>
                handleFavorite(
                  item.name,
                  item.link,
                  item.id,
                  item.image,
                  item.categoryId
                )
              }
              className="fav-icon-container"
              size="small"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>
        ))}
      {showPagination && (
        <Box py={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={noOfPages}
            page={page}
            onChange={handleChange}
            defaultPage={1}
            color="primary"
            showFirstButton
            showLastButton
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </div>
  );
}

export default Favorite;
