import React from 'react'
import {Helmet} from 'react-helmet'


const Meta = ({title,description,keywords}) => {
    return (
        <Helmet>
                <title>{title}</title>
                <meta name={description} content={keywords}></meta>
         </Helmet>
    )
}

Meta.defaultProps  = {
    title:'Welcome To Proshop',
    keywords:'We sell the best products for cheap',
    description:'electronics,buy electronics, cheap electronics'

}

export default Meta
