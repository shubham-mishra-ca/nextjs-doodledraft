import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
const Menu = () => {
    return (
        <div>
            <div>
                    <FontAwesomeIcon icon={faPencil} />
            </div>
            <div>
                    <FontAwesomeIcon icon={faEraser} />
            </div>
            <div>
                    <FontAwesomeIcon icon={faRotateLeft} />
            </div>
            <div>
                    <FontAwesomeIcon icon={faRotateRight} />
            </div>
            <div>
                    <FontAwesomeIcon icon={faFileArrowDown} />
            </div>
        </div>
    )
}

export default Menu;