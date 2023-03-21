import React from 'react'
import Grid from "@material-ui/core/Grid";
import { Box } from "@material-ui/core";
import Cache from '../../components/Cache/Cache';
import Favorite from '../../components/Favorite/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import { RecentlyPlayed } from "../../components"

const useStyles = makeStyles((theme) => ({
    title: {
      color: "rgb(16, 107, 102)",
    },
  
    recentContainer: {
      padding: theme.spacing(3),
      borderRadius: 10,
    },
  }));
function FavoritePage() {
    const classes = useStyles();

    return (
        <div className="fav-redirect-container">
                <Grid item xs={12} md={4}>
                  <Box
                    className={classes.title}
                    mb={3}
                    fontSize="h4.fontSize"
                    fontWeight="fontWeightBold"
                  >
                    Favorites
                  </Box>
                  <Favorite />
                </Grid>
                <Grid  item xs={12} md={4}>
                  <Box
                    className={classes.title}
                    mb={3}
                    fontSize="h4.fontSize"
                    fontWeight="fontWeightBold"
                  >
                    Cached
                  </Box>
                  <Cache />
                </Grid>
                <Grid item xs={12} md={9}>
                <Box className={classes.title} mb={3} fontSize="h4.fontSize" fontWeight="fontWeightBold">
                  History
                </Box>

                <RecentlyPlayed />
                </Grid>
              </div>
    )
}

export default FavoritePage
