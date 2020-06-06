import { Component } from 'react';
import React from 'react';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

export default class SkeletonThumbnail extends Component {
    render () {
        return (<div>
            <Box width={ 210 } marginRight={ 0.5 } my={ 5 }>
                <Skeleton variant="rect" width={ 210 } height={ 371.7 } />
            </Box>
        </div>);
    }
}