import React, { Component } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import ListIcon from '@material-ui/icons/List';

class MenuBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="static" style={{background: '#4091c7', borderRadius: '5px 5px 0px 0px'}}>
                <Toolbar>
                    {this.props.showPlayer &&
                    <IconButton color="inherit" aria-label="Menu" onClick={this.props.handleListClick}
                                style={{position: 'relative', float: 'right'}}>
                        <ListIcon/>
                    </IconButton>}
                    <Typography style={{marginLeft: 10}} variant="h6" color="inherit">
                        {this.props.showPlayer? 'Player' : 'Sessions List'}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

export default MenuBar;
