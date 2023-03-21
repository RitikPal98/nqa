import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Breadcrumbs, Link, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { changeURL } from "../../store/slices/playerSlice";
import Image from "../Image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import categoryStructure from "../../data/category-strcture";
import { useHistory } from "react-router-dom";
import { navigateToCategory } from "../../helpers/navigateToCategory";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Home from "@material-ui/icons/Home";
import { changeSubCatsVisible } from "../../store/slices/favoriteSlice";



const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),

    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(0),
    },
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: 850,
    textAlign: "center",
    color: theme.palette.text.secondary,
  },

  image: {
    boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    borderRadius: 15,
    width: 150,
    height: 150,

    [theme.breakpoints.down("xs")]: {
      width: 100,
      height: 100,
    },
  },

  title: {
    color: theme.palette.primary.dark,
  },

  item: {
    cursor: "pointer",
    width: 150,
    fontSize: theme.typography.fontSize,
    padding: theme.spacing(0),
    [theme.breakpoints.down("xs")]: {
      width: 10,
    },
  },

  catLink: {
    cursor: "pointer",
    color: "black",
    padding: theme.spacing(0),
    overflow: "hidden",
    textOverflow: "ellipses",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      width: 10,
    },
  },
  categoryContainer: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
    borderRadius: 10,

    // [theme.breakpoints.down("sm")]: {
    //     display: "flex",
    //     flexDirection: "row",
    //     justifyContent: "left",
    //     height: 100,
    //     alignItems: "center",
    // },
},
}));



export default function CategorySlider({ data, getMore }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [subCategories, setSubCategories] = useState([]);
  const [currCategory, setCurrCategory] = useState({});
  const [currSubCategory, setCurrSubCategory] = useState({});
  const [history, setHistory] = useState([{id: 0, name: "Home"}]);
  const browserHistory = useHistory();
  const [isSubCatVisible, setIsSubCatVisible] = useState(true);
  const {subCatsVisible} = useSelector((state) => state.favorite);

  const handlePlay = (item) => {
    dispatch(
      changeURL({
        name: item.name,
        link: item.link,
        id: item.id,
        image: item.image,
        categoryId: item.categoryId || item.category_id,
        currentPlayingPosition: "topChart",
      })
    );
  };

  let settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ],
    autoplaySpeed: 2000,
    cssEase: "linear",
    
  };

  useEffect(() => {
    if(currCategory.subCategories){
      setSubCategories(currCategory.subCategories);
      if (history.indexOf(currCategory) === -1){
        var hist = [{id: 0, name: "Home"}];
        hist.push(currCategory);
        setHistory(hist); 
      }
    } else{
      setSubCategories([]);
    }
  }, [currCategory])

  var subCatOnClick = (item) => {
    if(item == currSubCategory){
      return
    }
    if (history.indexOf(item) === -1){
      var hist = history; 
      hist.push(item);
      setHistory(hist);
    }
    if(item.subCategories){
      setCurrSubCategory(item);
      setSubCategories(item.subCategories);
      // if (history.indexOf(item) === -1){
      //   var hist = history; 
      //   hist.push(item);
      //   setHistory(hist);
      // }
    } else{ 
      //DO ROUTING
      //setSubCategories([]);
      setCurrSubCategory(item);
      handleSelectCategory(item);
    }
    !isSubCatVisible && setIsSubCatVisible(true)
  }

  var handleHistoryClick = (item) => {
    if(item.id === 0){
      setCurrCategory({})
      setSubCategories([])
      setCurrSubCategory({})
      setHistory([history[0]])
      browserHistory.push('/');
    } else{
      setHistory(history.slice(0,history.indexOf(item)+1))
      if(item.subCategories){
        setSubCategories(item.subCategories)
      }
    }
    !isSubCatVisible && setIsSubCatVisible(true)
  }

  const handleSelectCategory = ({ id }) => {
    setIsSubCatVisible(false);
    navigateToCategory(id, browserHistory);
  };

  

  return (
    <div className={classes.root}>
      <Box className={classes.title} mb={1} ml={1} fontSize="h4.fontSize" fontWeight="fontWeightBold">
        Categories
      </Box>
      <div onClick={getMore} >
        <Slider 
          
        {...settings}>
          {
            categoryStructure.map((item) => (
              <div className={classes.item} key={item.id}>
                <Box>
                  <Image 
                    onClick={() => {
                      dispatch(
                        changeSubCatsVisible({
                          subCatsVisible: true
                        })
                      )
                      setCurrCategory(item)
                      !isSubCatVisible && setIsSubCatVisible(true)
                    }} 
                    src={item.image} className={classes.image}/>
                </Box>
                <Box textAlign="center" textOverflow="ellipsis" overflow="hidden" py={1} fontSize={12}>
                  {item.name}
                </Box>
              </div>
            ))
          }
          </Slider>
          </div>
      {
        subCategories.length > 0 && subCatsVisible?
        <>
        <Box className={classes.title} mb={3} ml={1} fontSize="h4.fontSize" fontWeight="fontWeightBold">
            <Breadcrumbs >
              {
                history.map((item, idx) => (
                  <span key={`history-${item.id}`}>
                    {/* {idx !== 0 ? ">" : ""} */}
                    
                    <Link className = {classes.catLink} 
                      onClick = {
                        item.id !== currSubCategory.id ? 
                        () => handleHistoryClick(item) :
                        () => {}
                      }
                      textOverflow="ellipsis" overflow="hidden">
                      {idx === 0 ? <Home/> : item.name}
                    </Link>

                  </span>
                ))
              }
            </Breadcrumbs>
          
        </Box>
        {
          isSubCatVisible &&
      <div >
        {/* <Slider  */}
          <Grid container spacing={2}>

          {/* {...settings} */}
            {
              subCategories.map((item) => (
                <Grid item className={classes.item} key={item.id} xs= {6} lg={3} sm={6} md={4}>
                  <Paper variant="outlined" className={classes.categoryContainer}>
                      <Box>
                        <Image  onClick={() => subCatOnClick(item)} src={item.image} className={classes.image}/>
                      </Box>
                      <Box textAlign="center" textOverflow="ellipsis" overflow="hidden" py={1} fontSize={12}>
                        {item.name}
                      </Box>
                  </Paper>
                </Grid>
              ))
            }
          </Grid>
          
          {/* </Slider> */}
          </div>
        }
        </> : <></>
      }
      
    </div>

  );
}
