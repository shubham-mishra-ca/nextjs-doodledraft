import {useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
 
const Board = () => {
    const canvasRef = useRef(null);

    const activeMenuItems = useSelector((state) => state.menu.activeMenuItems)
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItems])

    useEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //when mounting
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }, [])

    console.log(color, size)

    return (<canvas ref={canvasRef}></canvas>
    )
}


export default Board;