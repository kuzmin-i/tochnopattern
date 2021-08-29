const generateShape = (SegmentSize) => {
    const GenShapes = [
        [0, 0, 0, 0],
        null,
        'LeftTop',
        null,
        'LeftBottom',
        'RightTop',
        [0, 0, 0, 0],
        'RightBottom',
        null
    ]

    let CircleCoord = {
        'LeftTop': [1, 1, 180 * Math.PI / 180, 270 * Math.PI / 180, 'Circle'],
        'LeftBottom': [1, 0, 90 * Math.PI / 180, 180 * Math.PI / 180, 'Circle'],
        'RightTop': [0, 1, -90 * Math.PI / 180, 0, 'Circle'],
        'RightBottom': [0, 0, 0, 90 * Math.PI / 180, 'Circle']
    }

    let random = Math.round(Math.random()*(GenShapes.length-1))

    /* CornersRadius */
    let CornersRadius

    if(GenShapes[random]) {
        if(typeof GenShapes[random] == 'string') {
            CornersRadius = CircleCoord[GenShapes[random]]
        } else {
            CornersRadius = GenShapes[random].map(i => {
                return i * SegmentSize
            })
        }
    } else {
        CornersRadius = [0, 0, 0, 0]
    }

    /* FillStroke */
    let FillStroke
    
    if(GenShapes[random]) {
        FillStroke = ['#2EFDDA', '#2EFDDA']
    } else {
        FillStroke = [null, null]
    }

    let ShapeType

    if(typeof GenShapes[random] == 'string') {
        ShapeType = 'Circle' + GenShapes[random]
    } else {
        ShapeType = 'Rect'
    }

    return {
        'CornersRadius': CornersRadius,
        'FillStroke': FillStroke,
        'ShapeType': ShapeType
    }
}

export default generateShape