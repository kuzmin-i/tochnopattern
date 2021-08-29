const regenerateShape = (SegmentSize, _PrevShape, _UpShape, PrevResults) => {
    let CircleCoord = {
        'LeftTop': [1, 1, 180 * Math.PI / 180, 270 * Math.PI / 180, 'Circle'],
        'LeftBottom': [1, 0, 90 * Math.PI / 180, 180 * Math.PI / 180, 'Circle'],
        'RightTop': [0, 1, -90 * Math.PI / 180, 0, 'Circle'],
        'RightBottom': [0, 0, 0, 90 * Math.PI / 180, 'Circle']
    }

    let PrevShape = (typeof _PrevShape == 'string' && _PrevShape != 'Rect') ? _PrevShape.substr(6) : null
    let UpShape = (typeof _UpShape == 'string' && _UpShape != 'Rect') ? _UpShape.substr(6) : null

    let CommonList = []

    let InversePrevCircle = null
    if(PrevShape == 'LeftTop' || PrevShape == 'LeftBottom') {
        InversePrevCircle = (PrevShape == 'LeftTop') ? 'RightTop' : 'RightBottom'
        CommonList.push(InversePrevCircle)
        CommonList.push(InversePrevCircle)
    }

    if(PrevShape == 'RightTop' || PrevShape == 'RightBottom') {
        InversePrevCircle = 'LeftTop'
        CommonList.push(null)
        CommonList.push(null)
    }

    let InverseUpCircle = null
    if(UpShape == 'LeftTop' || UpShape == 'RightTop') {
        InverseUpCircle = (UpShape == 'LeftTop') ? 'LeftBottom' : 'RightBottom'
        CommonList.push(InverseUpCircle)
        CommonList.push(InverseUpCircle)
    }

    if(UpShape == 'LeftBottom' || UpShape == 'RightBottom') {
        InversePrevCircle = 'LeftTop'
        CommonList.push(null)
        CommonList.push(null)
    }

    if(!_PrevShape && !_UpShape) {
        InversePrevCircle = 'LeftTop'
        CommonList.push(null)
        CommonList.push(null)
    }
    

    CommonList.push([0, 0, 0, 0])
    CommonList.push(null)

    if(PrevShape == 'LeftBottom' && UpShape == 'RightTop') {
        CommonList = []
        CommonList.push('RightBottom')
    }

    if(InverseUpCircle || InversePrevCircle) {
        /*Начинается главное */
        let random = Math.round(Math.random()*(CommonList.length-1))

        /* CornersRadius */
        let CornersRadius

        if(CommonList[random]) {
            if(typeof CommonList[random] == 'string') {
                CornersRadius = CircleCoord[CommonList[random]]
            } else {
                CornersRadius = CommonList[random].map(i => {
                    return i * SegmentSize
                })
            }
        } else {
            CornersRadius = [0, 0, 0, 0]
        }

        /* FillStroke */
        let FillStroke
        
        if(CommonList[random]) {
            FillStroke = ['#2EFDDA', '#2EFDDA']
        } else {
            FillStroke = [null, null]
        }

        let ShapeType

        if(typeof CommonList[random] == 'string') {
            ShapeType = 'Circle' + CommonList[random]
        } else {
            ShapeType = 'Rect'
        }

        return {
            'CornersRadius': CornersRadius,
            'FillStroke': FillStroke,
            'ShapeType': ShapeType
        }

        /* Завершение return */
    } else {
        return PrevResults
    }
}

export default regenerateShape