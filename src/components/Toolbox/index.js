import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import styles from './index.module.css';
import {COLORS, MENU_ITEMS} from '@/constants';
import { changeColor, changeBrushSize } from '@/slice/toolboxSlice';



const Toolbox = () => {
    const dispatch = useDispatch()
    const activeMenuItems = useSelector((state) => state.menu.activeMenuItems)
    const showStrokeToolOption = activeMenuItems === MENU_ITEMS.PENCIL
    const showBrushToolOption = activeMenuItems === MENU_ITEMS.PENCIL || activeMenuItems === MENU_ITEMS.ERASER
    const {color} = useSelector((state) => state.toolbox[activeMenuItems])


    const updateBrushSize = (e) => {
       dispatch(changeBrushSize({item: activeMenuItems, size: e.target.value}))
    }

    const updateColor = (newColor) => {
        dispatch(changeColor({item: activeMenuItems, color: newColor}))
    }
    return (<div className={styles.toolboxContainer}> 
        {showStrokeToolOption && <div className={styles.toolItem}>
            <h4 className={styles.toolText}>Stroke Color</h4>
            <div className={styles.itemContainer}>
                <div className={cx(styles.colorBox, {[styles.active]:color === COLORS.BLACK })} style = {{backgroundColor: COLORS.BLACK}} onClick={() => updateColor(COLORS.BLACK)}/>
                <div className={cx(styles.colorBox, {[styles.active]:color === COLORS.RED })} style = {{backgroundColor: COLORS.RED}} onClick={() => updateColor(COLORS.RED)}/>
                <div className={cx(styles.colorBox, {[styles.active]:color === COLORS.GREEN })} style = {{backgroundColor: COLORS.GREEN}} onClick={() => updateColor(COLORS.GREEN)}/>
                <div className={cx(styles.colorBox, {[styles.active]:color === COLORS.BLUE })} style = {{backgroundColor: COLORS.BLUE}} onClick={() => updateColor(COLORS.BLUE)}/>
                <div className={cx(styles.colorBox, {[styles.active]:color === COLORS.ORANGE })} style = {{backgroundColor: COLORS.ORANGE}} onClick={() => updateColor(COLORS.ORANGE)}/>
                <div className={cx(styles.colorBox, {[styles.active]:color === COLORS.YELLOW })} style = {{backgroundColor: COLORS.YELLOW}} onClick={() => updateColor(COLORS.YELLOW)}/>
            </div>
        </div> }
        
        { showBrushToolOption && <div className={styles.toolItem}>
            <h4 className={styles.toolText}>Brush Size</h4>
            <div className={styles.itemContainer}>
                <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} />
            </div>
        </div>}
    </div>)
}

export default Toolbox;