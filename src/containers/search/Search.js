import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Image, ListItem, RecentlyPlayed } from "../../components";
import { useSelector } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import { useData } from "../../hooks/useData";
import { useLocation, useHistory } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import parse from "html-react-parser"
import { navigateToCategory } from "../../helpers/navigateToCategory";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#f7f7f7",
    minHeight: `calc(100vh - 120px)`,
    padding: theme.spacing(5, 0, 10, 0),
  },

  audioButton: {
    borderRadius: 20,
    fontWeight: "bold",
    marginRight: 20,
  },

  catergeryButton: {
    borderRadius: 20,
    fontWeight: "bold",
  },

  title: {
    color: theme.palette.primary.dark,
  },

  recentContainer: {
    padding: theme.spacing(3),
  },

  image: {
    boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    borderRadius: 15,
    width: "100%",
    height: "auto",
  },

  categoryItem: {
    cursor: "pointer",
    width: "25%",
    paddingRight: 20,
    //color: theme.palette.text.secondary,
    //marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    fontSize: theme.typography.subtitle2,

    [theme.breakpoints.down("xs")]: {
      width: "33%",
      paddingRight: 20,
      fontSize: 12,
    },
  },
}));

export default function Search() {
  const classes = useStyles();
  const { search } = useLocation();
  const history = useHistory();
  const theme = useTheme();

  const searchText = search.split("?")[1];
  const [activeTab, setActiveTab] = useState(1);

  const { offlineMode } = useSelector((state) => state.download);
  const { playing } = useSelector((state) => state.player);

  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  const handleCategoryClick = (id) => {
    navigateToCategory(id, history);
  };

  const {
    loading,
    totalPages,
    categorySearchTotalPages,
    currentPage,
    categorySearchCurrentPage,
    audioList,
    categoryList,
    changePage,
    changeCategorySearchPage,
  } = useData({
    searchText: searchText,
    offlineMode: offlineMode,
  });

  const handleChangePage = (_, page) => {
    changePage(page);
  };

  const handleCategorySearchChangePage = (_, page) => {
    changeCategorySearchPage(page);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    changePage(1);
  };

  const showPagination = !loading && audioList.length > 0 && totalPages > 1;
  const showCategoryPagination = !loading && categoryList.length > 0 && categorySearchTotalPages > 1;

  useEffect(() => {
    window?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div style={playing ? { paddingBottom: 150 } : { paddingBottom: 50 }} className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" mb={1} ml={1} className={classes.title} fontSize="h4.fontSize">
              <Box fontWeight="fontWeightBold" mr={2}>
                Result for
              </Box>
              <Box>{decodeURIComponent(searchText)}</Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box pb={3}>
              <Button
                className={classes.audioButton}
                size="large"
                variant={activeTab === 1 ? "contained" : "outlined"}
                color="primary"
                disableElevation
                onClick={() => handleTabChange(1)}
              >
                AUDIOS
              </Button>
              <Button
                className={classes.catergeryButton}
                size="large"
                variant={activeTab === 2 ? "contained" : "outlined"}
                color="primary"
                disableElevation
                onClick={() => handleTabChange(2)}
              >
                CATEGORIES
              </Button>
            </Box>
            {activeTab === 1 && (
              <Box>
                {audioList.length === 0 && (
                  <Box px={2} py={2}>
                    No result found
                  </Box>
                )}
                {audioList.map((item, key) => {
                  return <ListItem currentPlayingPosition="search" key={item.id} data={item} />;
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
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <Grid container>
                  {categoryList.length === 0 && (
                    <Box alignItems="center" px={2} my={2}>
                      No result found
                    </Box>
                  )}
                  {categoryList.map((item) => (
                    <Grid onClick={() => handleCategoryClick(item.id)} item className={classes.categoryItem}>
                      <Image src={item.image} className={classes.image} />
                      <Box
                        textAlign="center"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        py={1}
                        fontWeight="fontWeightMedium"
                      >
                        {parse(item.highlightName)}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {showCategoryPagination && (
                  <Box py={2} display="flex" justifyContent="flex-end">
                    <Pagination
                      onChange={handleCategorySearchChangePage}
                      size={matches ? "small" : "large"}
                      page={categorySearchCurrentPage}
                      count={categorySearchTotalPages}
                      variant="outlined"
                      shape="rounded"
                    />
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className={classes.title} mb={3} fontSize="h4.fontSize" fontWeight="fontWeightBold">
              HISTORY
            </Box>

            <RecentlyPlayed />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
