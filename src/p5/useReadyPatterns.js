const UseReadyPatterns = (SegmentSize, PatternNum, Step) => {
    let CircleCoord = {
        'LeftTop': [1, 1, 180 * Math.PI / 180, 270 * Math.PI / 180, 'Circle'],
        'LeftBottom': [1, 0, 90 * Math.PI / 180, 180 * Math.PI / 180, 'Circle'],
        'RightTop': [0, 1, -90 * Math.PI / 180, 0, 'Circle'],
        'RightBottom': [0, 0, 0, 90 * Math.PI / 180, 'Circle']
    }

    const Pattern1 = [
        [0, 0, 0, 0],
        null,
        null,
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        null,
        null, 
        [0, 0, 0, 0],
        'LeftTop',
        null,
        null,
        [0, 0, 0, 0],
        null,
        null,
        'LeftBottom',
        'RightBottom',
        null,
        'LeftBottom'
    ]

    const Pattern2 = [
        null,
        [0, 0, 0, 0],
        null,
        [0, 0, 0, 0]
        [0, 0, 0, 0]
        [0, 0, 0, 0],
        null,
        null,
        [0, 0, 0, 0],
        'RightTop',
        null,
        'LeftTop',
        null,
        null,
        'LeftBottom',
        'RightBottom',
        null,
        'LeftBottom'
    ]

    const Pattern3 = [
        null,
        null,
        null,
        null,
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        null,
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        null,
        [0, 0, 0, 0],
        'LeftTop',
        null,
        null,
        'LeftBottom',
        'RightBottom',
        null,
        'LeftBottom'
    ]

    const Patterns = [Pattern1, Pattern2, Pattern3]

    const SelPattern = Patterns[PatternNum]
    const SelPatternStep = SelPattern[Step]

    /* CornersRadius */
    let CornersRadius

    if(SelPatternStep) {
        if(typeof SelPatternStep == 'string') {
            CornersRadius = CircleCoord[SelPatternStep]
        } else {
            CornersRadius = SelPatternStep.map(i => {
                return i * SegmentSize
            })
        }
    } else {
        CornersRadius = [0, 0, 0, 0]
    }

    /* FillStroke */
    let FillStroke
    
    if(SelPatternStep) {
        FillStroke = ['#2EFDDA', '#2EFDDA']
    } else {
        FillStroke = [null, null]
    }

    let ShapeType

    if(typeof SelPatternStep == 'string') {
        ShapeType = 'Circle' + SelPatternStep
    } else {
        ShapeType = 'Rect'
    }

    return {
        'CornersRadius': CornersRadius,
        'FillStroke': FillStroke,
        'ShapeType': ShapeType
    }
}

export default UseReadyPatterns