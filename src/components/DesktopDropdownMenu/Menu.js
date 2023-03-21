/* eslint-disable react-hooks/exhaustive-deps */
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSubCategoryIds, getSubCategoryNamesByIds } from '../../db/services';
import { navigateToCategory } from "../../helpers/navigateToCategory";
import SubMenu from "./SubMenu";
import {changeSubCatsVisible} from "../../store/slices/favoriteSlice";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    paper: {
        marginRight: theme.spacing(2),
    },

    buttonLebel: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    button: {
        fontSize: 14,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: 40,
        zIndex: 10,
    },

    title: {
        fontSize: 14,
        display: "flex",
        alignItems: "center",
    },
}));

export default function Menu({ category }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();


    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleSelectCategory = ({ id }) => {
        dispatch(
            changeSubCatsVisible(
                {
                    subCatsVisible: false
                }
            )
        )
        navigateToCategory(id, history);
        setOpen(false);
    };

    const rederCategories = useCallback((categories) => {
        return categories?.map((category, key) => {
            if (category.subCategories) {
                return (
                    <SubMenu key={key} label={category.name}>
                        {rederCategories(category.subCategories)}
                    </SubMenu>
                );
            }
            return (
                <MenuItem onClick={() => handleSelectCategory(category)} key={key} className={classes.title}>
                    {category.name}
                </MenuItem>
            );
        });
    }, []);

    return (
        <div className={classes.root}>
            <div style={{ width: "100%" }}>
                <MenuItem className={classes.button} ref={anchorRef} onClick={handleToggle}>
                    {category.name}
                </MenuItem>

                <Popper
                    placement="bottom-start"
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    style={{zIndex: 100}}
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: "top left",
                            }}
                            timeout={250}
                        >
                            <Paper style={{ marginTop: 0, marginBottom: 0 }}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {rederCategories(category?.subCategories)}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}
