import { Component } from 'react';
import React from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addVideo, resetVideo, addRecommendations, resetRecommendations, resetFavouriteVideo } from "../store/actions";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Thumbnail from './Thumbnail';
import SkeletonThumbnail from './SkeletonThumbnail';

import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

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

class App extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  componentDidMount () {
    this.props.resetFavouriteVideo();
    this.props.resetRecommendations();
    this.fetchRandom();
  }

  async fetchRandom () {

    //  await axios.get(window.location.hostname === 'localhost' ? 'http://localhost:5000/random' : '/api/random')
    await axios.get('/api/random')
      .then(async (values) => {
        if (values.data) {
          //console.log(values.data);
          await Promise.all(values.data.map((e) => this.fetchValues(e['tconst'], e['cluster'], false)));
        }
      })
      .catch((e) => console.error(e));

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

  handlePrev () {
    this.setState({
      step: this.state.step - 1,
    });
  };

  handleNext () {
    this.setState({
      step: this.state.step + 1,
    });
  };

  render () {

    // eslint-disable-next-line no-unused-vars
    const { classes } = this.props;
    const noOfSteps = Object.values(this.props.videos).length === 0 ? 0 : Math.floor(Object.values(this.props.videos).length / 4); // round down to multiples of 4
    //console.log(this.state.step);
    return (<div>
      <Container maxWidth="md">
        < Typography variant="h1">Movie Roulette</Typography>
        <br />
        < Typography variant="subtitle1">Wondering what to watch next?</Typography>
        < Typography variant="subtitle1">Answer 5 questions and let us help you choose the next flix.</Typography>
        <br />
        <br />
        < Typography variant="h6">Click on the movies you like</Typography>
        <div>
          <Grid alignItems="center" container spacing={ 1 }>
            { Object.values(this.props.videos).length > 0 && Object.values(this.props.videos).slice(this.state.step * 4, this.state.step * 4 + 4).map((tile) => {
              if (!this.props.videos.hasOwnProperty(tile.id)) {
                return <SkeletonThumbnail key={ `S${tile.id}${Date.now()}` } />;
              } else {
                return <Thumbnail key={ `${tile.id}${Date.now()}` } video={ tile } />;
              }
            }) }
          </Grid>
          <MobileStepper
            variant="dots"
            steps={ noOfSteps }
            position="static"
            activeStep={ this.state.step }
            backButton={
              <Button aria-label="previous" onClick={ () => {
                if (this.state.step > 0) {
                  this.handlePrev();
                }
              } } >
                { this.state.step > 0 && <NavigateBeforeIcon fontSize="large" /> }
                < Typography variant="h6">{ this.state.step === 0
                  ? " "
                  : "Prev" }</Typography>
              </Button >
            }
            nextButton={
              this.state.step === noOfSteps
                ? <Link className="text-muted" to="/recommendations">
                  <Button aria-label="next" >
                    < Typography variant="h6">{ Object.keys(this.props.favvidoes).length === 0
                      ? "No Favorites Selected"
                      : "Get Recommendations"
                    }</Typography>
                  </Button ></Link>
                :
                <Button aria-label="next" onClick={ () => { this.handleNext(); } } >
                  < Typography variant="h6">Next</Typography>
                  <NavigateNextIcon fontSize="large" />
                </Button >
            }
          />
        </div>
        <footer>
          <Box mt={ 3 }>
            <Typography align="center" variant="caption" display="block">
              This product uses the TMDb API but is not endorsed or certified by TMDb
            </Typography>
          </Box>
        </footer>
      </Container>
    </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    videos: state.videos,
    favvidoes: state.favvidoes,
  };
};

export default connect(mapStateToProps,
  {
    addVideo, addRecommendations, resetRecommendations, resetFavouriteVideo, resetVideo,
  })((withStyles(styles)(App)));
