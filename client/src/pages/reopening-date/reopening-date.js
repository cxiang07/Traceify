// import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './reopening.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import fetchReopens from '../../redux/actions/reopening-actions';

function renderProvince(obj) {
  if (Object.keys(obj).length !== 0) {
    const current_phase = obj.current_stage - 1;
    return (
      <div>
        <h1
          style={{
            textAlign: 'center',
            fontSize: '1.5em',
            backgroundColor: 'rgb(135, 151, 170)',
          }}
        >
          {obj.province} is currently in Stage {obj.current_stage}
        </h1>
        <table id='provtable'>
          <tr>
            <th>Service</th>
            <th>Detail and restrictions for stage ... </th>
          </tr>
          {renderTableData(obj.phases[current_phase].restrictions)}
        </table>
        <b>
          Additional information is located{' '}
          <a href={obj.more} target='_blank'>
            here.
          </a>
        </b>
      </div>
    );
  }
  return <div>Utnapishtim</div>;
}

function getProvinceReopen(region, props) {
  for (const x in props.reopen) {
    if (x.province === region) {
      return x;
    }
  }
  return {};
}

function renderTableData(restrictions) {
  const list = Object.entries(restrictions);
  return list.map((mesage) => {
    for (const x of mesage) {
      // TODO: render the table
      return (
        <tr>
          <td>{x.replace(/_/gi, ' ').replace(/\n/g, '<br />')}</td>
          <td>{mesage[1]}</td>
        </tr>
      );
    }
  });
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const provterr = [
  { abbr: 'AB', province: 'Alberta' },
  { abbr: 'BC', province: 'British Columbia' },
  { abbr: 'MB', province: 'Manitoba' },
  { abbr: 'NB', province: 'New Brunswick' },
  { abbr: 'NL', province: 'Newfoundland' },
  { abbr: 'NT', province: 'Northwest Territories' },
  { abbr: 'NS', province: 'Nova Scotia' },
  { abbr: 'NU', province: 'Nunavut' },
  { abbr: 'ON', province: 'Ontario' },
  { abbr: 'PE', province: 'Prince Edward Island' },
  { abbr: 'QC', province: 'Quebec' },
  { abbr: 'SK', province: 'Saskatchewan' },
  { abbr: 'YK', province: 'Yukon' },
];
const dropprovmenu = provterr.map((list) => {
  return <MenuItem value={list.abbr}>{list.province}</MenuItem>;
});

const phasesmenu = (region) => {
  const retphase = [];
  if (Object.keys(region).length > 0) {
    for (const x of region.phases) {
      retphase.push(x.phase);
    }
  }
  return retphase;
};

function dropphasemenu(region) {
  if (Object.keys(region).length > 0) {
    return phasesmenu(region)
      .sort()
      .map((service) => {
        return <MenuItem value={service}>{service}</MenuItem>;
      });
  }
  return <MenuItem />;
}

function Reopen(props) {
  const [prov, setProvince] = useState({});
  // useEffect(() => {
  //   props.fetchReopens();
  // });
  const classes = useStyles();
  const axiosgetreopenlist = (target) => {
    axios
      .get('http://localhost:7000/reopenings/getprovince/'.concat(target))
      .then((res) => {
        setProvince(res.data[0]);
      })
      .catch((err) => {
        console.log('failed to get desired reopen deatil. Error: ', err);
      });
  };
  const handleChange = (event) => {
    setProvince(getProvinceReopen(event.target.value, props));
    axiosgetreopenlist(event.target.value);
  };
  const droprender = (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id='province-select-label'>Prov/Terr</InputLabel>
        <Select
          labelId='province-select-label'
          id='service-select-label'
          onChange={handleChange}
        >
          {dropprovmenu}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id='service-select-label'>Phases/Stages</InputLabel>
        <Select
          labelId='phases-select-label'
          id='phases-select-label'
          onChange={handleChange}
        >
          {dropphasemenu(prov)}
          {/* {dropphasemenu(saskatchewan)} */}
        </Select>
      </FormControl>
      {renderProvince(prov)}
    </div>
  );
  return (
    <div>
      <h1 style={{ fontSize: '2.5em', textAlign: 'center' }}>Reopening</h1>
      <b>Disclaimer</b>
      :
      <br />
      Each province and territory have several phases or stages that consist of
      unique policies.
      <br />
      As the COVID-19 cases improves, the province/territory will transition
      into the next phase.
      <br />
      eg. 1 goes to 2 and 2 goes to 3, etc.
      <br />
      However, if the COVID-19 cases worsens, it is possible to regress to a
      previous phase.
      <br />
      eg. 2 reverts to 1.
      <br />
      Each of these phases are flexible to change according to the COVID-19
      climate. Only the Canadian province British Columbia has been updated.
      <br />
      If there is a service you do not see, try checking the previous stages.
      <br />
      There are additional information listed at the button of the table.
      <br />
      Please call the specific store location of interest to enquire about
      operating hours. Their hours may have adjusted. They could be closed for
      safety.
      <br />
      {droprender}
      <br />
    </div>
  );
}

// export default withRouter(Reopen);

const mapStateToProps = (state) => {
  return {
    reopen: state.reopen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReopens: bindActionCreators(fetchReopens, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Reopen);
