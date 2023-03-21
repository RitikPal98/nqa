import { Box, Button, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Image from '../Image/Image';
import { ToastContainer, toast } from 'react-toastify';

export default function DialogBox({ open = false, handleClose, title, data }) {
    const [playlistName, setPlaylistName] = useState('')
    const [options, setOptions] = useState([])
    const [handleError, setHandleError] = useState({
        error: false,
        message: ''
    })

    const addSongToPlaylist = () => {
        // console.log('[addSongToPlaylist]')
        if (playlistName.length < 1) {
            return setHandleError({
                error: true,
                message: 'Kindly enter the name first'
            })
        }
        
        setHandleError({
            error: false,
            message: ''
            
        })

        
        let localData = JSON.parse(localStorage.getItem('playlist')) || [];
        
        
        if (localData.find(item => item[playlistName])) {
            // Check if exists
            if (localData.find(item => item[playlistName])[playlistName].some(song => song.id === data.id)) {
                return handleClose();
            }
            localData.find(item => item[playlistName])[playlistName].push(data)
            localStorage.setItem('playlist', JSON.stringify(localData))
        } else {
            localData.push({ [playlistName]: [data] })
            localStorage.setItem('playlist', JSON.stringify(localData))
        }
        
        handleClose();
        toast('Playlist have been saved...');
    }

    useEffect(() => () => {
        setPlaylistName('');
        setHandleError({
            error: false,
            message: ''
        })
    }, [open]);

    useEffect(() => {
        let localData = JSON.parse(localStorage.getItem('playlist')) ?? [];
        if (localData.length > 0) setOptions(() => localData.map((name) => Object.keys(name)))
    }, [open])

    const keyPressHandler = e => {
        if (e.key === "Enter") { 
            addSongToPlaylist();
        }
    }

    return (
        <Dialog onClose={handleClose} open={open} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <Image src={data?.image} />
            <Box as="p" textAlign={'center'} paddingTop={3}>{data?.name}</Box>
            <Box margin={2}>
                <TextField label="Playlist" fullWidth value={playlistName} onKeyPress={keyPressHandler} error={handleError.error} helperText={handleError.message} onChange={(event) => setPlaylistName(event.target.value)} />
            </Box>
            <Box margin={2}>
                {/* <FormControl variant="standard"> */}
                <InputLabel id="demo-simple-select-standard-label">Select Playlist</InputLabel>
                <Select
                    fullWidth
                    value={playlistName}
                    onChange={(event) => setPlaylistName(event.target.value)}
                    label="Select Playlist"
                >
                    <MenuItem value="">
                        <em>Select Playlist</em>
                    </MenuItem>
                    {
                        options.map((item, index) =>
                            <MenuItem value={item} key={`option--${index}`}>{item}</MenuItem>
                        )
                    }
                </Select>
                {/* </FormControl> */}
            </Box>
            <Box gap={2} margin={2} marginY={2}>
                <Button fullWidth variant="contained" color="primary" onClick={addSongToPlaylist}>Save</Button>
                <Button fullWidth variant="text" onClick={() => handleClose()}>Cancel</Button>
            </Box>
            <ToastContainer autoClose={1000} className="notification-container-copied" />
        </Dialog>
    )
}
