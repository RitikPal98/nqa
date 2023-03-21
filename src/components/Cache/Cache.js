import {React, useState} from "react";
import { Box, IconButton } from "@material-ui/core";
import Image from "../Image";
import { makeStyles } from "@material-ui/core/styles";
import { changeURL } from "../../store/slices/playerSlice";
// import { changeCache } from "../../store/slices/playerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { changeCache } from "../../store/slices/downloadSlice";
import Pagination from '@material-ui/lab/Pagination';
import { getSubCategoryIds, getSubCategoryNamesByIds } from "../../db/services";
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

function Cache() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { cachelist } = useSelector((state) => state.download);
  const history = useHistory();
  const handlePlay = (name, link, id, image, categoryId) => {
    dispatch(changeURL({ name, link, id, image, categoryId,currentPlayingPosition: "home" }));
};
  const handleCache = (name, link, id, image, categoryId) => {
    dispatch(changeCache({ name, link, id, image, categoryId,currentPlayingPosition: "home" }));
};

const showPagination = (cachelist.length > 0);
const itemsPerPage = 10;
const [page, setPage] = useState(1);
const [noOfPages] = useState(Math.ceil(cachelist.length / itemsPerPage));

const handleChange = (event, value) => {
  setPage(value);
};


  return (
    <div className="favorite-container">
      {cachelist.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" my={10}>
                    No cached...
                </Box>
            )}
      {cachelist
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .reverse()
      .map((item, key) => (
        <Box
          className={classes.itemContainer}
          display="flex"
          alignItems="center"
          paddingTop={1}
          paddingBottom={1}
          key={key}
        >
          <Image src={item.image} className={classes.image} />

          <Box
            onClick={() => {
              if(item.link!=="category-link"){
                return handlePlay(item.name, item.link, item.id, item.image, item.categoryId)
                }}}
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
              {item.name}
            </p>
          </Box>
          <IconButton onClick={()=>handleCache(item.name, item.link, item.id, item.image, item.categoryId)}  className="fav-icon-container" size="small">
           <CheckCircleIcon className="check-cache-icon" />    
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

export default Cache;