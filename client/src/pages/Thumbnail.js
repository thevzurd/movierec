import { Component } from 'react';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { addFavouriteVideo, removeFavouriteVideo } from "../store/actions";

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { red } from '@material-ui/core/colors';

const styles = theme => ({
  mainBox: {
    zIndex: 0,
    position: "relative",
    overflow: 'initial',
  },
  avatar: {
    zIndex: 1,
    position: "absolute",
    right: "0",
    top: "0",
    marginRight: theme.spacing(-1),
    marginTop: theme.spacing(-1),
  },
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

class Thumbnail extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props);
  }

  setFav () {
    if (this.props.favvidoes.hasOwnProperty(this.props.video.id)) {
      this.props.removeFavouriteVideo(this.props.video.id);
    } else {
      this.props.addFavouriteVideo({
        [this.props.video.id]: this.props.video
      });
    }
  }

  render () {

    const { classes } = this.props;
    return (<Grid item xs={ 6 }
      sm={ 6 }
      md={ 3 }
      lg={ 3 }
      xl={ 3 }>
      <div className={ classes.mainBox }>
        <Card key={ this.props.video.id } onClick={ () => { this.setFav(); } }>
          <CardMedia
            className={ classes.media }
            image={ this.props.video.thumbnail }
            title={ this.props.video.name }
          />
        </Card>
        <div className={ classes.avatar }>
          <IconButton onClick={ () => { this.setFav(); } }>
            { this.props.favvidoes.hasOwnProperty(this.props.video.id)
              ? <FavoriteIcon color="action" style={ { color: red[500] } } fontSize="large" />
              : <FavoriteBorderIcon color="action" style={ { color: red[500] } } fontSize="large" /> }
          </IconButton>
        </div>
      </div>
      < Typography variant="overline">{ this.props.video.name }</Typography>
    </Grid>
    );
  }
}

Thumbnail.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    favvidoes: state.favvidoes,
  };
};

export default connect(mapStateToProps, {
  addFavouriteVideo, removeFavouriteVideo
})((withStyles(styles)(Thumbnail)));