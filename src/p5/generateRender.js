const generateRender = () => {
    const RenderMethods = [
        'fillAsRowTable',
        'fillAsReadyPatterns',
        'fillAsRowTable',
        'fillAsRowTable'
    ]

    let random = Math.round(Math.random() * (RenderMethods.length-1))

    return RenderMethods[random]
}

export default generateRender