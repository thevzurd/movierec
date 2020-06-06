import { Component } from 'react';
import React from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { addVideo, addRecommendations } from "../store/actions";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Thumbnail from './Thumbnail';
import SkeletonThumbnail from './SkeletonThumbnail';

import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  media: {
    height: 0,
    paddingTop: '177.77%', // 16:9
  },
});

class Recommendations extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.fetchRecommendations();
  }

  async fetchRecommendations () {

    if (Object.values(this.props.favvidoes).length === 0) {
      console.log('here');
      return;
    }
    var clusters = Object.values(this.props.favvidoes).reduce((p, video) => {
      var name = video['cluster'];
      if (!p.hasOwnProperty(name)) {
        p[name] = {
          'cluster': name,
          'count': 0
        };
      }
      p[name]['count']++;
      return p;
    }, {});

    // console.log(clusters);
    clusters = Object.values(clusters).sort((a, b) => b.count - a.count);

    var exit = false;
    var sum = 0;
    var index = 0;
    var cs = [];
    while (!exit) {
      var c = Object.values(clusters)[index]['count'];
      var cl = Object.values(clusters)[index]['cluster'];
      sum = sum + c;
      if (sum >= 4) {
        var x = sum - 4;
        cs.push({
          'cluster': cl,
          'count': x === 0 ? c : x
        });
        exit = true;
      } else {
        //cs.push(Object.values(clusters)[index]);
        cs.push({
          'cluster': cl,
          'count': c
        });
      }
      index++;
      if (index >= Object.values(clusters).length) {
        exit = true;
      }
    }

    //console.log(cs);

    await Promise.all(cs.map(async (cluster) => {
      console.log(`/api/recommend/${cluster['cluster']}/${cluster['count']}`);
      await axios.get(
        //window.location.hostname === 'localhost'
        // ? `http://localhost:5000/recommend/${cluster['cluster']}/${cluster['count']}`
        //  : 
        `/api/recommend/${cluster['cluster']}/${cluster['count']}`)
        .then(async (values) => {
          if (values.data) {
            //console.log(values.data);
            await Promise.all(values.data.map((e) => this.fetchValues(e['tconst'], e['cluster'], true)));
          }
        })
        .catch((e) => console.error(e));
      return true;
    }));

  }

  async fetchValues (id, cluster, recommend) {
    const values = await axios.get(`https://api.themoviedb.org/3/find/${id}?external_source=imdb_id`, {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODA3MjJmYmU3OTJlNjFhMmZlZmJkMGEzZGZiZWI5ZCIsInN1YiI6IjVlYjgyMTliZjE0ZGFkMDAxY2U5NjVmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6zwog2x5lk_boqZ8qm66LjFClOoDMtSIccs2kEuMhTU",
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    if (values.data) {
      let data = values.data;
      if (data["movie_results"] && data["movie_results"].length > 0) {
        let result = data["movie_results"][0];
        if (recommend === false) {
          this.props.addVideo({
            [id]: {
              id: id,
              thumbnail: result["poster_path"] ? `https://image.tmdb.org/t/p/w300/${result["poster_path"]}` : '',
              name: result["title"],
              cluster: cluster,
            }
          });
        } else {
          this.props.addRecommendations({
            [id]: {
              id: id,
              thumbnail: result["poster_path"] ? `https://image.tmdb.org/t/p/w300/${result["poster_path"]}` : '',
              name: result["title"],
              cluster: cluster,
            }
          });
        }
        return false;
      }
      /*       if (data["person_results"] && data["person_results"].length > 0) {
              this.setState({ values: data });
              return false;
            } */
      if (data["tv_results"] && data["tv_results"].length > 0) {
        let result = data["tv_results"][0];
        if (recommend === false) {
          this.props.addVideo({
            [id]: {
              id: id,
              thumbnail: result["poster_path"] ? `https://image.tmdb.org/t/p/w300/${result["poster_path"]}` : '',
              name: result["name"],
              cluster: cluster,
            }
          });
        } else {
          this.props.addRecommendations({
            [id]: {
              id: id,
              thumbnail: result["poster_path"] ? `https://image.tmdb.org/t/p/w300/${result["poster_path"]}` : '',
              name: result["name"],
              cluster: cluster,
            }
          });
        }
        return false;
      }
      /*       if (data["tv_episode_results"] && data["tv_episode_results"].length > 0) {
              this.setState({ values: data });
              return false;
            }
            if (data["tv_season_results"] && data["tv_season_results"].length > 0) {
              this.setState({ values: data });
              return false;
            } */
    }

  }

  render () {

    // eslint-disable-next-line no-unused-vars
    const { classes } = this.props;

    return (<div>
      <Container maxWidth="md">
        < Typography variant="h1">Movie Roulette</Typography>
        <br />
        < Typography variant="subtitle1">               </Typography>
        < Typography variant="subtitle1">               </Typography>
        <br />
        <br />
        < Typography variant="h6">Here are your recommendations</Typography>
        <Grid alignItems="center" container spacing={ 1 }>
          { Object.values(this.props.recommendations).map((tile) => {
            if (!this.props.recommendations.hasOwnProperty(tile.id)) {
              return <SkeletonThumbnail key={ `S${tile.id}${Date.now()}` } />;
            } else {
              return <Thumbnail key={ `${tile.id}${Date.now()}` } video={ tile } />;
            }
          }) }
        </Grid>
        <div style={ { textAlign: 'right' } }>
          <Button aria-label="next" href={ "/" } >
            < Typography variant="h6">Start Again</Typography>
          </Button >
        </div>
        <footer>
          <Box mt={ 3 }>
            <Typography align="center" variant="caption" display="block">
              This product uses the TMDb API but is not endorsed or certified by TMDb
            </Typography>
          </Box>
        </footer>
      </Container>
    </div >
    );
  }
}

Recommendations.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    favvidoes: state.favvidoes,
    recommendations: state.recommendations,
  };
};

export default connect(mapStateToProps,
  {
    addVideo, addRecommendations,
  })((withStyles(styles)(Recommendations)));
