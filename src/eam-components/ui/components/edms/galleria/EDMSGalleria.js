import React from 'react';
import {getEDMSFileUrl, getEDMSFileThumbnailUrl} from '../utils/EDMSUtils';
import DescriptionStrip from './DescriptionStrip'
import ImageGallery from 'react-image-gallery';
import './edmsgalleria.css'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'

export default class EDMSGalleria extends React.Component {

    generateImagesList() {
        let {documentList} = this.props

        return documentList.reduce((images, document) => images.concat(document.files.map(file => ({
            original: getEDMSFileUrl(file),
            thumbnail: getEDMSFileUrl(file),
            description: DescriptionStrip(file)
        }))),[])
    }

    renderLeftNav(onClick, disabled) {
        return (
            <ChevronLeft className='image-gallery-left-nav'
                         onClick={onClick}/>
        )
    }

    renderRightNav(onClick, disabled) {
        return (
            <ChevronRight className='image-gallery-right-nav'
                          onClick={onClick}/>
        )
    }

    render() {
        if(!this.props.documentList)
            return <div/>

        let images = this.generateImagesList()

        return (
            <div style={{width: "100%", marginTop: 0}}>
                    <ImageGallery showPlayButton={false}
                                  showFullscreenButton={false}
                                  items={images}
                                  renderLeftNav={this.renderLeftNav}
                                  renderRightNav={this.renderRightNav}
                    />
            </div>
            );

    }
}
