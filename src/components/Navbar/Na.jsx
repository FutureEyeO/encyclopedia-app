import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { v4 } from 'uuid';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function TemporaryDrawer() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

   const handleOpen = () => {
       setOpen(!open)
   }

    const list = (anchor) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={handleOpen()}
        >
            <List>
                <ListItem button key={v4()}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary="u" />
                </ListItem>
            </List>
            <Divider />

        </div>
    );

    return (
        <div>
                <React.Fragment key={anchor}>
                    <Button onClick={handleOpen()}></Button>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
        
        </div>
    );
}
