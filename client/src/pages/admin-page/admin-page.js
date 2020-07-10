import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import AdminAdd from '../../components/admin-add/admin-add';
import AdminDelete from '../../components/admin-delete/admin-delete';
import './admin-page.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
        width: '100%'
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        width: '20%'
    },
}));

function AdminPage(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="root">
            <p className="heading">ADMIN PAGE</p> <br />
            {/*
                ACCESSTOKEN: {this.props.accessToken} <br /><br /><br /><br />
        */}
            Welcome, {props.user}
            <br /><br /><br />
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Add a New Location" {...a11yProps(0)} />
                    <Tab label="Delete a Location(s)" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0} className="tabpanel">
                    <AdminAdd />
                </TabPanel>
                <TabPanel value={value} index={1} className="tabpanel">
                    <AdminDelete />
                </TabPanel>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        accessToken: state.website.accessToken,
        user: state.website.user
    };
};

export default withRouter(connect(mapStateToProps)(AdminPage));
