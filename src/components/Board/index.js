import { MENU_ITEMS } from '@/constants';
import {useEffect, useLayoutEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { menuItemClick, actionItemClick } from '@/slice/menuSlice';

import { socket } from '@/socket';

 
const Board = () => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const shouldDraw = useRef(false);
    const {activeMenuItems, actionMenuItem} = useSelector((state) => state.menu)
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItems])

    useEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');


        if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
            const context = canvasRef.current.getContext('2d');
            const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            const compositeOperation = context.globalCompositeOperation;
            context.globalCompositeOperation = "destination-over";
            context.fillStyle = "white";
            context.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
        
            const URL = canvasRef.current.toDataURL();
            context.clearRect (0,0,canvasRef.current.width,canvasRef.current.height);
            context.putImageData(imageData, 0,0);
            context.globalCompositeOperation = compositeOperation;
        
            const anchor = document.createElement('a');
            anchor.href = URL;
            anchor.download = 'sketch.png';
            anchor.click();
        }

        else if( actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO){
            if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1
            if(historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
            }
        

        dispatch(actionItemClick(null))
    }, [actionMenuItem])

    useEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');


       const changeConfig = (color, size) => { 
       context.strokeStyle = color;
       context.lineWidth = size;
       }


       const handleChangeConfig = (config) => {
        console.log(config)
        changeConfig(config.color, config.size)
         }

       changeConfig(color, size)
       socket.on('changeConfig', handleChangeConfig)

         return () => {
             socket.off('changeConfig', handleChangeConfig)
         }

    }, [color, size])

    useLayoutEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //when mounting
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const beginPath = (x, y) => {
            context.beginPath();
            context.moveTo(x, y)
        }

        const drawLine = (x, y) => {
            context.lineTo(x, y);
            context.stroke();
        }

        const handleMouseDown = (e) => {
            shouldDraw.current = true;
            beginPath(e.clientX, e.clientY);
            socket.emit('beginPath', {x: e.clientX, y: e.clientY});
        }
 
        const handleMouseMove = (e) => {
            if(!shouldDraw.current) return
            drawLine(e.clientX, e.clientY);
            socket.emit('drawLine', {x: e.clientX, y: e.clientY});
        }
 
          const handleMouseUp = (e) => {
                shouldDraw.current = false;
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                drawHistory.current.push(imageData);
                historyPointer.current = drawHistory.current.length - 1;
             }

        const handleBeginPath = (path) => {
            beginPath(path.x, path.y);
        }

        const handledrawLine = (path) => {
            drawLine(path.x, path.y);
        }
 
        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)


        socket.on('beginPath', handleBeginPath);
        socket.on('drawLine', handledrawLine);


             return () =>{
                    canvas.removeEventListener('mousedown', handleMouseDown)
                    canvas.removeEventListener('mousemove', handleMouseMove)
                    canvas.removeEventListener('mouseup', handleMouseUp)

                    socket.off('beginPath', handleBeginPath);
                    socket.off('drawLine', handledrawLine);
             }
    }, [])

    console.log(color, size)

    return (<canvas ref={canvasRef}></canvas>
    )
}


export default Board;